'use client';

import { useEffect, useRef, useState } from 'react';
import { getCategoryInfo } from '@/lib/categories';
import { renderToString } from 'react-dom/server';
import { getIconComponent } from '@/lib/iconMap';
import { User } from 'lucide-react';

export default function MapView({ negocios, highlighted = [], userLocation, onMarkerClick, showRoute = false }) {
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

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

      const bounds = [];

      // Add user location marker
      if (userLocation && userLocation.lat && userLocation.lng) {
        const userIconSvg = renderToString(<User size={20} color="white" />);
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background-color: #06B6D4;
            border-radius: 50%;
            border: 2px solid white;
            filter: drop-shadow(0 0 10px #06B6D4);
            animation: pulse 2s infinite;
          ">${userIconSvg}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        userMarker.bindPopup('<div style="font-weight:bold;color:#06B6D4;">Tu ubicación</div>');
        markersRef.current.push(userMarker);
        bounds.push([userLocation.lat, userLocation.lng]);
      }

      if (!negocios || negocios.length === 0) {
        if (bounds.length > 0) map.setView(bounds[0], 15);
        return;
      }

      negocios.forEach((negocio) => {
        if (!negocio.lat || !negocio.lng) return;

        const catInfo = getCategoryInfo(negocio.categoria);
        const isHighlighted = highlighted.includes(negocio.id);

        const IconComponent = getIconComponent(negocio.icon);
        const iconSvg = renderToString(<IconComponent size={isHighlighted ? 24 : 18} color={catInfo.color || '#333'} />);
        
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-radius: 50%;
            width: ${isHighlighted ? '40px' : '32px'};
            height: ${isHighlighted ? '40px' : '32px'};
            border: 2px solid ${catInfo.color};
            filter: ${isHighlighted ? `drop-shadow(0 0 8px ${catInfo.color})` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'};
            transition: all 0.3s ease;
            cursor: pointer;
          ">${iconSvg}</div>`,
          iconSize: [isHighlighted ? 40 : 32, isHighlighted ? 40 : 32],
          iconAnchor: [isHighlighted ? 20 : 16, isHighlighted ? 20 : 16],
        });

        const marker = L.marker([negocio.lat, negocio.lng], { icon }).addTo(map);

        marker.bindPopup(`
          <div>
            <div class="map-popup-title">${negocio.nombre}</div>
            <div class="map-popup-category">${negocio.categoria}</div>
            <div class="map-popup-desc">${negocio.descripcion || ''}</div>
            ${negocio.horario ? `<div style="font-size:0.8rem;margin-top:6px;color:#94A3B8">Horario: ${negocio.horario}</div>` : ''}
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
          if (bounds.length === 1) {
            map.setView(bounds[0], 16);
          } else {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          }
        } catch (e) {
          // ignore bounds error
        }
      }

      // Force invalidate size after rendering (crucial for modals)
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 150);
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 500);
    };

    updateMarkers();
  }, [negocios, highlighted, userLocation, mapReady, onMarkerClick]);

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

      if (!highlighted || highlighted.length === 0) return;

      const routePoints = highlighted
        .map((id) => negocios.find((n) => n.id === id))
        .filter((n) => n && n.lat && n.lng)
        .map((n) => [n.lat, n.lng]);

      if (userLocation && userLocation.lat && userLocation.lng && routePoints.length > 0) {
        routePoints.unshift([userLocation.lat, userLocation.lng]);
      }

      if (routePoints.length < 2) return;

      try {
        const coordsString = routePoints.map(p => `${p[1]},${p[0]}`).join(';');
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeGeoJSON = data.routes[0].geometry;

          routeLayerRef.current = L.geoJSON(routeGeoJSON, {
            style: {
              color: '#2563EB',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round'
            }
          }).addTo(map);

          map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
        } else {
          throw new Error('OSRM Failed');
        }
      } catch (err) {
        // Fallback to straight line
        routeLayerRef.current = L.polyline(routePoints, {
          color: '#2563EB',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(map);
        
        map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
      }
    };

    drawRoute();
  }, [highlighted, showRoute, negocios, userLocation, mapReady]);

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
