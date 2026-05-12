export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          plan: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          plan?: string
          created_at?: string
        }
        Update: {
          full_name?: string | null
          email?: string
          plan?: string
        }
      }
      channels: {
        Row: {
          id: string
          profile_id: string
          type: 'whatsapp' | 'instagram' | 'email'
          status: 'active' | 'disconnected' | 'error'
          access_token: string | null
          account_name: string | null
          account_id: string | null
          connected_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          type: 'whatsapp' | 'instagram' | 'email'
          status?: 'active' | 'disconnected' | 'error'
          access_token?: string | null
          account_name?: string | null
          account_id?: string | null
          connected_at?: string
        }
        Update: {
          status?: 'active' | 'disconnected' | 'error'
          access_token?: string | null
          account_name?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          profile_id: string
          name: string | null
          whatsapp_number: string | null
          instagram_handle: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name?: string | null
          whatsapp_number?: string | null
          instagram_handle?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          whatsapp_number?: string | null
          instagram_handle?: string | null
          email?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          customer_id: string | null
          content: string
          direction: 'inbound' | 'outbound'
          intent: 'faq' | 'order' | 'complaint' | 'unknown' | null
          urgency_score: number
          is_read: boolean
          is_resolved: boolean
          received_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          customer_id?: string | null
          content: string
          direction: 'inbound' | 'outbound'
          intent?: 'faq' | 'order' | 'complaint' | 'unknown' | null
          urgency_score?: number
          is_read?: boolean
          is_resolved?: boolean
          received_at?: string
        }
        Update: {
          intent?: 'faq' | 'order' | 'complaint' | 'unknown' | null
          urgency_score?: number
          is_read?: boolean
          is_resolved?: boolean
        }
      }
      auto_replies: {
        Row: {
          id: string
          profile_id: string
          trigger_keyword: string
          response_text: string
          channel_type: 'whatsapp' | 'instagram' | 'email' | 'all' | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          trigger_keyword: string
          response_text: string
          channel_type?: 'whatsapp' | 'instagram' | 'email' | 'all' | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          trigger_keyword?: string
          response_text?: string
          channel_type?: 'whatsapp' | 'instagram' | 'email' | 'all' | null
          is_active?: boolean
        }
      }
    }
  }
}