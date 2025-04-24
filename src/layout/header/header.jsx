import React, { useEffect, useState } from "react";
import "./header.css";
import imgfront from '../../assets/sliderhome.jpg';
import frenchCV from '../../assets/frenchCV.pdf';
import englishCV from '../../assets/englishCV.pdf';
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
    <div className="sectionheader-all" id='sectionfirsts'>
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
            <div className="discrptionnameall" >
              <div className="discrptionname">
                {language === "FR" ? <span className="title-top">Développeur full stack</span> : <span className="title-top">Full stack developer</span>}
                <h1>Benarfa <br /> Tarek</h1>
                <p>
                  {language === "FR"
                    ? "Je suis développeur full stack  avec 7 ans d'expérience."
                    : "I am a full stack developer with 7 years of experience."}
                </p>
              </div>
              <div className="buttons">
                <a href={language === "FR" ? frenchCV : englishCV} download className="btn-hover color-3">
                  <FontAwesomeIcon icon={faDownload} /> <p>{language === "FR" ? "CV" : "Resume"}</p>
                </a>
              </div>
            </div>
            <Slider long={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
