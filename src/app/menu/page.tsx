'use client'

import { useEffect } from 'react'

const MENU_ITEMS = [
  {
    category: 'Tacos & Quesadillas',
    color: '#C8102E',
    items: [
      {
        name: 'Texas Style Breakfast Taco',
        price: '$8.00',
        desc: 'Bacon or chorizo (homemade Mexican sausage), eggs, potato, cheese, refried beans served on a flour tortilla.',
        note: null,
        // Image: la-chiquita-photo-XX.jpg → user copies to public/images/menu/
        img: '/images/menu/Texas-Style-Breakfast-Taco.jpg',
      },
      {
        name: 'Gringa (Quesadilla with Flour Tortilla)',
        price: '$10.35',
        desc: 'Served with al pastor (adobo marinated pork) with pineapple, cheese, cilantro, and onions.',
        note: null,
        img: '/images/menu/Gringa-(Quesadilla-with-Flour-Tortilla).jpg',
      },
    ],
  },
  {
    category: 'Appetizers & Sides',
    color: '#006847',
    items: [
      {
        name: 'Colombian Empanadas',
        price: '$3.45',
        desc: 'Fried turnover made with corn flour filled with beef or chicken, potato, tomato, and onion served with aji (savoury mild topping).',
        note: null,
        img: '/images/menu/Colombian-Empanadas.jpg',
      },
      {
        name: 'Tequenos (Venezuelan Cheese Sticks – 4pcs)',
        price: '$9.20',
        desc: 'Golden fried pastry dough filled with melted cheese served with salsa rosa (pink sauce) and house sauce.',
        note: null,
        img: '/images/menu/Tequenos-(Venezuelan-Cheese-Sticks-4pcs).jpg',
      },
      {
        name: 'Nachos',
        price: '$17.25',
        desc: 'Homemade tortilla chips topped with refried beans, chorizo, cheese, cilantro, onion, Mexican crema.',
        note: null,
        img: '/images/menu/Nachos.jpg',
      },
      {
        name: 'Patacon (2 Pcs)',
        price: '$16.10',
        desc: 'Fried and smashed green plantains topped with your choice of pulled chicken, pulled pork or mix and match, pickled onions, cilantro, onion, crema, house sauce.',
        note: null,
        img: '/images/menu/Patacon(2-Pcs).jpg',
      },
    ],
  },
  {
    category: 'Mains',
    color: '#FFD700',
    items: [
      {
        name: 'Chilaquiles',
        price: '$13.80',
        desc: 'Homemade tortilla chips cooked in a warm savoury sauce, choice of red (spicy) or green (mild), topped with cheese, cilantro, onion, and Mexican crema.',
        note: 'Choice of red (spicy) or green (mild)',
        img: '/images/menu/Chilaquiles.jpg',
      },
      {
        name: 'Enchiladas',
        price: '$18.40',
        desc: 'Corn tortillas filled with choice of chicken or cheese, tossed in savoury mild green sauce, topped with cheese, cilantro, onion, and Mexican crema.',
        note: 'Choice of chicken or cheese',
        img: '/images/menu/Enchiladas.jpg',
      },
    ],
  },
  {
    category: 'Desserts',
    color: '#C8102E',
    items: [
      {
        name: 'Churros (4 Pcs)',
        price: '$6.75',
        desc: 'Fried dough tossed in cinnamon and sugar served with homemade chocolate sauce.',
        note: null,
        img: '/images/menu/Churros(4-Pcs).jpg',
      },
    ],
  },
]

export default function MenuPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Page Header */}
      <section style={{
        background: '#1A1A1A',
        paddingTop: '8rem',
        paddingBottom: '4rem',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
      }}>
        <span style={{ color: '#C8102E', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Our Menu</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', marginTop: '0.8rem', lineHeight: 1.1 }}>
          La Chiquita Menu
        </h1>
        <p style={{ color: '#aaa', marginTop: '1rem', fontSize: '1rem' }}>
          Fresh. Bold. Made to order.
        </p>
        <a
          href="https://www.doordash.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            background: '#C8102E',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.8rem 2rem',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Order on DoorDash
        </a>
      </section>

      {/* Menu Sections — Burrito Libre style color blocking */}
      {MENU_ITEMS.map((section, si) => (
        <section
          key={section.category}
          id={section.category.toLowerCase().replace(/[^a-z]/g, '-')}
          style={{
            background: si % 2 === 0 ? '#fff' : '#FFF8E7',
            padding: '4rem 2rem',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Section header */}
            <div className="reveal" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2.5rem',
              paddingBottom: '1rem',
              borderBottom: `3px solid ${section.color}`,
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 900,
                color: '#1A1A1A',
              }}>
                {section.category}
              </h2>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {section.items.map((item, ii) => (
                <div
                  key={item.name}
                  className="reveal"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1.5rem',
                    alignItems: 'start',
                    padding: '1.8rem 0',
                    borderBottom: '1px solid #e8e8e8',
                    animationDelay: `${ii * 0.08}s`,
                  }}
                >
                  {/* Text side */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A' }}>
                        {item.name}
                      </h3>
                      {item.note && (
                        <span style={{
                          background: section.color,
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '3px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {item.note}
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>

                  {/* Price + image grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: '100px' }}>
                    <span style={{
                      background: section.color,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.price}
                    </span>
                    {/* Image thumbnail */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      background: '#eee',
                      border: `2px solid ${section.color}22`,
                    }}>
                      {/* <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
                      {/* TODO: copy menu photos to public/images/menu/ */}
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f5f5f5',
                        fontSize: '1.8rem',
                      }}>
                        {section.category.includes('Taco') ? '🌮' :
                         section.category.includes('Appe') ? '🥟' :
                         section.category.includes('Main') ? '🍽️' : '🍫'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section style={{ background: '#1A1A1A', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
          Hungry?
        </h2>
        <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '2rem' }}>
          Order now on DoorDash — delivery or pickup available.
        </p>
        <a
          href="https://www.doordash.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#C8102E',
            color: '#fff',
            textDecoration: 'none',
            padding: '1rem 2.5rem',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Order on DoorDash
        </a>
      </section>
    </>
  )
}
