'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Step = 'email' | 'password' | 'create-password';

export default function Login() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 404) {
        setError('Usuario no encontrado');
        setIsLoading(false);
        return;
      }

      if (response.status === 423) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Error al verificar usuario');
        setIsLoading(false);
        return;
      }

      setNombre(data.nombre || '');
      
      if (data.needsPassword) {
        setStep('create-password');
      } else {
        setStep('password');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }

    setIsLoading(false);
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al crear contraseña');
        setIsLoading(false);
        return;
      }

      // Contraseña creada, ahora hacer login automático
      const loginResult = await login(email, password);
      
      if (loginResult.success) {
        router.push('/dashboard');
      } else {
        // Si falla, ir al paso de password
        setPassword('');
        setStep('password');
        setError('Contraseña creada. Por favor, inicia sesión.');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setError('');
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

          {/* Login Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            {/* Step: Email */}
            {step === 'email' && (
              <>
                <h1 className="text-xl font-semibold text-white text-center mb-6">
                  Iniciar Sesión
                </h1>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleEmailSubmit} className="space-y-5">
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
                      autoFocus
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
                        Verificando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Step: Password */}
            {step === 'password' && (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-1">Bienvenido</p>
                  <h1 className="text-xl font-semibold text-white">
                    {nombre || email}
                  </h1>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      autoFocus
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
                        Ingresando...
                      </>
                    ) : (
                      'Ingresar'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full text-gray-500 hover:text-gray-400 text-sm transition-colors"
                  >
                    ← Usar otro correo
                  </button>
                </form>
              </>
            )}

            {/* Step: Create Password */}
            {step === 'create-password' && (
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
                    Crea una contraseña para tu cuenta
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreatePassword} className="space-y-5">
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
                      autoFocus
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
                        Creando...
                      </>
                    ) : (
                      'Crear contraseña y entrar'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full text-gray-500 hover:text-gray-400 text-sm transition-colors"
                  >
                    ← Usar otro correo
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              ← Volver al inicio
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
