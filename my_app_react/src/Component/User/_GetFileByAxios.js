import React,{useEffect} from 'react'
import axios from 'axios';

const X =()=>{
    useEffect(()=>{

        /*  pdf :)
            const location = 'Uploads/Certificates/cert.pdf'
            const name = location.split("/")[2] // route api is: get('fetch_pdf/Uploads/Certificates/{name}' , name is variable :)

            axios.get(`/api/fetch_pdf/${name}`,{responseType: "arraybuffer"})
            .then(res=>{
                console.log("res",res.data)
            })
            .catch(function (error) {
                if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                } 
                else if (error.request) 
                {
                // The request was made but no response was received
                console.log(error.request);
                } 
                else 
                {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                }
            })
        */

        /* font :)
            const location = 'Uploads/Fonts/font.ttf'
            const name = location.split("/")[2] // route api is: get('fetch_font/Uploads/Fonts/{name}' , name is variable :)

            axios.get(`/api/fetch_font/${name}`,{responseType: "arraybuffer"})
            .then(res=>{
                console.log("res",res.data)
            })
            .catch(function (error) {
                if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                } 
                else if (error.request) 
                {
                // The request was made but no response was received
                console.log(error.request);
                } 
                else 
                {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                }
            })
        */
 
    },[]);

    return(
        <div className="container container m-5">
        <h1>By Axios...</h1>
        </div>
    )
}

export default X;