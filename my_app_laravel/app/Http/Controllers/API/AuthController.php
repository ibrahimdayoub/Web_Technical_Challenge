<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //01 Login (All)
    public function login(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'email'=>['required','string','max:100','email'],
            'password'=>['required','string','min:8'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $user=User::where('email',$request->email)->first();
            $admin=Admin::where('email',$request->email)->first();

            if((! $user || ! Hash::check($request->password,$user->password))
              &&(! $admin   || ! Hash::check($request->password,$admin->password))
            )
            {
                return response()->json([
                    'status'=>401,
                    'message'=>'Invalid Credentials',
                ]);
            }
            else if($user)
            {
                $token=$user->createToken($user->email.'_User_Token',['server:user'])->plainTextToken;

                return response()->json([
                    'status'=>200,
                    'token'=>$token,
                    'name'=>$user->first_name.' '.$user->middle_name.' '.$user->last_name,
                    'role'=>'User',
                    'message'=>'Logged In Successfully',
                ]);
            }
            else if($admin)
            {
                $token=$admin->createToken($admin->email.'_Admin_Token',['server:admin'])->plainTextToken;

                return response()->json([
                    'status'=>200,
                    'token'=>$token,
                    'name'=>$admin->first_name.' '.$admin->middle_name.' '.$admin->last_name,
                    'role'=>'Admin',
                    'message'=>'Logged In Successfully',
                ]);
            }
        }
    }

    //02 Logout (All)
    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged Out Successfully'
        ]);
    }
}
