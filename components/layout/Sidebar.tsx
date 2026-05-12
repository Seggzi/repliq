'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare, LayoutDashboard, Settings,
  Zap, Users, BarChart2, LogOut, ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Inbox'      },
  { href: '/dashboard/contacts', icon: Users,           label: 'Contacts'   },
  { href: '/dashboard/auto',     icon: Zap,             label: 'Auto-Reply' },
  { href: '/dashboard/analytics',icon: BarChart2,       label: 'Analytics'  },
  { href: '/settings',           icon: Settings,        label: 'Settings'   },
  { href: '/auth/login',              icon: LogOut,          label: 'Login'      },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside style={{
      width: 220, minWidth: 220, height: '100vh',
      background: '#0A2424',
      borderRight: '1px solid rgba(83,230,212,0.1)',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Outfit:wght@300;400;500;600&display=swap');
        .sb-sans { font-family: 'Outfit', system-ui, sans-serif; }
        .sb-serif { font-family: 'Cormorant Garamond', serif; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px; font-weight: 400;
          color: rgba(244,247,247,0.45);
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
          position: relative; cursor: pointer;
          margin: 0 8px;
        }
        .nav-item:hover {
          background: rgba(83,230,212,0.06);
          color: rgba(244,247,247,0.8);
        }
        .nav-item.active {
          background: rgba(83,230,212,0.1);
          color: #53E6D4;
          font-weight: 500;
        }
        .nav-item.active .nav-dot {
          opacity: 1;
        }
        .nav-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #53E6D4; margin-left: auto;
          opacity: 0; transition: opacity 0.18s;
          flex-shrink: 0;
        }

        .sidebar-orb {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none;
        }

        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 400;
          color: rgba(244,247,247,0.3);
          background: none; border: none; cursor: pointer;
          transition: background 0.18s, color 0.18s;
          width: 100%;
          margin: 0 8px; width: calc(100% - 16px);
        }
        .logout-btn:hover {
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }
      `}</style>

      {/* Decorative orb */}
      <div className="sidebar-orb" style={{ width:200, height:200, top:-60, left:-60, background:'rgba(83,230,212,0.06)' }} />

      {/* Logo */}
      <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid rgba(83,230,212,0.08)' }}>
        <Link href="/dashboard" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:34, height:34,
            background:'rgba(83,230,212,0.12)', border:'1px solid rgba(83,230,212,0.25)',
            borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <MessageSquare size={14} color="#53E6D4" />
          </div>
          <span className="sb-sans" style={{ fontSize:16, fontWeight:600, color:'#F4F7F7', letterSpacing:'-0.01em' }}>Repliq</span>
        </Link>
      </div>

      {/* Live indicator */}
      <div style={{ padding:'12px 22px', borderBottom:'1px solid rgba(83,230,212,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7,
          background:'rgba(83,230,212,0.06)', border:'1px solid rgba(83,230,212,0.12)',
          borderRadius:8, padding:'7px 10px',
        }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#53E6D4', flexShrink:0,
            animation:'blink-sb 2.2s ease-in-out infinite',
          }} />
          <style>{`@keyframes blink-sb { 0%,100%{opacity:1;} 50%{opacity:.2;} }`}</style>
          <span className="sb-sans" style={{ fontSize:11, color:'rgba(83,230,212,0.8)', fontWeight:500, letterSpacing:'0.04em' }}>INBOX LIVE</span>
          <span className="sb-sans" style={{ fontSize:11, color:'rgba(244,247,247,0.25)', marginLeft:'auto' }}>0 new</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 0', display:'flex', flexDirection:'column', gap:2 }}>
        <p className="sb-sans" style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(244,247,247,0.2)', padding:'4px 22px 8px' }}>
          Main
        </p>
        {NAV.slice(0, 4).map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={15} style={{ flexShrink:0 }} />
              {label}
              <span className="nav-dot" />
            </Link>
          )
        })}

        <p className="sb-sans" style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(244,247,247,0.2)', padding:'16px 22px 8px' }}>
          Account
        </p>
        {NAV.slice(4).map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href)
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={15} style={{ flexShrink:0 }} />
              {label}
              <span className="nav-dot" />
            </Link>
          )
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div style={{ borderTop:'1px solid rgba(83,230,212,0.08)', padding:'12px 8px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 14px', marginBottom:4,
          background:'rgba(83,230,212,0.04)', borderRadius:10,
        }}>
          <div style={{
            width:30, height:30, borderRadius:'50%', flexShrink:0,
            background:'rgba(83,230,212,0.12)', border:'1px solid rgba(83,230,212,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span className="sb-sans" style={{ fontSize:11, fontWeight:600, color:'#53E6D4' }}>A</span>
          </div>
          <div style={{ minWidth:0 }}>
            <p className="sb-sans" style={{ fontSize:12, fontWeight:500, color:'rgba(244,247,247,0.75)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>My Account</p>
            <p className="sb-sans" style={{ fontSize:11, color:'rgba(244,247,247,0.28)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Free plan</p>
          </div>
          <ChevronRight size={13} color="rgba(244,247,247,0.2)" style={{ marginLeft:'auto', flexShrink:0 }} />
        </div>

        <form action="/auth/login" method="post">
          <button type="submit" className="logout-btn">
            <LogOut size={14} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}