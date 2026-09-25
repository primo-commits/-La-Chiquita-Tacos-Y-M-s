'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AboutPage() {
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
        <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Our Story</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', marginTop: '0.8rem', lineHeight: 1.1 }}>
          About La Chiquita
        </h1>
      </section>

      {/* Main story section */}
      <section style={{ background: '#FFF8E7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#1A1A1A', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Real Flavors.<br />Real People.
            </h2>
            <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '1.2rem' }}>
              La Chiquita Tacos Y Más was born from a love of authentic Latin American street food — the kind that brings people together, that carries the smell of fresh tortillas and slow-simmered meats through an open kitchen.
            </p>
            <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '1.2rem' }}>
              Located in Rockford, Illinois, we serve up tacos, empanadas, birria, chilaquiles, and more — all made from scratch, all made to order. Our recipes draw from Mexico and across Latin America, built around bold flavors and honest ingredients.
            </p>
            <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.9 }}>
              Whether you grab a breakfast taco on your way to work, bring the family in for Sunday nachos, or order empanadas for your next event — we want every bite to feel like home.
            </p>
          </div>

          {/* Photo placeholder — replace with real restaurant photo */}
          <div className="reveal" style={{ animationDelay: '0.2s', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '4rem' }}>🏪</div>
            <span style={{ color: '#999', fontSize: '0.9rem', textAlign: 'center', padding: '0 1rem' }}>Restaurant Interior<br />Photo Coming Soon</span>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Values */}
      <section style={{ background: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
            <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>What We Stand For</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, color: '#1A1A1A', marginTop: '0.8rem' }}>
              Our Values
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🌮', title: 'Fresh Daily', desc: 'Tortillas, salsas, and fillings made from scratch every morning — never sitting around.' },
              { icon: '👨‍🍳', title: 'Made to Order', desc: 'Every dish is made when you order it. That means fresh, hot, and right every single time.' },
              { icon: '💛', title: 'Family Run', desc: 'We treat every customer like family. That\'s why people keep coming back.' },
              { icon: '🌎', title: 'Authentic Recipes', desc: 'From Colombian empanadas to Mexican birria — we honor the roots of every dish we serve.' },
            ].map((val, i) => (
              <div key={val.title} className="reveal" style={{ animationDelay: `${i * 0.1}s`, textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '8px', borderTop: '3px solid #C8102E' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{val.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem', color: '#1A1A1A' }}>{val.title}</h3>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#006847', padding: '4rem 2rem', textAlign: 'center' }} className="reveal">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
          Come Eat With Us
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: '2rem' }}>
          1505 S. Main St., Rockford, IL 61102
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/locations" style={{ background: '#FFD700', color: '#1A1A1A', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
            Get Directions
          </Link>
          <a href="https://www.doordash.com" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', border: '2px solid rgba(255,255,255,0.5)', letterSpacing: '1px' }}>
            Order Delivery
          </a>
        </div>
      </section>
    </>
  )
}
