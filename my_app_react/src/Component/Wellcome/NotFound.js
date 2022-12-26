import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="container">
      <div className="text-center text-primary fw-bold fs-2 shadow-lg rounded-lg mt-5 mx-auto col-md-5 p-5 bg-light">
        Page Not Found | 404
        <Link className="nav-link" to="/"> <i className="fa fa-home fa-2x"></i><span className="fs-4 ms-2 d-inline d-lg-none">Home</span></Link>
      </div>
    </div>
  )
}

export default NotFound