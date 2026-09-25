import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#1A1A1A',
      color: '#fff',
      padding: '3rem 2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem',
      }}>
        {/* Brand */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#C8102E', textTransform: 'uppercase' }}>La Chiquita</span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#FFD700', letterSpacing: '3px', textTransform: 'uppercase' }}>Tacos Y Más</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6 }}>
            Authentic Mexican &amp; Latin American flavors.<br />
            Crafted with heart, served with soul.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#FFD700', marginBottom: '1rem' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[['Home', '/'],['Menu','/menu'],['About','/about'],['Catering','/catering'],['Locations','/locations']].map(([label, href]) => (
              <Link key={href} href={href} style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#FFD700', marginBottom: '1rem' }}>Visit Us</h4>
          <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: 1.7 }}>
            1505 S. Main St.<br />
            Rockford, IL 61102<br />
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Open Daily — Check Locations</span>
          </p>
        </div>

        {/* Order */}
        <div>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#FFD700', marginBottom: '1rem' }}>Order</h4>
          <a
            href="https://www.doordash.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#C8102E',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#a00d25')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C8102E')}
          >
            Order on DoorDash
          </a>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #333',
        paddingTop: '1.2rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#666',
      }}>
        &copy; {new Date().getFullYear()} La Chiquita Tacos Y Más. All rights reserved.
      </div>
    </footer>
  )
}
