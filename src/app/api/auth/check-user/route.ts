import { NextRequest, NextResponse } from 'next/server';
import { buscarUsuarioPorCorreo } from '@/lib/airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const usuario = await buscarUsuarioPorCorreo(email);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si está bloqueado
    if (usuario.bloqueadoHasta) {
      const bloqueadoHasta = new Date(usuario.bloqueadoHasta);
      if (bloqueadoHasta > new Date()) {
        const minutosRestantes = Math.ceil((bloqueadoHasta.getTime() - Date.now()) / 60000);
        return NextResponse.json(
          { error: `Cuenta bloqueada. Intente de nuevo en ${minutosRestantes} minutos.` },
          { status: 423 }
        );
      }
    }

    // Verificar si necesita crear contraseña
    const needsPassword = !usuario.contrasenaHash || usuario.contrasenaHash.trim() === '';

    return NextResponse.json({
      exists: true,
      needsPassword,
      nombre: usuario.nombreCompleto,
      email: usuario.correoElectronico,
    });

  } catch (error) {
    console.error('Error verificando usuario:', error);
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
