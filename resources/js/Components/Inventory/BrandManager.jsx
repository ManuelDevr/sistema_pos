import React, { useState } from 'react';
import { Plus, Save, X, Edit, Check, ToggleLeft, ToggleRight, BookmarkPlus, ArrowLeft } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const BrandManager = ({ brands, onClose }) => {
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [editingId, setEditingId] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    nombre: '',
  });

  const [editingNombre, setEditingNombre] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!data.nombre.trim()) {
      toast.error('El nombre de la marca no puede estar vacío.');
      return;
    }
    post(route('marcas.store'), {
      onSuccess: () => {
        toast.success('Marca añadida');
        reset();
        setView('list');
      },
      onError: (err) => toast.error(err.nombre || 'Error al añadir marca')
    });
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingNombre(item.nombre);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingNombre('');
  };

  const handleUpdateItem = () => {
    if (!editingNombre.trim()) {
      toast.error('El nombre no puede estar vacío.');
      return;
    }
    router.put(route('marcas.update', editingId), { 
        nombre: editingNombre.trim(),
        estado: brands.find(b => b.id === editingId).estado 
    }, {
      onSuccess: () => {
        toast.success('Marca actualizada');
        cancelEditing();
      }
    });
  };

  const handleToggleStatus = (id) => {
    router.patch(route('marcas.toggle', id), {}, {
        onSuccess: () => toast.success('Estado actualizado')
    });
  };

  return (
    <div className="space-y-6">
      {view === 'add' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <button onClick={() => setView('list')} className="p-2 hover:bg-indigo-50 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h4 className="font-black text-sm uppercase tracking-widest">Añadir Nueva Marca</h4>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1 mb-2">Nombre de la Marca</label>
                <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    placeholder="Ej: Stanley, Bosch..."
                    className="w-full px-4 py-3 bg-white border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-2xl text-sm font-bold shadow-sm mb-4"
                    autoFocus
                />
                <button 
                    onClick={handleAddItem} 
                    disabled={processing}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Plus size={18} /> Añadir Marca
                </button>
            </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-sm">Marcas registradas</h4>
            <button 
                onClick={() => setView('add')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
            >
                <BookmarkPlus size={16} />
                Añadir Nueva Marca
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {brands.length > 0 ? brands.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.estado === 'Activo' ? 'bg-white border-slate-100 shadow-sm hover:border-indigo-200' : 'bg-slate-50 border-transparent opacity-70'}`}>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editingNombre}
                    onChange={(e) => setEditingNombre(e.target.value)}
                    className="flex-grow px-3 py-1.5 bg-white text-sm text-slate-800 border-indigo-500 ring-1 ring-indigo-500 rounded-xl mr-2 font-bold"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${item.estado === 'Activo' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                        {item.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-sm font-bold ${item.estado === 'Activo' ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{item.nombre}</span>
                  </div>
                )}
                
                <div className="flex gap-1">
                  {editingId === item.id ? (
                    <>
                      <button onClick={handleUpdateItem} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={18} /></button>
                      <button onClick={cancelEditing} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
                    </>
                  ) : (
                    <>
                      <button 
                          onClick={() => handleToggleStatus(item.id)} 
                          title={item.estado === 'Activo' ? 'Desactivar' : 'Activar'} 
                          className={`p-2 rounded-lg transition-colors ${item.estado === 'Activo' ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'}`}
                      >
                        {item.estado === 'Activo' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => startEditing(item)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Edit size={18} /></button>
                    </>
                  )}
                </div>
              </div>
            )) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">No hay marcas registradas</p>
                </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={onClose} className="h-11 px-8 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">
              Cerrar Mantenimiento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManager;
