import React from "react";
import "./header.css";
import imgfront from '../../assets/sliderhome.png'
import Menu from "../../pages/route";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
export default function Header() {
  return (
    <div className="sectionheader-all">
     <div className="sectionheader container">
      <div className="logo">
        <span className="logotext">Benarfa tarek</span>
      </div>
      <div className="sectionright">
        <div className="menu">
          <Menu />
        </div>
        <div className="suitechcolor">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="switchCheckDefault"
            />
            <label className="form-check-label" for="switchCheckDefault">
              Default switch
            </label>
          </div>
        </div>
      </div>
      </div>
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={imgfront} className="d-block w-100 img-t" alt="photo du profil"/>
      <div className="discrptionnameall">
      <div className="discrptionname">
        <span className="title-top">Développeur  front end </span>
        <h1>Benarfa <br/> tarek</h1>
        <p>Je suis développeur front-end avec<br/>  6 ans d'expérience.</p>
        </div>
        <div class="buttons">
    <button class="btn-hover color-3"><FontAwesomeIcon icon={faDownload} />  cv</button>
    </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
