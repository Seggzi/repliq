import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string }
}) {
  const supabase = await createClient()

  // Fetch single message
  const { data: rawMessage } = await supabase
    .from('messages')
    .select('*, customers(*), channels(type)')
    .eq('id', params.threadId)
    .single()

  if (!rawMessage) notFound()

  const message = rawMessage as any

  // Mark message as read
  await (supabase as any)
    .from('messages')
    .update({ is_read: true })
    .eq('id', params.threadId)

  // Fetch full thread
  const { data: rawThread } = await supabase
    .from('messages')
    .select('*, channels(type)')
    .eq('customer_id', message.customer_id)
    .order('received_at', { ascending: true })

  const thread = (rawThread ?? []) as any[]

  const customer = message.customers as any
  const chType = message.channels?.type ?? 'unknown'

  const channelColors: Record<string, string> = {
    whatsapp: '#25D366',
    instagram: '#E1306C',
    email: '#60a5fa',
  }

  const chColor = channelColors[chType] ?? '#53E6D4'

  const initials = (customer?.name ?? 'UN')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .t-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .t-sans  { font-family: 'Outfit', system-ui, sans-serif; }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(244,247,247,0.4); font-family: 'Outfit', sans-serif;
          font-size: 13px; text-decoration: none; transition: color 0.2s; margin-bottom: 24px;
        }
        .back-btn:hover { color: rgba(83,230,212,0.8); }
        .msg-bubble {
          max-width: 70%; padding: 12px 16px; border-radius: 16px;
          font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.6;
        }
        .resolve-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25);
          color: #34d399; padding: 9px 18px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.2s; text-decoration: none;
        }
        .resolve-btn:hover { background: rgba(52,211,153,0.18); }
        @media (max-width: 768px) {
          .thread-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Link href="/dashboard" className="back-btn">
        <ArrowLeft size={14} /> Back to inbox
      </Link>

      <div className="thread-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, maxWidth: 900 }}>

        {/* Thread */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h1 className="t-serif" style={{ fontSize: 32, fontWeight: 500, color: '#F4F7F7', letterSpacing: '-0.01em', marginBottom: 4 }}>
                {customer?.name ?? 'Unknown customer'}
              </h1>
              <span style={{
                fontSize: 11, color: chColor, background: `${chColor}15`,
                border: `1px solid ${chColor}25`, padding: '3px 10px', borderRadius: 6,
                fontFamily: "'Outfit', sans-serif", fontWeight: 500,
              }}>{chType}</span>
            </div>
            <Link href={`/dashboard/${params.threadId}?resolve=true`} className="resolve-btn">
              <CheckCircle size={14} /> Mark resolved
            </Link>
          </div>

          <div style={{
            background: 'rgba(13,46,46,0.35)', border: '1px solid rgba(83,230,212,0.1)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: 'rgba(10,36,36,0.5)',
              borderBottom: '1px solid rgba(83,230,212,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span className="t-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.4)' }}>
                {thread.length} message{thread.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(thread.length > 0 ? thread : [message]).map((msg: any) => {
                const isOut = msg.direction === 'outbound'
                const msgColor = channelColors[msg.channels?.type ?? chType] ?? chColor

                return (
                  <div key={msg.id} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: isOut ? 'flex-end' : 'flex-start',
                  }}>
                    <div className="msg-bubble" style={{
                      background: isOut ? 'rgba(83,230,212,0.12)' : 'rgba(13,46,46,0.7)',
                      border: `1px solid ${isOut ? 'rgba(83,230,212,0.2)' : 'rgba(244,247,247,0.06)'}`,
                      color: isOut ? '#53E6D4' : '#F4F7F7',
                      borderBottomRightRadius: isOut ? 4 : 16,
                      borderBottomLeftRadius: isOut ? 16 : 4,
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      <span style={{
                        fontSize: 10, padding: '1px 7px', borderRadius: 999,
                        background: `${msgColor}12`, color: msgColor,
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                      }}>
                        {msg.channels?.type ?? chType}
                      </span>
                      <span className="t-sans" style={{ fontSize: 11, color: 'rgba(244,247,247,0.22)' }}>
                        {new Date(msg.received_at).toLocaleString('en-NG', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Customer Sidebar */}
        <div>
          <div style={{
            background: 'rgba(13,46,46,0.5)', border: '1px solid rgba(83,230,212,0.15)',
            borderRadius: 20, padding: '22px', textAlign: 'center',
            position: 'relative', overflow: 'hidden', marginBottom: 12,
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(83,230,212,0.4), transparent)' }} />

            <div style={{
              width: 56, height: 56, borderRadius: '50%', margin: '0 auto 14px',
              background: 'rgba(83,230,212,0.08)', border: '1px solid rgba(83,230,212,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, color: '#53E6D4',
            }}>
              {initials}
            </div>

            <p className="t-sans" style={{ fontSize: 15, fontWeight: 500, color: '#F4F7F7', marginBottom: 4 }}>
              {customer?.name ?? 'Unknown'}
            </p>
            {customer?.email && <p className="t-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)' }}>{customer.email}</p>}
            {customer?.whatsapp_number && <p className="t-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)' }}>{customer.whatsapp_number}</p>}
            {customer?.instagram_handle && <p className="t-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)' }}>@{customer.instagram_handle}</p>}
          </div>

          <div style={{
            background: 'rgba(13,46,46,0.4)', border: '1px solid rgba(83,230,212,0.1)',
            borderRadius: 14, padding: '16px',
          }}>
            <p className="t-sans" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,247,247,0.25)', marginBottom: 12 }}>
              Message info
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Channel', value: chType },
                { label: 'Intent', value: message.intent ?? 'unknown' },
                { label: 'Urgency', value: message.urgency_score >= 20 ? 'High' : message.urgency_score >= 10 ? 'Medium' : 'Low' },
                { label: 'Status', value: message.is_resolved ? 'Resolved' : 'Open' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="t-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.3)' }}>{label}</span>
                  <span className="t-sans" style={{ fontSize: 12, color: '#F4F7F7', fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}