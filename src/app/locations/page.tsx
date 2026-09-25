'use client'

import { useEffect } from 'react'

export default function LocationsPage() {
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
        <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Find Us</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', marginTop: '0.8rem', lineHeight: 1.1 }}>
          Locations
        </h1>
      </section>

      {/* Main Location */}
      <section style={{ background: '#FFF8E7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="reveal">

            {/* Info card */}
            <div style={{ background: '#fff', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <span style={{
                display: 'inline-block',
                background: '#C8102E',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '0.3rem 0.8rem',
                borderRadius: '3px',
                marginBottom: '1.2rem',
              }}>
                Main Location
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                Rockford, IL
              </h2>
              <p style={{ color: '#444', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                1505 S. Main St.<br />Rockford, IL 61102
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#444', fontSize: '0.95rem' }}>
                  <span>🕐</span>
                  <span><strong>Mon – Fri:</strong> 10:00 AM – 9:00 PM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#444', fontSize: '0.95rem' }}>
                  <span>🕐</span>
                  <span><strong>Sat – Sun:</strong> 9:00 AM – 9:00 PM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#444', fontSize: '0.95rem' }}>
                  <span>📞</span>
                  <a href="tel:+18155551234" style={{ color: '#C8102E', textDecoration: 'none', fontWeight: 600 }}>(815) 555-1234</a>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>(placeholder — confirm with owner)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.google.com/maps/search/1505+S+Main+St+Rockford+IL+61102"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#006847',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Get Directions
                </a>
                <a
                  href="https://www.doordash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#C8102E',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Order Delivery
                </a>
              </div>
            </div>

            {/* Map */}
            <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#e8e8e8', aspectRatio: '4/3' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.867034!2d-89.093!3d42.271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDE2JzE3LjYiTiA4OcKwMDUnMzguMiJX!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, width: '100%', height: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="La Chiquita Tacos Y Más location"
              />
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .locations-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Second location teaser */}
      <section style={{ background: '#1A1A1A', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Also Coming Soon</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#fff', marginTop: '0.8rem', marginBottom: '1rem' }}>
            Mountain Road Location
          </h2>
          <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: 1.7 }}>
            A second location on Mountain Road is on the way. Stay tuned for updates.
          </p>
        </div>
      </section>
    </>
  )
}
