'use client';

import { getCategoryInfo } from '@/lib/categories';

export default function BusinessCard({ negocio, onClick }) {
  const categoryInfo = getCategoryInfo(negocio.categoria);

  return (
    <div className="business-card" onClick={() => onClick && onClick(negocio)}>
      <div className="business-card-header">
        <div>
          <h3>{negocio.nombre}</h3>
          <span
            className="badge"
            style={{
              backgroundColor: `${categoryInfo.color}20`,
              color: categoryInfo.color,
              borderColor: `${categoryInfo.color}30`,
            }}
          >
            {negocio.categoria}
          </span>
        </div>
        <div
          className="business-card-icon"
          style={{
            backgroundColor: `${categoryInfo.color}15`,
            fontSize: '1.5rem',
          }}
        >
          
        </div>
      </div>

      <p className="business-card-desc">{negocio.descripcion}</p>

      <div className="business-card-meta">
        {negocio.direccion && (
          <div className="business-card-meta-item">
            <span>Dir:</span>
            <span>{negocio.direccion}</span>
          </div>
        )}
        {negocio.horario && (
          <div className="business-card-meta-item">
            <span>Horario:</span>
            <span>{negocio.horario}</span>
          </div>
        )}
        {negocio.telefono && (
          <div className="business-card-meta-item">
            <span>Tel:</span>
            <span>{negocio.telefono}</span>
          </div>
        )}
      </div>

      {negocio.productos && negocio.productos.length > 0 && (
        <div className="business-card-productos">
          {negocio.productos.slice(0, 4).map((prod, i) => (
            <span key={i} className="producto-tag">
              {prod}
            </span>
          ))}
          {negocio.productos.length > 4 && (
            <span className="producto-tag">+{negocio.productos.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
}
