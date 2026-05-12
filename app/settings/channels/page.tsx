'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Trash2, RefreshCw, Plus, ArrowRight } from 'lucide-react'
import type { ChannelRecord } from '@/types'

export default function ChannelsPage() {
  const supabase = createClient()
  const [channels, setChannels] = useState<ChannelRecord[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('profile_id', user.id)
      if (data) setChannels(data as ChannelRecord[])
    }
    load()
  }, [])

  function isConnected(type: string) {
    return channels.some(c => c.type === type && c.status === 'active')
  }

  function getChannel(type: string) {
    return channels.find(c => c.type === type)
  }

  async function disconnectChannel(id: string) {
    await supabase.from('channels').delete().eq('id', id)
    setChannels(prev => prev.filter(c => c.id !== id))
  }

  async function connectEmail() {
    if (!emailInput || !userId) return
    setLoading('email')
    const forwardAddress = `${userId.slice(0, 8)}@mail.repliq.com`
    const { data, error } = await supabase.from('channels').insert({
      profile_id: userId,
      type: 'email',
      status: 'active',
      account_name: emailInput,
      account_id: forwardAddress,
    }).select().single()
    if (!error && data) {
      setChannels(prev => [...prev, data as ChannelRecord])
      setEmailInput('')
    }
    setLoading(null)
  }

  function copyAddress(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function connectInstagram() {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID
    if (!appId) {
      alert('Meta App ID not configured yet. Add NEXT_PUBLIC_META_APP_ID to your .env.local')
      return
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`)
    const scope = encodeURIComponent('instagram_basic,instagram_manage_messages,pages_manage_metadata')
    window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=instagram`
  }

  function connectWhatsApp() {
    alert('WhatsApp connection requires Meta app approval. We will set this up together after your Meta app is approved.')
  }

  const emailChannel = getChannel('email')
  const igChannel = getChannel('instagram')
  const waChannel = getChannel('whatsapp')

  const C = {
    mint:      '#53E6D4',
    mintFaint: 'rgba(83,230,212,0.08)',
    border:    'rgba(83,230,212,0.12)',
    borderMid: 'rgba(83,230,212,0.22)',
    carbon:    '#080C0C',
    teal800:   '#0A2424',
    teal700:   '#0C2929',
    gray:      '#F4F7F7',
    textDim:   'rgba(244,247,247,0.45)',
    textMid:   'rgba(244,247,247,0.7)',
  }

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .ch-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .ch-sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .rise { animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay:.06s; }
        .d2 { animation-delay:.12s; }
        .d3 { animation-delay:.18s; }

        .ch-card {
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 20px;
          padding: 24px;
          transition: border-color 0.2s, background 0.2s;
        }
        .ch-card:hover {
          border-color: rgba(83,230,212,0.2);
          background: rgba(13,46,46,0.6);
        }
        .ch-card.connected {
          border-color: rgba(83,230,212,0.3);
          background: rgba(13,46,46,0.55);
        }

        .connect-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(83,230,212,0.1);
          border: 1px solid rgba(83,230,212,0.22);
          color: #53E6D4;
          padding: 9px 18px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .connect-btn:hover {
          background: rgba(83,230,212,0.16);
          transform: translateY(-1px);
        }

        .disconnect-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          color: rgba(239,68,68,0.6);
          font-family: 'Outfit', sans-serif; font-size: 12px;
          padding: 0; transition: color 0.2s;
        }
        .disconnect-btn:hover { color: #f87171; }

        .field-input {
          flex: 1;
          background: rgba(13,46,46,0.6);
          border: 1px solid rgba(83,230,212,0.12);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; color: #F4F7F7;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input::placeholder { color: rgba(244,247,247,0.25); }
        .field-input:focus { border-color: rgba(83,230,212,0.35); }

        .btn-mint {
          display: inline-flex; align-items: center; gap: 7px;
          background: #53E6D4; color: #080C0C;
          padding: 11px 20px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-mint:hover:not(:disabled) { background: #6AEDE0; transform: translateY(-1px); }
        .btn-mint:disabled { opacity: 0.5; cursor: not-allowed; }

        .copy-btn {
          background: rgba(83,230,212,0.08);
          border: 1px solid rgba(83,230,212,0.18);
          color: #53E6D4;
          font-family: 'Outfit', sans-serif; font-size: 11px;
          padding: 5px 12px; border-radius: 7px; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
        }
        .copy-btn:hover { background: rgba(83,230,212,0.15); }

        .section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(244,247,247,0.25);
          margin-bottom: 14px;
        }
        .status-pill {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
          padding: 3px 10px; border-radius: 999px;
        }
      `}</style>

      {/* Header */}
      <div className="rise" style={{ marginBottom: 32 }}>
        <h1 className="ch-serif" style={{ fontSize: 42, fontWeight: 500, color: C.gray, letterSpacing: '-0.015em', lineHeight: 1.05, marginBottom: 6 }}>
          Connect <em style={{ color: C.mint }}>channels</em>
        </h1>
        <p className="ch-sans" style={{ fontSize: 14, color: C.textDim }}>
          Link your accounts — no technical setup needed.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680 }}>

        {/* Instagram */}
        <div className={`ch-card rise d1 ${isConnected('instagram') ? 'connected' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'rgba(225,48,108,0.1)', border: '1px solid rgba(225,48,108,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="#E1306C"/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="ch-sans" style={{ fontSize: 15, fontWeight: 500, color: C.gray }}>Instagram DM</span>
                {isConnected('instagram') ? (
                  <span className="status-pill" style={{ background: 'rgba(83,230,212,0.1)', color: C.mint, border: `1px solid ${C.borderMid}` }}>Connected</span>
                ) : (
                  <span className="status-pill" style={{ background: 'rgba(244,247,247,0.05)', color: 'rgba(244,247,247,0.3)', border: '1px solid rgba(244,247,247,0.08)' }}>Not connected</span>
                )}
              </div>

              {isConnected('instagram') ? (
                <div>
                  <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, marginBottom: 12 }}>
                    Connected as <span style={{ color: C.gray, fontWeight: 500 }}>{igChannel?.account_name}</span>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={11} color={C.mint} />
                      <span className="ch-sans" style={{ fontSize: 11, color: 'rgba(83,230,212,0.6)' }}>Active</span>
                    </div>
                    <button className="disconnect-btn" onClick={() => igChannel && disconnectChannel(igChannel.id)}>
                      <Trash2 size={11} /> Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
                  One click — a Facebook login popup opens. Approve Repliq and you're done. Takes about 1 minute.
                </p>
              )}
            </div>

            {!isConnected('instagram') && (
              <button className="connect-btn" onClick={connectInstagram}>
                <Plus size={13} /> Connect
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div className={`ch-card rise d2 ${isConnected('whatsapp') ? 'connected' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="ch-sans" style={{ fontSize: 15, fontWeight: 500, color: C.gray }}>WhatsApp Business</span>
                {isConnected('whatsapp') ? (
                  <span className="status-pill" style={{ background: 'rgba(83,230,212,0.1)', color: C.mint, border: `1px solid ${C.borderMid}` }}>Connected</span>
                ) : (
                  <span className="status-pill" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>Requires Meta approval</span>
                )}
              </div>

              {isConnected('whatsapp') ? (
                <div>
                  <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, marginBottom: 12 }}>
                    Connected as <span style={{ color: C.gray, fontWeight: 500 }}>{waChannel?.account_name}</span>
                  </p>
                  <button className="disconnect-btn" onClick={() => waChannel && disconnectChannel(waChannel.id)}>
                    <Trash2 size={11} /> Disconnect
                  </button>
                </div>
              ) : (
                <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
                  A Meta popup will guide you through connecting your WhatsApp Business number. No external sites needed.
                </p>
              )}
            </div>

            {!isConnected('whatsapp') && (
              <button className="connect-btn" onClick={connectWhatsApp}>
                <Plus size={13} /> Connect
              </button>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={`ch-card rise d3 ${isConnected('email') ? 'connected' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Mail size={18} color="#60a5fa" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="ch-sans" style={{ fontSize: 15, fontWeight: 500, color: C.gray }}>Email</span>
                {isConnected('email') ? (
                  <span className="status-pill" style={{ background: 'rgba(83,230,212,0.1)', color: C.mint, border: `1px solid ${C.borderMid}` }}>Connected</span>
                ) : (
                  <span className="status-pill" style={{ background: 'rgba(244,247,247,0.05)', color: 'rgba(244,247,247,0.3)', border: '1px solid rgba(244,247,247,0.08)' }}>Not connected</span>
                )}
              </div>

              {isConnected('email') ? (
                <div>
                  <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, marginBottom: 12 }}>
                    Forwarding from <span style={{ color: C.gray, fontWeight: 500 }}>{emailChannel?.account_name}</span>
                  </p>
                  <div style={{
                    background: 'rgba(8,12,12,0.5)', border: '1px solid rgba(83,230,212,0.1)',
                    borderRadius: 12, padding: '12px 14px', marginBottom: 12,
                  }}>
                    <p className="ch-sans" style={{ fontSize: 10, color: 'rgba(244,247,247,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Your Repliq inbox address
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{
                        flex: 1, fontFamily: 'monospace', fontSize: 13,
                        color: C.mint, background: 'rgba(83,230,212,0.05)',
                        border: '1px solid rgba(83,230,212,0.12)',
                        borderRadius: 8, padding: '7px 10px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {emailChannel?.account_id}
                      </code>
                      <button className="copy-btn" onClick={() => emailChannel?.account_id && copyAddress(emailChannel.account_id)}>
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <button className="disconnect-btn" onClick={() => emailChannel && disconnectChannel(emailChannel.id)}>
                    <Trash2 size={11} /> Disconnect
                  </button>
                </div>
              ) : (
                <div>
                  <p className="ch-sans" style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: 14 }}>
                    Enter your business email. We'll give you a forwarding address — just add it in Gmail settings. No DNS needed.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="field-input"
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="hello@yourbusiness.com"
                    />
                    <button
                      className="btn-mint"
                      onClick={connectEmail}
                      disabled={loading === 'email' || !emailInput}
                    >
                      {loading === 'email' ? 'Saving…' : <>Connect <ArrowRight size={13} /></>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info note */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'rgba(83,230,212,0.04)', border: '1px solid rgba(83,230,212,0.08)',
          borderRadius: 14, padding: '14px 18px', marginTop: 4,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(83,230,212,0.5)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="ch-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)', lineHeight: 1.6, margin: 0 }}>
            Your credentials are never stored. We only save the access tokens Meta gives us, which you can revoke anytime from your Facebook settings.
          </p>
        </div>

      </div>
    </div>
  )
}