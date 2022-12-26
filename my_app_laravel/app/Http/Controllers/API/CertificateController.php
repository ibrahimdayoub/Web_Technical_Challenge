<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class CertificateController extends Controller
{
    //01 View Certificates
    public function view_certificates()
    {
        $certificates=Certificate::all();

        return response()->json([
            'status'=>200,
            'certificates'=>$certificates,
        ]);
    }

    //02 Add Certificate
    public function add_certificate(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'title'=>['required','string','max:50','unique:certificates'],
            'location'=>['required','file'],

            'cer_degree'=>['string'],//
            'cer_specialty'=>['string'],//
            'cer_description'=>['string'],//
            'cer_date'=>['string'],//
            'cer_number'=>['string'],//
            'user_name'=>['string'],//
            'user_nationality'=>['string']//
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $certificate=new Certificate;
            $certificate->title=$request->input('title');

            if($request->hasFile('location'))
            {
                 $file = $request->file('location');
                 $extension = $file->getClientOriginalExtension();

                 if($extension ==="pdf")
                 {
                    $filename = time().'.'.$extension;
                    $file->move('Uploads/Certificates/',$filename);
                    $certificate->location = 'Uploads/Certificates/'.$filename;
                 }
                 else
                 {
                     return response()->json([
                         'status'=>400,
                         'message'=>'We need pdf file (.pdf)',
                     ]);
                 }
            }
            else{
                 return response()->json([
                     'status'=>400,
                     'message'=>'We need pdf file (.pdf)',
                 ]);
            }

            $certificate->cer_degree=$request->input('cer_degree');
            $certificate->cer_specialty=$request->input('cer_specialty');
            $certificate->cer_description=$request->input('cer_description');
            $certificate->cer_date=$request->input('cer_date');
            $certificate->cer_number=$request->input('cer_number');
            $certificate->user_name=$request->input('user_name');
            $certificate->user_nationality=$request->input('user_nationality');

            $certificate->save();
            return response()->json([
                'status'=>200,
                'message'=>'Certificate Added Successfully',
            ]);
        }
    }

    //03 View Certificate
    public function view_certificate($id)
    {
        $certificate=Certificate::find($id);

        if($certificate)
        {
            return response()->json([
                'status'=>200,
                'certificate'=>$certificate,
                'message'=>'Certificate Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Certificate Id Found',
            ]);
        }
    }

    //04 Update Certificate
    public function update_certificate(Request $request,$id)
    {
        $validationArray =[
            'cer_specialty'=>['string'],
            'cer_description'=>['string'],
            'cer_date'=>['string'],
            'cer_number'=>['string'],
            'user_name'=>['string'],
            'user_nationality'=>['string']
        ];

        $cet_e=Certificate::find($id);

        if($cet_e && $cet_e->title==$request->input('title'))
        {
            $validationArray['title']=['required','string','max:50'];
        }
        else
        {
            $validationArray['title']=['required','string','max:50','unique:certificates'];
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
            $certificate=Certificate::find($id);
            if($certificate)
            {
                $certificate->title=$request->input('title');

                if($request->hasFile('location'))
                {
                    $path = $certificate->location;
                    if(File::exists($path))
                    {
                        File::delete($path);
                    }
                    $file = $request->file('location');
                    $extension = $file->getClientOriginalExtension();

                    if($extension ==="pdf")
                    {
                        $filename = time().'.'.$extension;
                        $file->move('Uploads/Certificates/',$filename);
                        $certificate->location = 'Uploads/Certificates/'.$filename;
                    }
                    else
                    {
                        return response()->json([
                            'status'=>400,
                            'message'=>'We need pdf file (.pdf)',
                        ]);
                    }
                }
                else
                {
                    $certificate->location = $certificate->location;
                }

                /*
                    json_encode([
                        "key"=>$value,
                    ]);
                */

                $certificate->cer_degree=$request->input('cer_degree');
                $certificate->cer_specialty=$request->input('cer_specialty');
                $certificate->cer_description=$request->input('cer_description');
                $certificate->cer_date=$request->input('cer_date');
                $certificate->cer_number=$request->input('cer_number');
                $certificate->user_name=$request->input('user_name');
                $certificate->user_nationality=$request->input('user_nationality');

                $certificate->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Certificate Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Certificate Id Found',
                ]);
            }

        }
    }

    //05 Delete Certificate
    public function delete_certificate($id)
    {
        $certificate=Certificate::find($id);
        if($certificate)
        {
            $certificate->users = Certificate::find($id)->users;

            if(count($certificate->users)>0)
            {
                for($i=0; $i<count($certificate->users); $i++)
                {
                    $user=User::find($certificate->users[$i]->id);
                    if($user)
                    {
                        $user->certificate_id=null;
                        $user->save();
                    }
                }
            }

            $path = $certificate->certificate->location;
            if(File::exists($path))
            {
                File::delete($path);
            }

            $certificate->delete();

            return response()->json([
                'status'=>200,
                'message'=>'Certificate Deleted Successfully'
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Certificate Is Not Found',
            ]);
        }
    }

    //06 Fetch File (Certificate) (From ./public/Uploads/Certificates)
    public function fetch_pdf($name)
    {
        $file = null;

        try {
            $file = File::get('Uploads/Certificates/'.$name);
        }
        catch(Exception $e) {
            $response = Response::make($e->getMessage(),404);
            return $response;
        }

        $response = Response::make($file,200);
        $response->header('Content-Type', 'application/pdf');
        return $response;
    }
}
