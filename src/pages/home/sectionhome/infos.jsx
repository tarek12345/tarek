import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import ContactForm from '../../../componsants/ContactForm';
import videocode from '../../../assets/videocode.mp4';

export default function Contact(props) {
  return (
    <div id="section4" className="section4">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src={videocode} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="img-right">
        <h2 className="mb-3">
          {props.long === "FR" ? "Contactez-nous" : "Contact us"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>

      {/* Section principale avec le formulaire de contact et les informations pratiques */}
      <div className="section-left container">
        {/* Formulaire de contact */}
        <ContactForm translate={props} />

        {/* Informations pratiques */}
        <div className="infos-pratique">
          <h3>
            {props.long === "FR"
              ? "Informations pratiques"
              : "Practical information"}
          </h3>
          <ul>
            <li>
              <FontAwesomeIcon icon={faPhone} />
              <a href="tel:+21650269194" title="(+216) 50 269 194">
                (+216) 50 269 194
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} />
              <a
                href="mailto:tarekbenarfa53@gmail.com"
                title="tarekbenarfa53@gmail.com"
              >
                tarekbenarfa53@gmail.com
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <a
                href="https://www.google.tn/maps/search/15+rue+elbekri+beb+khadra+tunis/@36.8064991,10.1789567,17z/data=!3m1!4b1?hl=fr&entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"
                title="maps"
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.long === "FR"
                  ? "15 rue elbekri beb khadra tunis"
                  : "15 Elbekri Street, Beb Khadra, Tunis"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
