'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:.5;transform:scale(1);} 50%{opacity:.85;transform:scale(1.05);} }

        .rise { animation: rise 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .d1   { animation-delay:.08s; }
        .d2   { animation-delay:.16s; }

        .orb {
          position:absolute; border-radius:50%;
          filter:blur(100px); pointer-events:none; z-index:0;
        }

        .field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          color: rgba(83,230,212,0.45);
          display: flex;
          pointer-events: none;
        }
        .field-input {
          width: 100%;
          background: rgba(13,46,46,0.5);
          border: 1px solid rgba(83,230,212,0.12);
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #F4F7F7;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field-input::placeholder { color: rgba(244,247,247,0.25); }
        .field-input:focus {
          border-color: rgba(83,230,212,0.4);
          background: rgba(13,46,46,0.75);
        }
        .field-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(244,247,247,0.3);
          display: flex;
          padding: 0;
          transition: color 0.2s;
        }
        .field-toggle:hover { color: rgba(83,230,212,0.7); }

        .btn-mint {
          width: 100%;
          background: #53E6D4;
          color: #080C0C;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 28px rgba(83,230,212,0.2);
          letter-spacing: 0.01em;
        }
        .btn-mint:hover:not(:disabled) {
          background: #6AEDE0;
          transform: translateY(-1px);
          box-shadow: 0 0 44px rgba(83,230,212,0.35);
        }
        .btn-mint:disabled { opacity: 0.55; cursor: not-allowed; }

        .error-box {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          color: #fca5a5;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(83,230,212,0.15), transparent);
        }

        .stat-item {
          text-align: center;
        }
      `}</style>

      {/* bg orbs */}
      <div className="orb" style={{ width:600, height:600, top:-200, left:'50%', transform:'translateX(-50%)', background:'rgba(13,46,46,0.8)' }} />
      <div className="orb" style={{ width:320, height:320, top:30,   left:'50%', transform:'translateX(-50%)', background:'rgba(83,230,212,0.06)', animation:'breathe 7s ease-in-out infinite' }} />
      <div className="orb" style={{ width:180, height:180, bottom:100, left:'8%', background:'rgba(83,230,212,0.04)', animation:'breathe 10s ease-in-out infinite' }} />

      <div style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div className="rise" style={{ textAlign:'center', marginBottom:36 }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, justifyContent:'center' }}>
            <div style={{ width:40, height:40, background:'rgba(83,230,212,0.1)', border:'1px solid rgba(83,230,212,0.25)', borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <MessageSquare size={17} color="#53E6D4" />
            </div>
            <span className="sans" style={{ fontSize:20, fontWeight:600, color:'#F4F7F7', letterSpacing:'-0.01em' }}>Repliq</span>
          </Link>
          <div style={{ marginTop:20 }}>
            <h1 className="serif" style={{ fontSize:38, fontWeight:500, color:'#F4F7F7', letterSpacing:'-0.01em', lineHeight:1.05, marginBottom:8 }}>
              Welcome back
            </h1>
            <p className="sans" style={{ fontSize:14, color:'rgba(244,247,247,0.42)' }}>
              Sign in to your Repliq account
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rise d1" style={{
          position:'relative',
          background:'rgba(13,46,46,0.45)',
          border:'1px solid rgba(83,230,212,0.12)',
          borderRadius:24,
          padding:'32px 28px',
          boxShadow:'0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(83,230,212,0.08)',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, borderRadius:'24px 24px 0 0', background:'linear-gradient(90deg, transparent, rgba(83,230,212,0.35), transparent)', pointerEvents:'none' }} />

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Email */}
            <div>
              <label className="sans" style={{ display:'block', fontSize:12, fontWeight:500, color:'rgba(244,247,247,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>
                Email
              </label>
              <div className="field-wrap">
                <span className="field-icon"><Mail size={15} /></span>
                <input
                  className="field-input"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <label className="sans" style={{ display:'block', fontSize:12, fontWeight:500, color:'rgba(244,247,247,0.55)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" className="sans" style={{ fontSize:12, color:'rgba(83,230,212,0.7)', textDecoration:'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="field-wrap">
                <span className="field-icon"><Lock size={15} /></span>
                <input
                  className="field-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="field-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <div style={{ marginTop:4 }}>
              <button type="submit" disabled={loading} className="btn-mint">
                {loading ? 'Signing in…' : <>Sign in <ArrowRight size={15} /></>}
              </button>
            </div>

          </form>

          <div className="divider-line" style={{ margin:'24px 0' }} />

          {/* Social proof stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[
              { num:'2,400+', label:'Businesses' },
              { num:'98%',    label:'Uptime' },
              { num:'24/7',   label:'Support' },
            ].map(({ num, label }) => (
              <div key={label} className="stat-item">
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:500, color:'#53E6D4', lineHeight:1 }}>{num}</div>
                <div className="sans" style={{ fontSize:11, color:'rgba(244,247,247,0.32)', marginTop:3, letterSpacing:'0.04em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="sans rise d2" style={{ textAlign:'center', fontSize:14, color:'rgba(244,247,247,0.35)', marginTop:24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color:'#53E6D4', fontWeight:500, textDecoration:'none' }}>
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  )
}