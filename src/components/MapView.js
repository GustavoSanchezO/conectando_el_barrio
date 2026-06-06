'use client';

import { useEffect, useRef, useState } from 'react';
import { getCategoryInfo } from '@/lib/categories';

export default function MapView({ negocios, highlighted = [], onMarkerClick, showRoute = false }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [24.0226, -104.6578],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);

      // Fix map size after render
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers when negocios change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => map.removeLayer(m));
      markersRef.current = [];

      if (!negocios || negocios.length === 0) return;

      const bounds = [];

      negocios.forEach((negocio) => {
        if (!negocio.lat || !negocio.lng) return;

        const catInfo = getCategoryInfo(negocio.categoria);
        const isHighlighted = highlighted.includes(negocio.id);

        // Create custom icon
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: ${isHighlighted ? '42px' : '36px'};
            height: ${isHighlighted ? '42px' : '36px'};
            border-radius: 50%;
            background: ${isHighlighted ? catInfo.color : 'rgba(30, 41, 59, 0.9)'};
            border: 2.5px solid ${catInfo.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isHighlighted ? '1.3rem' : '1.1rem'};
            box-shadow: 0 2px 8px rgba(0,0,0,0.4)${isHighlighted ? `, 0 0 15px ${catInfo.color}60` : ''};
            transition: all 0.3s ease;
            cursor: pointer;
          ">${catInfo.emoji}</div>`,
          iconSize: [isHighlighted ? 42 : 36, isHighlighted ? 42 : 36],
          iconAnchor: [isHighlighted ? 21 : 18, isHighlighted ? 21 : 18],
        });

        const marker = L.marker([negocio.lat, negocio.lng], { icon }).addTo(map);

        marker.bindPopup(`
          <div>
            <div class="map-popup-title">${negocio.nombre}</div>
            <div class="map-popup-category">${catInfo.emoji} ${negocio.categoria}</div>
            <div class="map-popup-desc">${negocio.descripcion || ''}</div>
            ${negocio.horario ? `<div style="font-size:0.8rem;margin-top:6px;color:#94A3B8">🕐 ${negocio.horario}</div>` : ''}
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(negocio);
        });

        markersRef.current.push(marker);
        bounds.push([negocio.lat, negocio.lng]);
      });

      // Fit bounds if we have markers
      if (bounds.length > 0) {
        try {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        } catch (e) {
          // ignore bounds error
        }
      }
    };

    updateMarkers();
  }, [negocios, highlighted, mapReady, onMarkerClick]);

  // Draw route if enabled
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !showRoute) return;

    const drawRoute = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstanceRef.current;

      // Remove previous route
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }

      if (!highlighted || highlighted.length < 2) return;

      const routePoints = highlighted
        .map((id) => negocios.find((n) => n.id === id))
        .filter((n) => n && n.lat && n.lng)
        .map((n) => [n.lat, n.lng]);

      if (routePoints.length < 2) return;

      routeLayerRef.current = L.polyline(routePoints, {
        color: '#F59E0B',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
      }).addTo(map);
    };

    drawRoute();
  }, [highlighted, showRoute, negocios, mapReady]);

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
