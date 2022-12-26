<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FontController;
use App\Http\Controllers\API\CertificateController;
use App\Http\Controllers\API\AdminController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Login All
Route::post('login',[AuthController::class,'login']);

//If Authenticated (Role Is User Or Admin)
Route::middleware(['auth:sanctum'])->group(function(){

    //Logout all
    Route::post('logout',[AuthController::class,'logout']);

    //Users
    Route::get('view_user/{id}',[UserController::class,'view_user']);

    //Fonts
    Route::get('view_fonts',[FontController::class,'view_fonts']);

    //Files
    Route::get('fetch_pdf/{name}',[CertificateController::class,'fetch_pdf']);
    Route::get('fetch_font/{name}',[FontController::class,'fetch_font']);
});

//If Authenticated (Role Is Admin)
Route::middleware(['auth:sanctum','isAdmin'])->group(function(){

    //Users
    Route::get('view_users',[UserController::class,'view_users']);
    Route::post('add_user',[UserController::class,'add_user']);
    Route::put('update_user/{id}',[UserController::class,'update_user']);
    Route::delete('delete_user/{id}',[UserController::class,'delete_user']);

    //Fonts
    Route::post('add_font',[FontController::class,'add_font']);
    Route::get('view_font/{id}',[FontController::class,'view_font']);
    Route::post('update_font/{id}',[FontController::class,'update_font']); // no put :)
    Route::delete('delete_font/{id}',[FontController::class,'delete_font']);

    //Certificates
    Route::get('view_certificates',[CertificateController::class,'view_certificates']);
    Route::post('add_certificate',[CertificateController::class,'add_certificate']);
    Route::get('view_certificate/{id}',[CertificateController::class,'view_certificate']);
    Route::post('update_certificate/{id}',[CertificateController::class,'update_certificate']); // no put :)
    Route::delete('delete_certificate/{id}',[CertificateController::class,'delete_certificate']);

    //Authenticated Admin
    Route::get('authenticated_admin',function(){
        return response()->json(['status'=>200,'message'=>'You Are Authenticated','id'=>auth()->user()->id]);
    });
});

//If Authenticated (Role Is User)
Route::middleware(['auth:sanctum','isUser'])->group(function(){

    //Authenticated User
    Route::get('authenticated_user',function(){
        return response()->json(['status'=>200,'message'=>'You Are Authenticated','id'=>auth()->user()->id]);
    });
});

