import React, { useEffect, useState } from "react";
import "./header.css";
import imgfront from '../../assets/sliderhome.png';
import Menu from "../../pages/route";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Slider from "../../componsants/slider/slider";

export default function Header({ long, toggleLanguage }) {
  const [language, setLanguage] = useState(long || "FR");

  useEffect(() => {
    setLanguage(long); // Update language when props.long changes
  }, [long]);

  return (
    <div className="sectionheader-all">
      <div className="sectionheader container">
        <div className="logo">
          <span className="logotext">Benarfa Tarek</span>
        </div>
        <div className="sectionright">
          <div className="menu">
            <Menu long={long} toggleLanguage={toggleLanguage} />
          </div>
          <div className="suitechcolor">
            <span className="label-right">FR</span>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switchCheckDefault"
                onChange={toggleLanguage} // Use the toggle function passed as prop
              />
            </div>
            <span className="label-left">EN</span>
          </div>
        </div>
      </div>
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={imgfront} className="d-block w-100 img-t" alt="photo du profil" />
            <div className="discrptionnameall">
              <div className="discrptionname">
                {language === "FR" ? <span className="title-top">Développeur front end</span> : <span className="title-top">Front end developer</span>}
                <h1>Benarfa <br /> Tarek</h1>
                <p>
                  {language === "FR"
                    ? "Je suis développeur front-end avec 6 ans d'expérience."
                    : "I am a front-end developer with 6 years of experience."}
                </p>
              </div>
              <div className="buttons">
                <button className="btn-hover color-3">
                  <FontAwesomeIcon icon={faDownload} /> {language === "FR" ? "CV" : "Resume"}
                </button>
              </div>
            </div>
            <Slider long={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
