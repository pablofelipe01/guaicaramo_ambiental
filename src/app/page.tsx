import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/DJI_0909_cmozhv (1).jpg')" }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          {/* Logo */}
          <div className="mb-12">
            <Image
              src="/logo-Guaicaramo.png"
              alt="Guaicaramo Ambiental"
              width={280}
              height={80}
              priority
              className="h-16 w-auto mx-auto"
            />
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Bienvenido
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Sistema de gestión y carga de información ambiental
          </p>

          {/* Access Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25"
          >
            Acceder
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
