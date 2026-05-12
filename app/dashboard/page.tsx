import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MessageSquare, AlertCircle, Mail, CheckCircle, Plus, ArrowRight, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  const stats = [
    { label: 'Total messages', value: '0', icon: MessageSquare, color: '#53E6D4' },
    { label: 'Urgent',         value: '0', icon: AlertCircle,   color: '#f87171' },
    { label: 'Unread',         value: '0', icon: Mail,          color: '#a78bfa' },
    { label: 'Resolved today', value: '0', icon: CheckCircle,   color: '#34d399' },
  ]

  return (
    <div style={{ padding:'32px 36px', fontFamily:"'Outfit', system-ui, sans-serif", minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .db-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .db-sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .rise { animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay:.06s; }
        .d2 { animation-delay:.12s; }
        .d3 { animation-delay:.18s; }
        .d4 { animation-delay:.24s; }

        .stat-card {
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 16px; padding: 20px 22px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(83,230,212,0.22);
          background: rgba(13,46,46,0.65);
          transform: translateY(-3px);
        }

        .quick-action {
          display: flex; align-items: center; gap: 12px;
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 14px; padding: 16px 18px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .quick-action:hover {
          border-color: rgba(83,230,212,0.25);
          background: rgba(13,46,46,0.65);
          transform: translateY(-2px);
        }

        .btn-mint {
          display: inline-flex; align-items: center; gap: 8px;
          background: #53E6D4; color: #080C0C;
          padding: 11px 22px; border-radius: 11px;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
          text-decoration: none; letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 24px rgba(83,230,212,0.18);
        }
        .btn-mint:hover { background: #6AEDE0; transform: translateY(-1px); box-shadow: 0 0 36px rgba(83,230,212,0.3); }

        .section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(244,247,247,0.25);
          margin-bottom: 14px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(83,230,212,0.12), transparent);
          margin: 28px 0;
        }
      `}</style>

      {/* Header */}
      <div className="rise" style={{ marginBottom:32, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 className="db-serif" style={{ fontSize:42, fontWeight:500, color:'#F4F7F7', letterSpacing:'-0.015em', lineHeight:1.05, marginBottom:6 }}>
            Good morning, <em style={{ color:'#53E6D4' }}>{firstName}</em>
          </h1>
          <p className="db-sans" style={{ fontSize:14, color:'rgba(244,247,247,0.4)' }}>
            Here's what's happening with your inbox today
          </p>
        </div>
        <Link href="/settings/channels" className="btn-mint">
          <Plus size={14} /> Connect channel
        </Link>
      </div>

      {/* Stats strip */}
      <p className="section-label rise d1">Overview</p>
      <div className="rise d1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <span className="db-sans" style={{ fontSize:11, color:'rgba(244,247,247,0.35)', letterSpacing:'0.04em' }}>{label}</span>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:`${color}14`, border:`1px solid ${color}28`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={13} color={color} />
              </div>
            </div>
            <p className="db-serif" style={{ fontSize:44, fontWeight:500, color:'#F4F7F7', lineHeight:1, letterSpacing:'-0.02em' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20 }}>

        {/* Empty inbox */}
        <div className="rise d2" style={{
          background:'rgba(13,46,46,0.35)',
          border:'1px solid rgba(83,230,212,0.1)',
          borderRadius:20, overflow:'hidden',
        }}>
          {/* Inbox toolbar */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'16px 20px',
            borderBottom:'1px solid rgba(83,230,212,0.08)',
            background:'rgba(10,36,36,0.5)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <MessageSquare size={14} color="#53E6D4" />
              <span className="db-sans" style={{ fontSize:13, fontWeight:500, color:'rgba(244,247,247,0.7)' }}>All messages</span>
              <span className="db-sans" style={{
                fontSize:10, fontWeight:600,
                background:'rgba(83,230,212,0.1)', color:'rgba(83,230,212,0.7)',
                border:'1px solid rgba(83,230,212,0.15)',
                padding:'2px 7px', borderRadius:5,
              }}>0</span>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['All','Unread','Urgent'].map((f, i) => (
                <button key={f} className="db-sans" style={{
                  background: i === 0 ? 'rgba(83,230,212,0.1)' : 'transparent',
                  border: `1px solid ${i === 0 ? 'rgba(83,230,212,0.2)' : 'rgba(244,247,247,0.08)'}`,
                  color: i === 0 ? '#53E6D4' : 'rgba(244,247,247,0.35)',
                  fontSize:11, fontWeight:500, padding:'5px 12px', borderRadius:7, cursor:'pointer',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          <div style={{ padding:'80px 40px', textAlign:'center' }}>
            <div style={{
              width:56, height:56, borderRadius:'50%', margin:'0 auto 20px',
              background:'rgba(83,230,212,0.08)', border:'1px solid rgba(83,230,212,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <MessageSquare size={22} color="rgba(83,230,212,0.5)" />
            </div>
            <h3 className="db-serif" style={{ fontSize:26, fontWeight:500, color:'rgba(244,247,247,0.7)', marginBottom:8 }}>
              No messages yet
            </h3>
            <p className="db-sans" style={{ fontSize:13, color:'rgba(244,247,247,0.3)', lineHeight:1.6, maxWidth:260, margin:'0 auto 24px' }}>
              Connect a channel to start receiving customer messages here
            </p>
            <Link href="/settings/channels" className="btn-mint">
              Connect a channel <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Quick actions */}
          <div className="rise d3">
            <p className="section-label">Quick actions</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { href:'/settings/channels', icon: MessageSquare, label:'Connect WhatsApp',   sub:'Link your business number' },
                { href:'/dashboard/auto',    icon: Zap,           label:'Set up auto-reply',  sub:'Answer FAQs automatically' },
                { href:'/dashboard/contacts',icon: Plus,          label:'Add a contact',      sub:'Import your customer list' },
              ].map(({ href, icon: Icon, label, sub }) => (
                <Link key={href} href={href} className="quick-action">
                  <div style={{
                    width:32, height:32, borderRadius:9, flexShrink:0,
                    background:'rgba(83,230,212,0.08)', border:'1px solid rgba(83,230,212,0.15)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={14} color="#53E6D4" />
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p className="db-sans" style={{ fontSize:13, fontWeight:500, color:'rgba(244,247,247,0.75)' }}>{label}</p>
                    <p className="db-sans" style={{ fontSize:11, color:'rgba(244,247,247,0.3)', marginTop:2 }}>{sub}</p>
                  </div>
                  <ArrowRight size={13} color="rgba(83,230,212,0.35)" style={{ marginLeft:'auto', flexShrink:0 }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Plan card */}
          <div className="rise d4" style={{
            background:'rgba(13,46,46,0.5)',
            border:'1px solid rgba(83,230,212,0.15)',
            borderRadius:16, padding:'20px',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(83,230,212,0.4), transparent)' }} />
            <p className="db-sans" style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(83,230,212,0.7)', marginBottom:10 }}>Current plan</p>
            <p className="db-serif" style={{ fontSize:28, fontWeight:500, color:'#F4F7F7', marginBottom:4 }}>Free</p>
            <p className="db-sans" style={{ fontSize:12, color:'rgba(244,247,247,0.35)', marginBottom:16, lineHeight:1.5 }}>
              1 channel · 100 messages/mo
            </p>
            <div style={{ height:4, borderRadius:4, background:'rgba(244,247,247,0.06)', marginBottom:16 }}>
              <div style={{ height:'100%', width:'0%', borderRadius:4, background:'#53E6D4' }} />
            </div>
            <Link href="/settings/billing" style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              padding:'9px', borderRadius:10,
              border:'1px solid rgba(83,230,212,0.2)',
              color:'rgba(83,230,212,0.8)',
              fontFamily:"'Outfit', sans-serif", fontSize:12, fontWeight:500,
              textDecoration:'none',
              transition:'background 0.2s',
            }}>
              Upgrade to Growth <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}