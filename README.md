# 🏘️ Conectando el Barrio

> Catálogo inteligente de comercios locales de Durango, México.

**Hack Days 2026 Durango** — Reto: Conectando el Barrio

## ✨ Características

### 🎤 Registro por Voz con IA
- Un comerciante presiona un botón de micrófono
- Describe su negocio hablando naturalmente
- Google Gemini analiza la transcripción y extrae automáticamente:
  - Nombre, categoría, descripción, horarios, ubicación, productos
- Se genera una ficha que el comerciante solo confirma

### 💬 Chatbot Turístico
- Un visitante chatea con "Barrio Guide"
- El chatbot conoce todos los negocios registrados
- Recomienda lugares según intereses del visitante
- Genera rutas de consumo personalizadas en el mapa

### 🗺️ Mapa Interactivo
- Visualización de todos los comercios en el mapa de Durango
- Filtrado por categoría (Comida, Cafetería, Artesanías, etc.)
- Fichas detalladas de cada negocio
- Búsqueda por nombre o producto

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 15 | Framework full-stack |
| Google Gemini API | Análisis de voz y chatbot |
| Web Speech API | Reconocimiento de voz |
| Leaflet + OpenStreetMap | Mapas interactivos |
| localStorage | Base de datos del prototipo |
| Vanilla CSS | Estilos premium |

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/GustavoSanchezO/conectando_el_barrio.git
cd conectando_el_barrio

# Instalar dependencias
npm install

# Configurar API Key de Gemini
cp .env.local.example .env.local
# Edita .env.local y agrega tu GEMINI_API_KEY

# Iniciar servidor de desarrollo
npm run dev
```

Abre http://localhost:3000

## 🔑 Configuración

Necesitas una API Key de Google Gemini (gratis):
1. Ve a https://aistudio.google.com/
2. Crea una API Key
3. Agrégala en `.env.local`:
```
GEMINI_API_KEY=tu_api_key_aqui
```

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── registrar/page.js    # Registro por voz
│   ├── explorar/page.js     # Mapa + exploración
│   └── api/
│       ├── gemini/analizar/  # Análisis de voz con IA
│       ├── gemini/chatbot/   # Chatbot turístico
│       └── negocios/         # API de negocios
├── components/
│   ├── Navbar.js
│   ├── VoiceRecorder.js
│   ├── BusinessPreview.js
│   ├── BusinessCard.js
│   ├── MapView.js
│   └── ChatBot.js
└── lib/
    ├── store.js              # localStorage DB
    ├── categories.js         # Categorías
    └── seedData.js           # Datos de demo
```

## 👥 Equipo

Hack Days 2026 Durango

---

Hecho con ❤️ para impulsar el comercio local de Durango
