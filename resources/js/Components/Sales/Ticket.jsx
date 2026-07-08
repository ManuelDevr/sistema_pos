import React from 'react';
import { usePage } from '@inertiajs/react';
import { Package } from 'lucide-react';

const Ticket = React.forwardRef(({ sale }, ref) => {
  const { config } = usePage().props;

  if (!sale) return null;

  // Formatear fecha y hora
  const fechaEmision = sale.created_at 
    ? new Date(sale.created_at).toLocaleDateString('es-PE', { timeZone: 'America/Lima' }) 
    : new Date().toLocaleDateString('es-PE');
  const horaEmision = sale.created_at 
    ? new Date(sale.created_at).toLocaleTimeString('es-PE', { timeZone: 'America/Lima' }) 
    : new Date().toLocaleTimeString('es-PE');

  // Determinar ruta del logo de la empresa
  const logoUrl = config?.logo_empresa 
    ? `/storage/${config.logo_empresa}` 
    : null;

  return (
    <div ref={ref} className="p-4 text-[10px] text-black bg-white font-mono w-[280px] leading-tight">
      {/* Información de la Empresa */}
      <div className="text-center space-y-1 mb-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="mx-auto w-12 h-auto max-h-12 object-contain" />
        ) : (
          <Package className="mx-auto w-6 h-6 text-slate-400" />
        )}
        <h2 className="text-xs font-bold uppercase">{config?.nombre_empresa || 'Ferretería CMA'}</h2>
        {config?.direccion && <p className="text-[9px]">{config.direccion}</p>}
        {config?.ruc && <p className="text-[9px]">RUC: {config.ruc}</p>}
        {config?.telefono && <p className="text-[9px]">Tel: {config.telefono}</p>}
      </div>

      <div className="my-2 border-t border-dashed border-black"></div>

      {/* Datos del Comprobante */}
      <div className="space-y-0.5 mb-2">
        <p className="font-bold">COMPROBANTE: {sale.nro_comprobante}</p>
        <p>FECHA DE EMISIÓN: {fechaEmision}</p>
        <p>HORA: {horaEmision}</p>
        <p className="truncate">CLIENTE: <span className="font-bold">{sale.cliente?.nombre || 'CLIENTES VARIOS'}</span></p>
        {sale.cliente?.ruc_dni && <p>DNI/RUC: {sale.cliente.ruc_dni}</p>}
        <p className="truncate">VENDEDOR: {sale.user?.name || 'Cajero'}</p>
      </div>

      <div className="my-2 border-t border-dashed border-black"></div>

      {/* Detalle de Artículos */}
      <table className="w-full text-[9px]">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-left font-bold pb-1 w-[35px]">CANT.</th>
            <th className="text-left font-bold pb-1 w-[40px]">SKU</th>
            <th className="text-left font-bold pb-1 w-[35px]">U.D.M.</th>
            <th className="text-left font-bold pb-1">DESCRIPCIÓN</th>
            <th className="text-right font-bold pb-1 w-[45px]">P.U.</th>
            <th className="text-right font-bold pb-1 w-[50px]">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {sale.detalles?.map((item) => {
            const productSku = item.producto?.sku || 'N/A';
            const unitAbrev = item.unidad?.abreviatura || item.producto?.unidad_medida || 'UN';
            const productName = item.producto?.nombre || 'Producto';
            const unitPrice = parseFloat(item.precio_unitario || 0).toFixed(2);
            const totalItem = parseFloat(item.subtotal || 0).toFixed(2);

            return (
              <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                <td className="align-top py-1 font-bold">{item.cantidad}</td>
                <td className="align-top py-1 text-[8px] truncate">{productSku}</td>
                <td className="align-top py-1 uppercase">{unitAbrev}</td>
                <td className="py-1 break-words max-w-[90px]">{productName}</td>
                <td className="align-top py-1 text-right">S/ {unitPrice}</td>
                <td className="align-top py-1 text-right font-bold">S/ {totalItem}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="my-2 border-t border-dashed border-black"></div>

      {/* Totales */}
      <div className="space-y-1 text-right mb-3 text-[9px]">
        <p className="text-xs font-bold">IMPORTE TOTAL: S/ {parseFloat(sale.total || 0).toFixed(2)}</p>
        <div className="my-1 border-t border-dotted border-black/50"></div>
        <p>MÉTODO DE PAGO: <span className="font-bold">{sale.metodo_pago || 'EFECTIVO'}</span></p>
        {sale.pagado_con !== undefined && sale.pagado_con !== null && (
          <p>PAGO CON: S/ {parseFloat(sale.pagado_con).toFixed(2)}</p>
        )}
        {sale.vuelto !== undefined && sale.vuelto !== null && (
          <p>VUELTO: S/ {parseFloat(sale.vuelto).toFixed(2)}</p>
        )}
      </div>

      <div className="mt-2 text-center text-[9px] space-y-0.5 border-t border-dashed border-black pt-2">
        <div className="text-[8px]">
          <p className="font-bold">¡Gracias por su compra!</p>
          <p>Ferretería CMA le desea un excelente día.</p>
        </div>
      </div>
    </div>
  );
});

Ticket.displayName = 'Ticket';

export default Ticket;
