import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

export default function Competences(props) {
  // État local pour stocker les niveaux de compétence
  const [skills] = useState([
    { name: "HTML 5", level: 100 }, // Niveau de compétence sur 100
    { name: "CSS 3", level: 100 },
    { name: "Tailwind CSS", level: 80 },
    { name: "Bootstrap", level: 100 },
    { name: "JavaScript", level: 90 },
    { name: "React JS", level: 90 },
    { name: "Angular JS", level: 80 },
    { name: "Next JS", level: 90 },
    { name: "Vue JS", level: 70 },
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
            <FontAwesomeIcon icon={faArrowDown} />
            <span>{skill.name}</span>
            <div className="circle-container">
              {[...Array(10)].map((_, circleIndex) => (
                <div
                  key={circleIndex}
                  className={`circle ${circleIndex < Math.ceil(skill.level / 10) ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
