<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;

use App\Models\Font;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class FontController extends Controller
{
    //01 View Fonts
    public function view_fonts()
    {
        $fonts=Font::all();

        return response()->json([
            'status'=>200,
            'fonts'=>$fonts,
        ]);
    }

    //02 Add Font
    public function add_font(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'title'=>['required','string','max:50','unique:fonts'],
            'location'=>['required','file']
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]);
        }
        else
        {
            $font=new Font;
            $font->title=$request->input('title');

            if($request->hasFile('location'))
            {
                $file = $request->file('location');
                $extension = $file->getClientOriginalExtension();

                if($extension ==="ttf")
                {
                    $filename = time().'.'.$extension;
                    $file->move('Uploads/Fonts/',$filename);
                    $font->location = 'Uploads/Fonts/'.$filename;
                }
                else
                {
                    return response()->json([
                        'status'=>400,
                        'message'=>'We need font file (.ttf)',
                    ]);
                }
            }
            else{
                return response()->json([
                    'status'=>400,
                    'message'=>'We need font file (.ttf)',
                ]);
            }

            $font->save();

            return response()->json([
                'status'=>200,
                'message'=>'Font Added Successfully',
            ]);
        }
    }

    //03 View Font
    public function view_font($id)
    {
        $font=Font::find($id);

        if($font)
        {
            return response()->json([
                'status'=>200,
                'font'=>$font,
                'message'=>'Font Fetched Successfully',
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message'=>'No Font Id Found',
            ]);
        }
    }

    //04 Update Font
    public function update_font(Request $request,$id)
    {
        $validationArray =[
        // 'location'=>['required','file'] it is a file :)
        ];

        $font_e=Font::find($id);

        if($font_e && $font_e->title==$request->input('title'))
        {
            $validationArray['title']=['required','string','max:50'];
        }
        else
        {
            $validationArray['title']=['required','string','max:50','unique:fonts'];
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
            $font=Font::find($id);
            if($font)
            {
                $font->title=$request->input('title');

                if($request->hasFile('location'))
                {
                    $path = $font->location;
                    if(File::exists($path))
                    {
                        File::delete($path);
                    }
                    $file = $request->file('location');
                    $extension = $file->getClientOriginalExtension();

                    if($extension ==="ttf")
                    {
                        $filename = time().'.'.$extension;
                        $file->move('Uploads/Fonts/',$filename);
                        $font->location = 'Uploads/Fonts/'.$filename;
                    }
                    else
                    {
                        return response()->json([
                            'status'=>400,
                            'message'=>'We need font file (.ttf)',
                        ]);
                    }
                }
                else
                {
                    $font->location = $font->location;
                }

                $font->save();
                return response()->json([
                    'status'=>200,
                    'message'=>'Font Updated Successfully',
                ]);
            }
            else
            {
                return response()->json([
                    'status'=>404,
                    'message'=>'No Font Id Found',
                ]);
            }
        }
    }

    //05 Delete Font
    public function delete_font($id)
    {
        $font=Font::find($id);
        if($font)
        {
            $font->delete();

            return response()->json([
                'status'=>200,
                'message'=>'Font Deleted Successfully'
            ]);
        }
        else
        {
            return response()->json([
                'message'=>'Font Is Not Found',
            ]);
        }
    }

    //Fetch File (Font) (From ./public/Uploads/Fonts/)
    public function fetch_font($name)
    {
        $file = null;

        try {
            $file = File::get('Uploads/Fonts/'.$name);
        }
        catch(Exception $e) {
            $response = Response::make($e->getMessage(),404);
            return $response;
        }

        $response = Response::make($file,200);
        $response->header('Content-Type', 'application/x-font-truetype');
        return $response;
    }

}
