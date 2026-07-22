import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FaUser, FaLock, FaTrashAlt } from 'react-icons/fa';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const sections = [
        { icon: FaUser, iconBg: 'bg-indigo-50 text-indigo-600', label: 'Información del Perfil', component: UpdateProfileInformationForm, props: { mustVerifyEmail, status } },
        { icon: FaLock, iconBg: 'bg-slate-50 text-slate-600', label: 'Actualizar Contraseña', component: UpdatePasswordForm, props: {} },
        { icon: FaTrashAlt, iconBg: 'bg-rose-50 text-rose-600', label: 'Eliminar Cuenta', component: DeleteUserForm, props: {} },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />

            <div className="space-y-6">
                {sections.map(({ icon: Icon, iconBg, label, component: Component, props }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className={`p-2 rounded-lg ${iconBg}`}>
                                <Icon size={16} />
                            </div>
                            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">{label}</h2>
                        </div>
                        <div className="p-5">
                            <Component {...props} />
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
