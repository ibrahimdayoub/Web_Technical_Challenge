import React,{useState,useEffect} from 'react';
import {Link,useHistory,Switch,Route,Redirect} from 'react-router-dom';
import Routes from '../../Routes/AdminRoutes';
import axios from 'axios';
import swal from 'sweetalert';


const Navbar =()=>{
    const history=useHistory();

    const logoutSubmit=(e)=>{
        e.preventDefault();

        axios.post('/api/logout').then(res=>{
            if(res.data.status===200)
            {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                localStorage.removeItem('auth_role');
                history.push('/');
                swal("Success",res.data.message,"success");

                setTimeout(() => {
                    history.go(0);
                }, 1500);
            }
        });
    }

    return(
        <div>
            <nav className="border border-primary border-5 border-top-0 border-bottom-0 border-end-0 navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/admin">CGS</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-md-0">
                            <li className="nav-item me-1" title="Home">
                                <Link className="nav-link" to="/admin/home"> <i className="fa fa-home fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Home</span></Link>
                            </li>
                            <li className="nav-item me-1" title="Users">
                                <Link className="nav-link" to="/admin/view_users"> <i className="fa fa-user fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Users</span></Link>
                            </li>
                            <li className="nav-item me-1" title="Fonts">
                                <Link className="nav-link" to="/admin/view_fonts"> <i className="fa fa-pencil-alt fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Fonts</span></Link>
                            </li>
                            <li className="nav-item me-1" title="Certificates">
                                <Link className="nav-link" to="/admin/view_certificates"> <i className="fa fa-award fa-2x"></i><span className="fs-5 ms-2 d-inline d-lg-none">Certificates</span></Link>
                            </li>
                            <li className="nav-item ms-lg-1" title="Logout">
                                <button onClick={logoutSubmit} className="nav-link btn btn-outline-primary px-2" >
                                    <i className="fa fa-sign-out-alt fs-4"></i>
                                    <span className="fs-5 ms-2 d-inline d-lg-none">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main>
                <Switch>
                {
                    Routes.map((route,idx)=>{
                        return(
                            route.component&& (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={(props)=>(
                                        <route.component {...props} />
                                    )}
                                />
                            )
                        )
                    })
                }
                <Redirect to='admin/home' />
                </Switch>
            </main>
        </div>
    )
}

export default Navbar 