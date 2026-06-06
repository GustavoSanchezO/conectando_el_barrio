'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = pathname === '/' && !scrolled && !menuOpen;

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/explorar', label: 'Explorar' },
    { href: '/registrar', label: 'Registrar' },
  ];

  return (
    <nav className={`navbar ${isTransparent ? 'navbar-transparent' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          Conectando el Barrio
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar-cta">
            <Link href="/registrar" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Registrar Negocio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
