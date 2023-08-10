import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
/* import { GoogleLogin, GoogleLogout } from "react-google-login"; */
import "./CreateLogin.css";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../../redux/features/user";
import axios from "axios";
import { useJwt } from "react-jwt";
import Cookies from "universal-cookie";
const baseURL = process.env.REACT_APP_API_URL;

export default function CreateLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [email, setEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState("Poste");
  const [selectedOptionSexe, setselectedOptionSexe] = useState("Sexe");
  const [selectedOptionRole, setselectedOptionRole] = useState("Role");
  const [poste, setPoste] = useState([
  {  value:'dev',nom:"Dévéloppeur"},
  {  value:'inte',nom:"Intégrateur" },
  {  value:'seo',nom:"Seo" },
  {  value:'red',nom:"Rédaction"},
  {  value:'chef',nom:"Chef d'equipe"},
  {  value:'resource',nom:"Resource humaine"},
  ]);




  const [sexe, setSexe] = useState([
  {  value:'homme',nom:"Homme"},
  {  value:'femme',nom:"Femme" },
  ]);

  const [isEmail, setIsEmail] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [Confirm, setConfirm] = useState("");
  const [nom, setNom] = useState("");
  const [jour, setJour] = useState(0);

  const [role, setRole] = useState([
    {  value:'admin',nom:"Admin"},
    {  value:'client',nom:"Client" },
    ]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const createUser = async () => {
    try {
      await axios
        .post(baseURL + "/users/create", {
          email: email,
          password: password,
          name: nom,
          jour: jour,
          poste: selectedOption,
          role: selectedOptionRole,
          sexe: selectedOptionSexe,
        })
        .then(async (response) => {

          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          navigate("/login");
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

  const Reset = async () => {
    setEmail('')
    setPassword('')
    setNom('')
    setConfirm('')
    setSelectedOption('')
    setselectedOptionSexe('')
    setselectedOptionRole('')
    setJour(0)
  }
  const Retour = async () => {
   navigate('/login')
  }
  useEffect(() => {
   
    const validateEmail = () => {
      if (emailRegex.test(email)) {
        setIsEmail(true);
      
      } else {
        setIsEmail(false);
    
      }
    };

    const validatepass = () => {
        if (Confirm !=password) {
            setIsConfirm(true)
        
        } else {
            setIsConfirm(false)
      
        }
      };
    validateEmail()
    validatepass()
  }, [email,Confirm]);
  return (
    <section id="CreateLogin">
      <div className="login-box">
        <form action="">
          <h2>Créer un compte</h2>
          <div className="input-box">
            <span className="icon">
            <i className="fa-solid fa-user"></i>
            </span>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}/>
            <label>Nom & Prénom</label>
          </div>
          <div className="input-box">
          {!isEmail ? <span className="icon">
              <i className="fa-solid fa-envelope"></i> <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </span>: <span className="icon">
              <i className="fa-solid fa-envelope"></i> <i className="fa-solid fa-badge-check"></i>
            </span>}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Email</label>
         
          </div>
      
          <select id="mySelect" className="form-select" aria-label="Default select example" value={selectedOptionSexe}  onChange={(e) => setselectedOptionSexe(e.target.value)}>
            <option selected>Sexe</option>
                {sexe.map((po, i)=>{
                    return(  
                    <> 
                     <option   key={i}  value={po.nom}>
                        {po.nom}
                        </option>
                    </>)
                })}
  
           
                </select>    
                  <select id="mySelect" className="form-select" aria-label="Default select example" value={selectedOptionRole}  onChange={(e) => setselectedOptionRole(e.target.value)}>
            <option selected>Role</option>
                {role.map((po, i)=>{
                    return(  
                    <> 
                     <option   key={i}  value={po.nom}>
                        {po.nom}
                        </option>
                    </>)
                })}
  
           
                </select>
          <select id="mySelect" className="form-select" aria-label="Default select example" value={selectedOption}  onChange={(e) => setSelectedOption(e.target.value)}>
            <option selected>Poste</option>
                {poste.map((po, i)=>{
                    return(  
                    <> 
                     <option   key={i}  value={po.nom}>
                        {po.nom}
                        </option>
                    </>)
                })}
  
           
                </select>
                <div className="input-box">
            <span className="icon">
            <i className="fas fa-hourglass-start"></i>
            </span>
            <input type="text" required value={jour} onChange={(e) => setJour(e.target.value)}/>
            <label>Nombre du jour Congé</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input type="text" required  value={password}  onChange={(e) => setPassword(e.target.value)}/>
            <label>Mot de passe</label>
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input type="password" required  value={Confirm}  onChange={(e) => setConfirm(e.target.value)}/>
            <label>Confirm mot de passe</label>
          </div>
          <div className="d-flex ">
          <button type="reset" className="login me-2" onClick={Reset}>
            {" "}
            Annuler
          </button>
          <button type="button" className="login" onClick={createUser}   disabled={!isEmail||isConfirm}>
        
            Enregister
          </button>
          </div>
          <div className="registrer-link">
           
              Je deja un  compte ?{" "}
              <span  className="Retour" onClick={Retour}>
                Retour
              </span>
           
          </div>
        </form>
      </div>
      <Toaster />
    </section>
  );
}
