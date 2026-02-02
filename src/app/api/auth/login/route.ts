import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { buscarUsuarioPorCorreo, actualizarUltimoLogin, incrementarIntentosFallidos } from '@/lib/airtable';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por correo
    const usuario = await buscarUsuarioPorCorreo(email);

    console.log('Usuario encontrado:', usuario ? {
      id: usuario.id,
      email: usuario.correoElectronico,
      tieneContrasena: !!usuario.contrasenaHash,
      contrasenaHash: usuario.contrasenaHash ? `[${usuario.contrasenaHash.length} chars]` : 'vacío',
    } : 'No encontrado');

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está bloqueado
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

    // Verificar si el usuario es nuevo (no tiene contraseña)
    if (!usuario.contrasenaHash || usuario.contrasenaHash.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Debe crear una contraseña',
          requiresPasswordSetup: true,
          email: usuario.correoElectronico,
          nombre: usuario.nombreCompleto,
        },
        { status: 428 } // 428 Precondition Required
      );
    }

    // Verificar contraseña
    // Nota: Si la contraseña en Airtable no está hasheada, podemos comparar directamente
    // En producción, siempre usar hash
    let passwordValid = false;
    
    if (usuario.contrasenaHash) {
      // Intentar verificar como hash bcrypt
      try {
        passwordValid = await bcrypt.compare(password, usuario.contrasenaHash);
      } catch {
        // Si falla, comparar directamente (para desarrollo/testing)
        passwordValid = password === usuario.contrasenaHash;
      }
    }

    if (!passwordValid) {
      // Incrementar intentos fallidos
      await incrementarIntentosFallidos(usuario.id, usuario.intentosFallidos || 0);
      
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Login exitoso - actualizar último login
    await actualizarUltimoLogin(usuario.id);

    // Crear sesión
    await createSession({
      userId: usuario.ID.toString(),
      userRecordId: usuario.id,
      email: usuario.correoElectronico,
      nombre: usuario.nombreCompleto || 'Usuario',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.ID,
        email: usuario.correoElectronico,
        nombre: usuario.nombreCompleto,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
