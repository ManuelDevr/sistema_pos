import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Search, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, Package, Bookmark } from 'lucide-react';
import ProductCard from '@/Components/Products/ProductCard';
import Pagination from '@/Components/Pagination';
import { useCartStore } from '@/Hooks/useCartStore';
import toast from 'react-hot-toast';

export default function Catalog({ productos, categorias, marcas }) {
  const { config } = usePage().props;
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const { addToCart } = useCartStore();

  // Obtener todos los IDs de categorías descendientes de forma recursiva
  const getAllChildCategoryIds = (categoryId, categoryList) => {
    let ids = [parseInt(categoryId)];
    
    const findAndAddChildren = (currentId, list) => {
        for (const cat of list) {
            if (cat.id === currentId) {
                if (cat.children && cat.children.length > 0) {
                    cat.children.forEach(child => {
                        ids.push(child.id);
                        findAndAddChildren(child.id, cat.children);
                    });
                }
                break;
            }
            if (cat.children && cat.children.length > 0) {
                findAndAddChildren(currentId, cat.children);
            }
        }
    };

    findAndAddChildren(parseInt(categoryId), categoryList);
    return ids;
  };

  const filteredProducts = useMemo(() => {
    let categoryIds = [];
    if (selectedCategory) {
        categoryIds = getAllChildCategoryIds(selectedCategory, categorias);
    }

    return productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (p.codigo_barras && p.codigo_barras.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || categoryIds.includes(p.categoria_id);
      const matchesBrand = !selectedBrand || p.marca_id === parseInt(selectedBrand);
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [productos, searchTerm, selectedCategory, selectedBrand, categorias]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const currentProducts = useMemo(() => 
    filteredProducts.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filteredProducts, currentPage, rowsPerPage]
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.nombre} añadido al carrito`);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Catálogo de Productos" />

      <div className="space-y-6">
        {/* Barra de Filtros Mejorada */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
            {/* Buscador */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:border-indigo-500 focus:ring-0 rounded-2xl text-sm font-bold shadow-inner"
                    placeholder="Buscar por nombre, SKU o código..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                {/* Filtro Categoría */}
                <div className="relative flex-1 min-w-[200px]">
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:border-indigo-500 focus:ring-0 rounded-2xl text-sm font-bold text-slate-700 shadow-inner appearance-none"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <React.Fragment key={cat.id}>
                                <option value={cat.id} className="font-bold">{cat.nombre}</option>
                                {cat.children.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        &nbsp;&nbsp;&nbsp;{sub.nombre}
                                    </option>
                                ))}
                            </React.Fragment>
                        ))}
                    </select>
                </div>

                {/* Filtro Marca */}
                <div className="relative flex-1 min-w-[180px]">
                    <select
                        value={selectedBrand}
                        onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:border-indigo-500 focus:ring-0 rounded-2xl text-sm font-bold text-slate-700 shadow-inner appearance-none"
                    >
                        <option value="">Todas las marcas</option>
                        {marcas.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Botones de Vista (Grid/List) */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    <button 
                      onClick={() => setViewMode('grid')} 
                      className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Vista Cuadrícula"
                    >
                      <LayoutGrid size={20} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      title="Vista Lista"
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
            </div>
        </div>

        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.length > 0 ? currentProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAdd={() => handleAddToCart(product)}
                        onView={() => router.get(route('productos.show', product.id))}
                    />
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <Package size={48} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron productos</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4 text-center">Stock</th>
                                <th className="p-4 text-right">Precio</th>
                                <th className="p-4 text-right pr-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center text-slate-300">
                                                {product.imagen_url ? (
                                                  <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                  <Package size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{product.nombre}</p>
                                                <p className="text-[10px] font-mono text-slate-400">{product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                                            {product.categoria?.nombre || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-bold text-slate-600 text-sm">
                                        {parseInt(product.stock, 10)} {product.unidad_medida}
                                    </td>
                                    <td className="p-4 text-right font-black text-slate-800">
                                        S/ {parseFloat(product.precio_venta).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0}
                                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md shadow-indigo-100 disabled:bg-slate-300"
                                        >
                                            Añadir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(val) => { setRowsPerPage(val); setCurrentPage(1); }}
                totalRecords={filteredProducts.length}
            />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
