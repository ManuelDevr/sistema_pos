import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function StoreCatalog() {
  const [priceRange, setPriceRange] = useState(500);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: 1,
      name: 'PL-Motion X900',
      desc: 'Full Motion Dual Arm Mount (55-85")',
      price: '$249.99',
      tag: 'VESA Compatible',
      service: true,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9ObxIs7AdZCUtaooVBSoLljr2tRrxJklUXRxQBElKLaTx_SrH7ZRn7ybqPVXKY_mr2D7HD9JJkUSlNY2Pz5PoawCnqkh6jzSPEDk-VCN25T4VOkYyw1DzcoXRMOR4Yyzg6oa5OpV6co2THoNMLlvnEUjfZuW4NUq3CpdunYTxikXJlThEByxwyeJfN-NMfq8eE4hwIInzd_rRKDn021g1Ux-QpJx1Psywz3WV0MS6icScO1F9eqrEgRR_RHk-u75wbT4YWOyYaBw'
    },
    {
      id: 2,
      name: 'Ultra-Slim Fixed',
      desc: 'Professional Grade Fixed Mount (32-55")',
      price: '$89.00',
      tag: 'Low Profile',
      service: false,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgnvWwG0ql1cr9imkhTM0tqYbrvGCPv6GcjYMOpEvMlxupb00r3T2gWOXbW6CqzdroQNfN-RQteaxOLycR1RCCltg_g1KtC4urayGeHILtqQ15wtiCFHRH6KsUoMw_eo7JW6FWqOheyyhM0VW9bRftem_jBoN5Cp_j-fAvgCY9x29EEu0x4DPXqoQg4u3CrlU7JVPE89kSzXosaD7zAObSPCP98T3dVaysF257WKSNtkTwav6YR62Ye4h7xiQ0Z62bkG_azzid6Aw'
    },
    {
      id: 3,
      name: 'Pro-Ceiling Articulate',
      desc: 'Telescopic Ceiling Mount (40-75")',
      price: '$315.50',
      tag: 'Commercial',
      service: true,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUpyVtrqfrI1q_82RIoFoh9Jev_B-B_RfVGEJx0nKe9c2pQBKkWso8Df-A_YMNRuVl4XIZMlkssEUcx-97YVFk9E67i9ZmE7KvZD40iR9B3G64vNk-Pknx7Y3c6o3mICUCrb1YOtBNs327x2SO100llai31Oh_fuwnT-q6jY9oPy4na3bkLeXRb6cuB4pNyWtxFecFphYyUkohK5_h-or9asrfdaHXgSiJ7Dsdv38iBKk1ZjcjAUtWox0SWyz2QuqmAE3Yb7un8I'
    },
    {
      id: 4,
      name: 'TiltMaster Pro',
      desc: 'Precision Tilt Wall Mount (50-80")',
      price: '$124.95',
      tag: 'Tool-Less Adjustment',
      service: false,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZOH3cuk_N7rXnQpqHZaJSGPlMzcV5_PTdke56m11cDiYOxtdQPsZCOiJ5U5nwoZUQJI1ho-k57jA_LMowU1vMlefjyYOa2Ek9iYC7YdkYg-Mf8lXHSgFNFDwcopTByKi-3U3Wn9vcPHaT9sCA8upltVzf-A2F1-dJx_PzIxnxID8l8Q2hEUoU0JQBJY-EDjFfWGbwgKMPi2L_GmOGpE2A9-2kdmr68cmlw_SiQy7O-_tkAg5L6epZlCKj03EiTSSy1K_UjVTSZbk'
    },
    {
      id: 5,
      name: 'StackVertical Pro',
      desc: 'Dual Vertical Display Rack',
      price: '$412.00',
      tag: 'Dual Screen',
      service: false,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE-JSwANeWYcXUUvYWBscVRzf5CfsAXfOQ_Q4gxz6LGQS6iG_xwR3go2uOPDZvLHRYNWgyPFSXJ3O2Hrc6slppFkzu9tL9sLPUZBha59HLqyN1isOn-6TxkhHqEImyYrWYT_S_xrO5TodTNW63L6iV8-JkQ9VC7YFyE0vd9UCIWrlC_BgOJhsHehmNLqhPbJ3WP1tUIeS1ZcVh7ZI8TkLURon16tEhBfBTcK-mljXk1WDlDgYZtV6LRbtyqPPoJpuQK8v_Evk06ng'
    },
    {
      id: 6,
      name: 'MotoLink Apex',
      desc: 'Motorized Full-Motion (Up to 90")',
      price: '$799.00',
      tag: 'Motorized',
      service: true,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAQcnezVL1CyGqUIqr8DaWiqpv9w3F_JHm68ACHtQVZm1-ZwApNAxrgnRtAkLTSGWy2oJ5o9gc7ysct-tsRHspMy5kb70AzoPcp6Kik8Ai9gUU5mQXwA_xDlGvQGvQD_8titrxHGKUdssQn9il6uzGtvtUcA_4kRv0C0BWcN-M6RwQJIfxuGlPgMixE9sDVOhZuU5zoprY8KcfC_7eQmNBOLfI-PFNKGQg7LzJC__gklamBEojBAh97l6X04EaTzXHcHYUI2_4KaY'
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col selection:bg-[#fea619]/30">
      <Head title="Catálogo de Productos - CMA Store">
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
                  className="text-black font-bold border-b-2 border-[#fea619] pb-1 flex items-center gap-1 transition-all"
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

              <Link href={route('store.detail')} className="text-slate-600 hover:text-black hover:scale-105 transition-all">Producto Destacado</Link>
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
        {/* Banner Promocional */}
        <section className="mb-10 relative overflow-hidden rounded-2xl bg-[#1c1b1b] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="z-10 text-center md:text-left">
            <span className="inline-block bg-[#fea619] text-black px-3 py-1 rounded text-xs font-black uppercase mb-3 animate-pulse">Oferta por tiempo limitado</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3">¡Instalación Profesional Incluida en Racks Seleccionados!</h1>
            <p className="text-slate-300 text-sm max-w-xl">Recibe montaje técnico especializado de nuestro equipo certificado ProLink al comprar cualquier soporte resistente.</p>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filtros */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Tamaño de Pantalla</h3>
                <div className="space-y-2 text-sm font-medium">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" />
                    <span>32-55" Display</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" defaultChecked />
                    <span>55-85" Display</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" />
                    <span>85"+ Ultra Large</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Tipo de Soporte</h3>
                <div className="space-y-2 text-sm font-medium">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" />
                    <span>Fijo (Fixed)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" defaultChecked />
                    <span>Inclinable (Tilt)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-black transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-black focus:ring-black" defaultChecked />
                    <span>Movimiento Completo</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Precio Máximo</h3>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-xs font-bold text-slate-500 mt-1">
                  <span>$50</span>
                  <span className="text-black font-extrabold">${priceRange}</span>
                </div>
              </div>

              <button
                onClick={() => setPriceRange(500)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* Grid Productos */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-500">Mostrando 6 Soluciones de Racks</span>
              <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none hover:border-slate-400 transition-colors">
                <option>Destacados</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative aspect-square p-6 bg-slate-50 overflow-hidden flex items-center justify-center">
                    <img className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src={item.img} alt={item.name} />
                    <span className="absolute top-3 right-[#fea619]/20 top-3 right-3 bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase">{item.tag}</span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    {item.service && (
                      <span className="inline-block bg-[#fea619]/20 text-[#855300] text-[10px] font-extrabold px-2 py-0.5 rounded w-max mb-2">
                        Instalación Incluida
                      </span>
                    )}
                    <h4 className="font-extrabold text-lg text-black mb-1 group-hover:text-[#855300] transition-colors">{item.name}</h4>
                    <p className="text-xs text-slate-500 mb-4">{item.desc}</p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xl font-black text-black">{item.price}</span>
                      <Link
                        href={route('store.detail')}
                        className="px-4 py-2 bg-black text-white font-bold text-xs rounded-xl hover:bg-[#fea619] hover:text-black hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Ver Detalle</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black text-white py-8 border-t border-slate-800 mt-12 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CMA Hardware Store. Todos los derechos reservados.
      </footer>
    </div>
  );
}
