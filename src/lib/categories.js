export const CATEGORIES = {
  'Comida': { emoji: '', color: '#333333' },
  'Cafetería': { emoji: '', color: '#444444' },
  'Artesanías': { emoji: '', color: '#555555' },
  'Servicios': { emoji: '', color: '#666666' },
  'Comercio': { emoji: '', color: '#777777' },
  'Bar/Bebidas': { emoji: '', color: '#888888' },
  'Panadería': { emoji: '', color: '#999999' },
  'Otro': { emoji: '', color: '#AAAAAA' },
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
