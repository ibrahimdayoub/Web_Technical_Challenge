import React from 'react';
import {BrowserRouter,Redirect,Route,Switch} from 'react-router-dom';

import AdminPrivateRoutes   from './Routes/AdminPrivateRoutes';
import UserPrivateRoutes from './Routes/UserPrivateRoutes';

import Home             from './Component/Wellcome/Home';
import NotFound             from './Component/Wellcome/NotFound';
import Login            from './Component/Wellcome/Login';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import '../node_modules/@fortawesome/fontawesome-free/js/all.min.js';

import axios from 'axios';
axios.defaults.withCredentials=true;
axios.defaults.baseURL="http://localhost:8000/";
axios.defaults.headers.post['Content-Type']='application/json';
axios.defaults.headers.post['Accept']='application/json';
//axios.defaults.headers.get['Access-Control-Allow-Origin']='*';
axios.interceptors.request.use(function(config){
  const token=localStorage.getItem('auth_token');
  config.headers.Authorization=token?`Bearer ${token}`:``;
  return config;
})

const App =()=>{
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact  path="/" component={Home} />

          <Route path="/login">
            {localStorage.getItem("auth_token")?  <Redirect to={'/'} /> :<Login/>}
          </Route>

          <AdminPrivateRoutes path="/admin" name="admin" />
          <UserPrivateRoutes path="/user" name="user" />

          <Route exact path="/*" component={NotFound} />

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;