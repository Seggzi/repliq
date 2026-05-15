import { NextResponse } from 'next/server'
import { calculateUrgency } from '@/lib/urgency'
import { classifyIntent } from '@/lib/intent'
import { createClient } from '@/lib/supabase/server'

type ChannelRow = {
  id: string
  profile_id: string
  type: string
  status: string
  access_token: string | null
  account_name: string | null
  account_id: string | null
}

type AutoReplyRow = {
  id: string
  trigger_keyword: string
  response_text: string
  channel_type: string | null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const fromEmail   = (body?.from ?? body?.sender ?? '') as string
    const fromName    = (body?.from_name ?? fromEmail.split('@')[0] ?? '') as string
    const subject     = (body?.subject ?? '(no subject)') as string
    const textContent = (body?.text ?? body?.html ?? body?.content ?? '') as string
    const toEmail     = (body?.to ?? '') as string

    if (!fromEmail || !textContent) {
      return NextResponse.json({ ok: true })
    }

    const sb = await createClient()
    const supabase = sb as any

    // Try to find channel by receiving address
    const { data: channelByAddress } = await supabase
      .from('channels')
      .select('*')
      .eq('type', 'email')
      .eq('account_id', toEmail)
      .eq('status', 'active')
      .single()

    let channel = channelByAddress as ChannelRow | null

    // Fallback: find any active email channel
    if (!channel) {
      const { data: fallbackChannel } = await supabase
        .from('channels')
        .select('*')
        .eq('type', 'email')
        .eq('status', 'active')
        .single()

      channel = fallbackChannel as ChannelRow | null
    }

    if (!channel) {
      console.log('No email channel found for:', toEmail)
      return NextResponse.json({ ok: true })
    }

    // Find or create customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('profile_id', channel.profile_id)
      .eq('email', fromEmail)
      .single()

    let customerId = (existingCustomer as { id: string } | null)?.id

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

      customerId = (newCustomer as { id: string } | null)?.id
    }

    const fullContent  = subject !== '(no subject)'
      ? `[${subject}] ${textContent}`
      : textContent

    const urgencyScore = calculateUrgency(fullContent, new Date().toISOString())
    const intent       = classifyIntent(fullContent)

    await supabase
      .from('messages')
      .insert({
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
    const { data: autoRepliesData } = await supabase
      .from('auto_replies')
      .select('*')
      .eq('profile_id', channel.profile_id)
      .eq('is_active', true)
      .or('channel_type.eq.all,channel_type.eq.email')

    const autoReplies = autoRepliesData as AutoReplyRow[] | null

    if (autoReplies && autoReplies.length > 0) {
      const contentLower = fullContent.toLowerCase()
      const match = autoReplies.find(r =>
        contentLower.includes(r.trigger_keyword.toLowerCase())
      )

      if (match) {
        await sendEmailReply(
          fromEmail,
          channel.account_name ?? 'hello@repliq.com',
          match.response_text,
          subject
        )

        await supabase
          .from('messages')
          .insert({
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

  } catch (err) {
    console.error('Email webhook error:', err)
    return NextResponse.json({ ok: true })
  }
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