import React, { useState } from 'react';
import { Plus, Save, X, Edit, Check, ToggleLeft, ToggleRight, Ruler, ArrowLeft, PlusCircle } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">{label}</label>
    <input 
        id={id} 
        {...props} 
        className="w-full px-4 py-3 bg-white border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-2xl text-sm font-bold shadow-sm" 
    />
  </div>
);

const UnitManager = ({ units, onClose }) => {
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [editingId, setEditingId] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    nombre: '',
    abreviatura: '',
  });

  const [editingData, setEditingData] = useState({ nombre: '', abreviatura: '' });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!data.nombre.trim() || !data.abreviatura.trim()) {
      toast.error('Nombre y abreviatura son requeridos');
      return;
    }
    post(route('unidades.store'), {
      onSuccess: () => {
        toast.success('Unidad añadida');
        reset();
        setView('list');
      },
    });
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingData({ nombre: item.nombre, abreviatura: item.abreviatura });
  };

  const handleUpdateItem = () => {
    if (!editingData.nombre.trim() || !editingData.abreviatura.trim()) {
      toast.error('Nombre y abreviatura son requeridos');
      return;
    }
    router.put(route('unidades.update', editingId), {
        ...editingData,
        estado: units.find(u => u.id === editingId).estado
    }, {
      onSuccess: () => {
        toast.success('Unidad actualizada');
        setEditingId(null);
      }
    });
  };

  const handleToggleStatus = (id) => {
    router.patch(route('unidades.toggle', id), {}, {
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
                <h4 className="font-black text-sm uppercase tracking-widest">Añadir Nueva Unidad</h4>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Nombre de la Unidad"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        placeholder="Ej: Kilogramo"
                    />
                    <FormInput
                        label="Abreviatura"
                        value={data.abreviatura}
                        onChange={(e) => setData('abreviatura', e.target.value)}
                        placeholder="Ej: kg"
                    />
                </div>
                <button 
                    onClick={handleAddItem} 
                    disabled={processing}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Plus size={18} /> Registrar Unidad
                </button>
            </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center px-1">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest text-sm">Unidades de Medida</h4>
            <button 
                onClick={() => setView('add')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
            >
                <PlusCircle size={16} />
                Añadir Unidades
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {units.length > 0 ? units.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.estado === 'Activo' ? 'bg-white border-slate-100 shadow-sm hover:border-indigo-200' : 'bg-slate-50 border-transparent opacity-70'}`}>
                {editingId === item.id ? (
                  <div className="flex gap-2 flex-grow mr-2">
                    <input
                      type="text"
                      value={editingData.nombre}
                      onChange={(e) => setEditingData({...editingData, nombre: e.target.value})}
                      className="flex-grow px-3 py-1.5 text-sm border-indigo-500 ring-1 ring-indigo-500 rounded-xl font-bold"
                    />
                    <input
                      type="text"
                      value={editingData.abreviatura}
                      onChange={(e) => setEditingData({...editingData, abreviatura: e.target.value})}
                      className="w-20 px-3 py-1.5 text-sm border-indigo-500 ring-1 ring-indigo-500 rounded-xl font-bold text-center"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${item.estado === 'Activo' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                        {item.abreviatura}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${item.estado === 'Activo' ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{item.nombre}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Referencia de Medida</p>
                      </div>
                  </div>
                )}
                
                <div className="flex gap-1">
                  {editingId === item.id ? (
                    <>
                      <button onClick={handleUpdateItem} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleToggleStatus(item.id)} className={`p-2 rounded-lg transition-colors ${item.estado === 'Activo' ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'}`}>
                        {item.estado === 'Activo' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => startEditing(item)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><Edit size={18} /></button>
                    </>
                  )}
                </div>
              </div>
            )) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">No hay unidades registradas</p>
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

export default UnitManager;
