import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { normalizeEmail } from '@/lib/normalizer'
import { calculateUrgency } from '@/lib/urgency'
import { classifyIntent } from '@/lib/intent'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Resend sends email data as JSON
    const fromEmail   = body?.from ?? body?.sender ?? ''
    const fromName    = body?.from_name ?? fromEmail.split('@')[0] ?? ''
    const subject     = body?.subject ?? '(no subject)'
    const textContent = body?.text ?? body?.html ?? body?.content ?? ''
    const toEmail     = body?.to ?? ''

    if (!fromEmail || !textContent) {
      return NextResponse.json({ ok: true })
    }

    const supabase = await createClient()

    // Find the channel by the receiving email address
    const { data: channel } = await supabase
      .from('channels')
      .select('*')
      .eq('type', 'email')
      .eq('account_id', toEmail)
      .eq('status', 'active')
      .single()

    if (!channel) {
      // Try finding by matching any email channel
      const { data: anyChannel } = await supabase
        .from('channels')
        .select('*')
        .eq('type', 'email')
        .eq('status', 'active')
        .single()

      if (!anyChannel) {
        console.log('No email channel found for:', toEmail)
        return NextResponse.json({ ok: true })
      }

      return handleEmailMessage(supabase, anyChannel, fromEmail, fromName, subject, textContent)
    }

    return handleEmailMessage(supabase, channel, fromEmail, fromName, subject, textContent)

  } catch (err) {
    console.error('Email webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}

async function handleEmailMessage(
  supabase: any,
  channel: any,
  fromEmail: string,
  fromName: string,
  subject: string,
  content: string
) {
  // Find or create customer
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('profile_id', channel.profile_id)
    .eq('email', fromEmail)
    .single()

  let customerId = existingCustomer?.id

  if (!customerId) {
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({
        profile_id: channel.profile_id,
        name:       fromName,
        email:      fromEmail,
      })
      .select('id')
      .single()

    customerId = newCustomer?.id
  }

  const fullContent = subject !== '(no subject)'
    ? `[${subject}] ${content}`
    : content

  const urgencyScore = calculateUrgency(fullContent, new Date().toISOString())
  const intent       = classifyIntent(fullContent)

  // Save message
  await supabase.from('messages').insert({
    channel_id:    channel.id,
    customer_id:   customerId ?? null,
    content:       fullContent,
    direction:     'inbound',
    intent,
    urgency_score: urgencyScore,
    is_read:       false,
    is_resolved:   false,
    received_at:   new Date().toISOString(),
  })

  // Check auto-replies
  const { data: autoReplies } = await supabase
    .from('auto_replies')
    .select('*')
    .eq('profile_id', channel.profile_id)
    .eq('is_active', true)
    .or('channel_type.eq.all,channel_type.eq.email')

  if (autoReplies && autoReplies.length > 0) {
    const contentLower = fullContent.toLowerCase()
    const match = autoReplies.find((r: any) =>
      contentLower.includes(r.trigger_keyword.toLowerCase())
    )

    if (match) {
      await sendEmailReply(fromEmail, channel.account_name, match.response_text, subject)

      await supabase.from('messages').insert({
        channel_id:    channel.id,
        customer_id:   customerId ?? null,
        content:       match.response_text,
        direction:     'outbound',
        intent:        'faq',
        urgency_score: 0,
        is_read:       true,
        is_resolved:   false,
        received_at:   new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ ok: true })
}

async function sendEmailReply(
  toEmail: string,
  fromEmail: string,
  message: string,
  originalSubject: string
) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from:    `Repliq <${fromEmail}>`,
      to:      toEmail,
      subject: `Re: ${originalSubject}`,
      text:    message,
    })
  } catch (err) {
    console.error('Failed to send email reply:', err)
  }
}