import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function StoreDetail() {
  const [activeTab, setActiveTab] = useState('details');
  const [includeService, setIncludeService] = useState(false);
  const [added, setAdded] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const images = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDabqOmf96EA2ltZa3Y-bbc9GUKqOi6C3GoOLAui4hG5sMxah9bRW0tHUlHK8sAMHrsX_g8rjaysTuyvo7sNNZ3KeHUbxK8ZhvI4rCyyRLj9qB0bzU3vEXnWB0MGbD6jAey9UjSzIPiHGMfTnVcsQpPIr78z_ORnarJLaDXryKwHLloDIjOZd1iFWBYINaFz47_ua0YgjaFlvYi1e8GKcNbJJnjAgELWguv5N4zuPjRo7y0Y5DNbYTbqRyYX75wXUoidrTKswypnrU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXxqCbWdR_QUZhYvS4m37F30yyt_WqeQhGCsVEMmSobWrEB6zxJqndP2akkWC9QBMCaZtnSBUGi3-dKvZvkTeSEA4kcLr-sWOOdZsAfTBa8ATBfLqR-2Figjt5rus_YK4b6ggQkiaHESE7_IeiN5OT7M-g_hl3wVQBFRUw8G1vfhKe95MAkz8NjkrXwFCPFkIuBjuvuXKCVUqDg4SmP4rkrWA1ipbOJ95XW9-tHzD8Q3pA4AWcBdZM1orkvOIOsUngoCnP6NKOojI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAl8xHcuS9zrTe4l-yQcN36vb1_P_2dxMFysKpVx-vOMumecLEh2_vcTsV-Bj18NPKSCLxUQ-_-XD4tM8U6mRttHSHKP53KvDOu4y_oF7QphoHSBXs5nBeHkhVL_S9xxzDMu2BLMDSkbBxYgEeYqYb5SW8FpREhS42NFgxzHg30DFjYgR89VYCzMDWEVGUyu26A0FbKoxfS9-3QnMhQPCq8xjqpG4VvF2GhezUQYqUjuL-ZmHdSD6_kpvkSfeU86cfzmgwHqz5Wf-M',
  ];

  const [selectedImg, setSelectedImg] = useState(0);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = route('store.catalog');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col selection:bg-[#fea619]/30">
      <Head title="ProSeries Full Motion TV Wall Mount | CMA Store">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8">
            <Link href={route('store.index')} className="font-black text-xl text-black uppercase tracking-tight flex items-center gap-2 group shrink-0">
              <span className="bg-[#fea619] text-black px-2 py-0.5 rounded text-sm group-hover:scale-105 transition-transform">CMA</span> 
              <span className="group-hover:text-[#855300] transition-colors">STORE</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <Link href={route('store.index')} className="text-slate-600 hover:text-black hover:scale-105 transition-all">Inicio</Link>
              
              {/* Menú Desplegable "Productos" */}
              <div 
                className="relative py-2"
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                <Link 
                  href={route('store.catalog')} 
                  className="text-slate-700 hover:text-black flex items-center gap-1 hover:scale-105 transition-all"
                >
                  <span>Productos</span>
                  <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180 text-[#855300]' : ''}`}>
                    expand_more
                  </span>
                </Link>

                {/* Submenú Dropdown */}
                {isProductsDropdownOpen && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5">Categorías</div>
                    <Link href={route('store.catalog')} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#fea619]/15 hover:text-black transition-all">
                      <span className="material-symbols-outlined text-base text-[#855300]">tv_gen</span>
                      <span>Soportes & Racks TV</span>
                    </Link>
                    <Link href={route('store.catalog')} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#fea619]/15 hover:text-black transition-all">
                      <span className="material-symbols-outlined text-base text-[#855300]">construction</span>
                      <span>Ferretería Industrial</span>
                    </Link>
                    <Link href={route('store.catalog')} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#fea619]/15 hover:text-black transition-all">
                      <span className="material-symbols-outlined text-base text-[#855300]">handyman</span>
                      <span>Herramientas de Mano</span>
                    </Link>
                    <Link href={route('store.catalog')} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#fea619]/15 hover:text-black transition-all">
                      <span className="material-symbols-outlined text-base text-[#855300]">electrical_services</span>
                      <span>Electricidad</span>
                    </Link>
                    <Link href={route('store.catalog')} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#fea619]/15 hover:text-black transition-all">
                      <span className="material-symbols-outlined text-base text-[#855300]">plumbing</span>
                      <span>Fontanería & Tubos</span>
                    </Link>
                  </div>
                )}
              </div>

              <span className="text-black font-bold border-b-2 border-[#fea619] pb-1 transition-all">Producto Destacado</span>
            </nav>
          </div>

          {/* Buscador en el Navbar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs sm:max-w-md mx-2">
            <div className="flex items-center bg-[#f2f4f6] px-3.5 py-1.5 rounded-xl border border-slate-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 transition-all shadow-sm">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs sm:text-sm w-full pl-2 text-slate-800 placeholder-slate-400" 
                placeholder="Buscar racks, herramientas, cables..." 
                type="text" 
              />
            </div>
          </form>

          <div className="flex items-center gap-4 shrink-0">
            <Link href={route('dashboard')} className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span className="hidden sm:inline">Panel POS</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1280px] mx-auto px-6 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Link href={route('store.index')} className="hover:text-black transition-colors">Inicio</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href={route('store.catalog')} className="hover:text-black transition-colors">Racks & Soportes</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-black font-black">ProSeries Full Motion</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Galería Fotos */}
          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col order-2 md:order-1 gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${selectedImg === idx ? 'border-black opacity-100 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                  </button>
                ))}
              </div>
              <div className="flex-1 order-1 md:order-2 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-hidden flex items-center justify-center group">
                <img src={images[selectedImg]} className="max-h-[450px] object-contain group-hover:scale-105 transition-transform duration-500" alt="Producto Principal" />
              </div>
            </div>
          </div>

          {/* Información Producto */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#fea619] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">Grado Profesional</span>
                <div className="flex items-center text-[#fea619]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                  <span className="text-slate-500 text-xs font-bold ml-1">(124 Reseñas)</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black mb-2">ProSeries Full Motion TV Wall Mount (37-75")</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Articulación de doble brazo para montaje de alta estabilidad en pantallas de gran formato. Diseñado con precisión arquitectónica.
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black transition-all">{includeService ? '$214.00' : '$129.00'}</span>
              <span className="text-sm text-slate-400 line-through">$159.00</span>
            </div>

            {/* Especificaciones Rápidas */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
                <p className="font-bold text-slate-400 uppercase">Patrón VESA</p>
                <p className="font-black text-black mt-0.5">200x200 a 600x400</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
                <p className="font-bold text-slate-400 uppercase">Peso Máximo</p>
                <p className="font-black text-black mt-0.5">132 lbs (60 kg)</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
                <p className="font-bold text-slate-400 uppercase">Inclinación</p>
                <p className="font-black text-black mt-0.5">+5° / -15°</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-colors">
                <p className="font-bold text-slate-400 uppercase">Giro Horizontal</p>
                <p className="font-black text-black mt-0.5">180° Horizontal</p>
              </div>
            </div>

            {/* Opción Servicio Instalación */}
            <div
              onClick={() => setIncludeService(!includeService)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-md ${includeService ? 'border-[#fea619] bg-[#fea619]/10 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fea619] text-black rounded-lg flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">build</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-black">Instalación Profesional Expert</p>
                  <p className="text-xs text-[#855300] font-bold">Montaje + gestión oculta de cables</p>
                </div>
              </div>
              <span className="font-black text-sm text-black">+ $85.00</span>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-12 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shadow-md ${added ? 'bg-emerald-600 text-white' : 'bg-black text-white hover:bg-slate-800'}`}
              >
                <span className="material-symbols-outlined text-sm">{added ? 'check' : 'shopping_cart'}</span>
                <span>{added ? '¡Añadido al Carrito!' : 'Agregar al Carrito'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs de Detalle */}
        <section className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex gap-6 border-b border-slate-100 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`font-bold text-sm pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-black'}`}
            >
              Detalles del Producto
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`font-bold text-sm pb-2 border-b-2 transition-all cursor-pointer ${activeTab === 'specs' ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-black'}`}
            >
              Especificaciones Técnicas
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed animate-in fade-in duration-300">
              <p>
                El rack ProSeries Full Motion es el estándar de oro para instalaciones de pantallas grandes. Su diseño de doble brazo proporciona una estabilidad lateral sin igual mientras permite extender el TV hasta 24 pulgadas de la pared para una flexibilidad visual óptima.
              </p>
              <p>
                Diseñado pensando en los contratistas, incluye una placa de pared abierta para fácil paso de cables y tomas eléctricas.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs animate-in fade-in duration-300">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Rango de Extensión</span>
                <span className="font-bold text-black">2.8" - 24.2"</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Material</span>
                <span className="font-bold text-black">Acero Forjado Reforzado</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Accesorios Incluidos</span>
                <span className="font-bold text-black">Tornillería completa (Concreto/Madera)</span>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-black text-white py-8 border-t border-slate-800 mt-12 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CMA Hardware Store. Todos los derechos reservados.
      </footer>
    </div>
  );
}
