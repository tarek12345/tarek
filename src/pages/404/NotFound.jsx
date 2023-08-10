import React from 'react'
import logo from "../../assets/logo.svg"
import { Route, useLocation, useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    const Retour =  () => {
        navigate('/login')
       }  
  return (
    <section>
    <div className="login-box">
      <form action="">
        <img src={logo} alt="logo" className="logo_auth" />
        <div className="registrer-link">
           <h1> Page  404   </h1> 
            <button type="button" className="login" onClick={Retour}>
            Retour
          </button>
        </div>
      </form>
    </div>

  </section>
  )
}

export default NotFound