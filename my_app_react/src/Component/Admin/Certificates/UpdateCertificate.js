import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom';   
import InputProps from './InputProps'; 
import axios from 'axios';
import swal from 'sweetalert';

const UpdateCertificate =(props)=>{
    const history = useHistory();
    let selectFont = [];

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);

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
        console.log(certificateInput)
        setCertificate({...certificateInput,[e.target.name]:e.target.value});
    };

    const handleCertificate=(e)=>{
        e.persist();
        setLocation({location:e.target.files[0]});
    };

    const certificateUpdate=(e)=>{
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

       axios.post( `/api/update_certificate/${props.match.params.id}`,formData).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                history.push('/admin/view_certificates');
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
        let flag=0;
        (async () => {
            await axios.get(`/api/view_fonts`).then(res=>{
                if(res.data.status===200)
                {
                    setFonts(res.data.fonts);
                    flag++;
                }
            }).then(
                await axios.get(`/api/view_certificate/${props.match.params.id}`).then(res=>{
                    if(res.data.status===200)
                    {
                        const data = {
                            title:res.data.certificate.title,
                            ...JSON.parse(res.data.certificate.cer_degree),
                            ...JSON.parse(res.data.certificate.cer_specialty),
                            ...JSON.parse(res.data.certificate.cer_description),
                            ...JSON.parse(res.data.certificate.user_name),
                            ...JSON.parse(res.data.certificate.user_nationality),
                            ...JSON.parse(res.data.certificate.cer_date),
                            ...JSON.parse(res.data.certificate.cer_number)
                        }

                        setCertificate({
                            ...certificateInput,
                            ...data
                        });

                        flag++;
                    }
                })
            )

            if(flag===2)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
    },[props.match.params.id, history, certificateInput]);

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
                <span className="h1 my-4">Update Certificate </span>
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
            <h1 className="my-4 d-none d-md-block">Update Certificate</h1>
            <i className="fa fa-edit fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={certificateUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_certificates" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10 py-1">
                            <input onChange={handleInput} value={certificateInput.title} name="title" className="form-control" id="inputTitle" placeholder="Enter certificate title" />
                            <label htmlFor="inputTitle"> Title</label>
                            {/*<span className="text-danger">{certificateInput.error_list.title}</span>*/}
                        </div>

                        <div className="mb-3 offset-md-1 col-md-10">
                            <label htmlFor="inputLocation"> Location (.pdf)</label>
                            <input type="file" onChange={handleCertificate} name="location" className="form-control" id="inputLocation" placeholder="Enter certificate location" />
                            {/*<span className="text-danger">{certificateInput.error_list.location}</span>*/}
                        </div>

                        <InputProps target="cer_degree" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        <InputProps target="cer_specialty" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        <InputProps target="cer_description" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        <InputProps target="user_name" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        <InputProps target="user_nationality" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>
                    
                        <InputProps target="cer_date" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                        <InputProps target="cer_number" handleInput={handleInput} selectFont={selectFont} certificateInput={certificateInput}/>

                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update Certificate</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateCertificate;