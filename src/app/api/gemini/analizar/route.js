import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { transcripcion } = await request.json();

    if (!transcripcion || transcripcion.trim().length < 10) {
      return NextResponse.json(
        { error: 'La transcripción es demasiado corta. Intenta describir tu negocio con más detalle.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      return NextResponse.json(
        { error: 'API Key de Gemini no configurada. Agrega GEMINI_API_KEY en .env.local' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Eres un asistente inteligente que ayuda a registrar negocios locales en Durango, México.

A partir de la siguiente transcripción de voz de un comerciante, extrae la información del negocio en formato JSON.

TRANSCRIPCIÓN:
"${transcripcion}"

Responde ÚNICAMENTE con un objeto JSON válido con estos campos:
{
  "nombre": "nombre del negocio (string)",
  "categoria": "una de estas opciones exactas: Comida, Cafetería, Artesanías, Servicios, Comercio, Bar/Bebidas, Panadería, Otro",
  "descripcion": "descripción atractiva del negocio en máximo 2 oraciones (string)",
  "horario": "horario de atención (string o null si no se menciona)",
  "direccion": "dirección lo más completa posible en Durango (string o null)",
  "productos": ["array de máximo 5 productos o servicios principales"],
  "telefono": "número de teléfono (string o null)",
  "lat": 24.02,
  "lng": -104.66
}

Reglas:
- Si algún dato no se menciona explícitamente, usa null (excepto lat/lng, usa valores por defecto en el centro de Durango).
- Para lat/lng, intenta estimar basándote en la dirección mencionada dentro de Durango (lat: 24.01-24.04, lng: -104.63 a -104.68).
- La descripción debe ser atractiva y profesional, mejorando lo que dijo el comerciante.
- La categoría debe ser exactamente una de las opciones listadas.
- Responde SOLO con el JSON, sin texto adicional, sin markdown, sin backticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text.trim();

    // Clean potential markdown formatting
    let cleanJson = text;
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const datos = JSON.parse(cleanJson);

    // Validate required fields
    if (!datos.nombre) {
      return NextResponse.json(
        { error: 'No se pudo extraer el nombre del negocio. Intenta ser más específico.' },
        { status: 400 }
      );
    }

    // Ensure defaults
    datos.lat = datos.lat || 24.0226;
    datos.lng = datos.lng || -104.6578;
    datos.productos = datos.productos || [];
    datos.categoria = datos.categoria || 'Otro';

    return NextResponse.json({ datos });
  } catch (error) {
    console.error('Error en análisis Gemini:', error);
    return NextResponse.json(
      { error: 'Error al analizar la transcripción. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
