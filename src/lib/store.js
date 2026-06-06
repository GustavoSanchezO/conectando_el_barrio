import { SEED_NEGOCIOS } from './seedData';

const STORE_KEY = 'conectando_barrio_negocios';

function getStore() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORE_KEY);
  if (!data) {
    // Initialize with seed data
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_NEGOCIOS));
    return [...SEED_NEGOCIOS];
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map(n => {
      if (!n.emoji) {
        const seed = SEED_NEGOCIOS.find(s => s.id === n.id);
        if (seed && seed.emoji) n.emoji = seed.emoji;
      }
      return n;
    });
  } catch {
    return [];
  }
}

function saveStore(negocios) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(negocios));
}

export function getNegocios() {
  return getStore();
}

export function getNegocio(id) {
  const negocios = getStore();
  return negocios.find((n) => n.id === id) || null;
}

export function addNegocio(negocio) {
  const negocios = getStore();
  const nuevo = {
    ...negocio,
    id: negocio.id || crypto.randomUUID(),
    creadoEn: negocio.creadoEn || new Date().toISOString(),
  };
  negocios.push(nuevo);
  saveStore(negocios);
  return nuevo;
}

export function getCategoriasUnicas() {
  const negocios = getStore();
  const categorias = [...new Set(negocios.map((n) => n.categoria))];
  return categorias.sort();
}

export function getNegociosByCategoria(categoria) {
  const negocios = getStore();
  if (!categoria || categoria === 'Todos') return negocios;
  return negocios.filter((n) => n.categoria === categoria);
}

export function searchNegocios(query) {
  if (!query) return getStore();
  const q = query.toLowerCase();
  const negocios = getStore();
  return negocios.filter(
    (n) =>
      n.nombre.toLowerCase().includes(q) ||
      n.descripcion.toLowerCase().includes(q) ||
      n.categoria.toLowerCase().includes(q) ||
      (n.productos && n.productos.some((p) => p.toLowerCase().includes(q)))
  );
}

export function initSeedData() {
  if (typeof window === 'undefined') return;
  const data = localStorage.getItem(STORE_KEY);
  if (!data || JSON.parse(data).length === 0) {
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_NEGOCIOS));
  }
}

export function resetStore() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_KEY, JSON.stringify(SEED_NEGOCIOS));
}
