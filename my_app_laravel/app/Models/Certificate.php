<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "location",
        "cer_degree",
        "cer_specialty",
        "cer_description",
        "cer_date",
        "cer_number",
        "user_name",
        "user_nationality"
    ];

    public function users() {
        return $this->hasMany(User::class);
    }
}
