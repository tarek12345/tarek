import React from "react";
import "./footer.css";
import footerbg from "../../assets/footerbg.png";
import suivez from "../../assets/suivez.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faWhatsapp,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer(props) {
  return (
    <div id="sectionfooter" style={{ backgroundImage: `url(${footerbg})` }}>
      <div id="sectionfooter-1">
        <img src={suivez} alt="profil" />
        <div className="titlefooter">
          {" "}
          {props.long === "FR" ? "Suis-moi" : "Follow me"}
        </div>
        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/benarfa-tarek-104964112/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://wa.me/50269194?text=Bonjour je suis intéressé pour  un autre  oprtunité"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a
            href="https://www.facebook.com/TAREK.BENARFA/?locale=fr_FR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </div>
      </div>
      <div className="copyright">
        {props.long === "FR"
          ? "Réalisé par Benara Tarek ©"
          : "Directed by Benara Tarek ©"}{" "}
        {new Date().getFullYear()}
      </div>
    </div>
  );
}
