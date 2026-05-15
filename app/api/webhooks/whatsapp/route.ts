import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { normalizeWhatsApp } from '@/lib/normalizer'
import { calculateUrgency } from '@/lib/urgency'
import { classifyIntent } from '@/lib/intent'

type ChannelRow = {
  id: string
  profile_id: string
  type: string
  status: string
  access_token: string | null
  account_name: string | null
  account_id: string | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body         = await request.json()
    const entry        = body?.entry?.[0]
    if (!entry) return NextResponse.json({ ok: true })

    const supabase    = await createClient()
    const waAccountId = entry?.changes?.[0]?.value?.metadata?.phone_number_id

    const { data: channelData } = await supabase
      .from('channels')
      .select('*')
      .eq('account_id', waAccountId)
      .eq('type', 'whatsapp')
      .eq('status', 'active')
      .single()

    const channel = channelData as ChannelRow | null
    if (!channel) return NextResponse.json({ ok: true })

    const normalized = normalizeWhatsApp(body, channel.id)
    if (!normalized) return NextResponse.json({ ok: true })

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('profile_id', channel.profile_id)
      .eq('whatsapp_number', normalized.customer_external_id)
      .single()

    let customerId = (existingCustomer as { id: string } | null)?.id

    if (!customerId) {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          profile_id:      channel.profile_id,
          name:            normalized.customer_name,
          whatsapp_number: normalized.customer_external_id,
        })
        .select('id')
        .single()
      customerId = (newCustomer as { id: string } | null)?.id
    }

    const urgencyScore = calculateUrgency(normalized.content, normalized.received_at)
    const intent       = classifyIntent(normalized.content)

    await supabase.from('messages').insert({
      channel_id:    channel.id,
      customer_id:   customerId ?? null,
      content:       normalized.content,
      direction:     'inbound',
      intent,
      urgency_score: urgencyScore,
      is_read:       false,
      is_resolved:   false,
      received_at:   normalized.received_at,
    })

    const { data: autoRepliesData } = await supabase
      .from('auto_replies')
      .select('*')
      .eq('profile_id', channel.profile_id)
      .eq('is_active', true)
      .or('channel_type.eq.all,channel_type.eq.whatsapp')

    const autoReplies = autoRepliesData as {
      id: string
      trigger_keyword: string
      response_text: string
    }[] | null

    if (autoReplies && autoReplies.length > 0) {
      const contentLower = normalized.content.toLowerCase()
      const match = autoReplies.find(r =>
        contentLower.includes(r.trigger_keyword.toLowerCase())
      )

      if (match) {
        await sendWhatsAppReply(
          normalized.customer_external_id,
          match.response_text,
          channel.access_token!,
          channel.account_id!
        )

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

  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}

async function sendWhatsAppReply(
  to: string,
  message: string,
  accessToken: string,
  phoneNumberId: string
) {
  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        }),
      }
    )
  } catch (err) {
    console.error('Failed to send WhatsApp reply:', err)
  }
}