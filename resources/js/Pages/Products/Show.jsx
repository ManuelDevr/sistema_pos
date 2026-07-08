import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ShoppingCart, Package, Image as ImageIcon, Info, CheckCircle2, AlertTriangle, XCircle, Tag, Ruler, Archive, Layers, Bookmark } from 'lucide-react';
import ProductCard from '@/Components/Products/ProductCard';
import { useCartStore } from '@/Hooks/useCartStore';
import toast from 'react-hot-toast';

const getStockStatus = (stock, stockMinimo) => {
  if (stock <= 0) return { label: 'Agotado', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: XCircle };
  if (stock <= stockMinimo) return { label: 'Stock Bajo', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: AlertTriangle };
  return { label: 'En Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 };
};

export default function Show({ producto, similares }) {
  const { addToCart, items } = useCartStore();
  
  // State for selected unit presentation
  const [selectedUnit, setSelectedUnit] = useState({
      label: producto.unidad_medida,
      precio: producto.precio_venta,
      factor: 1, // Factor de la unidad base es siempre 1
      conversion_id: null
  });

  // Calcular stock disponible para la unidad seleccionada
  const getAvailableStock = (factor) => Math.floor(producto.stock / parseFloat(factor));
  
  // Stock real disponible considerando ya en el carrito
  const totalPhysicalInCart = items.reduce((total, item) => {
      if (item.id === producto.id) {
          return total + (item.quantity * item.factor);
      }
      return total;
  }, 0);
  
  const availableStock = Math.floor((producto.stock - totalPhysicalInCart) / selectedUnit.factor);

  const status = getStockStatus(producto.stock, producto.stock_minimo);

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    
    // Pasamos el producto y la información de la unidad seleccionada
    const unitData = selectedUnit.conversion_id ? {
        id: selectedUnit.conversion_id,
        unidad_id: selectedUnit.label, // Simplificado, mejor enviar el objeto conversión
        precio_venta: selectedUnit.precio,
        unidad: { nombre: selectedUnit.label },
        factor: selectedUnit.factor
    } : null;

    addToCart(producto, unitData);
    toast.success(`${producto.nombre} (${selectedUnit.label}) añadido al carrito`);
  };

  return (
    <AuthenticatedLayout>
      <Head title={producto.nombre} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs / Back Button */}
        <div>
          <Link 
            href={route('catalogo-productos')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-200 shadow-sm">
                <ChevronLeft size={16} />
            </div>
            Volver al Catálogo
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="bg-slate-50 flex items-center justify-center p-12 border-r border-slate-100 relative">
            {producto.imagen_url ? (
              <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full max-h-[400px] object-contain" />
            ) : (
              <ImageIcon size={200} className="text-slate-200" />
            )}
            <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border flex items-center gap-2 ${status.color}`}>
                <status.icon size={14} />
                {status.label}
            </div>
          </div>

          {/* Details Side */}
          <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <Layers size={12} />
                    {producto.categoria?.nombre || 'General'}
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-800 leading-tight">
                    {producto.nombre}
                </h1>

                {/* Brand & Stock Section - REVERTED TO BASE STOCK */}
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                        <Bookmark size={16} className="text-indigo-500" />
                        Marca: <span className="text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{producto.marca?.nombre || 'Sin Marca'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                        <Package size={16} className="text-emerald-500" />
                        Stock Base: <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">{producto.stock} {producto.unidad_medida}</span>
                    </div>
                </div>
            </div>

            {/* Selector de Unidades */}
            <div className="space-y-3 pt-4">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">Unidad de medida: <span className="text-indigo-600">{selectedUnit.label}</span></p>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSelectedUnit({ label: producto.unidad_medida, precio: producto.precio_venta, factor: 1, conversion_id: null })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedUnit.label === producto.unidad_medida ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'}`}
                    >
                        {producto.unidad_medida}
                    </button>
                    {producto.conversiones.map(conv => {
                        const available = getAvailableStock(conv.factor);
                        const isOutOfStock = available <= 0;

                        return (
                            <button 
                                key={conv.id}
                                disabled={isOutOfStock}
                                onClick={() => setSelectedUnit({ label: conv.unidad.nombre, precio: conv.precio_venta, factor: conv.factor, conversion_id: conv.id })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-100' : (selectedUnit.label === conv.unidad.nombre ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200')}`}
                            >
                                {conv.unidad.nombre} {isOutOfStock && '(Agotado)'}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Precio de Venta</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-indigo-600">S/ {parseFloat(selectedUnit.precio).toFixed(2)}</span>
                    <span className="text-sm text-slate-400 font-bold uppercase">Incl. IGV</span>
                </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={handleAddToCart}
                disabled={availableStock <= 0}
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
              >
                <ShoppingCart size={20} />
                {availableStock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
              </button>
            </div>
          </div>
        </div>



        {/* Description Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-10 shadow-sm">
            <h3 className="flex items-center gap-3 text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">
                <Info className="text-indigo-600" />
                Descripción del Producto
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {producto.descripcion || 'Este producto no cuenta con una descripción detallada.'}
            </p>
        </div>

        {/* Similar Products */}
        {similares.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-tight">Productos que podrían interesarte</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similares.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={() => { addToCart(p); toast.success('Añadido'); }}
                  onView={() => router.get(route('productos.show', p.id))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
