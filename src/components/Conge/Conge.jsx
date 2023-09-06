import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Topbar from "../../layout/Topbar/Topbar";
import { Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import fr from "date-fns/locale/fr";

import "react-datepicker/dist/react-datepicker.css";
import "./Conge.css";

import axios from "axios";
import { useJwt } from "react-jwt";
import Cookies from "universal-cookie";
const baseURL = process.env.REACT_APP_API_URL;
function Conge() {
  const [AllConge, setAllConge] = useState([]);
  const [conge, setConge] = useState('');
  const [nom, setNom] = useState("");
  const [jour, setJour] = useState(0);
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [startDate, endDate] = dateRange;
  const createUser = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
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
          getConge();
          Reset();
        })
        .catch(function (error) {
          console.log(error.response.data.message);
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
  };

  const getConge = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/conges/get")
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        setAllConge(response.data.data);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message
            ? error.response.data.message
            : error.message,
          {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );
      });
  };
  const deleteSite = async () => {

    await axios
      .delete(process.env.REACT_APP_API_URL + "/conges/delete/" + conge._id)
      .then((response) => {
        setShow(false);
        getConge();
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      })
      .catch((error) => {
        // console.log(error);
        toast({
          render: error.response.data.message
            ? error.response.data.message
            : error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      });
  };
  const supModal = (item) => {
    console.log(conge.name);
    setShow(true);
    setConge(item);
  };
  const Reset = () => {
    setNom("");
    setDateRange("");
    setJour("");
    setDescription("");
  };


  useEffect(() => {
    getConge();
  }, []);
  return (
    <section className="homes">
      <Topbar />
      <div className="struc">
        <div id="conges">
          <h1>Demande du congé</h1>
          <form action="">
            <div className="printts">
              <div className="table-hover">
                <div className="input-box">
                  <span className="icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                  <label>Nom & Prénom</label>
                </div>
                <div className="input-box">
                  <span className="icon">
                    <i className="fas fa-hourglass-start"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={jour}
                    onChange={(e) => setJour(e.target.value)}
                  />
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
                  <input
                    type="textarea"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label>Raison du congé </label>
                </div>
              </div>{" "}
            </div>
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
        <div className="feuille">
          <h2>
            Listes des congés<sup>({AllConge.length})</sup>
          </h2>
       
          <div className="tous">
         {AllConge.length==0? <span>Pas de  congé</span>
          : <>{AllConge.map((cong) => {
            return (
              <div className="liste">
                
                <div className="titrecong">
                  <span className="me-2">Nombres du jour {cong.jour}</span>
                </div>
                <div className="actions">
                  <i class="fa-solid fa-print me-2 " ></i>
                  <i
                    class="fa-solid fa-trash"
                    onClick={() => supModal(cong)}
                  ></i>
                </div>
              </div>
            );
          })}
         </>}
          </div> 
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          className="modalDelete"
          size="md"
          id="addPageModal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="add_page_modal_header">
            <div className="titre_popup_page">
              <div className="modal_header_add_page ">
                <div className="titre_popup_add_page">
                  {" "}
                  Supprimer utilisateur
                </div>

                <i
                  className="fa-solid fa-xmark closeSideBar"
                  onClick={handleClose}
                ></i>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="add_page_modal_content ">
              <div className="addPageOptions">
                <div className="add_Page_Options_title">
                  Voulez-vous vraiment supprimer l'utilisateur
                  <b> {conge.name} ? </b>
                  Cette action supprimera l'utilisateur ainsi que l'ensemble du
                  contenu qui lui est associé.
                  <br />
                  Cette action ne peut pas être annulée.
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-rounded  btn-outline-secondary"
              onClick={handleClose}
            >
              Annuler
            </button>
            <button
              className="btn  btn-rounded btn btn-outline-secondary delete"
              onClick={deleteSite}
            >
              Supprimer
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}

export default Conge;
