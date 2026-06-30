import React, { useState, useMemo } from 'react';
import { Plus, X, Edit, Save, GitBranch, ChevronRight, ChevronDown } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const CategoryForm = ({ categoryToEdit, categories, onCancel, isSub }) => {
  const isEdit = !!categoryToEdit && !isSub;
  
  const { data, setData, post, put, processing, reset, errors } = useForm({
    nombre: isEdit ? categoryToEdit.nombre : '',
    parent_id: isSub ? categoryToEdit.id : (categoryToEdit?.parent_id || null),
    descripcion: isEdit ? categoryToEdit.descripcion : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {
        onSuccess: () => {
            toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada');
            onCancel();
        }
    };

    if (isEdit) {
      put(route('categorias.update', categoryToEdit.id), options);
    } else {
      post(route('categorias.store'), options);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <h4 className="font-bold text-slate-800 text-sm">
            {isSub ? `Añadir subcategoría a: ${categoryToEdit.nombre}` : (isEdit ? 'Editar Categoría' : 'Nueva Categoría Principal')}
        </h4>
        
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nombre</label>
            <input 
                type="text" 
                value={data.nombre} 
                onChange={e => setData('nombre', e.target.value)} 
                className="w-full px-3 py-2 bg-white text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg"
                placeholder="Ej: Herramientas Eléctricas"
                autoFocus
            />
            {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
        </div>

        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Descripción (Opcional)</label>
            <textarea 
                value={data.descripcion} 
                onChange={e => setData('descripcion', e.target.value)} 
                className="w-full px-3 py-2 bg-white text-sm text-slate-800 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg"
                rows="2"
            />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="h-10 px-5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
        <button type="submit" disabled={processing} className="h-10 px-5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 disabled:opacity-50">
          <Save size={16} /> Guardar
        </button>
      </div>
    </form>
  );
};

const CategoryItem = ({ category, onEdit, onAddSub, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div className={`flex items-center justify-between p-2 rounded-lg group hover:bg-slate-50 transition-colors ${category.estado === 'Inactivo' ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2 flex-1">
          <div style={{ width: `${depth * 1.5}rem` }} />
          {hasChildren ? (
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-slate-400 hover:text-slate-600">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : <div className="w-6" />}
          
          <span className={`text-sm font-medium ${category.estado === 'Activo' ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
            {category.nombre}
          </span>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!category.parent_id && (
            <button onClick={() => onAddSub(category)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md" title="Añadir Subcategoría">
              <GitBranch size={14} />
            </button>
          )}
          <button onClick={() => onEdit(category)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-md" title="Editar">
            <Edit size={14} />
          </button>
        </div>
      </div>
      
      {hasChildren && isOpen && (
        <div className="space-y-1">
          {category.children.map(child => (
            <CategoryItem key={child.id} category={child} onEdit={onEdit} onAddSub={onAddSub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryManager = ({ categories, onClose }) => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSub, setIsSub] = useState(false);

  const handleAddParent = () => {
    setEditingCategory(null);
    setIsSub(false);
    setView('form');
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setIsSub(false);
    setView('form');
  };

  const handleAddSub = (parent) => {
    setEditingCategory(parent);
    setIsSub(true);
    setView('form');
  };

  return (
    <div className="space-y-4">
      {view === 'form' ? (
        <CategoryForm 
            categoryToEdit={editingCategory} 
            onCancel={() => setView('list')} 
            isSub={isSub}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 text-sm">Jerarquía de Categorías</h4>
            <button onClick={handleAddParent} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
              <Plus size={14} /> Nueva Principal
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar border-t border-b border-slate-100 py-2">
            {categories.length > 0 ? categories.map(cat => (
              <CategoryItem key={cat.id} category={cat} onEdit={handleEdit} onAddSub={handleAddSub} />
            )) : (
                <p className="text-center py-8 text-sm text-slate-400">No hay categorías registradas</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="h-10 px-5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryManager;
