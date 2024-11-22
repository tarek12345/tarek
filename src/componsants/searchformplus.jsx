import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPhone, faSadTear, faSmile } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Doughnut } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend);

const SearchFormPlus = (props) => {
const [skills] = useState(props.skills || []);
const [software] = useState(props.imgsatware || []);
const [experiences] = useState([
{ name: "1 an d'expérience", value: 1 },
{ name: "2 ans d'expérience", value: 2 },
{ name: "3 ans d'expérience", value: 3 },
{ name: "4 ans d'expérience", value: 4 },
{ name: "5 ans d'expérience", value: 5 },
{ name: "6 ans d'expérience", value: 6 },
]);
const [searchQuery, setSearchQuery] = useState("");
const [filteredSkills, setFilteredSkills] = useState(skills);
const [filteredSoftware, setFilteredSoftware] = useState(software);
const [filteredExperiences, setFilteredExperiences] = useState(experiences);
const [matchPercentage, setMatchPercentage] = useState(0);

useEffect(() => {
const searchTerms = searchQuery
.toLowerCase()
.split(/[\s,]+/)
.filter((term) => term.trim() !== "");

const filteredSkills = skills.filter((skill) =>
searchTerms.some((term) => skill.name.toLowerCase().includes(term))
);
setFilteredSkills(filteredSkills);

const filteredSoftware = software.filter((soft) =>
searchTerms.some((term) => soft.caption.toLowerCase().includes(term))
);
setFilteredSoftware(filteredSoftware);

const filteredExperiences = experiences.filter((experience) =>
searchTerms.some((term) => experience.name.toLowerCase().includes(term))
);
setFilteredExperiences(filteredExperiences);

const totalItems = skills.length + software.length + experiences.length;
const totalMatches =
filteredSkills.length +
filteredSoftware.length +
filteredExperiences.length;
const percentage = totalItems > 0 ? (totalMatches / totalItems) * 100 : 0;
setMatchPercentage(percentage.toFixed(2));
}, [searchQuery, skills, software, experiences]);

const chartData = {
labels: ["Skills", "Software", "Experiences", "Other"],
datasets: [
{
data: [
filteredSkills.length,
filteredSoftware.length,
filteredExperiences.length,
skills.length +
software.length +
experiences.length -
(filteredSkills.length +
filteredSoftware.length +
filteredExperiences.length),
],
backgroundColor: ["#812fab", "#170122", "#f39c12", "#f44336"],
hoverBackgroundColor: ["#812fab", "#170122", "#f1c40f", "#ef5350"],
},
],
};

return (
<div className="search-form-plus infos-pratique">
  <h4>Recherche Avancée par Offre</h4>
  <div className="search-input-container mb-3 champs">
    <textarea className="form-control"
     placeholder={props.long==="FR"?"Saissir decription du votre offre d'emploi..."
      :'Enter a description of your job offer...'} 
     value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}
          rows="4"
        />
        <button
          className="btn btn-primary search-btn"
          data-bs-toggle="modal"
          data-bs-target="#searchResultsModal"
        >
          <FontAwesomeIcon icon={faSearch} /> 
        </button>
      </div>

      <div
        className="modal fade"
        id="searchResultsModal"
        tabIndex="-1"
        aria-labelledby="searchResultsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="searchResultsModalLabel">
                 Resultat
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="chart-container"
                style={{ width: "100%", maxWidth: "500px", margin: "auto" }}
              >
                <Doughnut data={chartData} />
                <div className="match-percentage">
                  <h4
                    style={{
                      color: matchPercentage > 50 ? "green" : "red",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {matchPercentage}%
                  </h4>
                </div>
              </div>

              {matchPercentage > 50 ? (
                <div className="entretient">
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <FontAwesomeIcon
                      icon={faSmile}
                      size="3x"
                      style={{ color: "green" }}
                    />
                    <p style={{ fontWeight: "bold", color: "green" }}>
                    {props.long==="FR"?"Félicitations ! Mon profil correspond parfaitement à vos besoins. N'hésitez pas à me contacter en cliquant sur l'icône de téléphone ou de WhatsApp !":
                     "My profile perfectly matches your needs. Do not hesitate to contact me by clicking on the phone or WhatsApp icon"}
                    </p>
                  </div>
                  <ul>
                    <li>
                     
                      <a href="tel:50269194" style={{ color: "black" }}>
                        <FontAwesomeIcon icon={faPhone} /> 50 269 194
                      </a>
                    </li>
                    <li>
                   
                      <a
                        href="https://wa.me/50269194?text=Bonjour je suis intéressé pour une autre opportunité"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "black" }}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} /> +216 50 269 194
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <FontAwesomeIcon
                    icon={faSadTear}
                    size="3x"
                    style={{ color: "red" }}
                  />
                  <p>{props.long==="FR"?"Ma profil non compatible avec vos besoins.":"My profile is not compatible with your needs."}</p>
                  
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {props.long==="FR"?"Fermer":"Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFormPlus;