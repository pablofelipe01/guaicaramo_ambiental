import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buscarUsuarioPorCorreo, usuariosTable } from '@/lib/airtable';
import { FieldSet } from 'airtable';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await buscarUsuarioPorCorreo(email);

    if (!usuario) {
      return NextResponse.json(
        { error: 'No se encontró un usuario con este correo' },
        { status: 404 }
      );
    }

    // Verificar que el usuario NO tenga contraseña (es nuevo)
    if (usuario.contrasenaHash && usuario.contrasenaHash.trim() !== '') {
      return NextResponse.json(
        { error: 'Este usuario ya tiene una contraseña configurada' },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña en Airtable
    await usuariosTable.update(usuario.id, {
      'Contraseña (hash)': hashedPassword,
    } as Partial<FieldSet>);

    return NextResponse.json({
      success: true,
      message: 'Contraseña creada exitosamente',
    });
  } catch (error) {
    console.error('Error configurando contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
