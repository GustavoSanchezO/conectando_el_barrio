import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const negocio = await request.json();

    // Validate required fields
    if (!negocio.nombre) {
      return NextResponse.json(
        { error: 'El nombre del negocio es obligatorio.' },
        { status: 400 }
      );
    }

    // Return validated business with generated id and timestamp
    const validated = {
      id: crypto.randomUUID(),
      nombre: negocio.nombre,
      categoria: negocio.categoria || 'Otro',
      descripcion: negocio.descripcion || '',
      horario: negocio.horario || null,
      direccion: negocio.direccion || null,
      productos: negocio.productos || [],
      lat: negocio.lat || 24.0226,
      lng: negocio.lng || -104.6578,
      telefono: negocio.telefono || null,
      imagen: negocio.imagen || null,
      creadoEn: new Date().toISOString(),
    };

    return NextResponse.json({ negocio: validated });
  } catch (error) {
    console.error('Error saving negocio:', error);
    return NextResponse.json(
      { error: 'Error al procesar el negocio.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Los negocios se gestionan desde el cliente (localStorage).',
    tip: 'Usa el módulo @/lib/store para acceder a los datos.',
  });
}
