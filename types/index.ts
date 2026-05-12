export type Channel = 'whatsapp' | 'instagram' | 'email'
export type Direction = 'inbound' | 'outbound'
export type Intent = 'faq' | 'order' | 'complaint' | 'unknown'
export type Plan = 'free' | 'growth' | 'business'

export interface Message {
  id: string
  channel_id: string
  customer_id: string | null
  content: string
  direction: Direction
  intent: Intent | null
  urgency_score: number
  is_read: boolean
  is_resolved: boolean
  received_at: string
  customer?: Customer
  channel?: ChannelRecord
}

export interface Customer {
  id: string
  profile_id: string
  name: string | null
  whatsapp_number: string | null
  instagram_handle: string | null
  email: string | null
  created_at: string
}

export interface ChannelRecord {
  id: string
  profile_id: string
  type: Channel
  status: 'active' | 'disconnected' | 'error'
  access_token: string | null
  account_name: string | null
  account_id: string | null
  connected_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string
  plan: Plan
  created_at: string
}

export interface AutoReply {
  id: string
  profile_id: string
  trigger_keyword: string
  response_text: string
  channel_type: Channel | 'all' | null
  is_active: boolean
  created_at: string
}

// Webhook payload shapes
export interface NormalizedMessage {
  channel_id: string
  customer_external_id: string
  customer_name: string | null
  content: string
  channel_type: Channel
  received_at: string
}