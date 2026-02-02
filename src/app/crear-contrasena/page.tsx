'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SetPasswordForm() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nombreParam = searchParams.get('nombre');
    if (emailParam) setEmail(emailParam);
    if (nombreParam) setNombre(nombreParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear contraseña');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/18032025-DSCF8092_mpdwvs.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/">
              <Image
                src="/logo-Guaicaramo.png"
                alt="Guaicaramo Ambiental"
                width={240}
                height={70}
                priority
                className="h-14 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">¡Contraseña creada!</h2>
                <p className="text-gray-400 text-sm">Redirigiendo al inicio de sesión...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-semibold text-white mb-2">
                    ¡Bienvenido{nombre ? `, ${nombre.split(' ')[0]}` : ''}!
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Por favor, crea una contraseña para tu cuenta
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="correo@ejemplo.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="Mínimo 6 caracteres"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="Repite tu contraseña"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creando contraseña...
                      </>
                    ) : (
                      'Crear contraseña'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2026 Guaicaramo Ambiental
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  );
}
