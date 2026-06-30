import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  FaHome, FaList, 
  FaMoneyBillWave, FaUsers, FaUserFriends, 
  FaChevronLeft, FaChevronRight, FaPlus,
  FaShoppingCart, FaBolt, FaTimes, FaShieldAlt
} from 'react-icons/fa';
import { Settings, Box, Search, LayoutGrid, ClipboardList, Layers, History, ShieldCheck, Building2, ChevronDown, ChevronRight, Package, ShoppingBag, Settings2 } from 'lucide-react';
import Logo from '@/Assets/Logo.jpg';

const NavItem = ({ item, isOpen, isMobile, setOpen, isSubItem = false }) => {
    const isActive = item.routeName ? route().current(item.routeName) : false;

    return (
        <Link 
            href={item.routeName ? route(item.routeName) : '#'} 
            onClick={() => isMobile && setOpen(false)}
            className={`flex items-center h-10 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            } ${(isOpen || isMobile) ? 'justify-start' : 'justify-center'} ${isSubItem ? 'mt-1 relative' : ''}`}
        >
            {isSubItem && (
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-3 h-[2px] bg-slate-200" />
            )}
            <item.icon className={`w-5 h-5 flex-shrink-0 ${(isOpen || isMobile) ? (isSubItem ? 'mr-3 w-4 h-4' : 'mr-3') : ''}`} />
            {(isOpen || isMobile) && <span>{item.label}</span>}
        </Link>
    );
};

const CollapsibleSection = ({ section, isOpen, isMobile, setOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [showFloating, setShowFloating] = useState(false);
    const { auth } = usePage().props;
    const permissions = auth.permissions || [];

    const visibleItems = section.items.filter(item => !item.permission || permissions.includes(item.permission));

    if (visibleItems.length === 0) return null;

    // --- MODO COLAPSADO: Menú Flotante TIPO POPOVER (CLARO) ---
    if (!isOpen && !isMobile) {
        return (
            <div 
                className="relative flex flex-col items-center py-2"
                onMouseEnter={() => setShowFloating(true)}
                onMouseLeave={() => setShowFloating(false)}
            >
                <button 
                    onClick={() => setShowFloating(!showFloating)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${showFloating ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    <section.icon size={22} />
                </button>

                {showFloating && (
                    <div className="absolute left-full ml-2 top-0 z-[60] w-64 animate-in fade-in slide-in-from-left-2 duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 p-3">
                            <div className="px-4 py-3 mb-3 border-b border-slate-100 bg-slate-50/50 -mx-3 -mt-3">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <section.icon size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">{section.title}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1 relative pl-2">
                                {/* Línea vertical del árbol */}
                                <div className="absolute left-4 top-0 bottom-4 w-[1.5px] bg-slate-200" />
                                
                                {visibleItems.map((item) => {
                                    const isItemActive = route().current(item.routeName);
                                    return (
                                        <Link 
                                            key={item.label}
                                            href={route(item.routeName)}
                                            onClick={() => setShowFloating(false)}
                                            className={`flex items-center h-10 pl-8 pr-3 rounded-xl text-xs font-bold transition-all relative group ${
                                                isItemActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                        >
                                            {/* Línea horizontal del árbol */}
                                            <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-[1.5px] transition-colors ${
                                                isItemActive ? 'bg-indigo-400' : 'bg-slate-200 group-hover:bg-slate-300'
                                            }`} />
                                            
                                            <item.icon className={`w-4 h-4 mr-2.5 transition-opacity ${isItemActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- MODO EXPANDIDO: Acordeón Suave ---
    return (
        <div className="space-y-1">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    !isCollapsed ? 'bg-slate-50' : 'hover:bg-slate-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${!isCollapsed ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        <section.icon size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700">{section.title}</span>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 space-y-1 mt-1 border-l-2 border-slate-100 ml-5 relative">
                    {visibleItems.map((item) => (
                        <NavItem key={item.label} item={item} isOpen={isOpen} isMobile={isMobile} setOpen={setOpen} isSubItem={true} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, setOpen, isMobile }) => {
  const { auth } = usePage().props;
  const userPermissions = auth.permissions || [];

  const menuStructure = [
    { 
        type: 'item', 
        icon: LayoutGrid, 
        label: 'Inicio', 
        routeName: 'dashboard', 
        permission: 'ver_dashboard' 
    },
    { 
        type: 'item', 
        icon: FaList, 
        label: 'Catálogo', 
        routeName: 'catalogo-productos', 
        permission: 'ver_catalogo' 
    },
    { 
        type: 'item', 
        icon: FaBolt, 
        label: 'Venta Rápida', 
        routeName: 'venta-rapida', 
        permission: 'realizar_ventas' 
    },
    { 
        type: 'section',
        title: 'Inventario', 
        icon: Package,
        items: [
            { icon: Box, label: 'Gestión de Productos', routeName: 'gestion-productos', permission: 'gestionar_productos' },
            { icon: ClipboardList, label: 'Kardex', routeName: 'kardex.index', permission: 'ver_kardex' },
            { icon: Layers, label: 'Categorías y Marcas', routeName: 'inventory.maintenance', permission: 'gestionar_mantenimiento' }
        ]
    },
    { 
        type: 'section',
        title: 'Ventas', 
        icon: ShoppingBag,
        items: [
            { icon: History, label: 'Historial de Ventas', routeName: 'gestion-ventas', permission: 'ver_historial_ventas' },
            { icon: FaUserFriends, label: 'Clientes', routeName: 'gestion-clientes', permission: 'gestionar_clientes' },
        ]
    },
    { 
        type: 'section',
        title: 'Configuraciones', 
        icon: Settings2,
        items: [
            { icon: FaUsers, label: 'Usuarios / Personal', routeName: 'gestion-usuarios', permission: 'gestionar_usuarios' },
            { icon: Building2, label: 'Datos de Empresa', routeName: 'configuracion', permission: 'configuracion_sistema' },
            { icon: ShieldCheck, label: 'Privilegios', routeName: 'privilegios.index', permission: 'configurar_privilegios' }
        ]
    }
  ];

  const sidebarWidth = isMobile ? '280px' : (isOpen ? '280px' : '80px');

  return (
    <aside 
      className={`fixed top-0 h-full flex flex-col bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out shadow-sm`}
      style={{ width: sidebarWidth, left: isMobile ? (isOpen ? '0' : '-280px') : '0' }}
    >
      <div className="flex items-center justify-between h-[70px] px-4 border-b border-slate-200 flex-shrink-0">
        <Link 
            href={route('dashboard')}
            className={`flex items-center ${(isOpen || isMobile) ? 'justify-start' : 'justify-center'} w-full group`}
        >
            <div className="p-1.5 bg-white rounded-xl shadow-lg border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                <img src={Logo} alt="Logo" className="w-9 h-9 object-contain" />
            </div>
            {(isOpen || isMobile) && (
                <div className="ml-3">
                    <h1 className="text-lg font-black text-slate-800 tracking-tighter italic">CMA <span className="text-indigo-600 font-bold">POS</span></h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Ferretería</p>
                </div>
            )}
        </Link>
        {isMobile && (
            <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <FaTimes size={20} />
            </button>
        )}
      </div>

      <nav className={`flex-1 px-3 py-8 space-y-4 ${isOpen || isMobile ? 'overflow-y-auto' : 'overflow-y-visible'} custom-scrollbar`}>
        {menuStructure.map((element, idx) => {
            if (element.type === 'item') {
                if (element.permission && !userPermissions.includes(element.permission)) return null;
                
                if (!isOpen && !isMobile) {
                    return (
                        <div key={idx} className="group relative flex justify-center py-2">
                            <Link 
                                href={route(element.routeName)}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${route().current(element.routeName) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <element.icon size={22} />
                            </Link>
                            <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-800 uppercase tracking-widest">
                                {element.label}
                            </div>
                        </div>
                    );
                }
                return <NavItem key={idx} item={element} isOpen={isOpen} isMobile={isMobile} setOpen={setOpen} />;
            }
            return <CollapsibleSection key={idx} section={element} isOpen={isOpen} isMobile={isMobile} setOpen={setOpen} />;
        })}
      </nav>

      {!isMobile && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
                onClick={() => setOpen(!isOpen)}
                className={`w-full h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${
                    isOpen ? 'bg-slate-50 text-slate-400 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
            >
                {isOpen ? <FaChevronLeft className="w-5 h-5" /> : <FaChevronRight className="w-5 h-5" />}
            </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
