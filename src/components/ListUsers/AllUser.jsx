import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal } from "react-bootstrap";
import { format } from "date-fns";

import "./AllUser.css";
import axios from "axios";
export default function AllUser() {
  const [AllUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [showDetaile, setShowDetail] = useState(false);
  const [showEdits, setShowEdits] = useState(false);
  const [sexe, setSexe] = useState([
    { value: "homme", nom: "Homme" },
    { value: "femme", nom: "Femme" },
  ]);
  const [poste, setPoste] = useState([
    { value: "dev", nom: "Dévéloppeur" },
    { value: "inte", nom: "Intégrateur" },
    { value: "seo", nom: "Seo" },
    { value: "red", nom: "Rédaction" },
    { value: "chef", nom: "Chef d'equipe" },
    { value: "resource", nom: "Resource humaine" },
  ]);

  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const handleClose = () => setShow(false);
  const handleCloseDetaile = () => setShowDetail(false);
  const handleCloseEdits = () => setShowEdits(false);
  const fiterSearsh = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/users/filter", {
        search: search,
      })

      .then((response) => {
        setAllUsers(response.data.data);

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
  const storeSite = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  useEffect(() => {}, [storeSite]);
  /*DEBUT  DELETE LIST WEBSITE */
  const supModal = (item) => {
    setUser(item);
    setShow(true);
  };

  const supModalDetaile = (item) => {
    setUser(item);
    setShowDetail(true);
  };
  const [usersEdit, setUsersEdit] = useState(AllUsers);
  const [editingUserId, setEditingUserId] = useState(null);

  const deleteSite = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/users/delete/" + user._id)
      .then((response) => {
        setShow(false);
        getUser();
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

  /* FIN DELETE LIST WEBSITE */
  const getUser = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/users/get")
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

        setAllUsers(response.data.data);
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
  const restInput = () => {
    setSearch("");
    getUser();
  };
  const handlePrint = () => {
    const tbodyContent = document.querySelector(
      ".add_Page_Options_title  tbody"
    ).innerHTML;
    const printWindow = window.open("", "_blank");

    if (printWindow && tbodyContent) {
      printWindow.document.write(`
        <html>
        <head>
        <title>Information </title>
      
      </head>
          <body>
            <table className="table table-hover">
              <tbody>
                ${tbodyContent}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  const supModalEdits = (item) => {
    setEditingUserId(item);
    setShowEdits(true);
  };
  const handleEdit = async (updatedUser) => {
    await axios

      .post(
        process.env.REACT_APP_API_URL + "/users/update/" + editingUserId._id,
        {
          name: editingUserId.name,
          sexe: editingUserId.sexe,
          poste: editingUserId.poste,
          email: editingUserId.email,
          jour: editingUserId.jour,
        }
      )
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
        setShowEdits(false);
        setEditingUserId(updatedUser);
        getUser();
      })
      .catch((error) => {
        // console.log(error);
        toast.error("utilisateur  non modifier", {
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
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <div className="headers mt-4 mb-4">
        <h2> Listes des employers</h2>

        <div className="input-group mb-3 serash-users">
          <input
            type="text"
            value={search}
            className="form-control"
            placeholder="Rechercher par employer"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            onChange={handleSearch}
          />
          <button onClick={restInput} className="iclosed" type="reset">
            &times;
          </button>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary ok"
              type="button"
              onClick={fiterSearsh}
            >
              OK
            </button>
          </div>
        </div>
      </div>
      <div className="mb-4">
        {AllUsers.map((user, index) => {
          return (
            <div className="listUser " key={index}>
              <div className="allusers">
                <div className="profilencart">
                   
                  <div className= {user.poste=="Chef d'equipe"?
                      'enteteimg chef'
                    :'enteteimg'
                    }>
                    {user.sexe == "Homme" ? (
                      <i className="fa-regular fa-user-tie-hair"></i>
                    ) : (
                      <i className="fa-regular fa-user-tie-hair-long"></i>
                    )}
                  </div>
                  <div className="enteteinfo">
                    <span className="Nameprofil">{user.name}</span>
                    <span className="Posteprofil">{user.poste}</span>
                    <span className="dateprofil">{user.email}</span>
                  </div>
                </div>
                <div className="btnsusers">
                  <span
                    className="butn detaile"
                    onClick={() => supModalDetaile(user)}
                  >
                    <i className="fa-sharp fa-solid fa-circle-info"></i>
                  </span>
                  <span
                    className="butn edit"
                    onClick={() => supModalEdits(user)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </span>
                  <span className="butn edit">
                    <i class="fa-solid fa-calendar"></i>
                  </span>
                  <span className="butn supp" onClick={() => supModal(user)}>
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </div>
              </div>
              <Toaster />
            </div>
          );
        })}
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
              <div className="titre_popup_add_page"> Supprimer utilisateur</div>

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
                <b> {user.nom} ? </b>
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
      <Modal
        show={showDetaile}
        onHide={handleCloseDetaile}
        backdrop="static"
        keyboard={false}
        className="modalDelete"
        size="lg"
        id="addPageModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="add_page_modal_header">
          <div className="titre_popup_page">
            <div className="modal_header_add_page ">
              <div className="titre_popup_add_page"> Details utilisateur</div>

              <i
                className="fa-solid fa-xmark closeSideBar"
                onClick={handleCloseDetaile}
              ></i>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="add_page_modal_content ">
            <div className="addPageOptions">
              <div className="add_Page_Options_title">
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <th scope="col">Nom</th>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <th scope="col">Sexe</th>
                      <td>{user.sexe}</td>
                    </tr>
                    <tr>
                      <th scope="col">Email</th>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <th scope="col">Poste</th>
                      <td>{user.poste}</td>
                    </tr>
                    <tr>
                      <th scope="col">Role</th>
                      <td>{user.role}</td>
                    </tr>

                    <tr>
                      <th scope="col">Nombre du jour congé</th>
                      <td>{user.jour}</td>
                    </tr>
                    <tr>
                      <th scope="col">Date du jour </th>
                      <td> {formattedDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="print-section">
          <button
            className="btn btn-rounded  btn-outline-secondary "
            onClick={handleCloseDetaile}
          >
            Retour
          </button>
          <button
            className="btn  btn-rounded btn btn-outline-secondary imprimer"
            onClick={handlePrint}
          >
            Imprimer
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEdits}
        onHide={handleCloseEdits}
        backdrop="static"
        keyboard={false}
        className="modalEdits"
        size="md"
        id="addPageModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="add_page_modal_header">
          <div className="titre_popup_page">
            <div className="modal_header_add_page ">
              <div className="titre_popup_add_page"> Editer utilisateur</div>

              <i
                className="fa-solid fa-xmark closeSideBar"
                onClick={handleCloseEdits}
              ></i>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="add_page_modal_content ">
            <div className="addPageOptions">
              <div className="add_Page_Options_title">
                {editingUserId && (
                  <>
                    <label>Nom & Prénom</label>
                    <div className="input-box mb-3">
                      <input
                        type="text"
                        value={editingUserId.name}
                        onChange={(e) =>
                          setEditingUserId({
                            ...editingUserId,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <label>Sexe</label>
                    <select
                      id="mySelect"
                      className="form-select  mb-3"
                      aria-label="Default select example"
                      value={editingUserId.sexe}
                      onChange={(e) =>
                        setEditingUserId({
                          ...editingUserId,
                          sexe: e.target.value,
                        })
                      }
                    >
                      <option selected>Sexe</option>
                      {sexe.map((se, i) => {
                        return (
                          <>
                            <option key={i} value={se.nom}>
                              {se.nom}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    <label>Poste</label>
                    <select
                      id="mySelect"
                      className="form-select  mb-3"
                      aria-label="Default select example"
                      value={editingUserId.poste}
                      onChange={(e) =>
                        setEditingUserId({
                          ...editingUserId,
                          poste: e.target.value,
                        })
                      }
                    >
                      <option selected>Poste</option>
                      {poste.map((po, i) => {
                        return (
                          <>
                            <option key={i} value={po.nom}>
                              {po.nom}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    <label>E-mail</label>
                    <div className="input-box mb-3">
                      <input
                        type="text"
                        value={editingUserId.email}
                        onChange={(e) =>
                          setEditingUserId({
                            ...editingUserId,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <label>Nombre du jour </label>
                    <div className="input-box mb-3">
                      <input
                        type="number"
                        value={editingUserId.jour}
                        onChange={(e) =>
                          setEditingUserId({
                            ...editingUserId,
                            jour: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="print-section">
          <button
            className="btn btn-rounded  btn-outline-secondary "
            onClick={handleCloseEdits}
          >
            Retour
          </button>
          <button
            className="btn  btn-rounded btn btn-outline-secondary imprimer"
            onClick={handleEdit}
          >
            Enregistrer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
