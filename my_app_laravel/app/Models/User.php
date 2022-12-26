<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        "first_name",
        "middle_name",
        "last_name",
        "nation",
        "email",
        "certificate_id"
    ];

    protected $hidden = [
        "password"
    ];

    public function certificate() {
        return $this->belongsTo(Certificate::class,'certificate_id');
    }
}
