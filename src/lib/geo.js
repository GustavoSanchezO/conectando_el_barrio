/**
 * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 6371; // Radio de la tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
}

/**
 * Retorna un string formateado con la distancia y tiempo estimado
 * Caminando: ~5km/h
 * Auto: ~30km/h (ciudad)
 */
export function getDistanceInfo(lat1, lon1, lat2, lon2) {
  const distanceKm = calculateDistance(lat1, lon1, lat2, lon2);
  if (!distanceKm) return null;

  const walkingMinutes = Math.round((distanceKm / 5) * 60);
  const drivingMinutes = Math.round((distanceKm / 30) * 60) || 1;

  let distStr = distanceKm < 1 
    ? `${Math.round(distanceKm * 1000)} m` 
    : `${distanceKm.toFixed(1)} km`;

  return {
    distance: distStr,
    distanceKm: distanceKm,
    walking: `${walkingMinutes} min`,
    driving: `${drivingMinutes} min`
  };
}
