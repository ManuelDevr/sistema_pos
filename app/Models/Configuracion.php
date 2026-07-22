<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $table = 'configuracion';

    protected $fillable = [
        'nombre_empresa',
        'logo_empresa',
        'ruc',
        'direccion',
        'telefono',
        'metodos_pago',
        'certificado_digital',
        'sol_usuario',
        'sol_clave',
        'entorno',
        'serie_factura',
        'serie_boleta',
        'serie_nota_credito',
        'serie_nota_debito',
        'igv',
    ];

    protected $casts = [
        'metodos_pago' => 'array',
        'igv' => 'decimal:2',
    ];
}
