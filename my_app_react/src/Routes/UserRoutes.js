import Home                         from '../Component/User/Home'; 
import GetCertificate               from '../Component/User/GetCertificate'; 
import DownloadCertificate          from '../Component/User/DownloadCertificate'; 

import NotFound                     from '../Component/Wellcome/NotFound';

const Routes=[
    {path:'/user', exact:true, name:'user'},
    {path:'/user/home', exact:true, name:'home', component:Home},
    {path:'/user/get_certificate', exact:true, name:'GetCertificate', component:GetCertificate},
    {path:'/user/download_certificate', exact:true, name:'DownloadCertificate', component:DownloadCertificate},

    { path: '/user/*', exact:true, name:'not_found', component:NotFound}
]

export default Routes;