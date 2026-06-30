import React, { useState, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Search, Edit, Filter, FileDown, ToggleLeft, ToggleRight, Scale, Plus, Package, AlertTriangle, CheckCircle, XCircle, Barcode, X } from 'lucide-react';
import CommonModal from '@/Components/CommonModal';
import ProductForm from '@/Components/Products/ProductForm';
import ProductUnitManager from '@/Components/Products/ProductUnitManager';
import Pagination from '@/Components/Pagination';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import { generateProfessionalPDF } from '@/Utils/pdfGenerator';

const getStatusInfo = (stock, stockMinimo) => {
  if (stock <= 0) return { text: 'Agotado', color: 'text-red-600 bg-red-50 border-red-100', icon: XCircle };
  if (stock <= stockMinimo) return { text: 'Stock Bajo', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: AlertTriangle };
  return { text: 'En Stock', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle };
};

const ProductRow = React.memo(({ product, onEdit, onToggleStatus, onOpenUnits, onPrintLabel, isAdmin }) => {
  const status = getStatusInfo(product.stock, product.stock_minimo);
  const isActive = product.estado === 'Activo';
  const Icon = status.icon;

  return (
    <tr className={`hover:bg-slate-50/50 transition-colors ${!isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <td className="p-4 whitespace-nowrap">
        <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-500">{product.sku || '---'}</span>
            {product.codigo_barras && <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">{product.codigo_barras}</span>}
        </div>
      </td>
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Package size={20} />
          </div>
          <div className="max-w-[250px]">
            <div className={`font-bold text-slate-800 truncate ${!isActive ? 'line-through' : ''}`} title={product.nombre}>{product.nombre}</div>
            <div className="text-xs text-slate-500 truncate">{product.marca?.nombre || 'Sin Marca'}</div>
          </div>
        </div>
      </td>
      <td className="p-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          {product.categoria?.nombre || 'General'}
        </span>
      </td>
      <td className="p-4 whitespace-nowrap text-center">
        <div className="flex flex-col items-center">
            <span className="font-bold text-slate-900">{product.stock}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">{product.unidad_medida}</span>
        </div>
      </td>
      <td className="p-4 whitespace-nowrap text-right">
        <div className="font-bold text-slate-900">S/ {parseFloat(product.precio_venta).toFixed(2)}</div>
        {product.tasa_descuento > 0 && (
            <div className="text-[10px] text-red-500 font-bold">-{product.tasa_descuento}% OFF</div>
        )}
      </td>
      <td className="p-4 whitespace-nowrap text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
          <Icon size={12} />
          {status.text}
        </div>
      </td>
      <td className="p-4 whitespace-nowrap">
        <div className="flex gap-2 justify-center">
          <button onClick={() => onPrintLabel(product)} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Imprimir Etiqueta"><Barcode size={16} /></button>
          <button onClick={() => onOpenUnits(product)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Conversiones"><Scale size={16} /></button>
          <button onClick={() => onEdit(product)} className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Editar"><Edit size={16} /></button>
          {isAdmin && (
            <button 
                onClick={() => onToggleStatus(product)} 
                className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} 
                title={isActive ? 'Desactivar' : 'Activar'}
            >
                {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

export default function Index({ productos, categorias, marcas }) {
  const { auth, config } = usePage().props;
  const isAdmin = auth.user.rol === 'Administrador';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL', 'LOW', 'EMPTY'
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUnitModalOpen, setUnitModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductForUnits, setSelectedProductForUnits] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (p.codigo_barras && p.codigo_barras.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || p.categoria_id === parseInt(selectedCategory);
      const matchesStatus = showInactive ? true : p.estado === 'Activo';
      
      let matchesStock = true;
      if (stockFilter === 'LOW') matchesStock = p.stock <= p.stock_minimo && p.stock > 0;
      if (stockFilter === 'EMPTY') matchesStock = p.stock <= 0;

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }, [productos, searchTerm, selectedCategory, showInactive, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const currentProducts = useMemo(() => 
    filteredProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filteredProducts, currentPage, rowsPerPage]
  );

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleOpenUnits = (product) => {
    setSelectedProductForUnits(product);
    setUnitModalOpen(true);
  };

  const handleToggleStatus = (product) => {
    router.patch(route('productos.toggle', product.id), {}, {
        onSuccess: () => toast.success('Estado actualizado')
    });
  };

  const handlePrintLabel = (product) => {
    if (!product.codigo_barras) {
        toast.error('Este producto no tiene código de barras');
        return;
    }

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [50, 30]
    });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(product.nombre.substring(0, 30), 25, 5, { align: 'center' });

    const canvas = document.createElement('canvas');
    try {
        JsBarcode(canvas, product.codigo_barras, {
            format: product.codigo_barras.length === 13 ? "EAN13" : "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 14
        });
    } catch (e) {
        JsBarcode(canvas, product.codigo_barras, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 14
        });
    }

    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 5, 7, 40, 18);
    doc.setFontSize(6);
    doc.text(`S/ ${parseFloat(product.precio_venta).toFixed(2)}`, 25, 28, { align: 'center' });
    window.open(doc.output('bloburl'), '_blank');
  };

  const exportToPDF = () => {
    let categoryName = 'General';
    if (selectedCategory) {
        categorias.forEach(cat => {
            if (cat.id === parseInt(selectedCategory)) {
                categoryName = cat.nombre;
            } else {
                const sub = cat.children.find(s => s.id === parseInt(selectedCategory));
                if (sub) categoryName = sub.nombre;
            }
        });
    }

    const headers = ['SKU', 'Producto', 'Categoría', 'Stock', 'Precio', 'Estado'];
    const body = filteredProducts.map(p => [
      p.sku || '---',
      p.nombre,
      p.categoria?.nombre || 'General',
      p.stock,
      `S/ ${parseFloat(p.precio_venta).toFixed(2)}`,
      p.estado
    ]);

    const stockLabels = {
        'ALL': 'Todos los niveles',
        'LOW': 'Stock Bajo / Reposición',
        'EMPTY': 'Sin Stock / Agotados'
    };

    const titleWithExtra = [
        `Inventario de Productos`,
        `Categoría: ${categoryName}`,
        `Nivel de stock: ${stockLabels[stockFilter]}`,
        `Usuario: ${auth.user.name}`
    ].join(' | ');

    generateProfessionalPDF({
        title: titleWithExtra,
        filename: `Inventario_CMA_${categoryName.replace(/\s+/g, '_')}`,
        headers,
        body,
        config
    });
    toast.success('Reporte generado');
  };

  return (
    <AuthenticatedLayout>
      <Head title="Gestión de Productos" />

      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 flex flex-col min-h-[600px] overflow-hidden">
        <header className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  className="w-full md:w-96 pl-10 pr-4 py-2.5 bg-white border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm shadow-sm"
                  placeholder="Nombre, SKU o código..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={exportToPDF} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-all shadow-sm font-bold text-sm group"
              >
                <FileDown size={18} className="text-emerald-600" />
                <span>Exportar Catálogo</span>
              </button>

              <button 
                onClick={() => handleOpenModal()} 
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
              >
                <Plus size={20} />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2.5 bg-white border-slate-200 focus:ring-indigo-500 rounded-xl text-sm font-bold text-slate-700"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <React.Fragment key={cat.id}>
                      <option value={cat.id} className="font-bold">{cat.nombre}</option>
                      {cat.children.map(sub => <option key={sub.id} value={sub.id}>&nbsp;&nbsp;&nbsp;{sub.nombre}</option>)}
                  </React.Fragment>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2.5 bg-white border-slate-200 focus:ring-indigo-500 rounded-xl text-sm font-bold text-slate-700 shadow-sm"
              >
                <option value="ALL">Todos los Niveles</option>
                <option value="LOW">⚠️ Stock Bajo / Reposición</option>
                <option value="EMPTY">🚫 Sin Stock / Agotados</option>
              </select>

              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                  <label className="flex items-center gap-2 cursor-pointer group w-full">
                    <input 
                      type="checkbox" 
                      checked={showInactive}
                      onChange={(e) => setShowInactive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 uppercase tracking-widest">Ver Inactivos</span>
                  </label>
              </div>
          </div>
        </header>

        <div className="overflow-x-auto flex-grow custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-4 w-[12%]">Código / SKU</th>
                <th className="p-4 w-[33%]">Producto</th>
                <th className="p-4 w-[15%]">Categoría</th>
                <th className="p-4 w-[10%] text-center">Stock</th>
                <th className="p-4 w-[12%] text-right">Precio</th>
                <th className="p-4 w-[13%] text-center">Estado</th>
                <th className="p-4 w-[10%] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => handleOpenModal(product)}
                    onToggleStatus={handleToggleStatus}
                    onOpenUnits={() => handleOpenUnits(product)}
                    onPrintLabel={handlePrintLabel}
                    isAdmin={isAdmin}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-16 text-center">
                    <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                            <Package size={32} />
                        </div>
                        <p className="text-slate-800 font-bold mb-1">No se encontraron productos</p>
                        <p className="text-sm text-slate-400">Intenta ajustar tus filtros o buscar otro término.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}
          totalRecords={filteredProducts.length}
        />
      </div>

      <CommonModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}
        maxWidth="5xl"
      >
        <ProductForm 
            productToEdit={editingProduct} 
            onClose={() => setModalOpen(false)} 
        />
      </CommonModal>

      <CommonModal 
        isOpen={isUnitModalOpen} 
        onClose={() => setUnitModalOpen(false)} 
        title={`Presentaciones para "${selectedProductForUnits?.nombre}"`}
        maxWidth="3xl"
      >
        <ProductUnitManager 
            product={selectedProductForUnits} 
            onClose={() => setUnitModalOpen(false)} 
        />
      </CommonModal>
    </AuthenticatedLayout>
  );
}
