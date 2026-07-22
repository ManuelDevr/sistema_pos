import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Layers } from 'lucide-react';
import CategoryManager from '@/Components/Inventory/CategoryManager';

export default function Index() {
  const { categorias } = usePage().props;

  return (
    <AuthenticatedLayout>
      <Head title="Categorías" />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Layers size={22} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Categorías</h2>
              <p className="text-sm text-slate-500">Gestiona las categorías y subcategorías de productos</p>
            </div>
          </div>
          <CategoryManager categories={categorias} onClose={() => {}} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
