import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ContactForm from '../../../componsants/ContactForm';

export default function Contact(props) {


  return (
    <div id="section4">
      {/* En-tête de section avec titre et icône */}
      <div className="img-right">
        <h2>
          {props.long === "FR" ? "Contactez-nous" : "Contact us"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>

      {/* Section principale avec le formulaire de contact et les informations pratiques */}
      <div className="section-left">
        {/* Formulaire de contact */}
          <ContactForm />

        {/* Informations pratiques */}
        <div className="infos-pratique">
          <h3>Informations pratiques</h3>
          <ul>
            <li>
              <FontAwesomeIcon icon={faPhone} /> Téléphone : +33 1 23 45 67 89
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} /> Email : contact@example.com
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Adresse : 123 Rue Exemple, 75000 Paris, France
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
