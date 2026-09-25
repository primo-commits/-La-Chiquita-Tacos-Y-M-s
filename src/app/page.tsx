'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HERO_VIDEOS = [
  '/videos/Dip and Sip that Consomme - Google Maps.mp4',
  '/videos/Aji Colombiana for our Empanadas - Google Maps.mp4',
  '/videos/New Brunswicks best Hot Sauces - Google Maps.mp4',
  '/videos/Quesabirria Tacos - Google Maps.mp4',
]

const FEATURED_ITEMS = [
  {
    name: 'Birria Tacos',
    desc: 'Slow-cooked, deeply seasoned — dipped in consommé and griddle-crisped.',
    color: '#C8102E',
    emoji: '🌮',
  },
  {
    name: 'Empanadas',
    desc: 'Colombian-style turnover with beef or chicken, potato, and aji.',
    color: '#006847',
    emoji: '🥟',
  },
  {
    name: 'Chilaquiles',
    desc: 'Crispy tortilla chips in red or green sauce, topped with crema and cheese.',
    color: '#FFD700',
    emoji: '🍳',
  },
]

export default function HomePage() {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.src = HERO_VIDEOS[currentVideo]
    video.load()
    video.play().catch(() => {})
  }, [currentVideo])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(v => (v + 1) % HERO_VIDEOS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Scroll reveal
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
      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#000' }}>
        <video
          ref={videoRef}
          key={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.65,
          }}
        />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Hero text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}>
          <span style={{
            display: 'inline-block',
            background: '#C8102E',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            padding: '0.4rem 1rem',
            borderRadius: '2px',
            marginBottom: '1.2rem',
            animation: 'fadeIn 1s ease-out 0.3s both',
          }}>
            Rockford, Illinois
          </span>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.0,
            marginBottom: '0.5rem',
            animation: 'fadeIn 1s ease-out 0.5s both',
          }}>
            La Chiquita
          </h1>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: '#FFD700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
            animation: 'fadeIn 1s ease-out 0.7s both',
          }}>
            Tacos Y Más
          </h2>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeIn 1s ease-out 0.9s both' }}>
            <Link
              href="/menu"
              style={{
                background: '#C8102E',
                color: '#fff',
                textDecoration: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#a00d25'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C8102E'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              View Menu
            </Link>
            <a
              href="https://www.doordash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: '#fff',
                textDecoration: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '2px solid #fff',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#1A1A1A' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
            >
              Order Online
            </a>
          </div>
        </div>

        {/* Video indicator dots */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}>
          {HERO_VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentVideo(i)}
              style={{
                width: i === currentVideo ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: i === currentVideo ? '#C8102E' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── BURIOT LIRE分割样式的各个板块 ── */}

      {/* Section 1: Our Story teaser */}
      <section style={{ background: '#1A1A1A', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal" style={{ animationDelay: '0s' }}>
            <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Our Story</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0.8rem 0 1.2rem', lineHeight: 1.15 }}>
              Made Fresh.<br />Every Single Day.
            </h2>
            <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.8rem' }}>
              From our handmade tortillas to our slow-simmered birria, we believe real food starts with real ingredients. La Chiquita brings the flavors of Mexico and Latin America to Rockford — no shortcuts, no compromises.
            </p>
            <Link href="/about" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Learn More →
            </Link>
          </div>
          <div className="reveal" style={{ animationDelay: '0.2s', background: '#2a2a2a', borderRadius: '8px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Placeholder for restaurant photo — replace with real interior/exterior shot */}
            <div style={{ textAlign: 'center', color: '#555' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏪</div>
              <span style={{ fontSize: '0.85rem' }}>Interior Photo<br />Coming Soon</span>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .reveal { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Section 2: Featured Items */}
      <section style={{ background: '#FFF8E7', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} className="reveal">
            <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>From Our Kitchen</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginTop: '0.8rem', color: '#1A1A1A' }}>
              House Favorites
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {FEATURED_ITEMS.map((item, i) => (
              <div
                key={item.name}
                className="reveal"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '2rem',
                  borderTop: `4px solid ${item.color}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.7rem', color: '#1A1A1A' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }} className="reveal">
            <Link
              href="/menu"
              style={{
                display: 'inline-block',
                background: '#006847',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.9rem 2.5rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#005039')}
              onMouseLeave={e => (e.currentTarget.style.background = '#006847')}
            >
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: catering teaser */}
      <section style={{ background: '#C8102E', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="reveal">
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Catering</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0.8rem 0 1.2rem', lineHeight: 1.15 }}>
              Bring the Fiesta<br />to Your Event
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.8rem' }}>
              From corporate lunches to birthday parties, we bring the bold flavors of La Chiquita to your gathering. Let's talk about what you're planning.
            </p>
            <Link
              href="/catering"
              style={{
                display: 'inline-block',
                background: '#fff',
                color: '#C8102E',
                textDecoration: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
              }}
            >
              Get in Touch
            </Link>
          </div>
          <div className="reveal" style={{ animationDelay: '0.2s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {['🌮', '🥟', '🌮', '🥟'].map((e, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
              }}>
                {e}
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .catering-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* Section 4: Location CTA */}
      <section style={{ background: '#006847', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }} className="reveal">
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Find Us</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0.8rem 0 1rem' }}>
            Come Say Hello
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            1505 S. Main St., Rockford, IL 61102<br />
            Open 7 days a week — check our locations page for hours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/locations"
              style={{
                background: '#FFD700',
                color: '#1A1A1A',
                textDecoration: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
              }}
            >
              View Location
            </Link>
            <a
              href="https://www.doordash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.9rem 2rem',
                borderRadius: '4px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.9rem',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              Order Delivery
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
