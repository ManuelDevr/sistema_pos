import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import ReactECharts from 'echarts-for-react';
import { FaBolt } from 'react-icons/fa';
import {
  DollarSign, ShoppingCart, ArrowUp, ArrowDown,
  Box, List, PlusSquare, FileText, Users, Loader
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, path, color }) => (
  <Link href={path} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-colors ${color.bg} hover:${color.hoverBg}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.iconBg}`}>
      <Icon className={`w-6 h-6 ${color.icon}`} />
    </div>
    <p className="text-sm font-semibold text-slate-700">{label}</p>
  </Link>
);

export default function Dashboard({ stats }) {
  const { auth } = usePage().props;
  const user = auth.user;

  const statCards = [
    { title: 'Ventas del Día', value: `S/ ${parseFloat(stats.ventasDelDia || 0).toFixed(2)}`, icon: DollarSign },
    { title: 'Número de Ventas', value: stats.numeroDeVentas || 0, icon: ShoppingCart },
    { title: 'Productos Vendidos', value: stats.productosVendidos || 0, icon: Box },
  ];

  const weeklySalesData = {
    labels: stats.ventasSemanales.map(d => new Date(d.dia + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' })),
    data: stats.ventasSemanales.map(d => d.total),
  };
  
  const adminActions = [
    { label: 'Catálogo', path: '/catalogo-productos', icon: List, color: { bg: 'bg-sky-50', hoverBg: 'bg-sky-100', iconBg: 'bg-sky-100', icon: 'text-sky-600' } },
    { label: 'Gestión Ventas', path: '/gestion-ventas', icon: FileText, color: { bg: 'bg-green-50', hoverBg: 'bg-green-100', iconBg: 'bg-green-100', icon: 'text-green-600' } },
  ];

  const cashierActions = [
    { label: 'Venta Rápida', path: '/venta-rapida', icon: FaBolt, color: { bg: 'bg-green-50', hoverBg: 'bg-green-100', iconBg: 'bg-green-100', icon: 'text-green-600' } },
    { label: 'Mis Ventas', path: '/mis-ventas', icon: FileText, color: { bg: 'bg-indigo-50', hoverBg: 'bg-indigo-100', iconBg: 'bg-indigo-100', icon: 'text-indigo-600' } },
    { label: 'Catálogo', path: '/catalogo-productos', icon: List, color: { bg: 'bg-sky-50', hoverBg: 'bg-sky-100', iconBg: 'bg-sky-100', icon: 'text-sky-600' } },
  ];

  const quickActions = user?.rol === 'Administrador' ? adminActions : cashierActions;

  const salesChartOption = {
    tooltip: { 
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/><strong>${data.seriesName}:</strong> S/ ${parseFloat(data.value).toFixed(2)}`;
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: weeklySalesData.labels,
      axisLine: { lineStyle: { color: '#d1d5db' } },
      axisLabel: { color: '#334155', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: '#d1d5db' } },
      axisLabel: {
        color: '#334155',
        fontSize: 12,
        formatter: 'S/ {value}'
      },
      splitLine: { lineStyle: { color: '#e5e7eb' } },
    },
    series: [{
      name: 'Ventas',
      type: 'bar',
      data: weeklySalesData.data,
      itemStyle: { 
          color: '#4f46e5',
          borderRadius: [4, 4, 0, 0]
      },
      barWidth: '40%',
    }],
    backgroundColor: 'transparent',
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hola, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500">
              {user?.rol === 'Administrador' 
                ? 'Aquí tienes un resumen de la actividad de hoy.'
                : 'Selecciona una acción para comenzar.'}
            </p>
          </div>
        </div>

        {user?.rol === 'Administrador' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Ventas de la Semana</h3>
              <ReactECharts option={salesChartOption} style={{ height: 350 }} />
            </div>
          </>
        )}

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Acciones Rápidas</h3>
          <div className={`grid grid-cols-2 ${user?.rol === 'Administrador' ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
            {quickActions.map(action => <QuickActionButton key={action.label} {...action} />)}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
