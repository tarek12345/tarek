import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Topbar from '../../layout/Topbar/Topbar';
import DatePicker from "react-datepicker";
import fr from 'date-fns/locale/fr';

import "react-datepicker/dist/react-datepicker.css";
import './Conge.css'

import axios from "axios";
import { useJwt } from "react-jwt";
import Cookies from "universal-cookie";
const baseURL = process.env.REACT_APP_API_URL;
function Conge() {
  const [nom, setNom] = useState("");
  const [jour, setJour] = useState(0);
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const createUser = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      await axios
        .post(baseURL + "/conges/create", {
          name: nom,
          jour: jour,
          description: description,
          datedebut: formattedStartDate,
          datefin: formattedEndDate,
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
  const Reset = () => {
    setNom('')
    setDateRange('')
    setJour('')
    setDescription('')
  }
  const handlePrint = () => {
    const tbodyContent = document.querySelector(
      ".printts"
    ).innerHTML;
    const printWindow = window.open("", "_blank");

    if (printWindow && tbodyContent) {
      printWindow.document.write(`
        <html>
        <head>
        <title>Information </title>
      
      </head>
          <body>
          <style>
          .input-box label {
            position: absolute;
            top: 50%;
            left: 5px;
            transform: translateY(-50%);
            font-size: 1em;
            color: #fff;
            pointer-events: none;
            transition: 0.5s;
        }</style>
            <div className="table-hover">
                <b>${tbodyContent}</b>
            
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  return (

        <section className='homes'  >
        <Topbar/>
        <div className="headersform">
        <h1>Demande  du congé</h1> 
        <div className="feuille">
        <i class="fa-solid fa-print me-2"></i> 
        <span  onClick={handlePrint}>
          Imprimer
        </span>
        </div>
        </div>
    

        <div id="conges" >
        <form action="">
        <div className="printts">
          <div className="table-hover">
          <div className="input-box">
            <span className="icon">
            <i className="fa-solid fa-user"></i>
            </span>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}/>
            <label>Nom & Prénom</label>
          </div>
         <div className="input-box">
            <span className="icon">
            <i className="fas fa-hourglass-start"></i>
            </span>
            <input type="text" required value={jour} onChange={(e) => setJour(e.target.value)}/>
            <label>Nombre du jour Congé</label>
          </div>
          <DatePicker
            selectsRange={true}
            dateFormat="yyyy/MM/dd"
            startDate={startDate}
            endDate={endDate}
            locale={fr}
            placeholderText="Date du  congé"
            onChange={(update) => {
              
              setDateRange(update);
            }}
          withPortal
           />
          <div className="input-box">
            <span className="icon">
            <i class="fa-brands fa-readme"></i>
            </span>
            <input type="textarea" required value={description} onChange={(e) => setDescription(e.target.value)}/>
            <label>Raison du congé </label>
          </div>
          </div>  </div>
          <div className="d-flex ">
          <button type="reset" className="login me-2" onClick={Reset}>
            {" "}
            Annuler
          </button>
          <button type="button" className="login" onClick={createUser}>
        
            Enregister
          </button>
          </div>
        </form>
        <Toaster />
    </div>
      </section>
  )
}

export default Conge