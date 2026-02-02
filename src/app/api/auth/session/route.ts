import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        nombre: session.nombre,
      },
    });
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json(
      { error: 'Error al verificar sesión' },
      { status: 500 }
    );
  }
}
