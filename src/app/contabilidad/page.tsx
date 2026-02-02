import Image from "next/image";
import Link from "next/link";

export default function Contabilidad() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/18032025-DSCF8092_mpdwvs.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Volver</span>
            </Link>
            <Link href="/">
              <Image
                src="/logo-Guaicaramo.png"
                alt="Guaicaramo Ambiental"
                width={160}
                height={50}
                priority
                className="h-10 w-auto"
              />
            </Link>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          {/* Card */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Contabilidad</h1>
                  <p className="text-sm text-gray-500">Responsable: Faynsuri</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-full">
                Mensual
              </span>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-8 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Imágenes de comprobantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Recibos de energía</span>
              </div>
            </div>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-all">
              <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-400 mb-1">Arrastra tus imágenes aquí o haz clic para seleccionar</span>
              <span className="text-sm text-gray-600">Archivos permitidos: .jpg, .jpeg, .png, .webp</span>
              <input type="file" className="hidden" accept="image/*" multiple />
            </label>

            {/* Submit Button */}
            <button className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
              Subir imágenes
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2026 Guaicaramo Ambiental
          </p>
        </div>
      </footer>
    </div>
  );
}
