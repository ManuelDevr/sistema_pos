import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Search, Plus, Trash2, Package, ChevronLeft, User, Phone, Mail, Home, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Create({ productos, lastNumber }) {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteRuc, setClienteRuc] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [tipoComprobante, setTipoComprobante] = useState('Boleta');
  const [observaciones, setObservaciones] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);

  const filteredProducts = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addItem = (producto) => {
    const exists = items.find(i => i.producto_id === producto.id);
    if (exists) {
      toast.error('Este producto ya está agregado');
      return;
    }
    setItems([...items, {
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      unidad_medida: producto.unidad_medida,
      cantidad: 1,
      precio_unitario: parseFloat(producto.precio_venta) || 0,
    }]);
    setSearchTerm('');
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totals = useMemo(() => {
    const sub = items.reduce((acc, i) => acc + (parseFloat(i.cantidad) || 0) * (parseFloat(i.precio_unitario) || 0), 0);
    const igv = sub * 0.18;
    return { subtotal: sub, igv, total: sub + igv };
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Agrega al menos un producto');
      return;
    }
    router.post(route('cotizaciones.store'), {
      cliente_nombre: clienteNombre,
      cliente_ruc: clienteRuc,
      cliente_direccion: clienteDireccion,
      cliente_email: clienteEmail,
      cliente_telefono: clienteTelefono,
      tipo_comprobante: tipoComprobante,
      observaciones: observaciones,
      items: items.map(i => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      })),
    }, {
      onSuccess: () => toast.success('Cotización creada'),
      onError: (err) => toast.error(Object.values(err).join(', ')),
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Nueva Cotización" />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.get(route('cotizaciones.index'))} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Nueva Cotización</h1>
            <p className="text-sm text-slate-500 font-medium">Crea un presupuesto para tu cliente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-800">Productos</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                {filteredProducts.map(p => (
                  <button type="button" key={p.id} onClick={() => addItem(p)} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-between">
                    <span>{p.nombre}</span>
                    <span className="text-xs font-mono text-slate-400">S/ {parseFloat(p.precio_venta).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="p-4">Producto</th>
                      <th className="p-4 text-center w-24">Cantidad</th>
                      <th className="p-4 text-right w-32">P. Unitario</th>
                      <th className="p-4 text-right w-32">Subtotal</th>
                      <th className="p-4 text-center w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                          <Package size={32} className="mx-auto text-slate-200 mb-2" />
                          Agrega productos desde la lista
                        </td>
                      </tr>
                    ) : items.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 text-sm">{item.producto_nombre}</td>
                        <td className="p-4">
                          <input type="number" step="0.01" min="0.01" value={item.cantidad} onChange={(e) => updateItem(i, 'cantidad', e.target.value)} className="w-20 px-2 py-1.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm text-center font-bold" />
                        </td>
                        <td className="p-4">
                          <input type="number" step="0.01" min="0" value={item.precio_unitario} onChange={(e) => updateItem(i, 'precio_unitario', e.target.value)} className="w-28 px-2 py-1.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm text-right font-bold" />
                        </td>
                        <td className="p-4 text-right font-bold text-slate-800">S/ {(parseFloat(item.cantidad) * parseFloat(item.precio_unitario)).toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button type="button" onClick={() => removeItem(i)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800">Datos del Cliente</h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Nombre del cliente" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">RUC/DNI</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <input type="text" value={clienteRuc} onChange={(e) => setClienteRuc(e.target.value.replace(/\D/g, ''))} maxLength="11" className="w-full pl-8 pr-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="RUC" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                    <input type="tel" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value.replace(/\D/g, ''))} maxLength="9" className="w-full pl-8 pr-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Teléfono" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Dirección</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" value={clienteDireccion} onChange={(e) => setClienteDireccion(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Dirección" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800">Resumen</h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tipo Comprobante</label>
                <select value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm font-bold">
                  <option>Boleta</option>
                  <option>Factura</option>
                </select>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">S/ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">IGV (18%)</span>
                  <span className="font-bold">S/ {totals.igv.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between">
                  <span className="font-black text-slate-800">Total</span>
                  <span className="font-black text-indigo-600 text-lg">S/ {totals.total.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Observaciones</label>
                <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm" placeholder="Notas adicionales..." />
              </div>
              <button type="submit" disabled={items.length === 0} className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 shadow-md">
                Guardar Cotización
              </button>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
