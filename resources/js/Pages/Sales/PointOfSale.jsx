import React, { useState, useMemo, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Search, Plus, Minus, X, Trash2, User, ShoppingCart, DollarSign, CreditCard, CheckCircle, Package, ArrowRight, LayoutGrid, List, ScanLine, Scale, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Ticket from '@/Components/Sales/Ticket';
import toast from 'react-hot-toast';
import CommonModal from '@/Components/CommonModal';
import ClientForm from '@/Components/Clients/ClientForm';
import { useCartStore } from '@/Hooks/useCartStore';

export default function PointOfSale({ productos }) {
  const { auth } = usePage().props;
  
  const { items: cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotal: cartTotal } = useCartStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientResults, setClientResults] = useState([]);
  const [isSearchingClients, setIsSearchingClients] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paidWith, setPaidWith] = useState('');
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');

  // Estado para selección de unidad
  const [isUnitModalOpen, setUnitModalOpen] = useState(false);
  const [productForUnits, setProductForUnits] = useState(null);

  // Estados y lógica para el ticket de venta
  const { flash } = usePage().props;
  const [completedSale, setCompletedSale] = useState(null);
  const [tempSaleInfo, setTempSaleInfo] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const ticketRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `venta-${completedSale?.nro_comprobante || 'ticket'}`,
  });

  useEffect(() => {
    if (flash?.last_sale) {
      setCompletedSale({
        ...flash.last_sale,
        pagado_con: tempSaleInfo?.paidWith,
        vuelto: tempSaleInfo?.change,
        metodo_pago: tempSaleInfo?.paymentMethod || flash.last_sale.metodo_pago
      });
      setSuccessModalOpen(true);
    }
  }, [flash, tempSaleInfo]);

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    setCompletedSale(null);
    setTempSaleInfo(null);
  };

  // Lógica del Escáner de Código de Barras
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const currentTime = Date.now();
        if (currentTime - lastKeyTime.current > 50) {
            barcodeBuffer.current = '';
        }
        lastKeyTime.current = currentTime;

        if (e.key === 'Enter') {
            if (barcodeBuffer.current.length > 3) {
                processBarcode(barcodeBuffer.current);
                barcodeBuffer.current = '';
                e.preventDefault();
            }
        } else if (e.key.length === 1) {
            barcodeBuffer.current += e.key;
        }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [productos, cart]);

  const processBarcode = (code, showToastOnError = true) => {
    // Buscar en productos base
    let product = productos.find(p => p.codigo_barras === code || p.sku === code);
    if (product) {
        // Si tiene conversiones, pasamos un objeto temporal de unidad base para saltar el modal
        const baseUnit = product.conversiones && product.conversiones.length > 0
            ? { isBase: true, unidad: { nombre: product.unidad_medida }, precio_venta: product.precio_venta, factor: 1 }
            : null;
        handleAddToCart(product, baseUnit);
        return true;
    }

    // Buscar en conversiones
    for (const p of productos) {
        const conv = p.conversiones.find(c => c.codigo_barras === code);
        if (conv) {
            handleAddToCart(p, conv);
            return true;
        }
    }

    if (showToastOnError) {
        toast.error(`Código no encontrado: ${code}`);
    }
    return false;
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productos.slice(0, 12);
    const search = searchTerm.toLowerCase();
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(search) || 
      (p.sku && p.sku.toLowerCase().includes(search)) ||
      (p.codigo_barras && p.codigo_barras.includes(search))
    ).slice(0, 12);
  }, [productos, searchTerm]);

  // Búsqueda AJAX de clientes con debounce de 300ms
  useEffect(() => {
    if (!customerSearch.trim()) {
      setClientResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingClients(true);
      try {
        const res = await fetch(`/clientes/search?q=${encodeURIComponent(customerSearch)}`);
        const data = await res.json();
        setClientResults(data);
      } catch {
        setClientResults([]);
      } finally {
        setIsSearchingClients(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const handleAddToCart = (product, unit = null) => {
    // Si no se pasó unidad y el producto tiene varias, abrir modal (solo si no es escaneo directo)
    if (!unit && product.conversiones && product.conversiones.length > 0) {
        setProductForUnits(product);
        setUnitModalOpen(true);
        return;
    }

    const factor = unit ? parseFloat(unit.factor) : 1;
    const requestedQty = 1; // Intentamos añadir 1 unidad de esta presentación
    const physicalUnitsRequested = requestedQty * factor;

    // Calcular cuántas unidades físicas totales del producto base ya están en el carrito
    const totalPhysicalInCart = cart.reduce((total, item) => {
        if (item.id === product.id) {
            // Factor es 1 para unidad base, o el valor de conversión
            const itemFactor = item.factor || 1;
            return total + (item.quantity * itemFactor);
        }
        return total;
    }, 0);

    // Calcular stock necesario total si añadimos esta presentación
    const totalNeeded = totalPhysicalInCart + physicalUnitsRequested;

    if (product.stock < totalNeeded) {
      toast.error(`Stock insuficiente. Solo quedan ${product.stock} ${product.unidad_medida} en total.`);
      return;
    }

    addToCart(product, unit);
    
    // Obtener nombre de unidad para el toast
    const unitName = unit ? (unit.unidad ? unit.unidad.nombre : 'Presentación') : product.unidad_medida;
    toast.success(`${product.nombre} (${unitName}) añadido`);
    setUnitModalOpen(false);
  };

  const change = useMemo(() => {
    const paid = parseFloat(paidWith) || 0;
    const total = cartTotal();
    return Math.max(0, paid - total);
  }, [paidWith, cartTotal]);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    const total = cartTotal();
    if (paymentMethod === 'Efectivo' && (parseFloat(paidWith) || 0) < total) {
        toast.error('Monto insuficiente');
        return;
    }

    // Guardar temporalmente los datos del pago ingresados por el cajero para el ticket impreso
    setTempSaleInfo({
        paidWith: paymentMethod === 'Efectivo' ? (parseFloat(paidWith) || total) : total,
        change: paymentMethod === 'Efectivo' ? change : 0,
        paymentMethod: paymentMethod
    });

    router.post(route('ventas.store'), {
        total: total,
        metodo_pago: paymentMethod,
        cliente_id: selectedClient?.id || null,
        items: cart.map(item => ({
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.precio,
            unidad_id: item.unit_id,
            conversion_id: item.conversion_id
        }))
    }, {
        onSuccess: () => {
            toast.success('¡Venta realizada!');
            clearCart();
            setSelectedClient(null);
            setCustomerSearch('');
            setPaidWith('');
            setActiveTab('catalog');
        },
        onError: (err) => {
            toast.error(err.error || 'Error al procesar la venta');
        }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Venta Rápida" />

      {/* Selector de Pestañas para Móviles */}
      <div className="flex lg:hidden bg-white p-1 rounded-2xl mb-4 border border-slate-200 shadow-sm">
        <button 
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
        >
            <LayoutGrid size={16} />
            Catálogo
        </button>
        <button 
            onClick={() => setActiveTab('cart')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'cart' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
        >
            <ShoppingCart size={16} />
            Carrito ({cart.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-140px)]">
        
        {/* Catálogo de Productos */}
        <div className={`lg:col-span-2 flex flex-col space-y-4 ${activeTab !== 'catalog' && 'hidden lg:flex'}`}>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar producto o escanear código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchTerm.trim().length > 3) {
                    const found = processBarcode(searchTerm.trim(), false);
                    if (found) {
                      setSearchTerm('');
                      e.preventDefault();
                    }
                  }
                }}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:border-indigo-500 focus:ring-0 rounded-xl text-slate-800"
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <ScanLine size={18} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Escáner Activo</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <button 
                    key={product.id} 
                    onClick={() => handleAddToCart(product)}
                    className="group bg-white p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col h-full"
                >
                  <div className="relative aspect-square rounded-xl bg-slate-50 overflow-hidden mb-3">
                    <Package size={40} className="w-full h-full p-8 text-slate-200" />
                    {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Agotado</span>
                        </div>
                    )}
                    {product.conversiones?.length > 0 && (
                        <div className="absolute top-2 left-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
                            <Scale size={14} />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg">
                            <Plus size={14} />
                        </div>
                    </div>
                  </div>
                  <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{product.marca?.nombre || 'General'}</p>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{product.nombre}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                    <span className="text-lg font-black text-indigo-600">S/ {parseFloat(product.precio_venta).toFixed(2)}</span>
                    <div className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Stock: {product.stock}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel del Carrito */}
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden border-t-4 border-t-indigo-600 ${activeTab !== 'cart' && 'hidden lg:flex'}`}>
          
          {/* Header del Carrito: Cliente */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cliente</span>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={selectedClient ? selectedClient.nombre : "Buscar cliente..."}
                        value={customerSearch}
                        onChange={e => { setCustomerSearch(e.target.value); }}
                        className="w-full pl-3 pr-10 py-2 bg-white border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm font-medium"
                    />
                    <button 
                        onClick={() => setClientModalOpen(true)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                
                {(clientResults.length > 0 || isSearchingClients) && customerSearch.trim() && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                        {isSearchingClients ? (
                            <div className="px-4 py-3 text-sm text-slate-400 text-center">Buscando...</div>
                        ) : (
                            clientResults.map(c => (
                                <button 
                                    key={c.id} 
                                    onClick={() => { setSelectedClient(c); setCustomerSearch(c.nombre); setClientResults([]); }}
                                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-slate-50 last:border-0 transition-colors"
                                >
                                    <p className="font-bold text-slate-800 text-sm">{c.nombre}</p>
                                    <p className="text-xs text-slate-400">{c.ruc_dni || 'Sin DNI'}</p>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 grayscale py-10">
                    <ShoppingCart size={48} className="text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-400">Carrito Vacío</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={`${item.id}-${item.conversion_id}`} className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-200">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            <Package className="w-full h-full p-2 text-slate-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">{item.nombre}</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-indigo-600">S/ {item.precio.toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 px-1.5 rounded">{item.unit_name}</span>
                            </div>
                        </div>
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, item.conversion_id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600"><Minus size={12} /></button>
                            <span className="w-8 text-center text-sm font-black text-slate-700">{item.quantity}</span>
                            <button 
                                onClick={() => {
                                    // Buscamos el producto en la lista de productos disponibles para tener el stock real
                                    const product = productos.find(p => p.id === item.id);
                                    if (!product) return;

                                    // Calcular unidades físicas de otros items en el carrito
                                    const otherItemsPhysical = cart.reduce((total, cartItem) => {
                                        if (cartItem.id === product.id && (cartItem.conversion_id !== item.conversion_id)) {
                                            return total + (cartItem.quantity * cartItem.factor);
                                        }
                                        return total;
                                    }, 0);

                                    // Calcular nuevas unidades físicas incluyendo el incremento
                                    const nextQty = item.quantity + 1;
                                    const newTotalPhysical = otherItemsPhysical + (nextQty * item.factor);

                                    if (product.stock < newTotalPhysical) {
                                        toast.error(`Stock insuficiente. Solo quedan ${product.stock} ${product.unidad_medida} en total.`);
                                        return;
                                    }
                                    updateQuantity(item.id, item.conversion_id, nextQty);
                                }} 
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.conversion_id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                ))
            )}
          </div>

          {/* Footer del Carrito: Totales y Pago */}
          <div className="p-5 bg-white border-t border-slate-100 space-y-4 mt-auto shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total a Pagar</span>
                <span className="text-3xl font-black text-indigo-600">S/ {cartTotal().toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Método</label>
                    <div className="relative text-slate-800">
                        <select 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-xs font-bold text-slate-700 appearance-none shadow-sm"
                        >
                            <option>Efectivo</option>
                            <option>Yape</option>
                            <option>BCP</option>
                            <option>Plin</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ArrowRight size={12} className="rotate-90" /></div>
                    </div>
                </div>

                {paymentMethod === 'Efectivo' && (
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Paga con</label>
                        <input 
                            type="number" 
                            placeholder="0.00"
                            value={paidWith}
                            onChange={e => setPaidWith(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-xs font-bold text-slate-800 shadow-sm"
                        />
                    </div>
                )}
            </div>

            {paymentMethod === 'Efectivo' && paidWith > 0 && (
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Su Vuelto</span>
                    <span className="text-xl font-black text-emerald-700">S/ {change.toFixed(2)}</span>
                </div>
            )}

            <div className="flex gap-2 pt-2">
                <button 
                    onClick={clearCart}
                    className="w-12 h-12 bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl flex items-center justify-center transition-all active:scale-95"
                    title="Vaciar Carrito"
                >
                    <Trash2 size={18} />
                </button>
                <button 
                    onClick={handlePlaceOrder}
                    disabled={cart.length === 0}
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {cart.length === 0 ? 'Carrito Vacío' : (
                        <>
                            <CheckCircle size={18} />
                            Finalizar Venta
                        </>
                    )}
                </button>
            </div>
          </div>
        </div>
      </div>

      <CommonModal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)} title="Nuevo Cliente">
        <ClientForm onClose={() => setClientModalOpen(false)} />
      </CommonModal>

      {/* Modal de Selección de Unidad */}
      <CommonModal 
        isOpen={isUnitModalOpen} 
        onClose={() => setUnitModalOpen(false)} 
        title="Seleccionar Presentación"
      >
        <div className="space-y-4">
            <p className="text-sm font-medium text-slate-600 mb-4">Elige cómo deseas vender este producto:</p>
            
            {/* Opción Unidad Base */}
            <button 
                onClick={() => handleAddToCart(productForUnits, { isBase: true, unidad: { nombre: productForUnits.unidad_medida }, precio_venta: productForUnits.precio_venta, factor: 1 })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-indigo-600">
                        <Package size={20} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800">{productForUnits?.unidad_medida}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Unidad Base</p>
                    </div>
                </div>
                <span className="text-lg font-black text-indigo-600">S/ {parseFloat(productForUnits?.precio_venta || 0).toFixed(2)}</span>
            </button>

            {/* Opciones Equivalentes */}
            {productForUnits?.conversiones.map(conv => (
                <button 
                    key={conv.id}
                    onClick={() => handleAddToCart(productForUnits, conv)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-indigo-600">
                            <Scale size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-800">{conv.unidad.nombre}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Equivale a {parseFloat(conv.factor)} {productForUnits?.unidad_medida}</p>
                        </div>
                    </div>
                    <span className="text-lg font-black text-indigo-600">S/ {parseFloat(conv.precio_venta).toFixed(2)}</span>
                </button>
            ))}

            <button 
                onClick={() => setUnitModalOpen(false)}
                className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
                Cancelar
            </button>
        </div>
      </CommonModal>

      {/* Modal de Éxito / Venta Completada */}
      <CommonModal 
        isOpen={isSuccessModalOpen} 
        onClose={handleCloseSuccessModal} 
        title="¡Venta Completada con Éxito!"
      >
        <div className="flex flex-col items-center text-center p-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
            <h3 className="text-lg font-black text-slate-800 mb-1">
                Comprobante: {completedSale?.nro_comprobante}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
                La venta ha sido registrada correctamente. El stock y el Kardex permanente han sido actualizados.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                    onClick={handlePrint}
                    className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
                >
                    <Printer size={16} />
                    Imprimir Ticket
                </button>
                <button
                    onClick={handleCloseSuccessModal}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                    Nueva Venta
                </button>
            </div>
        </div>
      </CommonModal>

      {/* Ticket Oculto para Impresión */}
      <div className="hidden">
        <Ticket ref={ticketRef} sale={completedSale} />
      </div>
    </AuthenticatedLayout>
  );
}
