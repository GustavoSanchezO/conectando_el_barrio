'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNegocios } from '@/lib/store';

export default function HomePage() {
  const [stats, setStats] = useState({ negocios: 0, categorias: 0 });

  useEffect(() => {
    const negocios = getNegocios();
    const categorias = [...new Set(negocios.map((n) => n.categoria))];
    setStats({ negocios: negocios.length, categorias: categorias.length });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            Hack Days 2026 Durango
          </div>
          <h1>
            Descubre tu <span className="text-gradient">Barrio</span> como nunca antes
          </h1>
          <p>
            El primer catálogo inteligente de comercios locales de Durango.
            Registra tu negocio con solo hablar y descubre rutas de consumo personalizadas.
          </p>
          <div className="hero-actions">
            <Link href="/registrar" className="btn btn-primary btn-lg">
              Registrar mi Negocio
            </Link>
            <Link href="/explorar" className="btn btn-outline btn-lg">
              Explorar el Barrio
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.negocios}</div>
              <div className="hero-stat-label">Negocios registrados</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.categorias}</div>
              <div className="hero-stat-label">Categorías</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">IA</div>
              <div className="hero-stat-label">Registro con IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: 'var(--space-sm)' }}>
            ¿Cómo funciona?
          </h2>
          <p className="text-center" style={{ maxWidth: '500px', margin: '0 auto var(--space-2xl)' }}>
            Dos experiencias diseñadas para comerciantes y visitantes
          </p>

          <div className="features-grid">
            <div className="card feature-card">
              <h3>Para Comerciantes</h3>
              <p>
                Presiona un botón, describe tu negocio hablando naturalmente y nuestra IA genera automáticamente tu ficha comercial.
                Sin formularios complicados.
              </p>
              <Link
                href="/registrar"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'var(--space-md)' }}
              >
                Registrar Negocio
              </Link>
            </div>

            <div className="card feature-card">
              <h3>Para Visitantes</h3>
              <p>
                Chatea con nuestro guía virtual, cuéntale qué buscas y recibe recomendaciones personalizadas con rutas
                de consumo en el mapa.
              </p>
              <Link
                href="/explorar"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 'var(--space-md)' }}
              >
                Explorar Durango
              </Link>
            </div>

            <div className="card feature-card">
              <h3>Mapa Interactivo</h3>
              <p>
                Visualiza todos los comercios del barrio en un mapa, filtra por categoría y descubre
                tesoros escondidos cerca de ti.
              </p>
              <Link
                href="/explorar"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 'var(--space-md)' }}
              >
                Ver Mapa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps for merchants */}
      <section className="section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
            Registro en <span className="text-gradient">3 pasos</span>
          </h2>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#fff',
                  margin: '0 auto var(--space-md)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                1
              </div>
              <h3>Habla</h3>
              <p>Presiona el micrófono y describe tu negocio con tus propias palabras.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#fff',
                  margin: '0 auto var(--space-md)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                2
              </div>
              <h3>IA procesa</h3>
              <p>Nuestra inteligencia artificial extrae nombre, categoría, horarios y productos.</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: '#fff',
                  margin: '0 auto var(--space-md)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                3
              </div>
              <h3>Confirma</h3>
              <p>Revisa la ficha generada, ajusta si necesitas y listo. ¡Ya estás en el mapa!</p>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link href="/registrar" className="btn btn-primary btn-lg">
              Comenzar Registro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: 'var(--space-xl)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <p className="text-small" style={{ color: 'var(--text-muted)' }}>
          Conectando el Barrio — Hack Days 2026 Durango
        </p>
        <p
          className="text-small"
          style={{ color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}
        >
          Hecho para impulsar el comercio local
        </p>
      </footer>
    </>
  );
}
