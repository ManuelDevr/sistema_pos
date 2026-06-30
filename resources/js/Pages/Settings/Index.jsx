import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building, Image as ImageIcon, Save, Upload, X, MapPin, Phone, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <h3 className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-6">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        <Icon size={20} />
      </div>
      <span>{title}</span>
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const FormInput = ({ label, id, icon: Icon, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-slate-500 uppercase mb-1 ml-1 tracking-widest" style={{ fontSize: '10px' }}>{label}</label>
        <div className="relative">
            {Icon && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                </span>
            )}
            <input 
              id={id} 
              {...props}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-3 py-2.5 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-xl text-sm font-medium ${error ? 'border-red-500' : ''}`}
            />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

export default function Index({ configuracion }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'POST',
    nombre_empresa: configuracion?.nombre_empresa || '',
    ruc: configuracion?.ruc || '',
    direccion: configuracion?.direccion || '',
    telefono: configuracion?.telefono || '',
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(configuracion?.logo_empresa ? `/storage/${configuracion.logo_empresa}` : null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('logo', file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    post(route('configuracion.update'), {
        forceFormData: true,
        onSuccess: () => toast.success('Configuración guardada correctamente'),
        onError: () => toast.error('Error al guardar la configuración')
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Configuración" />

      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormSection title="Datos de la Empresa" icon={Building}>
              <FormInput 
                  label="Nombre de la Ferretería"
                  id="nombre_empresa"
                  value={data.nombre_empresa}
                  onChange={e => setData('nombre_empresa', e.target.value)}
                  icon={Building}
                  placeholder="Ej: Ferretería CMA S.A.C."
                  error={errors.nombre_empresa}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput 
                      label="RUC / Identificación"
                      id="ruc"
                      value={data.ruc}
                      onChange={e => setData('ruc', e.target.value)}
                      icon={FileText}
                      placeholder="20123456789"
                      error={errors.ruc}
                  />
                  <FormInput 
                      label="Teléfono de Contacto"
                      id="telefono"
                      value={data.telefono}
                      onChange={e => setData('telefono', e.target.value)}
                      icon={Phone}
                      placeholder="01-2345678"
                      error={errors.telefono}
                  />
              </div>
              <FormInput 
                  label="Dirección Fiscal / Local"
                  id="direccion"
                  value={data.direccion}
                  onChange={e => setData('direccion', e.target.value)}
                  icon={MapPin}
                  placeholder="Av. Principal 123, Ciudad"
                  error={errors.direccion}
              />
            </FormSection>

            <div className="flex justify-end">
                <button 
                    type="submit"
                    disabled={processing}
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    <Save size={18} />
                    Guardar Cambios
                </button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <FormSection title="Logotipo" icon={ImageIcon}>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 group hover:border-indigo-300 transition-all">
                  {logoPreview ? (
                    <div className="relative w-full h-full group">
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                        <button 
                            type="button" 
                            onClick={() => { setLogoPreview(null); setData('logo', null); }}
                            className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <X size={14} />
                        </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={32} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Subir Logotipo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                    </label>
                  )}
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recomendado</p>
                    <p className="text-xs text-slate-500">Formato PNG o JPG transparente.<br/>Máximo 1MB.</p>
                </div>
              </div>
            </FormSection>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
