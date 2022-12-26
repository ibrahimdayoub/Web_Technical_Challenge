<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //01 View Users
    public function view_users()
    {
        $users=User::all();

        return response()->json([
            'status'=>200,
            'users'=>$users,
        ]);
    }

    //02 Add User
    public function add_user(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'nation'=>['required','string','max:50'],
            'email'=>['required','string','max:100','email','unique:users','unique:admins'],
            'password'=>['required','string','min:8'],
            'certificate_id'=>['integer'],
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $user=new User;
            $user->first_name=$request->input('first_name');
            $user->middle_name=$request->input('middle_name');
            $user->last_name=$request->input('last_name');
            $user->nation=$request->input('nation');
            $user->email=$request->input('email');
            $user->password=Hash::make($request->input('password'));
            $user->certificate_id = $request->input('certificate_id')==0 ? null : $request->input('certificate_id');
            $user->save();

            return response()->json([
                'status'=>200,
                'message'=>'User Added Successfully',
            ]);
        }
    }

    //03 View User
    public function view_user($id)
    {
        $user=User::find($id);

        if($user)
        {
            $user->certificate=User::find($id)->certificate;
            return response()->json([
                'status'=>200,
                'user'=>$user,
                'message'=>'User Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'No User Id Found',
            ]);
        }
    }

    //04 Update User
    public function update_user(Request $request,$id)
    {
        $validationArray=[
            'first_name'=>['required','string','max:50'],
            'middle_name'=>['required','string','max:50'],
            'last_name'=>['required','string','max:50'],
            'nation'=>['required','string','max:50'],
            'password'=>['required','string','min:8'],
            'certificate_id'=>['integer'],
        ];

        $user_e=User::find($id);

        if($user_e && $user_e->email==$request->input('email'))
        {
            $validationArray['email']=['required','string','max:100','email','unique:admins'];
        }
        else
        {
            $validationArray['email']=['required','string','max:100','email','unique:users','unique:admins'];
        }

        $validator=Validator::make($request->all(),$validationArray);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $user=User::find($id);
            if($user)
            {
                $user->first_name=$request->input('first_name');
                $user->middle_name=$request->input('middle_name');
                $user->last_name=$request->input('last_name');
                $user->nation=$request->input('nation');
                $user->email=$request->input('email');
                $user->certificate_id = $request->input('certificate_id')==0 ? null : $request->input('certificate_id');
                $user->password = $request->input('password')==="useOldPassword" ? $user->password : Hash::make($request->input('password'));

                $user->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'User Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No User Id Found',
                ]);
            }

        }
    }

    //05 Delete User
    public function delete_user($id)
    {
        $user=User::find($id);
        if($user)
        {
            $user->delete();

            return response()->json([
                'status'=>200,
                'message'=>'User Deleted Successfully'
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'User Is Not Found',
            ]);
        }
    }
}
