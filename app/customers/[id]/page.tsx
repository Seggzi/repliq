import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Mail, Phone } from 'lucide-react'

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!customer) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*, channels(type)')
    .eq('customer_id', customer.id)
    .order('received_at', { ascending: false })
    .limit(50)

  const C = {
    mint:      '#53E6D4',
    mintFaint: 'rgba(83,230,212,0.08)',
    border:    'rgba(83,230,212,0.12)',
    borderMid: 'rgba(83,230,212,0.22)',
    gray:      '#F4F7F7',
    textDim:   'rgba(244,247,247,0.45)',
  }

  const initials = (customer.name ?? '??')
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const channelColors: Record<string, string> = {
    whatsapp:  '#25D366',
    instagram: '#E1306C',
    email:     '#60a5fa',
  }

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .cd-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .cd-sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .rise { animation: rise 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        .msg-bubble {
          max-width: 72%;
          padding: 11px 14px;
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; line-height: 1.55;
        }
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(244,247,247,0.4);
          font-family: 'Outfit', sans-serif; font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
          margin-bottom: 24px;
        }
        .back-btn:hover { color: rgba(83,230,212,0.8); }
      `}</style>

      <Link href="/customers" className="back-btn">
        <ArrowLeft size={14} /> Back to customers
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, maxWidth: 900 }}>

        {/* Message history */}
        <div>
          <h1 className="cd-serif" style={{ fontSize: 36, fontWeight: 500, color: C.gray, letterSpacing: '-0.015em', marginBottom: 6 }}>
            {customer.name ?? 'Unknown customer'}
          </h1>
          <p className="cd-sans" style={{ fontSize: 13, color: C.textDim, marginBottom: 24 }}>
            Full message history across all channels
          </p>

          {!messages || messages.length === 0 ? (
            <div style={{
              background: 'rgba(13,46,46,0.3)', border: '1px solid rgba(83,230,212,0.08)',
              borderRadius: 16, padding: '40px', textAlign: 'center',
            }}>
              <MessageSquare size={24} color="rgba(83,230,212,0.3)" style={{ margin: '0 auto 12px' }} />
              <p className="cd-sans" style={{ fontSize: 13, color: 'rgba(244,247,247,0.3)' }}>No messages yet</p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(13,46,46,0.35)', border: '1px solid rgba(83,230,212,0.1)',
              borderRadius: 20, overflow: 'hidden',
            }}>
              {/* Toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'rgba(10,36,36,0.6)',
                borderBottom: '1px solid rgba(83,230,212,0.08)',
              }}>
                <span className="cd-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.4)' }}>
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Messages */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...messages].reverse().map((msg: any) => {
                  const isOut   = msg.direction === 'outbound'
                  const chType  = msg.channels?.type ?? 'unknown'
                  const chColor = channelColors[chType] ?? C.mint

                  return (
                    <div key={msg.id} style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: isOut ? 'flex-end' : 'flex-start',
                    }}>
                      <div className="msg-bubble" style={{
                        background: isOut ? 'rgba(83,230,212,0.12)' : 'rgba(13,46,46,0.7)',
                        border: `1px solid ${isOut ? 'rgba(83,230,212,0.2)' : 'rgba(244,247,247,0.06)'}`,
                        color: isOut ? C.mint : C.gray,
                        borderBottomRightRadius: isOut ? 4 : 14,
                        borderBottomLeftRadius:  isOut ? 14 : 4,
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, padding: '1px 7px', borderRadius: 999,
                          background: `${chColor}12`, color: chColor,
                          fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                        }}>{chType}</span>
                        <span className="cd-sans" style={{ fontSize: 11, color: 'rgba(244,247,247,0.25)' }}>
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
          )}
        </div>

        {/* Profile sidebar */}
        <div>
          {/* Avatar card */}
          <div style={{
            background: 'rgba(13,46,46,0.5)', border: '1px solid rgba(83,230,212,0.15)',
            borderRadius: 20, padding: '24px', marginBottom: 12, textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(83,230,212,0.4), transparent)' }} />
            <div style={{
              width: 60, height: 60, borderRadius: '50%', margin: '0 auto 14px',
              background: C.mintFaint, border: `1px solid ${C.borderMid}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600, color: C.mint,
            }}>
              {initials}
            </div>
            <p className="cd-sans" style={{ fontSize: 15, fontWeight: 500, color: C.gray, marginBottom: 4 }}>
              {customer.name ?? 'Unknown'}
            </p>
            <p className="cd-sans" style={{ fontSize: 11, color: C.textDim }}>
              Customer since {new Date(customer.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Contact details */}
          <div style={{
            background: 'rgba(13,46,46,0.4)', border: '1px solid rgba(83,230,212,0.1)',
            borderRadius: 16, padding: '18px',
          }}>
            <p className="cd-sans" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,247,247,0.25)', marginBottom: 14 }}>
              Contact details
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {customer.whatsapp_number && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Phone size={13} color="#25D366" />
                  </div>
                  <div>
                    <p className="cd-sans" style={{ fontSize: 10, color: 'rgba(244,247,247,0.3)', marginBottom: 2 }}>WhatsApp</p>
                    <p className="cd-sans" style={{ fontSize: 13, color: C.gray }}>{customer.whatsapp_number}</p>
                  </div>
                </div>
              )}

              {customer.instagram_handle && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(225,48,108,0.1)', border: '1px solid rgba(225,48,108,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Instagram icon — not in lucide-react, using inline SVG */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="#E1306C"/>
                    </svg>
                  </div>
                  <div>
                    <p className="cd-sans" style={{ fontSize: 10, color: 'rgba(244,247,247,0.3)', marginBottom: 2 }}>Instagram</p>
                    <p className="cd-sans" style={{ fontSize: 13, color: C.gray }}>@{customer.instagram_handle}</p>
                  </div>
                </div>
              )}

              {customer.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Mail size={13} color="#60a5fa" />
                  </div>
                  <div>
                    <p className="cd-sans" style={{ fontSize: 10, color: 'rgba(244,247,247,0.3)', marginBottom: 2 }}>Email</p>
                    <p className="cd-sans" style={{ fontSize: 13, color: C.gray }}>{customer.email}</p>
                  </div>
                </div>
              )}

              {!customer.whatsapp_number && !customer.instagram_handle && !customer.email && (
                <p className="cd-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.25)' }}>No contact details yet</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}