import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { mensaje, historial, negocios, userLocation } = await request.json();

    if (!mensaje || mensaje.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje está vacío.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      return NextResponse.json(
        { error: 'API Key de Gemini no configurada.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build the list of businesses for context
    const negociosContext = (negocios || [])
      .map(
        (n) =>
          `- ID: ${n.id} | ${n.nombre} (${n.categoria}) — Lat: ${n.lat}, Lng: ${n.lng}. ${n.descripcion}.`
      )
      .join('\n');

    // Build conversation history
    const historialText = (historial || [])
      .slice(-6)
      .map((h) => `${h.role === 'user' ? 'Visitante' : 'Guía'}: ${h.content}`)
      .join('\n');

    const userLocText = userLocation
      ? `\nUBICACIÓN ACTUAL DEL VISITANTE: Lat ${userLocation.lat}, Lng ${userLocation.lng}. ¡Prioriza negocios cercanos y calcula distancias aproximadas en tu respuesta si es útil!`
      : '';

    const prompt = `Eres "Barrio Guide", un asistente turístico de Inteligencia Artificial para Durango, México. Eres capaz de generar rutas inteligentes y optimizadas.

NEGOCIOS LOCALES REGISTRADOS:
${negociosContext || 'No hay negocios registrados aún.'}
${userLocText}

${historialText ? `CONVERSACIÓN PREVIA:\n${historialText}\n` : ''}
MENSAJE DEL VISITANTE: "${mensaje}"

INSTRUCCIONES:
1. Responde de forma conversacional, cálida y en español.
2. Analiza la intención. Si el usuario busca algo cerca, USA su ubicación actual para recomendar los IDs de los negocios más cercanos (calcula la distancia mentalmente según lat/lng).
3. Si pide una "ruta", "recorrido" o plan, selecciona los negocios, ordénalos formando un circuito lógico de distancia y márcalo activando "mostrarRuta": true.
4. Usa emojis. Mantén las respuestas muy concisas.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks):
{
  "mensaje": "tu respuesta conversacional aquí",
  "negociosRecomendados": ["id1", "id2"],
  "mostrarRuta": true
}

- negociosRecomendados: array de IDs ordenados por cercanía o secuencia de ruta.
- mostrarRuta: true si el visitante pidió un recorrido o ruta, false si solo es una pregunta.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text.trim();

    let cleanJson = text;
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const datos = JSON.parse(cleanJson);

    return NextResponse.json({
      mensaje: datos.mensaje || 'Disculpa, no pude procesar tu mensaje.',
      negociosRecomendados: datos.negociosRecomendados || [],
      mostrarRuta: datos.mostrarRuta || false,
    });
  } catch (error) {
    console.error('Error en chatbot Gemini:', error);
    return NextResponse.json(
      {
        mensaje: '¡Ups! Tuve un pequeño problema. ¿Podrías repetir tu pregunta? 😅',
        negociosRecomendados: [],
        mostrarRuta: false,
      },
      { status: 200 } // Return 200 so the chat doesn't break
    );
  }
}
