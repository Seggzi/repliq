'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Zap, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react'
import type { AutoReply } from '@/types'

const CHANNEL_OPTIONS = ['all', 'whatsapp', 'instagram', 'email'] as const

const EXAMPLES = [
  { trigger: 'price',    response: 'Hi! Our prices start from ₦3,500. Reply with the item name for the exact price 😊' },
  { trigger: 'location', response: 'We are located at 12 Bode Thomas Street, Surulere, Lagos. Open Mon–Sat 9am–7pm.' },
  { trigger: 'delivery', response: 'We deliver within Lagos in 24–48 hours. Outside Lagos takes 3–5 working days.' },
]

export default function AutoRepliesPage() {
  const supabase = createClient()
  const [replies, setReplies] = useState<AutoReply[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [trigger, setTrigger] = useState('')
  const [response, setResponse] = useState('')
  const [channelType, setChannelType] = useState<'all' | 'whatsapp' | 'instagram' | 'email'>('all')

  const C = {
    mint:      '#53E6D4',
    mintFaint: 'rgba(83,230,212,0.08)',
    border:    'rgba(83,230,212,0.12)',
    borderMid: 'rgba(83,230,212,0.22)',
    gray:      '#F4F7F7',
    textDim:   'rgba(244,247,247,0.45)',
    textMid:   'rgba(244,247,247,0.7)',
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setReplies(data as AutoReply[])
    }
    load()
  }, [])

  async function addReply() {
    if (!trigger.trim() || !response.trim() || !userId) return
    setLoading(true)

    const { data, error } = await supabase.from('auto_replies').insert({
      profile_id: userId,
      trigger_keyword: trigger.trim().toLowerCase(),
      response_text: response.trim(),
      channel_type: channelType,
      is_active: true,
    }).select().single()

    if (!error && data) {
      setReplies(prev => [data as AutoReply, ...prev])
      setTrigger('')
      setResponse('')
      setChannelType('all')
      setShowForm(false)
    }
    setLoading(false)
  }

  async function deleteReply(id: string) {
    await supabase.from('auto_replies').delete().eq('id', id)
    setReplies(prev => prev.filter(r => r.id !== id))
  }

  async function toggleReply(id: string, current: boolean) {
    await supabase.from('auto_replies').update({ is_active: !current }).eq('id', id)
    setReplies(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r))
  }

  function useExample(ex: typeof EXAMPLES[0]) {
    setTrigger(ex.trigger)
    setResponse(ex.response)
    setShowForm(true)
  }

  const channelColors: Record<string, string> = {
    all:       '#53E6D4',
    whatsapp:  '#25D366',
    instagram: '#E1306C',
    email:     '#60a5fa',
  }

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .ar-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .ar-sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .rise { animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .d1{animation-delay:.06s;} .d2{animation-delay:.12s;} .d3{animation-delay:.18s;}

        .reply-card {
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 16px; padding: 18px 20px;
          transition: border-color 0.2s, background 0.2s;
        }
        .reply-card:hover {
          border-color: rgba(83,230,212,0.2);
          background: rgba(13,46,46,0.6);
        }
        .reply-card.inactive {
          opacity: 0.5;
        }

        .example-card {
          background: rgba(13,46,46,0.35);
          border: 1px solid rgba(83,230,212,0.08);
          border-radius: 14px; padding: 14px 16px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .example-card:hover {
          border-color: rgba(83,230,212,0.22);
          background: rgba(13,46,46,0.6);
          transform: translateY(-2px);
        }

        .field-input {
          width: 100%;
          background: rgba(13,46,46,0.6);
          border: 1px solid rgba(83,230,212,0.12);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; color: #F4F7F7;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
        }
        .field-input::placeholder { color: rgba(244,247,247,0.25); }
        .field-input:focus { border-color: rgba(83,230,212,0.35); }

        .ch-select {
          background: rgba(13,46,46,0.6);
          border: 1px solid rgba(83,230,212,0.12);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; color: #F4F7F7;
          outline: none; cursor: pointer;
          transition: border-color 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(83,230,212,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        .ch-select option { background: #0A2424; }

        .btn-mint {
          display: inline-flex; align-items: center; gap: 7px;
          background: #53E6D4; color: #080C0C;
          padding: 11px 22px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-mint:hover:not(:disabled) { background: #6AEDE0; transform: translateY(-1px); }
        .btn-mint:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 7px;
          background: transparent; color: rgba(244,247,247,0.4);
          padding: 11px 18px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px;
          border: 1px solid rgba(244,247,247,0.1); cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-ghost:hover { background: rgba(244,247,247,0.04); color: rgba(244,247,247,0.7); }

        .add-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(83,230,212,0.1);
          border: 1px solid rgba(83,230,212,0.22);
          color: #53E6D4;
          padding: 10px 20px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.2s, transform 0.15s;
        }
        .add-btn:hover { background: rgba(83,230,212,0.16); transform: translateY(-1px); }

        .delete-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(239,68,68,0.5); display: flex; align-items: center;
          padding: 0; transition: color 0.2s;
        }
        .delete-btn:hover { color: #f87171; }

        .toggle-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 0;
          transition: color 0.2s;
        }

        .section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(244,247,247,0.25);
          margin-bottom: 14px;
        }
      `}</style>

      {/* Header */}
      <div className="rise" style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="ar-serif" style={{ fontSize: 42, fontWeight: 500, color: C.gray, letterSpacing: '-0.015em', lineHeight: 1.05, marginBottom: 6 }}>
            Auto <em style={{ color: C.mint }}>replies</em>
          </h1>
          <p className="ar-sans" style={{ fontSize: 14, color: C.textDim }}>
            Set keywords that trigger automatic responses 24/7.
          </p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(v => !v)}>
          <Plus size={14} /> New auto-reply
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, maxWidth: 960 }}>

        {/* Left column */}
        <div>

          {/* Add form */}
          {showForm && (
            <div className="rise" style={{
              background: 'rgba(13,46,46,0.55)',
              border: '1px solid rgba(83,230,212,0.2)',
              borderRadius: 20, padding: '22px 24px', marginBottom: 16,
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg, transparent, rgba(83,230,212,0.4), transparent)' }} />

              <p className="ar-sans" style={{ fontSize: 13, fontWeight: 600, color: C.gray, marginBottom: 16, letterSpacing: '-0.01em' }}>
                New auto-reply
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                <div>
                  <label className="ar-sans" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(244,247,247,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
                    Trigger keyword
                  </label>
                  <input
                    className="field-input"
                    type="text"
                    value={trigger}
                    onChange={e => setTrigger(e.target.value)}
                    placeholder="e.g. price, delivery, location"
                  />
                  <p className="ar-sans" style={{ fontSize: 11, color: 'rgba(244,247,247,0.25)', marginTop: 5 }}>
                    When a message contains this word, the reply is sent automatically
                  </p>
                </div>

                <div>
                  <label className="ar-sans" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(244,247,247,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
                    Response message
                  </label>
                  <textarea
                    className="field-input"
                    rows={3}
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    placeholder="What should Repliq reply when this keyword is detected?"
                  />
                </div>

                <div>
                  <label className="ar-sans" style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'rgba(244,247,247,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
                    Apply to channel
                  </label>
                  <select
                    className="ch-select"
                    value={channelType}
                    onChange={e => setChannelType(e.target.value as typeof channelType)}
                  >
                    <option value="all">All channels</option>
                    <option value="whatsapp">WhatsApp only</option>
                    <option value="instagram">Instagram only</option>
                    <option value="email">Email only</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button className="btn-mint" onClick={addReply} disabled={loading || !trigger || !response}>
                    {loading ? 'Saving…' : <>Save reply <ArrowRight size={13} /></>}
                  </button>
                  <button className="btn-ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Replies list */}
          {replies.length === 0 ? (
            <div style={{
              background: 'rgba(13,46,46,0.3)',
              border: '1px solid rgba(83,230,212,0.08)',
              borderRadius: 20, padding: '60px 40px', textAlign: 'center',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', margin: '0 auto 18px',
                background: C.mintFaint, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={20} color="rgba(83,230,212,0.5)" />
              </div>
              <h3 className="ar-serif" style={{ fontSize: 24, fontWeight: 500, color: 'rgba(244,247,247,0.6)', marginBottom: 8 }}>
                No auto-replies yet
              </h3>
              <p className="ar-sans" style={{ fontSize: 13, color: 'rgba(244,247,247,0.3)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto 22px' }}>
                Add your first keyword to start replying to customers automatically
              </p>
              <button className="add-btn" onClick={() => setShowForm(true)}>
                <Plus size={13} /> Add your first reply
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="section-label">{replies.length} auto-repl{replies.length === 1 ? 'y' : 'ies'}</p>
              {replies.map((r, i) => (
                <div key={r.id} className={`reply-card rise ${!r.is_active ? 'inactive' : ''}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>

                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: C.mintFaint, border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Zap size={14} color={C.mint} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <code style={{
                          fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
                          color: C.mint, background: C.mintFaint,
                          border: `1px solid ${C.border}`,
                          padding: '2px 9px', borderRadius: 6,
                        }}>
                          {r.trigger_keyword}
                        </code>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                          background: `${channelColors[r.channel_type ?? 'all']}15`,
                          color: channelColors[r.channel_type ?? 'all'],
                          border: `1px solid ${channelColors[r.channel_type ?? 'all']}25`,
                          fontFamily: "'Outfit', sans-serif",
                        }}>
                          {r.channel_type === 'all' ? 'All channels' : r.channel_type}
                        </span>
                        {!r.is_active && (
                          <span style={{ fontSize: 10, color: 'rgba(244,247,247,0.25)', fontFamily: "'Outfit', sans-serif" }}>Paused</span>
                        )}
                      </div>
                      <p className="ar-sans" style={{ fontSize: 13, color: C.textDim, lineHeight: 1.55 }}>
                        {r.response_text}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button className="toggle-btn" onClick={() => toggleReply(r.id, r.is_active)}
                        title={r.is_active ? 'Pause' : 'Activate'}
                        style={{ color: r.is_active ? C.mint : 'rgba(244,247,247,0.2)' }}>
                        {r.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                      <button className="delete-btn" onClick={() => deleteReply(r.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — examples */}
        <div>
          <p className="section-label">Quick start examples</p>
          <p className="ar-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.3)', lineHeight: 1.6, marginBottom: 14 }}>
            Click any example to pre-fill the form
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EXAMPLES.map(ex => (
              <div key={ex.trigger} className="example-card" onClick={() => useExample(ex)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <code style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                    color: C.mint, background: C.mintFaint,
                    border: `1px solid ${C.border}`,
                    padding: '2px 8px', borderRadius: 5,
                  }}>{ex.trigger}</code>
                  <ArrowRight size={11} color="rgba(83,230,212,0.4)" style={{ marginLeft: 'auto' }} />
                </div>
                <p className="ar-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)', lineHeight: 1.55 }}>
                  {ex.response.slice(0, 70)}…
                </p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{
            background: 'rgba(83,230,212,0.04)', border: '1px solid rgba(83,230,212,0.08)',
            borderRadius: 14, padding: '16px', marginTop: 16,
          }}>
            <p className="ar-sans" style={{ fontSize: 11, fontWeight: 600, color: C.mint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>How it works</p>
            {[
              'Customer sends a message containing your keyword',
              'Repliq detects it instantly',
              'Your pre-written reply is sent automatically',
              'Message is still visible in your inbox',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <span className="ar-sans" style={{ fontSize: 11, fontWeight: 600, color: C.mint, opacity: 0.5, minWidth: 16 }}>{i + 1}.</span>
                <p className="ar-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.35)', lineHeight: 1.55, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}