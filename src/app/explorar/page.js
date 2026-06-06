'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getNegocios, getNegociosByCategoria } from '@/lib/store';
import { getCategoryList, getCategoryInfo } from '@/lib/categories';
import BusinessCard from '@/components/BusinessCard';
import ChatBot from '@/components/ChatBot';

// Dynamic import for Leaflet (SSR incompatible)
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div
      className="map-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-card)',
      }}
    >
      <div className="loading-spinner"></div>
    </div>
  ),
});

export default function ExplorarPage() {
  const [negocios, setNegocios] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [selectedNegocio, setSelectedNegocio] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [highlighted, setHighlighted] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const data = getNegocios();
    setNegocios(data);
  }, []);

  const filteredNegocios = useMemo(() => {
    let result = filtro === 'Todos' ? negocios : getNegociosByCategoria(filtro);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.nombre.toLowerCase().includes(q) ||
          n.descripcion.toLowerCase().includes(q)
      );
    }
    return result;
  }, [negocios, filtro, searchQuery]);

  const categories = getCategoryList();

  const handleMarkerClick = useCallback((negocio) => {
    setSelectedNegocio(negocio);
  }, []);

  const handleChatRecommendations = useCallback((ids, showRouteFlag) => {
    setHighlighted(ids);
    setShowRoute(showRouteFlag || false);
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          Explora <span className="text-gradient">Durango</span>
        </h1>
        <p>Descubre los negocios locales de tu barrio en el mapa</p>
      </div>

      {/* Search */}
      <div style={{ maxWidth: '500px', margin: '0 auto var(--space-lg)' }}>
        <input
          className="form-input"
          placeholder="🔍 Buscar negocios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Category filters */}
      <div className="filter-bar" style={{ justifyContent: 'center' }}>
        <button
          className={`filter-chip ${filtro === 'Todos' ? 'active' : ''}`}
          onClick={() => setFiltro('Todos')}
        >
          Todos ({negocios.length})
        </button>
        {categories.map((cat) => {
          const count = negocios.filter((n) => n.categoria === cat.name).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.name}
              className={`filter-chip ${filtro === cat.name ? 'active' : ''}`}
              onClick={() => setFiltro(cat.name)}
              style={
                filtro === cat.name
                  ? {
                      backgroundColor: `${cat.color}20`,
                      borderColor: cat.color,
                      color: cat.color,
                    }
                  : {}
              }
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Map + List Layout */}
      <div className="explore-layout">
        {/* Map */}
        <div>
          <MapView
            negocios={filteredNegocios}
            highlighted={highlighted}
            showRoute={showRoute}
            onMarkerClick={handleMarkerClick}
          />
          {highlighted.length > 0 && (
            <div style={{ marginTop: 'var(--space-sm)', textAlign: 'center' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setHighlighted([]);
                  setShowRoute(false);
                }}
              >
                ✕ Limpiar selección
              </button>
            </div>
          )}
        </div>

        {/* Business List */}
        <div className="explore-sidebar">
          {filteredNegocios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"></div>
              <h3>No se encontraron negocios</h3>
              <p>Intenta con otra categoría o busca algo diferente</p>
            </div>
          ) : (
            filteredNegocios.map((negocio) => (
              <BusinessCard
                key={negocio.id}
                negocio={negocio}
                onClick={setSelectedNegocio}
              />
            ))
          )}
        </div>
      </div>

      {/* Business Detail Modal */}
      {selectedNegocio && (
        <div className="modal-overlay" onClick={() => setSelectedNegocio(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedNegocio(null)}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <div
                className="business-card-icon"
                style={{
                  backgroundColor: `${getCategoryInfo(selectedNegocio.categoria).color}20`,
                  fontSize: '2rem',
                  width: '60px',
                  height: '60px',
                }}
              >
                {selectedNegocio.emoji}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                  {selectedNegocio.nombre}
                </h2>
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${getCategoryInfo(selectedNegocio.categoria).color}20`,
                    color: getCategoryInfo(selectedNegocio.categoria).color,
                    marginTop: '4px',
                  }}
                >
                  {selectedNegocio.categoria}
                </span>
              </div>
            </div>

            <p style={{ marginBottom: 'var(--space-lg)', lineHeight: 1.7 }}>
              {selectedNegocio.descripcion}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              {selectedNegocio.direccion && (
                <div className="business-card-meta-item">
                  <span>Dir:</span>
                  <span>{selectedNegocio.direccion}</span>
                </div>
              )}
              {selectedNegocio.horario && (
                <div className="business-card-meta-item">
                  <span>Horario:</span>
                  <span>{selectedNegocio.horario}</span>
                </div>
              )}
              {selectedNegocio.telefono && (
                <div className="business-card-meta-item">
                  <span>Tel:</span>
                  <span>{selectedNegocio.telefono}</span>
                </div>
              )}
            </div>

            {selectedNegocio.productos &&
              selectedNegocio.productos.length > 0 && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <h4 style={{ marginBottom: 'var(--space-sm)' }}>
                    Productos y Servicios
                  </h4>
                  <div className="business-card-productos">
                    {selectedNegocio.productos.map((prod, i) => (
                      <span key={i} className="producto-tag">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {selectedNegocio.lat && selectedNegocio.lng ? (
              <div className="modal-map-wrapper" style={{ marginTop: 'var(--space-lg)' }}>
                <MapView negocios={[selectedNegocio]} />
              </div>
            ) : (
              <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                📍 Ubicación exacta no disponible en el mapa.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chatbot Toggle */}
      {!chatOpen && (
        <button className="chat-toggle" onClick={() => setChatOpen(true)}>
          Chat
        </button>
      )}

      {/* Chatbot */}
      {chatOpen && (
        <ChatBot
          onRecommendations={handleChatRecommendations}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
