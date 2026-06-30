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
    ];

    protected $casts = [
        'metodos_pago' => 'array',
    ];
}
