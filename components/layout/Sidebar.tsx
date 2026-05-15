'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  MessageSquare, LayoutDashboard, Settings,
  Zap, Users, BarChart2, LogOut, ChevronRight,
  Plug, Menu, X,
} from 'lucide-react'

const NAV_MAIN = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Inbox'        },
  { href: '/customers',             icon: Users,           label: 'Customers'    },
  { href: '/settings/auto-replies', icon: Zap,             label: 'Auto-replies' },
  { href: '/analytics',             icon: BarChart2,       label: 'Analytics'    },
]

const NAV_SETTINGS = [
  { href: '/settings/channels', icon: Plug,     label: 'Channels' },
  { href: '/settings',          icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return path === '/dashboard'
    if (href === '/settings')  return path === '/settings'
    return path.startsWith(href)
  }

  const sidebarContent = (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
        .sb-sans { font-family: 'Outfit', system-ui, sans-serif; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 400;
          color: rgba(244,247,247,0.45); text-decoration: none;
          transition: background 0.18s, color 0.18s;
          cursor: pointer; margin: 0 8px;
          border-left: 2px solid transparent;
        }
        .nav-item:hover { background: rgba(83,230,212,0.06); color: rgba(244,247,247,0.8); }
        .nav-item.active {
          background: rgba(83,230,212,0.1); color: #53E6D4; font-weight: 500;
          border-left: 2px solid #53E6D4;
        }
        .nav-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #53E6D4; margin-left: auto;
          opacity: 0; transition: opacity 0.18s; flex-shrink: 0;
        }
        .nav-item.active .nav-dot { opacity: 1; }

        @keyframes blink-sb { 0%,100%{opacity:1;} 50%{opacity:.2;} }

        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-family: 'Outfit', sans-serif; font-size: 13px; color: rgba(244,247,247,0.3);
          background: none; border: none; cursor: pointer;
          transition: background 0.18s, color 0.18s;
          width: calc(100% - 16px); margin: 0 8px;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.08); color: #fca5a5; }
      `}</style>

      {/* Orb */}
      <div style={{
        position: 'absolute', width: 200, height: 200, top: -60, left: -60,
        background: 'rgba(83,230,212,0.06)', borderRadius: '50%',
        filter: 'blur(70px)', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid rgba(83,230,212,0.08)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
          onClick={() => setMobileOpen(false)}>
          <div style={{
            width: 34, height: 34,
            background: 'rgba(83,230,212,0.12)', border: '1px solid rgba(83,230,212,0.25)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <MessageSquare size={14} color="#53E6D4" />
          </div>
          <span className="sb-sans" style={{ fontSize: 16, fontWeight: 600, color: '#F4F7F7', letterSpacing: '-0.01em' }}>
            Repliq
          </span>
        </Link>
      </div>

      {/* Live indicator */}
      <div style={{ padding: '12px 22px', borderBottom: '1px solid rgba(83,230,212,0.06)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(83,230,212,0.06)', border: '1px solid rgba(83,230,212,0.12)',
          borderRadius: 8, padding: '7px 10px',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#53E6D4', flexShrink: 0,
            animation: 'blink-sb 2.2s ease-in-out infinite',
          }} />
          <span className="sb-sans" style={{ fontSize: 11, color: 'rgba(83,230,212,0.8)', fontWeight: 500, letterSpacing: '0.04em' }}>
            INBOX LIVE
          </span>
          <span className="sb-sans" style={{ fontSize: 11, color: 'rgba(244,247,247,0.25)', marginLeft: 'auto' }}>
            0 new
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <p className="sb-sans" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,247,247,0.2)', padding: '4px 22px 8px' }}>
          Main
        </p>
        {NAV_MAIN.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`nav-item ${isActive(href) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}>
            <Icon size={15} style={{ flexShrink: 0 }} />
            {label}
            <span className="nav-dot" />
          </Link>
        ))}
        <p className="sb-sans" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,247,247,0.2)', padding: '16px 22px 8px' }}>
          Settings
        </p>
        {NAV_SETTINGS.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`nav-item ${isActive(href) ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}>
            <Icon size={15} style={{ flexShrink: 0 }} />
            {label}
            <span className="nav-dot" />
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(83,230,212,0.08)', padding: '12px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', marginBottom: 4,
          background: 'rgba(83,230,212,0.04)', borderRadius: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(83,230,212,0.12)', border: '1px solid rgba(83,230,212,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="sb-sans" style={{ fontSize: 11, fontWeight: 600, color: '#53E6D4' }}>U</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p className="sb-sans" style={{ fontSize: 12, fontWeight: 500, color: 'rgba(244,247,247,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>My Account</p>
            <p className="sb-sans" style={{ fontSize: 11, color: 'rgba(244,247,247,0.28)' }}>Free plan</p>
          </div>
          <ChevronRight size={13} color="rgba(244,247,247,0.2)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: '#0A2424', borderBottom: '1px solid rgba(83,230,212,0.1)',
        padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
      }} className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'rgba(83,230,212,0.12)', border: '1px solid rgba(83,230,212,0.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={12} color="#53E6D4" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: '#F4F7F7' }}>Repliq</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,247,247,0.6)', display: 'flex' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 149 }}
        />
      )}

      {/* Mobile drawer */}
      <aside style={{
        position: 'fixed', top: 0, left: mobileOpen ? 0 : '-240px',
        width: 240, height: '100vh', zIndex: 150,
        background: '#0A2424', borderRight: '1px solid rgba(83,230,212,0.1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'left 0.25s cubic-bezier(0.16,1,0.3,1)',
      }} className="mobile-sidebar">
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside style={{
        width: 220, minWidth: 220, height: '100vh',
        background: '#0A2424', borderRight: '1px solid rgba(83,230,212,0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }} className="desktop-sidebar">
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
          .mobile-topbar  { display: none !important; }
        }
      `}</style>
    </>
  )
}