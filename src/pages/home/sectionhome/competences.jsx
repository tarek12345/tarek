import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'; // Icônes solid
import {
  faHtml5,
  faCss3Alt,
  faJsSquare,
  faReact,
  faAngular,
  faBootstrap
} from '@fortawesome/free-brands-svg-icons'; // Icônes brands
import { faVuejs } from '@fortawesome/free-brands-svg-icons'; // Import de l'icône Vue.js

export default function Competences(props) {
  // État local pour stocker les niveaux de compétence
  const [skills] = useState([
    { name: "HTML 5", level: 100, icon: faHtml5 },
    { name: "CSS 3", level: 100, icon: faCss3Alt },
    { name: "Tailwind CSS", level: 80, icon: faBootstrap },
    { name: "Bootstrap", level: 95, icon: faBootstrap },
    { name: "JavaScript", level: 80, icon: faJsSquare },
    { name: "React JS", level: 90, icon: faReact },
    { name: "Angular JS", level: 80, icon: faAngular },
    { name: "Vue JS", level: 70, icon: faVuejs }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Next JS", level: 90, icon: faJsSquare }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
  ]);

  return (
    <div id="section2">
      <div className="img-right">
        <h2>
          {props.long === "FR" ? "Compétences" : "Skills"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>
      <div className="skills">
        {skills.map((skill, index) => (
          <div className="card-skills" key={index}>
            <FontAwesomeIcon icon={skill.icon} />{" "}
            {/* Utilisez l'icône associée */}
            <span>{skill.name}</span>
            <div className="circle-container">
              {[...Array(10)].map((_, circleIndex) => (
                <div
                  key={circleIndex}
                  className={`circle ${
                    circleIndex < Math.ceil(skill.level / 10) ? 'filled' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
