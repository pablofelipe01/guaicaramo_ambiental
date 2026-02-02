import Image from "next/image";
import Link from "next/link";

export default function Login() {
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
            <h1 className="text-xl font-semibold text-white text-center mb-6">
              Iniciar Sesión
            </h1>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <Link
                href="/dashboard"
                className="block w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium text-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
              >
                Ingresar
              </Link>
            </form>
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
