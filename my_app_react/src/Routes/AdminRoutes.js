import Home                 from '../Component/Admin/Home';
import ViewUsers            from '../Component/Admin/Users/ViewUsers';  
import AddUser              from '../Component/Admin/Users/AddUser';  
import UpdateUser           from '../Component/Admin/Users/UpdateUser';
import ViewFonts            from '../Component/Admin/Fonts/ViewFonts';  
import AddFont              from '../Component/Admin/Fonts/AddFont';  
import UpdateFont           from '../Component/Admin/Fonts/UpdateFont';
import ViewCertificates     from '../Component/Admin/Certificates/ViewCertificates';  
import AddCertificate       from '../Component/Admin/Certificates/AddCertificate';  
import UpdateCertificate    from '../Component/Admin/Certificates/UpdateCertificate';

import NotFound             from '../Component/Wellcome/NotFound';

const Routes=[
    { path: '/admin', exact:true, name:'admin'},
    { path: '/admin/home', exact:true, name:'home', component:Home},

    { path: '/admin/view_users', exact:true, name:'view_users', component:ViewUsers},
    { path: '/admin/add_user', exact:true, name:'add_user', component:AddUser},
    { path: '/admin/update_user/:id', exact:true, name:'update_user', component:UpdateUser},

    { path: '/admin/view_fonts', exact:true, name:'view_fonts', component:ViewFonts},
    { path: '/admin/add_font', exact:true, name:'add_font', component:AddFont},
    { path: '/admin/update_font/:id', exact:true, name:'update_font', component:UpdateFont},

    { path: '/admin/view_certificates', exact:true, name:'view_certificates', component:ViewCertificates},
    { path: '/admin/add_certificate', exact:true, name:'add_certificate', component:AddCertificate},
    { path: '/admin/update_certificate/:id', exact:true, name:'update_certificate', component:UpdateCertificate},

    { path: '/admin/*', exact:true, name:'not_found', component:NotFound}
]

export default Routes;