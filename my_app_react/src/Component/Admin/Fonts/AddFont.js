import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom';    
import axios from 'axios';
import swal from 'sweetalert'

const AddFont =()=>{
    const history = useHistory();

    const [fontInput,setFont]=useState({
        title:"",
        error_list:[]
    });
    const [locationInput,setLocation]=useState({});

    const handleInput=(e)=>{
        e.persist();
        setFont({...fontInput,[e.target.name]:e.target.value});
    };

    const handleFont=(e)=>{
        e.persist();
        setLocation({location:e.target.files[0]});
    };

    const fontSubmit=(e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('title',fontInput.title)
        formData.append('location',locationInput.location)

        axios.post('/api/add_font',formData).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                setFont({
                    ...fontInput,
                    title:"",
                    error_list:[]
                })
                setLocation({
                    ...locationInput,
                    location:""
                })
            }
            else if(res.data.status===400)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_fonts');
            }
            else
            {
                setFont({...fontInput,error_list:res.data.validation_errors});
            }
        });
    };

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add Font</h1>
            <i className="fa fa-plus fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={fontSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_fonts" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={fontInput.title} name="title" className="form-control" id="inputTitle" placeholder="Enter font title" />
                            <label htmlFor="inputTitle"> Title</label>
                            <span className="text-danger">{fontInput.error_list.title}</span>
                        </div>
                        <div className="mb-3 offset-md-1 col-md-10">
                            <label htmlFor="inputLocation">Location (.ttf)</label>
                            <input type="file" onChange={handleFont} name="location" className="form-control" id="inputLocation" placeholder="Enter font location" />
                            <span className="text-danger">{fontInput.error_list.location}</span>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add Font</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddFont;