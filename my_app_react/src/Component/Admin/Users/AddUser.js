import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';    
import axios from 'axios';
import swal from 'sweetalert'

const AddUser =()=>{
    let history=useHistory();
    let selectCertificate = [];

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [certificates,setCertificates]=useState([]);
    const [userInput,setUser]=useState({
        first_name:"",
        middle_name:"",
        last_name:"",
        nation:"",
        email:"",
        password:"",
        certificate_id:"",
        error_list:[]
    });
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setUser({...userInput,[e.target.name]:e.target.value});
    };

    const handleCheck=(e)=>{
        e.persist();

        if(e.target.value=="on")
        {
            e.target.value="off"
        }
        else if(e.target.value=="off")
        {
            e.target.value="on"
        }
        setCheck(e.target.value);
    }

    const userSubmit=(e)=>{
        e.preventDefault();

        const data={
            "first_name":userInput.first_name,
            "middle_name":userInput.middle_name,
            "last_name":userInput.last_name,
            "nation":userInput.nation,
            "email":userInput.email,
            "password":userInput.password,
            "certificate_id":userInput.certificate_id==null?0:userInput.certificate_id,
        }

        axios.post('/api/add_user',data).then(res=>{
            if(res.data.status===200)
            {
                swal("Success",res.data.message,"success");
                /*setTimeout(() => {
                    history.go(0);
                }, 2000);*/
                setUser({
                    ...userInput,
                    first_name:"",
                    middle_name:"",
                    last_name:"",
                    nation:"",
                    email:"",
                    password:"",
                    certificate_id:"",
                    error_list:[]
                })
            }
            else
            {
                setUser({...userInput,error_list:res.data.validation_errors});
            }
        });
    };

    useEffect(()=>{
        axios.get(`/api/view_certificates`).then(res=>{
            if(res.data.status===200)
            {
                setCertificates(res.data.certificates);
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        });
    },[]);

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
                <span className="h1 my-4">Add User </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
    else
    {
        selectCertificate=certificates.map((certificate,idx)=>{
            return(
                <option value={certificate.id} key={idx} className="bg-light p-4 mt-4 text-primary" label={certificate.title}>
                {
                    certificate.title
                }
                </option>
            )
        })
    }

    return(
        <div className="container px-4">
            <h1 className="my-4 d-none d-md-block">Add User</h1>
            <i className="fa fa-plus fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={userSubmit} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_users" role="button"><i className="fa fa-chevron-left"></i></Link>
                
                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter user first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{userInput.error_list.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter user middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{userInput.error_list.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter user last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{userInput.error_list.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.nation} name="nation" className="form-control" id="inputNation" placeholder="Enter user nation" />
                            <label htmlFor="inputNation"> Nationality</label>
                            <span className="text-danger">{userInput.error_list.nation}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={userInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter user email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{userInput.error_list.email}</span>
                        </div>
 
                        <div className="mb-3 offset-md-1 col-md-10">
                            <select name="certificate_id" onChange={handleInput} defaultValue={userInput.certificate_id} className="form-select py-3" aria-label="Default select example">
                                <option className="d-none">Select Certificate</option>
                                <option value={0}>No Certificate</option>
                                {selectCertificate}
                            </select>
                            <span className="text-danger">{userInput.error_list.certificate_id}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type={check=="off"?"text":"password"} onChange={handleInput} value={userInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter user password" />
                            <label htmlFor="inputPassword"> Password</label>
                            <div className="form-check mt-1">
                                <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheck}/>
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                            <span className="text-danger">{userInput.error_list.password}</span>
                        </div>

                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Add User</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddUser;