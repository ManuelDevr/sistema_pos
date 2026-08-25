import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function StoreIndex() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const slides = [
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo69GGCDxVufer3peu6jB1zQGfX3cZfHXc9HP_w6G4xdrOXK54W1YiLdV3gOeSWcYnY7KpT_cGwk6aapnd8pk-XyCpF2tQuKZw7OfkPloxTcbDeYb1N5I9acRJ03ihUAXP83_Iisr9LtoJhgxhC12OTvCCp7enDpamYzaHcDcDBkVnX0GRhPtlp7iWx_kwsUqb119jjcL4jIS2Y3XQmrAQcJB7IzOHFNV5bbbrTKCrUSckjHEUjfbIdHmyb5sr-cLw5oPttpB2-cI',
      tag: 'Servicios de Instalación Elite',
      title: 'Hardware de Precisión y Montaje Profesional de TV',
      desc: 'Desde herramientas estructurales de uso rudo hasta sistemas de racks profesionales, proporcionamos los componentes industriales y la instalación experta que su proyecto exige.',
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgEAMQoSvf7kM2gmjoSyFpUSuC_0b0C2KmGC9_9riq4gBbXlFKApkSw0KXeTytWgKoTnoRCAln1cA77vqTHljvRxAnnu2Df62oLYCqfBBEqApdI-IeVAjHVled9857LOiCunwWkPXaPIOdDP9GNhsbcmPgmfp8aelF3vli4D2Jn5Y2ZM9BioSSe0YMvh8U9qPBttAm8cR5StWmMC_KMRudsot3GaTWOVr3fAM_9ZnFI9Sl1-qPfiBrvn5JOae6kFRMMGoOe1khZzM',
      tag: 'Herramientas de Alto Rendimiento',
      title: 'Equipamiento Profesional para Contratistas',
      desc: 'Herramientas eléctricas e inalámbricas con tecnología de punta diseñadas para resistir los entornos de trabajo más exigentes.',
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-pfHKzTiL1tDakaBTagwr1NYxITB1nz9CzjvqvihjeJeyOtYP2oit7-BDlDUxnT25D0U8LauIvAij29c_IELwKWefpN6NQtVPIkw1jmviomkwFy8YQMPMdXl6jOazJmgeBGXBSo7cCaHCWNYO2Iuzfq-R8B46VLZDR6hel9cO2CergmN17vTsBFe9k0wrk9H8sufm28Zl7eBPDydz7Qt-rYpO2ytXUbrfdDZZQcJTPWQ_KIvOFXVVB6siBdUKxE9jl6_NloaI1Y',
      tag: 'Sistemas Industriales',
      title: 'Soportes de Nivel e Infraestructura Compleja',
      desc: 'Nivelación láser y estructuras avanzadas para instalaciones de video wall y despliegues comerciales en todo el país.',
    }
  ];

  const brands = [
    'STRUCTO_CORP', 'IRON_WORKS', 'PRECISION_IND', 'HARDWARE_LABS', 'MOUNT_PRO', 'TECH_BUILD',
    'CMA_TOOLS', 'PROSERIES_HARDWARE', 'STANLEY_PRO', 'BOSCH_HEAVY'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = route('store.catalog');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans selection:bg-[#fea619]/30">
      <Head title="CMA Store - Tienda Hardware & Racks">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes infiniteScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: infiniteScroll 25s linear infinite;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </Head>

      {/* Navbar Superior */}
      <header className="w-full sticky top-0 z-50 bg-[#f7f9fb]/95 backdrop-blur-md border-b border-[#c4c7c7] shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8">
            <Link href={route('store.index')} className="font-black text-xl text-black uppercase tracking-tight flex items-center gap-2 group shrink-0">
              <span className="bg-[#fea619] text-black px-2 py-0.5 rounded text-sm group-hover:scale-105 transition-transform">CMA</span> 
              <span className="group-hover:text-[#855300] transition-colors">STORE</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 font-semibold text-sm">
              <Link 
                href={route('store.index')} 
                className="text-black font-bold border-b-2 border-[#fea619] pb-1 transition-all"
              >
                Inicio
              </Link>

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

              <Link 
                href={route('store.detail')} 
                className="text-slate-600 hover:text-black hover:scale-105 transition-all"
              >
                Producto Destacado
              </Link>
            </nav>
          </div>

          {/* Buscador en el Navbar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs sm:max-w-md mx-2">
            <div className="flex items-center bg-white px-3.5 py-1.5 rounded-xl border border-slate-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 transition-all shadow-sm">
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

          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href={route('dashboard')} 
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span className="hidden sm:inline">Panel POS</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Carrusel Hero */}
        <section className="relative min-h-[600px] lg:min-h-[700px] bg-black overflow-hidden flex items-center">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out transform scale-105 hover:scale-100" style={{ backgroundImage: `url('${slide.image}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
            </div>
          ))}

          <div className="relative z-20 max-w-[1280px] mx-auto px-6 w-full py-16">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-[#fea619] text-black text-xs font-black rounded shadow-lg mb-6 uppercase tracking-widest animate-bounce">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {slides[currentSlide].tag}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-[1.1] text-white drop-shadow-md transition-all duration-700">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg text-slate-200 mb-8 max-w-xl leading-relaxed">
                {slides[currentSlide].desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={route('store.catalog')} 
                  className="h-13 px-8 bg-[#fea619] text-black font-extrabold text-sm rounded-xl flex items-center gap-2 hover:scale-105 hover:bg-[#ffb95f] active:scale-95 transition-all shadow-xl shadow-[#fea619]/20"
                >
                  Explorar Catálogo <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                </Link>
                <Link 
                  href={route('store.detail')} 
                  className="h-13 px-8 bg-white/10 backdrop-blur-xl border border-white/30 text-white font-extrabold text-sm rounded-xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  Ver Producto Destacado
                </Link>
              </div>
            </div>
          </div>

          {/* Indicadores de Carrusel */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentSlide ? 'w-12 bg-[#fea619]' : 'w-3 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </section>

        {/* SLIDER INFINITE LOOP de Marcas y Logos */}
        <section className="py-7 border-y border-slate-200 bg-white overflow-hidden shadow-inner">
          <div className="animate-infinite-scroll flex items-center gap-12 font-black text-slate-600 tracking-tighter uppercase italic text-lg select-none">
            {[...brands, ...brands].map((brand, i) => (
              <span 
                key={i} 
                className="hover:text-[#855300] hover:scale-110 transition-all cursor-pointer px-4 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#fea619]" />
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* Categorías Técnicas */}
        <section className="py-20 max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-black mb-2">Categorías Técnicas</h2>
              <p className="text-slate-500 max-w-xl">Inventario de grado profesional seleccionado por su integridad estructural y precisión técnica.</p>
            </div>
            <Link href={route('store.catalog')} className="text-[#855300] font-bold text-sm flex items-center gap-1 hover:translate-x-2 transition-transform">
              Ver Catálogo Completo <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Racks y Montaje', desc: 'Soluciones para pantallas de gran formato.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdnvgDl5Nme-Nh7xS8qQYbbXDkkwBfRKBgeNm8Rx0nlkn3RzV6J34YGWvSpgG2GCZGp9pRdRQUFhXjwbwUHMzMlEGrQgKnM6hgo0WRK0mE1o7d8ej2q6GOjbsipWvxmzfp3mf8Rq7oH0Pgddek4W_aBTFnfSpoxWHzgwC1TXaBvbF42HD877WIiuRsVa4cfwsUqzm7jCFllrbBQZOVLBG8Yc37Ecte4x5Qyesnf719hABW8-EsR5Zx7QHFyVCYv5UCh4eV3OUfJZ0' },
              { title: 'Herramientas', desc: 'Equipamiento eléctrico y manual.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgEAMQoSvf7kM2gmjoSyFpUSuC_0b0C2KmGC9_9riq4gBbXlFKApkSw0KXeTytWgKoTnoRCAln1cA77vqTHljvRxAnnu2Df62oLYCqfBBEqApdI-IeVAjHVled9857LOiCunwWkPXaPIOdDP9GNhsbcmPgmfp8aelF3vli4D2Jn5Y2ZM9BioSSe0YMvh8U9qPBttAm8cR5StWmMC_KMRudsot3GaTWOVr3fAM_9ZnFI9Sl1-qPfiBrvn5JOae6kFRMMGoOe1khZzM' },
              { title: 'Electricidad', desc: 'Cableado, cajas y componentes.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-pfHKzTiL1tDakaBTagwr1NYxITB1nz9CzjvqvihjeJeyOtYP2oit7-BDlDUxnT25D0U8LauIvAij29c_IELwKWefpN6NQtVPIkw1jmviomkwFy8YQMPMdXl6jOazJmgeBGXBSo7cCaHCWNYO2Iuzfq-R8B46VLZDR6hel9cO2CergmN17vTsBFe9k0wrk9H8sufm28Zl7eBPDydz7Qt-rYpO2ytXUbrfdDZZQcJTPWQ_KIvOFXVVB6siBdUKxE9jl6_NloaI1Y' },
              { title: 'Fontanería', desc: 'Fijaciones industriales y tuberías.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhC1xPxfGurvB829SiEw-gC-7Is7dEEX-SKbKWsRLuVR18IYEp-9k7i4lle4FdzVKznECYfoiy3XG9oBkWaPQnv1uj4K_pvavlibH3egzXTvT-7_uztrVzKBRGZgxThKUE1y8Isg3KzPKKG4bKOVv5C2qf2Cp1_UmJRS4eKL_ESTFLPMysFC4fHSwPsuwoERo8z6-YrpjmxYUE5AYlRkX-PgmjYPT5Rq7KC_v2GW0giEAa8Hle6hm19aaigKDmCW7cJIccScKE-pQ' },
            ].map((cat, idx) => (
              <Link 
                key={idx} 
                href={route('store.catalog')} 
                className="group relative h-80 overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" style={{ backgroundImage: `url('${cat.img}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#fea619] transition-colors">{cat.title}</h3>
                  <p className="text-slate-300 text-xs mb-3">{cat.desc}</p>
                  <span className="text-[#fea619] font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explorar <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Productos Destacados */}
        <section className="py-20 max-w-[1280px] mx-auto px-6 bg-white rounded-3xl my-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black">Más Vendidos / Favoritos</h2>
              <p className="text-slate-500 text-sm mt-1">Componentes comprobados por instaladores certificados.</p>
            </div>
            <Link href={route('store.catalog')} className="px-5 py-2.5 bg-black text-white font-bold text-xs rounded-xl hover:bg-[#fea619] hover:text-black hover:scale-105 active:scale-95 transition-all">
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Producto 1 */}
            <div className="group bg-[#f7f9fb] rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-64 p-6 relative overflow-hidden bg-white flex items-center justify-center">
                <img className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgEAMQoSvf7kM2gmjoSyFpUSuC_0b0C2KmGC9_9riq4gBbXlFKApkSw0KXeTytWgKoTnoRCAln1cA77vqTHljvRxAnnu2Df62oLYCqfBBEqApdI-IeVAjHVled9857LOiCunwWkPXaPIOdDP9GNhsbcmPgmfp8aelF3vli4D2Jn5Y2ZM9BioSSe0YMvh8U9qPBttAm8cR5StWmMC_KMRudsot3GaTWOVr3fAM_9ZnFI9Sl1-qPfiBrvn5JOae6kFRMMGoOe1khZzM" alt="Taladro" />
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">TOP VENTAS</span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#855300] mb-1">Industrial Power</span>
                <h4 className="font-bold text-base text-black mb-2 group-hover:text-[#855300] transition-colors">Taladro de Impacto Pro-Series 18V</h4>
                <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-slate-600">
                  <span className="material-symbols-outlined text-[#fea619] text-base">star</span>
                  <span>4.9 (124 reseñas)</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xl font-black text-black">$189.00</span>
                  <Link href={route('store.detail')} className="p-2.5 bg-black text-white rounded-xl hover:bg-[#fea619] hover:text-black hover:scale-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="group bg-[#f7f9fb] rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-64 p-6 relative overflow-hidden bg-white flex items-center justify-center">
                <img className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhC1xPxfGurvB829SiEw-gC-7Is7dEEX-SKbKWsRLuVR18IYEp-9k7i4lle4FdzVKznECYfoiy3XG9oBkWaPQnv1uj4K_pvavlibH3egzXTvT-7_uztrVzKBRGZgxThKUE1y8Isg3KzPKKG4bKOVv5C2qf2Cp1_UmJRS4eKL_ESTFLPMysFC4fHSwPsuwoERo8z6-YrpjmxYUE5AYlRkX-PgmjYPT5Rq7KC_v2GW0giEAa8Hle6hm19aaigKDmCW7cJIccScKE-pQ" alt="Llaves" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#855300] mb-1">Hand Tools</span>
                <h4 className="font-bold text-base text-black mb-2 group-hover:text-[#855300] transition-colors">Set de Llaves Master Torque</h4>
                <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-slate-600">
                  <span className="material-symbols-outlined text-[#fea619] text-base">star</span>
                  <span>4.8 (86 reseñas)</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xl font-black text-black">$124.50</span>
                  <Link href={route('store.detail')} className="p-2.5 bg-black text-white rounded-xl hover:bg-[#fea619] hover:text-black hover:scale-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Producto 3 */}
            <div className="group bg-[#f7f9fb] rounded-2xl border-2 border-[#fea619] overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-64 p-6 relative overflow-hidden bg-white flex items-center justify-center">
                <img className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVuto-JeT4T_xpuxryDMSkBzRKdvIb2itOcdqqalzmYlcukYx5_pxdsJDeLs3FwTkvboRjbbsk8BS3ySlUioye0ItnPq43CQ-GCiWOuBLJoysxycU1sj0u1aMF-Tj33m_NfzU5rr3O0c5J7C6hVKfoFsSLa3-gUfgNBAZmXXhEgmUojjE09YxewYNf83D8105ZACnUFF_0Pr3aMFbNAK1Oa95ctztwKKwhKwD9tH8TkpeDaiKVcKcGwedNKm1vLoTXLnmuxr4UZ_s" alt="Soporte Slim" />
                <span className="absolute top-3 right-3 bg-[#fea619] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">CON INSTALACIÓN</span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#855300] mb-1">AV Solutions</span>
                <h4 className="font-bold text-base text-black mb-2 group-hover:text-[#855300] transition-colors">Soporte Ultra-Slim Tilt (55"-85")</h4>
                <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-slate-600">
                  <span className="material-symbols-outlined text-[#fea619] text-base">star</span>
                  <span>5.0 (312 reseñas)</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xl font-black text-black">$79.99</span>
                  <Link href={route('store.detail')} className="p-2.5 bg-[#fea619] text-black font-bold rounded-xl hover:bg-black hover:text-white hover:scale-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Producto 4 */}
            <div className="group bg-[#f7f9fb] rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-64 p-6 relative overflow-hidden bg-white flex items-center justify-center">
                <img className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD-pfHKzTiL1tDakaBTagwr1NYxITB1nz9CzjvqvihjeJeyOtYP2oit7-BDlDUxnT25D0U8LauIvAij29c_IELwKWefpN6NQtVPIkw1jmviomkwFy8YQMPMdXl6jOazJmgeBGXBSo7cCaHCWNYO2Iuzfq-R8B46VLZDR6hel9cO2CergmN17vTsBFe9k0wrk9H8sufm28Zl7eBPDydz7Qt-rYpO2ytXUbrfdDZZQcJTPWQ_KIvOFXVVB6siBdUKxE9jl6_NloaI1Y" alt="Nivel Láser" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#855300] mb-1">Precision Gear</span>
                <h4 className="font-bold text-base text-black mb-2 group-hover:text-[#855300] transition-colors">Nivel Láser Green Beam 360°</h4>
                <div className="flex items-center gap-1 mb-4 text-xs font-semibold text-slate-600">
                  <span className="material-symbols-outlined text-[#fea619] text-base">star</span>
                  <span>4.7 (45 reseñas)</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xl font-black text-black">$215.00</span>
                  <Link href={route('store.detail')} className="p-2.5 bg-black text-white rounded-xl hover:bg-[#fea619] hover:text-black hover:scale-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Valor */}
        <section className="py-20 bg-[#1c1b1b] text-white my-12 rounded-3xl mx-6 p-8 sm:p-16 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">El Estándar CMA ProLink</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-base">
              Más allá del hardware, entregamos la confianza estructural y la experiencia técnica necesarias para instalaciones de alto nivel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#fea619] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">verified</span>
                <h3 className="text-lg font-bold mb-2">Calidad Certificada</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Cada artículo en nuestro inventario supera rigurosas pruebas de durabilidad industrial.</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#fea619] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">engineering</span>
                <h3 className="text-lg font-bold mb-2">Instalación Experta</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Técnicos certificados manejan montajes estructurales con precisión de plano arquitectónico.</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#fea619] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <span className="material-symbols-outlined text-4xl text-[#fea619] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform inline-block">support_agent</span>
                <h3 className="text-lg font-bold mb-2">Soporte Técnico 24/7</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Acceso directo a expertos que comprenden compatibilidad de hardware y códigos de seguridad.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <span className="font-black text-lg text-white uppercase tracking-wider block mb-3">CMA ProLink Store</span>
            <p className="text-slate-400 text-xs leading-relaxed">Hardware de precisión e instalación técnica garantizada para ferretería y contratistas.</p>
          </div>
          <div>
            <h5 className="font-bold uppercase text-xs text-[#fea619] mb-3">Navegación</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href={route('store.index')} className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href={route('store.catalog')} className="hover:text-white transition-colors">Productos (Racks & Ferretería)</Link></li>
              <li><Link href={route('store.detail')} className="hover:text-white transition-colors">Producto Destacado</Link></li>
              <li><Link href={route('dashboard')} className="hover:text-white transition-colors">Sistema POS</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase text-xs text-[#fea619] mb-3">Contacto</h5>
            <p className="text-xs text-slate-400">Ferretería CMA - Servicio de Atención y Montajes Especializados.</p>
          </div>
          <div>
            <h5 className="font-bold uppercase text-xs text-[#fea619] mb-3">Ubicación</h5>
            <p className="text-xs text-slate-400">Distrito Industrial - Nave Principal CMA</p>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 pt-8 mt-8 border-t border-white/10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} CMA Hardware & Installation Services. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
