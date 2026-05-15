import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, MessageSquare, ArrowRight } from 'lucide-react'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('profile_id', user!.id)
    .order('created_at', { ascending: false })

  const C = {
    mint:      '#53E6D4',
    mintFaint: 'rgba(83,230,212,0.08)',
    border:    'rgba(83,230,212,0.12)',
    borderMid: 'rgba(83,230,212,0.22)',
    gray:      '#F4F7F7',
    textDim:   'rgba(244,247,247,0.45)',
  }

  return (
    <div style={{ padding: '32px 36px', fontFamily: "'Outfit', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .cu-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .cu-sans  { font-family: 'Outfit', system-ui, sans-serif; }

        @keyframes rise { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        .rise { animation: rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .d1{animation-delay:.04s;} .d2{animation-delay:.08s;} .d3{animation-delay:.12s;}

        .customer-row {
          display: flex; align-items: center; gap: 14px;
          background: rgba(13,46,46,0.4);
          border: 1px solid rgba(83,230,212,0.1);
          border-radius: 14px; padding: 14px 18px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .customer-row:hover {
          border-color: rgba(83,230,212,0.25);
          background: rgba(13,46,46,0.65);
          transform: translateY(-2px);
        }

        .ch-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .section-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(244,247,247,0.25);
          margin-bottom: 14px;
        }
      `}</style>

      {/* Header */}
      <div className="rise" style={{ marginBottom: 32 }}>
        <h1 className="cu-serif" style={{ fontSize: 42, fontWeight: 500, color: C.gray, letterSpacing: '-0.015em', lineHeight: 1.05, marginBottom: 6 }}>
          Your <em style={{ color: C.mint }}>customers</em>
        </h1>
        <p className="cu-sans" style={{ fontSize: 14, color: C.textDim }}>
          Everyone who has ever messaged you, across all channels.
        </p>
      </div>

      {/* Stats */}
      <div className="rise d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 500, marginBottom: 28 }}>
        {[
          { label: 'Total customers', value: customers?.length ?? 0 },
          { label: 'WhatsApp',        value: customers?.filter(c => c.whatsapp_number).length ?? 0 },
          { label: 'Instagram',       value: customers?.filter(c => c.instagram_handle).length ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(13,46,46,0.4)', border: '1px solid rgba(83,230,212,0.1)',
            borderRadius: 14, padding: '16px 18px',
          }}>
            <p className="cu-serif" style={{ fontSize: 36, fontWeight: 500, color: C.gray, lineHeight: 1, marginBottom: 6 }}>{value}</p>
            <p className="cu-sans" style={{ fontSize: 11, color: C.textDim }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Customer list */}
      {!customers || customers.length === 0 ? (
        <div className="rise d2" style={{
          background: 'rgba(13,46,46,0.3)', border: '1px solid rgba(83,230,212,0.08)',
          borderRadius: 20, padding: '60px 40px', textAlign: 'center', maxWidth: 680,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', margin: '0 auto 18px',
            background: C.mintFaint, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={20} color="rgba(83,230,212,0.5)" />
          </div>
          <h3 className="cu-serif" style={{ fontSize: 24, fontWeight: 500, color: 'rgba(244,247,247,0.6)', marginBottom: 8 }}>
            No customers yet
          </h3>
          <p className="cu-sans" style={{ fontSize: 13, color: 'rgba(244,247,247,0.3)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto 22px' }}>
            Customers appear here automatically when they message you for the first time
          </p>
          <Link href="/settings/channels" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(83,230,212,0.1)', border: '1px solid rgba(83,230,212,0.22)',
            color: C.mint, padding: '10px 20px', borderRadius: 10,
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
          }}>
            Connect a channel <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div style={{ maxWidth: 680 }}>
          <p className="section-label">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {customers.map((customer, i) => {
              const channels = [
                customer.whatsapp_number  && { type: 'WhatsApp',  color: '#25D366' },
                customer.instagram_handle && { type: 'Instagram', color: '#E1306C' },
                customer.email            && { type: 'Email',     color: '#60a5fa' },
              ].filter(Boolean)

              const initials = (customer.name ?? '??')
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

              return (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="customer-row rise"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: C.mintFaint, border: `1px solid ${C.borderMid}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: C.mint,
                  }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="cu-sans" style={{ fontSize: 14, fontWeight: 500, color: C.gray, marginBottom: 3 }}>
                      {customer.name ?? 'Unknown'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {customer.whatsapp_number && (
                        <span className="cu-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.3)' }}>
                          {customer.whatsapp_number}
                        </span>
                      )}
                      {customer.email && (
                        <span className="cu-sans" style={{ fontSize: 12, color: 'rgba(244,247,247,0.3)' }}>
                          {customer.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Channel dots */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {channels.map((ch: any) => (
                      <span key={ch.type} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                        background: `${ch.color}15`, color: ch.color,
                        border: `1px solid ${ch.color}25`,
                        fontFamily: "'Outfit', sans-serif",
                      }}>
                        {ch.type}
                      </span>
                    ))}
                  </div>

                  <ArrowRight size={14} color="rgba(83,230,212,0.3)" style={{ flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}