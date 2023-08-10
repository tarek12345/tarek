import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Route, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
/* import { GoogleLogin, GoogleLogout } from "react-google-login"; */
import "./UpdatePawword.css";
import { useDispatch, useSelector } from "react-redux";


const baseURL = process.env.REACT_APP_API_URL;
function UpdatePawword() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [password, setPassword] = useState("");
    const [isPassword, setisPassword] = useState(false);


      const handleResetPassword = async () => {
        try {
          await axios
            .post(baseURL + "/users/reset-password", {
                email:state.email,
                password:password,
                newPassword:newPassword
            })
            .then(async (response) => {
         
              toast.success(response.data.message, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
    
              navigate("/login", {
                replace: true,
                state: { email: state.email ,password:newPassword},
              });
            })
            .catch(function (error) {
                console.log(error.response.data.message
                    )
              toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
        } catch (e) {
          //console.log(e);
          toast.error("Identfiant incorrect!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }

      const Retour = async () => {
        navigate('/login')
       }
       useEffect(() => {
        const validatepass = () => {
      
            if (password!=state.password) {
               setisPassword(true)
            
            } else {
            
                setisPassword(false)
          
            }
          };
        validatepass()
      }, [password]);
  return (
    <section id="ResetLogin">
      <div className="login-box">
        <form action="">
          <h2>Modifier mot de  passe ?</h2>
         <span className="emailrest">E-mail : {state.email} {state.password}</span>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input type="text" required  value={password}  onChange={(e) => setPassword(e.target.value)}/>
            <label>Ancien mot de passe</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input type="text" required  value={newPassword}  onChange={(e) => setNewPassword(e.target.value)}/>
            <label>Noveau mot de passe</label>
          </div>
          <div className="d-flex ">
          <button type="reset" className="login me-2" onClick={Retour}>
            {" "}
            Retour
          </button>
          <button type="button" className="login" onClick={handleResetPassword}  disabled={!isPassword}>
        
            Enregister
          </button>
          </div>
      
        </form>
      </div>
      <Toaster />
    </section>
  )
}

export default UpdatePawword