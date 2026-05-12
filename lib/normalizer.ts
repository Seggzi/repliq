import type { NormalizedMessage } from '@/types'

export function normalizeWhatsApp(body: any, channelId: string): NormalizedMessage | null {
  try {
    const entry = body?.entry?.[0]
    const change = entry?.changes?.[0]
    const msg = change?.value?.messages?.[0]
    const contact = change?.value?.contacts?.[0]

    if (!msg || msg.type !== 'text') return null

    return {
      channel_id: channelId,
      customer_external_id: msg.from,
      customer_name: contact?.profile?.name ?? null,
      content: msg.text.body,
      channel_type: 'whatsapp',
      received_at: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
    }
  } catch {
    return null
  }
}

export function normalizeInstagram(body: any, channelId: string): NormalizedMessage | null {
  try {
    const entry = body?.entry?.[0]
    const msg = entry?.messaging?.[0]

    if (!msg?.message?.text) return null

    return {
      channel_id: channelId,
      customer_external_id: msg.sender.id,
      customer_name: null,
      content: msg.message.text,
      channel_type: 'instagram',
      received_at: new Date(msg.timestamp).toISOString(),
    }
  } catch {
    return null
  }
}

export function normalizeEmail(body: any, channelId: string): NormalizedMessage | null {
  try {
    return {
      channel_id: channelId,
      customer_external_id: body?.from ?? 'unknown',
      customer_name: body?.from_name ?? null,
      content: body?.text ?? body?.html ?? '',
      channel_type: 'email',
      received_at: new Date().toISOString(),
    }
  } catch {
    return null
  }
}