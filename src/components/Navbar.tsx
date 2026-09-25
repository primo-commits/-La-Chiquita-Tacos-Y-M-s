'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/catering', label: 'Catering' },
  { href: '/locations', label: 'Locations' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(26,26,26,0.97)' : 'transparent',
        transition: 'background 0.3s ease',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1' }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: '#C8102E',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
          }}>La Chiquita</span>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            color: '#FFD700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>Tacos Y Más</span>
        </div>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              position: 'relative',
              paddingBottom: '4px',
            }}
          >
            {link.label}
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '0%',
              height: '2px',
              background: '#C8102E',
              transition: 'width 0.3s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.width = '100%')}
              onMouseLeave={e => (e.currentTarget.style.width = '0%')}
            />
          </Link>
        ))}
        <a
          href="https://www.doordash.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#C8102E',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a00d25')}
          onMouseLeave={e => (e.currentTarget.style.background = '#C8102E')}
        >
          Order Online
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          flexDirection: 'column',
          gap: '5px',
        }}
        className="hamburger"
        aria-label="Toggle menu"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: 'block',
            width: '24px',
            height: '2px',
            background: '#fff',
            transition: 'all 0.3s',
          }} />
        ))}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'rgba(26,26,26,0.98)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase' }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.doordash.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#C8102E',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.7rem 1.2rem',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 700,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Order Online
          </a>
        </div>
      )}

      <style>{`
        .hamburger { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
