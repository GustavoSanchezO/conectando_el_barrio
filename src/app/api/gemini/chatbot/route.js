import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { mensaje, historial, negocios } = await request.json();

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
          `- ID: ${n.id} | ${n.nombre} (${n.categoria}) — ${n.descripcion}. Dirección: ${n.direccion || 'No disponible'}. Horario: ${n.horario || 'No disponible'}. Productos: ${(n.productos || []).join(', ')}.`
      )
      .join('\n');

    // Build conversation history
    const historialText = (historial || [])
      .slice(-6) // Last 6 messages for context
      .map((h) => `${h.role === 'user' ? 'Visitante' : 'Guía'}: ${h.content}`)
      .join('\n');

    const prompt = `Eres "Barrio Guide", un guía turístico virtual de Durango, México. Eres amigable, entusiasta y conocedor de la cultura duranguense.

NEGOCIOS LOCALES REGISTRADOS:
${negociosContext || 'No hay negocios registrados aún.'}

${historialText ? `CONVERSACIÓN PREVIA:\n${historialText}\n` : ''}
MENSAJE DEL VISITANTE: "${mensaje}"

INSTRUCCIONES:
1. Responde de forma conversacional, cálida y en español.
2. Si el visitante pregunta por comida, lugares, servicios o actividades, recomienda negocios ESPECÍFICOS de la lista.
3. Si pide una ruta o recorrido, sugiere un orden lógico de visita entre los negocios relevantes.
4. Si no hay negocios relevantes, sugiere de todas formas pero menciona que el catálogo está creciendo.
5. Usa emojis ocasionalmente para ser más amigable.
6. Mantén las respuestas concisas (máximo 3-4 oraciones).

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks):
{
  "mensaje": "tu respuesta conversacional aquí",
  "negociosRecomendados": ["id1", "id2"],
  "mostrarRuta": false
}

- negociosRecomendados: array de IDs de negocios que recomiendas (vacío si no aplica)
- mostrarRuta: true si el usuario pidió una ruta o recorrido`;

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
