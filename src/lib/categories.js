export const CATEGORIES = {
  'Comida': { emoji: '🍽️', color: '#EF4444' },
  'Cafetería': { emoji: '☕', color: '#8B5CF6' },
  'Artesanías': { emoji: '🎨', color: '#F59E0B' },
  'Servicios': { emoji: '✂️', color: '#3B82F6' },
  'Comercio': { emoji: '🛍️', color: '#10B981' },
  'Bar/Bebidas': { emoji: '🍺', color: '#EC4899' },
  'Panadería': { emoji: '🥖', color: '#D97706' },
  'Otro': { emoji: '📍', color: '#6B7280' },
};

export function getCategoryInfo(categoria) {
  return CATEGORIES[categoria] || CATEGORIES['Otro'];
}

export function getCategoryList() {
  return Object.entries(CATEGORIES).map(([name, info]) => ({
    name,
    ...info,
  }));
}
