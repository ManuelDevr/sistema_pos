import React, { useState, useEffect } from 'react';
import {
  Archive, Diamond, Package, Tag as TagIcon, AlertTriangle, ShoppingCart,
  FileText, DollarSign, Percent, Ruler, Building, Plus, Edit, X, Save, TrendingUp, RotateCcw, ScanLine
} from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import CommonModal from '@/Components/CommonModal';
import CategoryManager from '@/Components/Inventory/CategoryManager';
import BrandManager from '@/Components/Inventory/BrandManager';
import UnitManager from '@/Components/Inventory/UnitManager';

const FormSection = ({ title, icon: Icon, children, gridCols = 'sm:grid-cols-2' }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-6">
      <Icon className="w-5 h-5 text-indigo-500" />
      <span>{title}</span>
    </h3>
    <div className={`grid grid-cols-1 ${gridCols} gap-x-6 gap-y-4`}>
      {children}
    </div>
  </div>
);

const FormInput = ({ label, id, icon: Icon, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="w-4 h-4 text-slate-400" />
      </span>
      <input
        id={id}
        {...props}
        className={`w-full pl-10 pr-3 py-2 text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg bg-slate-50 ${error ? 'border-red-500' : ''}`}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FormDisplay = ({ label, value, icon: Icon, className }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="w-4 h-4 text-slate-400" />
        </span>
      )}
      <div className={`w-full h-[38px] flex items-center ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 bg-slate-100 text-sm text-slate-900 border border-slate-200 rounded-lg font-bold`}>
        {value}
      </div>
    </div>
  </div>
);

const FormSelectWithButtons = ({ label, id, icon: Icon, children, onCreate, onEdit, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <div className="relative flex-grow">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="w-4 h-4 text-slate-400" />
        </span>
        <select id={id} {...props} className={`w-full pl-10 pr-8 py-2 bg-slate-50 text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg appearance-none ${error ? 'border-red-500' : ''}`}>
          {children}
        </select>
      </div>
      <button type="button" onClick={onCreate} title="Crear nuevo" className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"><Plus size={16} /></button>
      {onEdit && (
        <button type="button" onClick={onEdit} title="Gestionar" className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"><Edit size={16} /></button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const ProductForm = ({ productToEdit, onClose }) => {
  const { categorias, marcas, unidades, productos: allProducts = [] } = usePage().props;
  const isEdit = !!productToEdit;

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    nombre: '',
    descripcion: '',
    sku: '',
    codigo_barras: '',
    stock: 0,
    stock_minimo: 0,
    precio_compra: '',
    margen_ganancia: '',
    precio_venta: '',
    tasa_descuento: 0,
    unidad_medida: 'Unidad',
    categoria_id: '',
    marca_id: '',
    estado: 'Activo',
  });

  // Sincronizar datos cuando el componente se monta o cambia el producto
  useEffect(() => {
    if (isEdit && productToEdit) {
        setData({
            nombre: productToEdit.nombre || '',
            descripcion: productToEdit.descripcion || '',
            sku: productToEdit.sku || '',
            codigo_barras: productToEdit.codigo_barras || '',
            stock: productToEdit.stock || 0,
            stock_minimo: productToEdit.stock_minimo || 0,
            precio_compra: productToEdit.precio_compra !== undefined ? productToEdit.precio_compra : '',
            margen_ganancia: productToEdit.margen_ganancia !== undefined ? productToEdit.margen_ganancia : '',
            precio_venta: productToEdit.precio_venta !== undefined ? productToEdit.precio_venta : '',
            tasa_descuento: productToEdit.tasa_descuento || 0,
            unidad_medida: productToEdit.unidad_medida || 'Unidad',
            categoria_id: productToEdit.categoria_id || '',
            marca_id: productToEdit.marca_id || '',
            estado: productToEdit.estado || 'Activo',
        });
    } else if (!isEdit) {
        reset();
    }
    clearErrors();
  }, [productToEdit, isEdit]);

  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [isBrandOpen, setBrandOpen] = useState(false);
  const [isUnitOpen, setUnitOpen] = useState(false);

  // Recalcular precio de venta
  useEffect(() => {
    const costo = parseFloat(data.precio_compra) || 0;
    const utilidad = parseFloat(data.margen_ganancia) || 0;
    const descuento = parseFloat(data.tasa_descuento) || 0;
    const precioBruto = costo + utilidad;
    const precioFinal = precioBruto * (1 - descuento / 100);
    setData('precio_venta', precioFinal > 0 ? precioFinal.toFixed(2) : '0.00');
  }, [data.precio_compra, data.margen_ganancia, data.tasa_descuento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const options = {
        onSuccess: () => {
            toast.success(isEdit ? 'Producto actualizado' : 'Producto creado');
            if (onClose) onClose();
            else reset();
        },
        onError: () => toast.error('Error al guardar el producto')
    };

    if (isEdit) {
      put(route('productos.update', productToEdit.id), options);
    } else {
      post(route('productos.store'), options);
    }
  };

  const gananciaNeta = (parseFloat(data.precio_venta) || 0) - (parseFloat(data.precio_compra) || 0);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormSection title="Información General" icon={Package}>
              <FormInput 
                label="Nombre del Producto" 
                name="nombre" 
                value={data.nombre} 
                onChange={e => setData('nombre', e.target.value)} 
                icon={TagIcon} 
                className="sm:col-span-2" 
                placeholder="Ej: Martillo de 16oz"
                error={errors.nombre}
                required 
              />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
                <div className="relative">
                    <span className="absolute top-3 left-0 flex items-center pl-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                    </span>
                    <textarea 
                        value={data.descripcion} 
                        onChange={e => setData('descripcion', e.target.value)} 
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg"
                        rows="3"
                        placeholder="Detalles técnicos, dimensiones, etc."
                    />
                </div>
              </div>
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="SKU / Código" name="sku" value={data.sku} onChange={e => setData('sku', e.target.value)} icon={Archive} placeholder="Ej: HER-001" error={errors.sku} />
                <div>
                  <label htmlFor="codigo_barras" className="block text-sm font-medium text-slate-600 mb-1">Código de Barras</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <ScanLine className="w-4 h-4 text-slate-400" />
                      </span>
                      <input
                        id="codigo_barras"
                        name="codigo_barras"
                        value={data.codigo_barras}
                        onChange={e => setData('codigo_barras', e.target.value)}
                        placeholder="Escanee o ingrese EAN-13"
                        className={`w-full pl-10 pr-3 py-2 text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg bg-slate-50 ${errors.codigo_barras ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        let isUnique = false;
                        let generatedCode = '';
                        let attempts = 0;
                        while (!isUnique && attempts < 100) {
                          attempts++;
                          // Generar código numérico aleatorio de 12 dígitos (estilo EAN-12/13)
                          generatedCode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                          const existsInProducts = allProducts.some(p => p.codigo_barras === generatedCode || (p.conversiones && p.conversiones.some(c => c.codigo_barras === generatedCode)));
                          if (!existsInProducts) {
                            isUnique = true;
                          }
                        }
                        setData('codigo_barras', generatedCode);
                        toast.success('Código numérico generado correctamente');
                      }}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-bold text-xs flex items-center gap-2 border border-indigo-100 whitespace-nowrap"
                      title="Generar código de barras numérico único"
                    >
                      <Plus size={14} />
                      Generar
                    </button>
                  </div>
                  {errors.codigo_barras && <p className="text-xs text-red-500 mt-1">{errors.codigo_barras}</p>}
                </div>
              </div>
              <FormSelectWithButtons 
                label="Unidad Base" 
                icon={Ruler}
                value={data.unidad_medida}
                onChange={e => setData('unidad_medida', e.target.value)}
                onCreate={() => setUnitOpen(true)}
                onEdit={() => setUnitOpen(true)}
                error={errors.unidad_medida}
              >
                {unidades.map(u => <option key={u.id} value={u.nombre}>{u.nombre} ({u.abreviatura})</option>)}
              </FormSelectWithButtons>
            </FormSection>

            <FormSection title="Precios e Inventario" icon={DollarSign}>
              <FormInput label="Precio Compra (Costo)" type="number" step="0.01" value={data.precio_compra} onChange={e => setData('precio_compra', e.target.value)} icon={DollarSign} error={errors.precio_compra} />
              <FormInput label="Margen Ganancia (S/)" type="number" step="0.01" value={data.margen_ganancia} onChange={e => setData('margen_ganancia', e.target.value)} icon={TrendingUp} error={errors.margen_ganancia} />
              <FormInput label="Descuento (%)" type="number" step="0.01" value={data.tasa_descuento} onChange={e => setData('tasa_descuento', e.target.value)} icon={Percent} error={errors.tasa_descuento} />
              <FormDisplay label="Ganancia Neta" value={`S/ ${gananciaNeta.toFixed(2)}`} icon={TrendingUp} />
              <FormDisplay label="Precio de Venta Final" value={`S/ ${data.precio_venta}`} className="sm:col-span-2 text-indigo-600" />
              
              <FormInput label="Stock Actual" type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} icon={ShoppingCart} error={errors.stock} required />
              <FormInput label="Stock Mínimo (Alerta)" type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} icon={AlertTriangle} error={errors.stock_minimo} />
            </FormSection>
          </div>

          <div className="space-y-6">
            <FormSection title="Clasificación" icon={Diamond} gridCols="grid-cols-1">
              <FormSelectWithButtons 
                label="Categoría" 
                icon={TagIcon}
                value={data.categoria_id}
                onChange={e => setData('categoria_id', e.target.value)}
                onCreate={() => setCategoryOpen(true)}
                error={errors.categoria_id}
              >
                <option value="">Seleccione categoría</option>
                {categorias.map(cat => (
                  <React.Fragment key={cat.id}>
                    <option value={cat.id} className="font-bold">{cat.nombre}</option>
                    {cat.children.map(sub => <option key={sub.id} value={sub.id}>   {sub.nombre}</option>)}
                  </React.Fragment>
                ))}
              </FormSelectWithButtons>

              <FormSelectWithButtons 
                label="Marca" 
                icon={Building}
                value={data.marca_id}
                onChange={e => setData('marca_id', e.target.value)}
                onCreate={() => setBrandOpen(true)}
                onEdit={() => setBrandOpen(true)}
                error={errors.marca_id}
              >
                <option value="">Seleccione marca</option>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </FormSelectWithButtons>
            </FormSection>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <AlertTriangle size={18} />
                </div>
                <div>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Nota del Sistema</p>
                    <p className="text-[10px] text-amber-700 leading-tight mt-0.5">El almacenamiento de imágenes está desactivado para optimizar el rendimiento de la base de datos.</p>
                </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => { reset(); clearErrors(); }} className="h-11 px-6 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
              <RotateCcw size={18} /> Limpiar
            </button>
            <button type="submit" disabled={processing} className="h-11 px-8 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2 disabled:opacity-50">
              <Save size={18} /> {isEdit ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
        </div>
      </form>

      {/* Modales Auxiliares */}
      <CommonModal isOpen={isCategoryOpen} onClose={() => setCategoryOpen(false)} title="Gestión de Categorías">
        <CategoryManager categories={categorias} onClose={() => setCategoryOpen(false)} />
      </CommonModal>
      <CommonModal isOpen={isBrandOpen} onClose={() => setBrandOpen(false)} title="Gestión de Marcas">
        <BrandManager brands={marcas} onClose={() => setBrandOpen(false)} />
      </CommonModal>
      <CommonModal isOpen={isUnitOpen} onClose={() => setUnitOpen(false)} title="Unidades de Medida">
        <UnitManager units={unidades} onClose={() => setUnitOpen(false)} />
      </CommonModal>
    </>
  );
};

export default ProductForm;
