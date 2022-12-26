import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom';   
import InputProps from './InputProps'; 
import axios from 'axios';
import swal from 'sweetalert';
import { PDFDocument,StandardFonts} from 'pdf-lib'  
import fontkit from '@pdf-lib/fontkit'
import fileToArrayBuffer from 'file-to-array-buffer'

const AddCertificate =()=>{
    const history = useHistory();
    let selectFont = [];

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [flag,setFlag]=useState(true);
    const [pdfUrl, setPdfUrl] = useState(null); //for show

    const [fonts,setFonts]=useState({});
    const [certificateInput,setCertificate]=useState({
        title:"",

        cer_degree_font_type:"",
        cer_degree_font_size:"",
        cer_degree_font_color:"",
        cer_degree_x_position:"",
        cer_degree_y_position:"",

        cer_specialty_font_type:"",
        cer_specialty_font_size:"",
        cer_specialty_font_color:"",
        cer_specialty_x_position:"",
        cer_specialty_y_position:"",

        cer_description_font_type:"",
        cer_description_font_size:"",
        cer_description_font_color:"",
        cer_description_x_position:"",
        cer_description_y_position:"",

        user_name_font_type:"",
        user_name_font_size:"",
        user_name_font_color:"",
        user_name_x_position:"",
        user_name_y_position:"",

        user_nationality_font_type:"",
        user_nationality_font_size:"",
        user_nationality_font_color:"",
        user_nationality_x_position:"",
        user_nationality_y_position:"",

        cer_date_font_type:"",
        cer_date_font_size:"",
        cer_date_font_color:"",
        cer_date_x_position:"",
        cer_date_y_position:"",


        cer_number_font_type:"",
        cer_number_font_size:"",
        cer_number_font_color:"",
        cer_number_x_position:"",
        cer_number_y_position:"",

        error_list:[]
    });
    const [locationInput,setLocation]=useState({});

    const handleInput=(e)=>{
        e.persist();
        setCertificate({...certificateInput,[e.target.name]:e.target.value});
    };

    const handleCertificate=(e)=>{
        e.persist();
        setLocation({location:e.target.files[0]});
    };

    const certificateSubmit=async(e)=>{
        e.preventDefault();

        const cer_degree = {
            cer_degree_font_type:certificateInput.cer_degree_font_type,
            cer_degree_font_size:certificateInput.cer_degree_font_size,
            cer_degree_font_color:certificateInput.cer_degree_font_color,
            cer_degree_x_position:certificateInput.cer_degree_x_position,
            cer_degree_y_position:certificateInput.cer_degree_y_position,
        }
        const cer_specialty = {
            cer_specialty_font_type:certificateInput.cer_specialty_font_type,
            cer_specialty_font_size:certificateInput.cer_specialty_font_size,
            cer_specialty_font_color:certificateInput.cer_specialty_font_color,
            cer_specialty_x_position:certificateInput.cer_specialty_x_position,
            cer_specialty_y_position:certificateInput.cer_specialty_y_position,
        }
        const cer_description = {
            cer_description_font_type:certificateInput.cer_description_font_type,
            cer_description_font_size:certificateInput.cer_description_font_size,
            cer_description_font_color:certificateInput.cer_description_font_color,
            cer_description_x_position:certificateInput.cer_description_x_position,
            cer_description_y_position:certificateInput.cer_description_y_position,
        }
        const user_name = {
            user_name_font_type:certificateInput.user_name_font_type,
            user_name_font_size:certificateInput.user_name_font_size,
            user_name_font_color:certificateInput.user_name_font_color,
            user_name_x_position:certificateInput.user_name_x_position,
            user_name_y_position:certificateInput.user_name_y_position,
        }
        const user_nationality = {
            user_nationality_font_type:certificateInput.user_nationality_font_type,
            user_nationality_font_size:certificateInput.user_nationality_font_size,
            user_nationality_font_color:certificateInput.user_nationality_font_color,
            user_nationality_x_position:certificateInput.user_nationality_x_position,
            user_nationality_y_position:certificateInput.user_nationality_y_position,
        }
        const cer_date = {
            cer_date_font_type:certificateInput.cer_date_font_type,
            cer_date_font_size:certificateInput.cer_date_font_size,
            cer_date_font_color:certificateInput.cer_date_font_color,
            cer_date_x_position:certificateInput.cer_date_x_position,
            cer_date_y_position:certificateInput.cer_date_y_position,
        }
        const cer_number = {
            cer_number_font_type:certificateInput.cer_number_font_type,
            cer_number_font_size:certificateInput.cer_number_font_size,
            cer_number_font_color:certificateInput.cer_number_font_color,
            cer_number_x_position:certificateInput.cer_number_x_position,
            cer_number_y_position:certificateInput.cer_number_y_position,
        }


        const formData = new FormData();
        formData.append('title',certificateInput.title)
        formData.append('cer_degree', JSON.stringify(cer_degree))
        formData.append('cer_specialty', JSON.stringify(cer_specialty))
        formData.append('cer_description', JSON.stringify(cer_description))
        formData.append('user_name', JSON.stringify(user_name))
        formData.append('user_nationality', JSON.stringify(user_nationality))
        formData.append('cer_date', JSON.stringify(cer_date))
        formData.append('cer_number', JSON.stringify(cer_number))
        formData.append('location',locationInput.location)

        axios.post('/api/add_certificate',formData).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setCertificate({
                    ...certificateInput,
                    title:"",
                    error_list:[]
                })
                setLocation({
                    ...locationInput,
                    location:""
                })
            }
            else if(res.data.status===400 || res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_certificates');
            }
            else
            {
                setCertificate({...certificateInput,error_list:res.data.validation_errors});
            }
        });
    };

    useEffect(()=>{
        axios.get(`/api/view_fonts`).then(res=>{
            if(res.data.status===200)
            {
                setFonts(res.data.fonts);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        });
    },[pdfUrl]);

    const show = async()=>{

        setFlag(!flag)

        const cer_degree = {
            cer_degree_font_type:certificateInput.cer_degree_font_type,
            cer_degree_font_size:certificateInput.cer_degree_font_size,
            cer_degree_font_color:certificateInput.cer_degree_font_color,
            cer_degree_x_position:certificateInput.cer_degree_x_position,
            cer_degree_y_position:certificateInput.cer_degree_y_position,
        }
        const cer_specialty = {
            cer_specialty_font_type:certificateInput.cer_specialty_font_type,
            cer_specialty_font_size:certificateInput.cer_specialty_font_size,
            cer_specialty_font_color:certificateInput.cer_specialty_font_color,
            cer_specialty_x_position:certificateInput.cer_specialty_x_position,
            cer_specialty_y_position:certificateInput.cer_specialty_y_position,
        }
        const cer_description = {
            cer_description_font_type:certificateInput.cer_description_font_type,
            cer_description_font_size:certificateInput.cer_description_font_size,
            cer_description_font_color:certificateInput.cer_description_font_color,
            cer_description_x_position:certificateInput.cer_description_x_position,
            cer_description_y_position:certificateInput.cer_description_y_position,
        }
        const user_name = {
            user_name_font_type:certificateInput.user_name_font_type,
            user_name_font_size:certificateInput.user_name_font_size,
            user_name_font_color:certificateInput.user_name_font_color,
            user_name_x_position:certificateInput.user_name_x_position,
            user_name_y_position:certificateInput.user_name_y_position,
        }
        const user_nationality = {
            user_nationality_font_type:certificateInput.user_nationality_font_type,
            user_nationality_font_size:certificateInput.user_nationality_font_size,
            user_nationality_font_color:certificateInput.user_nationality_font_color,
            user_nationality_x_position:certificateInput.user_nationality_x_position,
            user_nationality_y_position:certificateInput.user_nationality_y_position,
        }
        const cer_date = {
            cer_date_font_type:certificateInput.cer_date_font_type,
            cer_date_font_size:certificateInput.cer_date_font_size,
            cer_date_font_color:certificateInput.cer_date_font_color,
            cer_date_x_position:certificateInput.cer_date_x_position,
            cer_date_y_position:certificateInput.cer_date_y_position,
        }
        const cer_number = {
            cer_number_font_type:certificateInput.cer_number_font_type,
            cer_number_font_size:certificateInput.cer_number_font_size,
            cer_number_font_color:certificateInput.cer_number_font_color,
            cer_number_x_position:certificateInput.cer_number_x_position,
            cer_number_y_position:certificateInput.cer_number_y_position,
        }
        
        let files_names = [
            certificateInput.cer_degree_font_type,
            certificateInput.cer_specialty_font_type,
            certificateInput.cer_description_font_type,
            certificateInput.user_name_font_type,
            certificateInput.user_nationality_font_type,
            certificateInput.cer_date_font_type,
            certificateInput.cer_number_font_type
        ]
        files_names = files_names.filter((file_name)=>{ //remove empty files names
            return file_name 
        })
        files_names = [...new Set(files_names)] //remove duplicate files names

        let fontsArrayBuffers = {}
        for(let i=0; i<files_names.length;i++)
        {
            const name = (files_names[i]).split("/")[2]
            await axios.get(`/api/fetch_font/${name}`,{responseType: "arraybuffer"})
            .then(res=>{
                fontsArrayBuffers[name]=res.data
            })
            .catch(function (error) {
                console.log(error);
            })
        }
        //console.log("fontsArrayBuffers",fontsArrayBuffers)

        const info = {
            cer_degree:"Certificate degree test",
            cer_specialty:"Certificate specialty test",
            cer_description:"Certificate description test",
            user_name:"User name test",
            user_nationality:"User nationality test",
            cer_date:"Certificate date test",
            cer_number:"Certificate number test"
        }
        //console.log("info",info);

        let detail = {
            cer_degree:JSON.stringify(cer_degree),
            cer_specialty:JSON.stringify(cer_specialty),
            cer_description:JSON.stringify(cer_description),
            user_name:JSON.stringify(user_name),
            user_nationality:JSON.stringify(user_nationality),
            cer_date:JSON.stringify(cer_date),
            cer_number:JSON.stringify(cer_number)
        }
        //console.log("detail",detail);

        let pdfArrayBuffer = null

        if(locationInput.location && locationInput.location.type === "application/pdf")
        {
            await fileToArrayBuffer(locationInput.location).then((data) => {
                pdfArrayBuffer = data
            })
        }
        //console.log("pdfArrayBuffer",pdfArrayBuffer)


        //validation
        if(!pdfArrayBuffer)
        {
            swal("Error","Certificate location (.pdf) required","error")
            setFlag(true)
        }
        else
        {
            await modifyPdf(info, detail, pdfArrayBuffer, fontsArrayBuffers)
        }
    }
    
    const modifyPdf = async (info, detail, pdfArrayBuffer, fontsArrayBuffers) =>{
        const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
        pdfDoc.registerFontkit(fontkit);

        for(let i=0; i<Object.keys(detail).length; i++)
        {   
            const smObj = JSON.parse(detail[Object.keys(detail)[i]])
            //console.log("O",smObj)

            let font_type = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_type')));
            let font_size = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_size')));
            let font_color = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_color')));
            let x_position = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('x_position')));
            let y_position = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('y_position')));

            //console.log(font_type,font_color,x_position)

            font_type  = smObj[Object.keys(font_type)[0]]            //set it standard :)
            font_size  = parseInt(smObj[Object.keys(font_size)[0]])  ||  16
            font_color = smObj[Object.keys(font_color)[0]]           || "#f00"
            x_position = parseInt(smObj[Object.keys(x_position)[0]]) ||  200
            y_position = parseInt(smObj[Object.keys(y_position)[0]]) ||  100

            //console.log(font_type,font_color,x_position)

           /* if(font_color[0]==="#")
            {*/
                const hexToRGBA = (hex) => {
                    return (hex = hex.replace('#', ''))
                        .match(new RegExp('(.{' + hex.length/3 + '})', 'g'))
                        .map(function(l) { return parseInt(hex.length%2 ? l+l : l, 12) })    
                }
    
                font_color = {
                    blue: hexToRGBA(font_color)[2],
                    green:hexToRGBA(font_color)[1],
                    red:hexToRGBA(font_color)[0],
                    type:"RGB"
                }
           /* }*/


            font_type = await font_type.split("/")[2]

            console.log(font_type,font_color,x_position)

            font_type = fontsArrayBuffers[font_type] ? await pdfDoc.embedFont(fontsArrayBuffers[font_type]) : await pdfDoc.embedFont(StandardFonts.TimesRoman)

            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            firstPage.drawText(info[Object.keys(info)[i]], {
              x: x_position,
              y:y_position,
              size: font_size,
              font: font_type,
              color: font_color
            })
        }

        //Show Pdf
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfUrl(pdfDataUri)
    }

    if(error)
    {
        return (
            <div className="container px-4 py-4 text-danger">
                <button onClick={()=>history.goBack()} className="btn btn-sm btn-outline-danger px-4 me-3 mb-3">
                    <i className="fa fa-chevron-left"></i>
                </button>
                <span className="h1 my-4">Something went wrong.</span>
            </div>
        )
    }
    else if(loading)
    {
        return (
            <div className="container px-4 py-4 text-primary">
                <span className="h1 my-4">Add Certificate </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        selectFont=fonts.map((font,idx)=>{
            return(
                <option value={font.location} key={idx} className="bg-light p-4 mt-4 text-primary" label={font.title}>
                {
                    font.title
                }
                </option>
            )
        })
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Certificate</h1>
            <i className="fa fa-plus fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={certificateSubmit} className="my-5">
                <div className="d-flex justify-content-between">
                    <Link className="btn btn-sm btn-primary px-4 m-1 me-auto" to="/admin/view_certificates" role="button"><i className="fa fa-chevron-left"></i></Link>
                    <button type="button" className="btn btn-sm btn-primary px-4 m-1 ms-auto" onClick={show} ><i className="fa fa-eye"></i></button>
                </div>

                {
                    flag?
                    <div className="border bg-light">
                        <div className="card-body border pt-5">
                            <div className="form-floating mb-3 offset-md-1 col-md-10 py-1">
                                <input onChange={handleInput} value={certificateInput.title} name="title" className="form-control" id="inputTitle" placeholder="Enter certificate title" />
                                <label htmlFor="inputTitle"> Title</label>
                                <span className="text-danger">{certificateInput.error_list.title}</span>
                            </div>

                            <div className="mb-3 offset-md-1 col-md-10">
                                <label htmlFor="inputLocation"> Location (.pdf)</label>
                                <input type="file" onChange={handleCertificate} name="location" className="form-control" id="inputLocation" placeholder="Enter certificate location" />
                                <span className="text-danger">{certificateInput.error_list.location}</span>
                            </div>

                            <InputProps target="cer_degree" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                            <InputProps target="cer_specialty" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                            <InputProps target="cer_description" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                            <InputProps target="user_name" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                            <InputProps target="user_nationality" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>
                        
                            <InputProps target="cer_date" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                            <InputProps target="cer_number" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        </div>
                    </div>:
                    <iframe style={{height:500}} className="w-100 rounded" title="test-frame" src={pdfUrl} type="application/pdf" />
                }

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Certificate</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddCertificate;