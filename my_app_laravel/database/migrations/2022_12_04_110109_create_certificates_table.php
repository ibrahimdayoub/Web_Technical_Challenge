<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCertificatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('location');
            $table->longText('cer_degree'); // json has font and color for this text {}
            $table->longText('cer_specialty'); // json has font and color for this text {}
            $table->longText('cer_description'); // json has font and color for this text {}
            $table->longText('cer_date'); // json has font and color for this text {}
            $table->longText('cer_number'); // json has font and color for this text {}
            $table->string('user_name'); // json has font and color for this text {}
            $table->string('user_nationality'); // json has font and color for this text {}
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('certificates');
    }
}
