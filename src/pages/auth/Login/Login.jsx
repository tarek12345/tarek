import React, { useState, useEffect } from "react";
import logo from "../../../assets/logo.svg"
import { Route, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
/* import { GoogleLogin, GoogleLogout } from "react-google-login"; */
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../../redux/features/user";
import axios from "axios";
import { useJwt } from "react-jwt";
import Cookies from "universal-cookie";
const baseURL = process.env.REACT_APP_API_URL;

export default function Login() {
  
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (evnt) => {
    setPassword(evnt.target.value);
  };
  const [isEmail, setIsEmail] = useState(false);
  const [ischecked, setIschecked] = useState({ email: "", password: "" });
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };
  const connect = async () => {
    try {
      await axios
        .post(baseURL + "/auth/login", {
          email: email,
          password: password,
        })
        .then(async (response) => {
          cookies.set("authorization", response.data.data.data.token, {
            path: "/",
          });
          cookies.set("refresh", response.data.data.data.refreshtoken, {
            path: "/",
          });
          
          await dispatch(login(response.data.data.data));
          setTimeout(() => {
            navigate("/");
          }, 3000);

          toast.success(response.data.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          //this.props.navigation.navigate('Dashbord')
        })
        .catch(function (error) {
          toast.error(error.response.data.errors[0].message, {
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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const validateEmail = () => {
      if (emailRegex.test(email)) {
        setIsEmail(true);
      
      } else {
        setIsEmail(false);
    
      }
    };
  
    const validateckebox = () => {
      if (checked) {
        setIschecked(true)
      
      } else {
        setIschecked(false)
    
      }
    };

    validateEmail();
    validateckebox();
  }, [email,checked]);
  const Addcpompte =  () => {
    navigate('/CreateLogin')
   }  
   const UpdatePawwords =  () => {
    navigate("/UpdatePawword", {
      replace: true,
      state: { email: email,password:password},
    })
   }

  return (
    <section>
      <div className="login-box">
        <form action="">
          <img src={logo} alt="logo" className="logo_auth" />
          <div className="input-box">
          {!isEmail ? <span className="icon">
              <i className="fa-solid fa-envelope"></i> <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </span>: <span className="icon">
              <i className="fa-solid fa-envelope"></i> <i className="fa-solid fa-badge-check"></i>
            </span>}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Email</label>
         
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
              <button type="button"
                      className="btn btn-outline-primary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword  ? (
                    <i className="fa-solid fa-eye"></i>
                      ) : (
                        <i className="fa-sharp fa-solid fa-eye-slash"></i>
                      )}
                    </button>
            </span>
            <input  type={showPassword ? "text" : "password"} required     id="password"
        value={password}   onChange={handlePasswordChange}/>
            <label>Mot de passe</label>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox"     checked={checked}
          onChange={handleCheckboxChange} /> Se souvenir
            </label>
            <span  className="Addcompte" onClick={UpdatePawwords}>
          Modifier mot de  passe ?
            </span>
          </div>
          <button type="button" className="login" onClick={connect}   disabled={!isEmail||!ischecked}>
            Connecter
          </button>
          <div className="registrer-link">
         
              Je n'ai pas de compte ? {" "}
              <span  className="Addcompte" onClick={Addcpompte}>
                Ajouter un compte 
              </span>
            
          </div>
        </form>
        <Toaster />
      </div>
  
    </section>
  );
}
