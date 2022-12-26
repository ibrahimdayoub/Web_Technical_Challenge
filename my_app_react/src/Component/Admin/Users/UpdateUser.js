import React,{useState,useEffect} from 'react'
import {useHistory,Link} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert'

const UpdateUser =(props)=>{

    let id=props.match.params.id;
    let history=useHistory();
    let selectCertificate = [];

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [certificates,setCertificates]=useState([]);
    const [userInput,setUser]=useState({});
    const [errorList,setErrorList]=useState({});
    const [isChecked,setChecked]=useState("1");
    const [check,setCheck]=useState(false);

    const handleInput=(e)=>{
        e.persist();
        setUser({...userInput,[e.target.name]:e.target.value});
    };

    const userUpdate=(e)=>{
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

        if(isChecked==="0" )
        {
            data.password="useOldPassword";
        }

        axios.put(`/api/update_user/${id}`,data).then(res=>{
            if(res.data.status===200)
            {   
                swal("Success",res.data.message,"success");
                history.push('/admin/view_users');
            }
            else  if(res.data.status===404)
            {
                swal("Error",res.data.message,"error");
                history.push('/admin/view_users');
            }
            else
            {
                setErrorList(res.data.validation_errors);
            } 
        });
    };

    const handleCheck=(e)=>{
        setChecked(e.target.value==="1"?"0":"1");
    }

    const handleCheckPassword=(e)=>{
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

    useEffect(()=>{
        let flag=0;
        (async () => {
            await axios.get(`/api/view_user/${id}`).then(res=>{
                if(res.data.status===200)
                {
                    setUser(res.data.user);
                    flag++;
                }
                else if(res.data.status===404){
                    swal("Error",res.data.message,"error");
                    history.push('/admin/view_users');
                }
            }).then(
                await axios.get(`/api/view_certificates`).then(res=>{
                    if(res.data.status===200)
                    {
                        setCertificates(res.data.certificates);
                        flag++;
                    }
                })
            )

            if(flag==2)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
    },[props.match.params.id,history]);

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
                <span className="h1 my-4">Update User </span>
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
            <h1 className="my-4 d-none d-md-block">Update User</h1>
            <i className="fa fa-edit fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={userUpdate} className="my-5">
                <Link className="btn btn-sm btn-primary px-4 m-1 ms-auto" to="/admin/view_users" role="button"><i className="fa fa-chevron-left"></i></Link>

                <div className="border bg-light">
                    <div className="card-body border pt-5">
                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.first_name} name="first_name" className="form-control" id="inputFirstName" placeholder="Enter user first name" />
                            <label htmlFor="inputFirstName"> First Name</label>
                            <span className="text-danger">{errorList.first_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.middle_name} name="middle_name" className="form-control" id="inputMiddleName" placeholder="Enter user middle name" />
                            <label htmlFor="inputMiddleName"> Middle Name</label>
                            <span className="text-danger">{errorList.middle_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.last_name} name="last_name" className="form-control" id="inputLastName" placeholder="Enter user last name" />
                            <label htmlFor="inputLastName"> Last Name</label>
                            <span className="text-danger">{errorList.last_name}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input onChange={handleInput} value={userInput.nation} name="nation" className="form-control" id="inputNation" placeholder="Enter user nation" />
                            <label htmlFor="inputNation"> Nationality</label>
                            <span className="text-danger">{errorList.nation}</span>
                        </div>

                        <div className="form-floating mb-3 offset-md-1 col-md-10">
                            <input type="email" onChange={handleInput} value={userInput.email} name="email" className="form-control" id="inputEmail" placeholder="Enter user email" />
                            <label htmlFor="inputEmail"> Email</label>
                            <span className="text-danger">{errorList.email}</span>
                        </div>

                        <div className="mb-3 offset-md-1 col-md-10">
                            <select name="certificate_id" onChange={handleInput} defaultValue={userInput.certificate_id} className="form-select py-3" aria-label="Default select example">
                                <option className="d-none">Select Certificate</option>
                                <option value={0}>No Certificate</option>
                                {selectCertificate}
                            </select>
                            <span className="text-danger">{errorList.certificate_id}</span>
                        </div>

                        <div className="form-check mb-3 offset-md-1 col-md-10">
                            <input onChange={handleCheck} value={isChecked}  className="form-check-input" type="checkbox" id="reset_password" defaultChecked/>
                            <label htmlFor="reset_password" className={isChecked==="0"?"text-dark form-check-label":"text-primary form-check-label"}>
                                I Would Reset Password For This User
                            </label>
                        </div>

                        {
                            isChecked=="1"?
                            <div className="form-floating mb-3 offset-md-1 col-md-10">
                                <input type={check=="off"?"text":"password"} onChange={handleInput} value={userInput.password} name="password" className="form-control" id="inputPassword" placeholder="Enter user password" />
                                <label htmlFor="inputPassword"> New Password</label>
                                    <div className="form-check mt-1">
                                        <input className="form-check-input" type="checkbox" defaultChecked={false} id="show-password" name="showPassword" onChange={handleCheckPassword}/>
                                        <label className="form-check-label" htmlFor="show-password">
                                            Show New Password
                                        </label>
                                    </div>
                                <span className="text-danger">{errorList.password}</span>
                            </div>:
                            ""
                        }
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-block py-3 offset-md-1 col-md-10">Update User</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateUser;