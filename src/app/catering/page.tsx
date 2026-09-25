'use client'

import { useEffect } from 'react'

export default function CateringPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Header */}
      <section style={{ background: '#1A1A1A', paddingTop: '8rem', paddingBottom: '4rem', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Events & Parties</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', marginTop: '0.8rem', lineHeight: 1.1 }}>
          Catering
        </h1>
        <p style={{ color: '#aaa', marginTop: '1rem', fontSize: '1.05rem', maxWidth: '500px', margin: '1rem auto 0' }}>
          Bring the bold flavors of La Chiquita to your next event.
        </p>
      </section>

      {/* What's included */}
      <section style={{ background: '#FFF8E7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#1A1A1A' }}>
              What We Offer
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: '🥟 Bulk Empanadas',
                desc: 'Colombian-style empanadas made in large batches. A crowd-pleasing starter or main that travels well.',
                color: '#006847',
              },
              {
                title: '🌮 Taco Platters',
                desc: 'Build your own taco bar — birria, al pastor, carnitas, and more. Sides included.',
                color: '#C8102E',
              },
              {
                title: '🍽️ Catering Trays',
                desc: 'Full trays of chilaquiles, nachos, enchiladas, and more — portioned for groups of 10 or more.',
                color: '#FFD700',
              },
              {
                title: '🎉 Custom Menus',
                desc: 'Have something specific in mind? Talk to us. We\'ll work with you to build a menu that fits your event.',
                color: '#C8102E',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="reveal"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '2rem',
                  borderTop: `4px solid ${item.color}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.8rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — contact */}
      <section style={{ background: '#C8102E', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
            Let's Plan Your Event
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Reach out and tell us about your event — date, headcount, location, and what you're thinking. We'll get back to you with options and a quote.
          </p>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <a href="tel:+18155551234" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, background: 'rgba(255,255,255,0.15)', padding: '0.8rem 2rem', borderRadius: '4px' }}>
              📞 (815) 555-1234
            </a>
            <a href="mailto:catering@lachiquitarockford.com" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, background: 'rgba(255,255,255,0.15)', padding: '0.8rem 2rem', borderRadius: '4px' }}>
              ✉️ catering@lachiquitarockford.com
            </a>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Or visit us at <strong>1505 S. Main St., Rockford, IL</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Note about the client */}
      <section style={{ background: '#fff', padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#999', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Catering details are confirmed directly with the restaurant. Menu items and pricing may vary based on headcount and event type.
        </p>
      </section>
    </>
  )
}
