'use client'

import Link from 'next/link'
import { MessageSquare, Zap, AlertCircle, Users, ArrowRight, Check } from 'lucide-react'

const C = {
  mint:      '#53E6D4',
  mintFaint: 'rgba(83,230,212,0.08)',
  mintGlow:  'rgba(83,230,212,0.15)',
  borderMid: 'rgba(83,230,212,0.22)',
  border:    'rgba(83,230,212,0.12)',
  carbon:    '#080C0C',
  teal800:   '#0A2424',
  teal700:   '#0C2929',
  gray:      '#F4F7F7',
  textDim:   'rgba(244,247,247,0.45)',
  textMid:   'rgba(244,247,247,0.7)',
}

export default function LandingPage() {
  return (
    <div style={{ background: C.carbon, color: C.gray, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes breathe {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.04); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }

        .rise { animation: rise 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .d1   { animation-delay: 0.08s; }
        .d2   { animation-delay: 0.18s; }
        .d3   { animation-delay: 0.28s; }
        .d4   { animation-delay: 0.40s; }
        .d5   { animation-delay: 0.52s; }

        .mint-text {
          background: linear-gradient(135deg, #53E6D4 0%, #9FF9EE 50%, #53E6D4 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .live-dot {
          display: inline-block; width: 7px; height: 7px;
          border-radius: 50%; background: #53E6D4;
          animation: blink 2.2s ease-in-out infinite;
        }
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
        .btn-mint {
          display: inline-flex; align-items: center; gap: 8px;
          background: #53E6D4; color: #080C0C;
          padding: 13px 28px; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          text-decoration: none; letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 28px rgba(83,230,212,0.22);
        }
        .btn-mint:hover { background: #6AEDE0; transform: translateY(-2px); box-shadow: 0 0 44px rgba(83,230,212,0.38); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(244,247,247,0.6);
          padding: 13px 28px; border-radius: 12px;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          text-decoration: none;
          border: 1px solid rgba(244,247,247,0.14);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .btn-outline:hover { border-color: rgba(83,230,212,0.35); color: #53E6D4; transform: translateY(-2px); }
        .feature-card {
          background: rgba(13,46,46,0.45);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 20px; padding: 28px;
          transition: border-color 0.3s, background 0.3s, transform 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(83,230,212,0.28);
          background: rgba(13,46,46,0.75);
          transform: translateY(-5px);
        }
        .plan-card {
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 24px; padding: 32px;
          display: flex; flex-direction: column;
          transition: transform 0.25s;
        }
        .plan-card:hover { transform: translateY(-6px); }
        .plan-card.featured {
          background: rgba(13,46,46,0.7);
          border: 1px solid rgba(83,230,212,0.35);
          box-shadow: 0 0 60px rgba(83,230,212,0.07), inset 0 1px 0 rgba(83,230,212,0.15);
        }
        .inbox-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 12px; border-radius: 12px;
          transition: background 0.2s; cursor: default;
          margin-bottom: 2px;
        }
        .inbox-row:hover { background: rgba(83,230,212,0.04); }
        .section-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #53E6D4; margin-bottom: 16px;
          font-family: 'Outfit', sans-serif;
        }
        .divider {
          height: 1px; max-width: 640px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(83,230,212,0.15), transparent);
        }
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px; font-weight: 500; line-height: 1; color: #53E6D4;
        }
        .nav-glass {
          backdrop-filter: blur(16px);
          background: rgba(8,12,12,0.82);
          border-bottom: 1px solid rgba(83,230,212,0.08);
        }
        .footer-link { transition: color 0.2s; }
        .footer-link:hover { color: #53E6D4 !important; }
      `}</style>

      {/* NAV */}
      <nav className="nav-glass sans" style={{
        padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: C.mintFaint, border: `1px solid ${C.borderMid}`,
            borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare size={15} color={C.mint} />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: C.gray }}>
            Repliq
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/auth/login" style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14,
            color: C.textDim, textDecoration: 'none', padding: '9px 18px', borderRadius: 10, transition: 'color 0.2s',
          }}>Log in</Link>
          <Link href="/auth/signup" className="btn-mint" style={{ padding: '9px 20px', fontSize: 13 }}>
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '120px 32px 80px' }}>
        <div className="orb" style={{ width: 700, height: 380, top: -60, left: '50%', transform: 'translateX(-50%)', background: 'rgba(13,46,46,0.9)' }} />
        <div className="orb" style={{ width: 440, height: 440, top: 30, left: '50%', transform: 'translateX(-50%)', background: C.mintGlow, animation: 'breathe 6s ease-in-out infinite' }} />

        <div className="rise" style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.mintFaint, border: `1px solid rgba(83,230,212,0.2)`,
            color: C.mint, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500,
            letterSpacing: '0.06em', padding: '6px 16px', borderRadius: 999,
          }}>
            <span className="live-dot" /> All your messages, one place
          </span>
        </div>

        <h1 className="serif rise d1" style={{
          position: 'relative', zIndex: 1,
          fontSize: 'clamp(54px, 8.5vw, 92px)',
          fontWeight: 500, lineHeight: 1.03, letterSpacing: '-0.015em',
          marginBottom: 28, color: C.gray,
        }}>
          Stop losing customers<br />
          <span className="mint-text">to missed messages</span>
        </h1>

        <p className="sans rise d2" style={{
          position: 'relative', zIndex: 1,
          fontSize: 18, lineHeight: 1.7, color: C.textDim,
          maxWidth: 500, margin: '0 auto 40px',
        }}>
          Repliq connects WhatsApp, Instagram, and email into one smart inbox — so you never miss a customer again.
        </p>

        <div className="rise d3" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40,
        }}>
          <Link href="/auth/signup" className="btn-mint">Start for free <ArrowRight size={15} /></Link>
          <Link href="/auth/login" className="btn-outline">Sign in</Link>
        </div>

        <div className="rise d4" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {[
            { label: 'WhatsApp',    dot: '#25D366' },
            { label: 'Instagram DM', dot: '#E1306C' },
            { label: 'Email',       dot: '#60a5fa' },
          ].map(({ label, dot }) => (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(13,46,46,0.6)', border: `1px solid ${C.border}`,
              color: C.textDim, fontFamily: "'Outfit', sans-serif",
              fontSize: 12, padding: '6px 14px', borderRadius: 999,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="sans rise d5" style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        background: 'rgba(13,46,46,0.3)',
        padding: '40px 32px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        maxWidth: 860, margin: '0 auto', gap: 8,
      }}>
        {[
          { num: '3×',   label: 'Faster replies' },
          { num: '98%',  label: 'Messages captured' },
          { num: '24/7', label: 'Auto-reply coverage' },
          { num: '5 min', label: 'Setup time' },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center', padding: '12px 0' }}>
            <div className="stat-num">{num}</div>
            <p style={{ fontSize: 13, color: C.textDim, marginTop: 6, letterSpacing: '0.03em' }}>{label}</p>
          </div>
        ))}
      </section>

      {/* INBOX PREVIEW */}
      <section style={{ maxWidth: 720, margin: '80px auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="section-label">Live inbox preview</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 500, letterSpacing: '-0.01em', color: C.gray, lineHeight: 1.1 }}>
            Every conversation, <em>in one place</em>
          </h2>
        </div>

        <div style={{
          background: C.teal800, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(83,230,212,0.05)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px',
            background: C.teal700, borderBottom: `1px solid ${C.border}`,
          }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: C.textDim, marginLeft: 10 }}>Repliq — Inbox</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: C.mint }}>3 unread</span>
            </div>
          </div>

          <div style={{ padding: '8px 12px 12px' }}>
            {[
              { name: 'Amina Khalid', init: 'AK', msg: 'Hey! Is the red bag still available for pickup?', time: '2m ago',  ch: 'WhatsApp',  chColor: '#25D366', unread: true,  urgent: true  },
              { name: 'Tunde Badmus', init: 'TB', msg: 'When will my order arrive? I ordered 3 days ago.', time: '14m ago', ch: 'Instagram', chColor: '#E1306C', unread: true,  urgent: false },
              { name: 'Grace Okonkwo',init: 'GO', msg: 'Thank you so much! I received the receipt.',       time: '1h ago',  ch: 'Email',     chColor: '#60a5fa', unread: false, urgent: false },
              { name: 'Daniel Eze',   init: 'DE', msg: 'Do you do bulk orders? We need 50 pieces.',        time: '2h ago',  ch: 'WhatsApp',  chColor: '#25D366', unread: false, urgent: false },
            ].map(({ name, init, msg, time, ch, chColor, unread, urgent }) => (
              <div key={name} className="inbox-row" style={{
                background: unread ? 'rgba(83,230,212,0.05)' : 'transparent',
                borderLeft: `2px solid ${unread ? C.mint : 'transparent'}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', minWidth: 40,
                  background: unread ? C.mintFaint : 'rgba(244,247,247,0.05)',
                  border: `1px solid ${unread ? C.borderMid : 'rgba(244,247,247,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                  color: unread ? C.mint : C.textDim,
                }}>{init}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: unread ? 600 : 400, color: unread ? C.gray : C.textDim }}>{name}</span>
                    {urgent && <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, background: 'rgba(239,68,68,0.12)', color: '#fca5a5', padding: '2px 7px', borderRadius: 5, fontWeight: 600, letterSpacing: '0.05em' }}>URGENT</span>}
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'rgba(244,247,247,0.2)', marginLeft: 'auto' }}>{time}</span>
                  </div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(244,247,247,0.32)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg}</p>
                </div>

                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: chColor, background: `${chColor}15`, border: `1px solid ${chColor}25`, padding: '4px 9px', borderRadius: 7, whiteSpace: 'nowrap', fontWeight: 500 }}>{ch}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="section-label">Why Repliq</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.01em', color: C.gray, lineHeight: 1.1 }}>
            Built for businesses that<br /><em>can't afford to miss a sale</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { icon: MessageSquare, title: 'Unified inbox',      desc: 'WhatsApp, Instagram, and email in one sorted feed. No more switching between 3 apps.' },
            { icon: Zap,           title: 'Auto-replies',       desc: 'Answer FAQs automatically, 24 hours a day. Your customers get answers even at midnight.' },
            { icon: AlertCircle,   title: 'Urgency alerts',     desc: 'Time-sensitive messages surface automatically. Hot leads never go cold from neglect.' },
            { icon: Users,         title: 'Customer profiles',  desc: 'Every conversation across every channel per customer. Context always at hand.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: C.mintFaint, border: `1px solid ${C.borderMid}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Icon size={18} color={C.mint} />
              </div>
              <p className="sans" style={{ fontSize: 15, fontWeight: 600, color: C.gray, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</p>
              <p className="sans" style={{ fontSize: 13, color: C.textDim, lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="section-label">How it works</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 500, letterSpacing: '-0.01em', color: C.gray, lineHeight: 1.1 }}>
            Up and running in <em>five minutes</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
          {[
            { step: '01', title: 'Create account',   desc: 'Sign up free in 30 seconds — no credit card' },
            { step: '02', title: 'Connect channels', desc: 'Link WhatsApp, Instagram, or email' },
            { step: '03', title: 'Set auto-replies', desc: 'Configure your FAQ responses once' },
            { step: '04', title: 'Start replying',   desc: 'All messages live in one inbox' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 52, fontWeight: 500, color: C.mint, opacity: 0.35, lineHeight: 1, marginBottom: 16 }}>{step}</div>
              <div style={{ width: 36, height: 1, background: C.mint, opacity: 0.25, margin: '0 auto 16px' }} />
              <p className="sans" style={{ fontSize: 14, fontWeight: 600, color: C.gray, marginBottom: 8 }}>{title}</p>
              <p className="sans" style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* PRICING */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="section-label">Pricing</p>
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 500, letterSpacing: '-0.01em', color: C.gray, lineHeight: 1.1 }}>
            Simple, honest pricing.<br /><em>No surprises.</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, alignItems: 'start' }}>
          {[
            { name: 'Starter', price: 'Free',     sub: 'Forever, no card needed', features: ['1 channel', 'Up to 100 messages/mo', 'Basic auto-replies'], featured: false, cta: 'Start free' },
            { name: 'Growth',  price: '₦5,000',   sub: '/month · ~$3 USD',        features: ['All 3 channels', 'Unlimited messages', 'Urgency scoring', 'Customer profiles'], featured: true,  cta: 'Get Growth' },
            { name: 'Business',price: '₦15,000',  sub: '/month',                  features: ['Everything in Growth', 'Up to 3 team members', 'Analytics dashboard', 'Priority support'], featured: false, cta: 'Get Business' },
          ].map(({ name, price, sub, features, featured, cta }) => (
            <div key={name} className={`plan-card ${featured ? 'featured' : ''}`}>
              {featured && (
                <div style={{ marginBottom: 18 }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700,
                    background: C.mintFaint, color: C.mint, border: `1px solid ${C.borderMid}`,
                    letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999,
                  }}>Most popular</span>
                </div>
              )}
              <p className="sans" style={{ fontSize: 11, color: C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{name}</p>
              <div className="serif" style={{ fontSize: 54, fontWeight: 500, color: featured ? C.mint : C.gray, letterSpacing: '-0.02em', lineHeight: 1 }}>{price}</div>
              <p className="sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.28)', marginTop: 6, marginBottom: 28 }}>{sub}</p>
              <div style={{ flex: 1, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', minWidth: 20,
                      background: featured ? C.mintFaint : 'rgba(244,247,247,0.04)',
                      border: `1px solid ${featured ? C.borderMid : 'rgba(244,247,247,0.09)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color={featured ? C.mint : C.textDim} />
                    </div>
                    <span className="sans" style={{ fontSize: 13, color: C.textMid }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className={featured ? 'btn-mint' : 'btn-outline'} style={{ display: 'block', textAlign: 'center', borderRadius: 12, padding: '13px', fontSize: 14 }}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: 960, margin: '0 auto 80px', padding: '0 32px' }}>
        <div style={{
          background: C.teal700, border: `1px solid ${C.border}`,
          borderRadius: 28, padding: '72px 48px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div className="orb" style={{ width: 500, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(83,230,212,0.07)', animation: 'breathe 5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(83,230,212,0.4), transparent)' }} />

          <h2 className="serif" style={{
            fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 500,
            letterSpacing: '-0.02em', lineHeight: 1.06,
            color: C.gray, position: 'relative', marginBottom: 18,
          }}>
            Ready to reply faster<br />and <span className="mint-text">convert more?</span>
          </h2>
          <p className="sans" style={{ fontSize: 15, color: C.textDim, marginBottom: 36, position: 'relative' }}>
            Join businesses who never miss a message. Start free today.
          </p>
          <Link href="/auth/signup" className="btn-mint" style={{ position: 'relative', fontSize: 15 }}>
            Start for free — no card needed <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sans" style={{
        borderTop: `1px solid ${C.border}`, padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, background: C.mintFaint, border: `1px solid ${C.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={12} color={C.mint} />
          </div>
          <span style={{ fontSize: 13, color: 'rgba(244,247,247,0.28)' }}>© 2026 Repliq</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} className="footer-link" style={{ fontSize: 13, color: 'rgba(244,247,247,0.28)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}