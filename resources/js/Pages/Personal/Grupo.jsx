import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function Grupo() {
  return (
    <AuthenticatedLayout>
      <Head title="Grupo de Personal" />
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 bg-indigo-50 rounded-full mb-4">
          <Users size={48} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Grupo de Personal</h2>
        <p className="text-slate-400 font-semibold mt-2">Módulo en construcción</p>
      </div>
    </AuthenticatedLayout>
  );
}
