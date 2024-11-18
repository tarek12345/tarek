import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// Import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown,faSearch,faCode,faLayerGroup    } from '@fortawesome/free-solid-svg-icons'; // Icônes solid
import {
  faHtml5,
  faCss3Alt,
  faJsSquare,
  faReact,
  faAngular,
  faBootstrap,
  faWordpress 
} from '@fortawesome/free-brands-svg-icons'; // Icônes brands
import { faVuejs } from '@fortawesome/free-brands-svg-icons'; // Import de l'icône Vue.js
export default function Competences(props) {
  // État local pour stocker les niveaux de compétence
  const [skills] = useState([
    { name: "HTML 5", level: 100, icon: faHtml5 },
    { name: "CSS 3", level: 100, icon: faCss3Alt },
    { name: "Tailwind CSS", level: 80, icon: faBootstrap },
    { name: "Bootstrap", level: 95, icon: faBootstrap },
    { name: "Matriel ui", level: 95, icon: faLayerGroup  },
    { name: "JavaScript", level: 80, icon: faJsSquare },
    { name: "React JS", level: 90, icon: faReact },
    { name: "Angular JS", level: 80, icon: faAngular },
    { name: "Vue JS", level: 70, icon: faVuejs }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "REST API", level: 80, icon: faCode },
    { name: "Next JS", level: 90, icon: faJsSquare }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Wordpress elemntor", level: 100, icon: faWordpress },
    { name: "Wordpress divi", level: 100, icon: faWordpress }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Wordpress Gutenberg", level: 90, icon: faWordpress }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Seo", level: 80, icon: faSearch }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée
  ]);
  const [isMobile, setIsMobile] = useState(false);
    // Hook to detect mobile screen
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768); // Define mobile breakpoint (e.g., 768px)
      };
  
      handleResize(); // Initial check
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  return (
    <div id="section2">
      <div className="img-right">
        <h2>
          {props.long === "FR" ? "Compétences" : "Skills"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>
      {!isMobile? <div className="skills">
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
      :
      <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
      }}
    >
      {skills.map((skill, index) => (
        <SwiperSlide key={index}>
          <div className="card-skills">
            <FontAwesomeIcon icon={skill.icon} size="2x" />
            <span>{skill.name}</span>
            <div className="circle-container">
              {[...Array(10)].map((_, circleIndex) => (
                <div
                  key={circleIndex}
                  className={`circle ${
                    circleIndex < Math.ceil(skill.level / 10) ? "filled" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>}
     
    </div>
  );
}
