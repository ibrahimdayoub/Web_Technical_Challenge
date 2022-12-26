import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'; 
import axios from 'axios';
import swal from 'sweetalert';

const DownloadCertificate =()=>{
    const history = useHistory();

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [errorFlag,setErrorFlag]=useState(false);

    const [userData,setUserData]=useState({})
    const [pdfArrayBuffer,setPdfArrayBuffer]=useState(null)
    const [fontsArrayBuffers,setFontsArrayBuffers]=useState({}) //font_name: value (arraybuffer)

    const [infoInput,setInfo]=useState({
        cer_degree:'',
        cer_date:(((new Date().toISOString().substring(0, 10)).split('-')).reverse()).join('/'),
        cer_description:'',
        cer_specialty:'',
        cer_number:new Date().getTime().toString(),
        user_name:'',
        user_nationality:''
    });

    const handleInput=(e)=>{
        e.persist();
        setInfo({...infoInput,[e.target.name]:e.target.value});
        setErrorFlag(false)
    };

    const infoSubmit= (e)=>{
        e.preventDefault();

        const info ={
            "cer_degree":infoInput.cer_degree,
            "cer_date":infoInput.cer_date,
            "cer_description":infoInput.cer_description,
            "cer_specialty":infoInput.cer_specialty,
            "cer_number":infoInput.cer_number,
            "user_name": !infoInput.user_name? `${userData.first_name} ${userData.middle_name} ${userData.last_name}` : infoInput.user_name,
            "user_nationality": !infoInput.user_nationality? `${userData.nation}` : infoInput.user_nationality
        }

        if(
            info.cer_degree &&
            info.cer_description &&
            info.cer_specialty
        )
        {
            const cerObj = Object.fromEntries(Object.entries(userData.certificate).filter(([key]) => key.includes('cer_'))) //certificate data
            const userObj = Object.fromEntries(Object.entries(userData.certificate).filter(([key]) => key.includes('user_'))) //user data
            const bigObj = {...cerObj,...userObj}

            history.push({
                pathname: '/user/download_certificate',
                state: { info, detail:bigObj , pdfArrayBuffer, fontsArrayBuffers}
            });
        }
        else
        {
            setErrorFlag(true)
            swal("Error","Certificate degree, description and specialty required","error")
        }
    };

    useEffect(()=>{
        let flag=0;
        let id;
        (async () => {
            await axios.get(`/api/authenticated_user`).then(res=>{
                if(res.data.status===200)
                {
                    id = res.data.id;
                    flag++;
                }
            })
            .catch(function (error) {
                console.log(error);
            })

            await axios.get(`/api/view_user/${id}`).then(async res=>{
                if(res.data.status===200)
                {
                    setUserData(res.data.user)

                    if(!res.data.user.certificate_id)
                    {
                        swal("Error","No certificate for you","error");
                        history.push('/user/home');
                    }
                    else
                    {
                        //fetch certificate
                        const location = res.data.user.certificate.location
                        const name = location.split("/")[2]
                        await axios.get(`/api/fetch_pdf/${name}`,{responseType: "arraybuffer"})
                        .then(res=>{
                            setPdfArrayBuffer(res.data)
                            flag++;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })

                        //fetch fonts
                        const cerObj = Object.fromEntries(Object.entries(res.data.user.certificate).filter(([key]) => key.includes('cer_'))) //certificate data
                        const userObj = Object.fromEntries(Object.entries(res.data.user.certificate).filter(([key]) => key.includes('user_'))) //user data
                        const bigObj = {...cerObj,...userObj}

                        const keys = Object.keys(bigObj);
                        const length = Object.keys(bigObj).length;
                        let files_names = []
                        
                        for(let i=0; i<length; i++)
                        {   
                            const smObj = JSON.parse(bigObj[keys[i]])   
                            let font_type = Object.fromEntries(Object.entries(smObj).filter(([key]) => key.includes('font_type')));
                            font_type  = smObj[Object.keys(font_type)[0]]
                            files_names.push(font_type)
                        }

                        files_names = files_names.filter((file_name)=>{ //remove empty files names
                            return file_name 
                        })

                        files_names = [...new Set(files_names)] //remove duplicate files names

                        for(let i=0; i<files_names.length;i++)
                        {
                            const name = (files_names[i]).split("/")[2]
                            await axios.get(`/api/fetch_font/${name}`,{responseType: "arraybuffer"})
                            .then(res=>{
                                setFontsArrayBuffers({...fontsArrayBuffers,[name]:res.data})
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                        }
                    }
                    flag++;
                }
            })
            .catch(function (error) {
                console.log(error);
            })

            if(flag===3)
            {
                setLoading(false);
            }
            else
            {
                setError(true);
            }
        })();
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
                <span className="h1 my-4">Get Certificate </span>
                <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container px-4 w-100 p-2">
            <h1 className="my-4 d-none d-md-block">Get Certificate</h1>
            <i className="fa fa-award fa-3x text-primary my-4 d-md-none"></i>

            <form onSubmit={infoSubmit} className="my-5">                
                <div className="border bg-light py-3">
                    <div className="form-floating mb-3 offset-md-1 col-md-10">
                        <input onChange={handleInput} value={infoInput.user_name} name="user_name" className="form-control" id="infoUserName" placeholder="Enter info user_name" />
                        <label htmlFor="infoUserName"> User Name</label>
                    </div>
                
                    <div className="form-floating mb-3 offset-md-1 col-md-10">
                        <input onChange={handleInput} value={infoInput.user_nationality} name="user_nationality" className="form-control" id="infoUserNationalitu" placeholder="Enter info user_nationality" />
                        <label htmlFor="infoUserNationalitu"> User Nationality</label>
                    </div>

                    <div className="form-floating mb-3 offset-md-1 col-md-10">
                        <input onChange={handleInput} value={infoInput.cer_degree} name="cer_degree" className={errorFlag?'border border-danger form-control':'form-control'} id="infoDegree" placeholder="Enter info cer_degree" />
                        <label htmlFor="infoDegree"> Certificate Degree</label>
                    </div>

                    <div className="form-floating mb-3 offset-md-1 col-md-10">
                        <input onChange={handleInput} value={infoInput.cer_specialty} name="cer_specialty" className={errorFlag?'border border-danger form-control':'form-control'} id="infoSpeciality" placeholder="Enter info cer_specialty" />
                        <label htmlFor="infoSpeciality"> Certificate Speciality</label>
                    </div>
            

                    <div className="form-floating mb-3 offset-md-1 col-md-10">
                        <input onChange={handleInput} value={infoInput.cer_description} name="cer_description" className={errorFlag?'border border-danger form-control':'form-control'} id="infoDescription" placeholder="Enter info cer_description" />
                        <label htmlFor="infoDescription"> Certificate Description</label>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary py-2 offset-md-1  col-md-10">Get Certificate</button>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default DownloadCertificate;