import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
export default function Competences({ long, skills }) {
  

  const [keword, setKword] = useState("");
  const [filteredSkills, setFilteredSkills] = useState(skills || []);

  const handleKeyword = (e) => {
    const search = e.target.value.toLowerCase();
    setKword(search);
    setFilteredSkills(
      skills.filter((skill) => skill.name.toLowerCase().includes(search))
    );
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    setFilteredSkills(skills || []);
  }, [skills]);

  return (
    <div id="section2">
      <div className="img-right">
        <h2>
          {long === "FR" ? "Compétences" : "Skills"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>

      <div className="mb-3 champs">
        <input
          type="text"
          value={keword}
          onChange={handleKeyword}
          className="form-control"
          placeholder={long === "FR" ? "Recherche" : "Search"}
          required
        />
      </div>

      {!isMobile ? (
        <div className="skills">
          {filteredSkills.map((skill, index) => (
            <div className="card-skills" key={index}>
               <div className="card-skills-1">
              <div className="logoicon">
              <FontAwesomeIcon icon={skill.icon} />
              </div>
               <div className="contenticon">
                 <div className="contenticon-1">
              <span>{skill.name}</span>
              <span className="levercom">{`${skill.level}%`}</span> 
             </div>

  <ProgressBar now={skill.level} label={`${skill.level}%`} visuallyHidden />

               <span className="stateskills">{
  long === "FR"
    ? skill.state === "Intermédiaire"
      ? "Intermédiaire"
      : skill.state === "Expert"
        ? "Expert"
        : skill.state === "Avancé"
          ? "Avancé"
          : ""
    : skill.state === "Intermédiaire"
      ? "Intermediate"
      : skill.state === "Expert"
        ? "Expert"
        : skill.state === "Avancé"
          ? "Advanced"
          : ""
} </span>
               </div>
</div>
             
            </div>
          ))}
        </div>
      ) : (
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
          {filteredSkills.map((skill, index) => (
            <SwiperSlide key={index}>
              <div className="card-skills">
                             <div className="card-skills-1">
              <div className="logoicon">
              <FontAwesomeIcon icon={skill.icon} />
              </div>
               <div className="contenticon">
                 <div className="contenticon-1">
              <span>{skill.name}</span>
              <span className="levercom">{`${skill.level}%`}</span> 
             </div>

               <ProgressBar now={skill.level} label={`${skill.level}%`} visuallyHidden />

               <span className="stateskills">
                
{
  long === "FR"
    ? skill.state === "Intermédiaire"
      ? "Intermédiaire"
      : skill.state === "Expert"
        ? "Expert"
        : skill.state === "Avancé"
          ? "Avancé"
          : ""
    : skill.state === "Intermédiaire"
      ? "Intermediate"
      : skill.state === "Expert"
        ? "Expert"
        : skill.state === "Avancé"
          ? "Advanced"
          : ""
}               
                </span>
                        

               </div>
</div> 
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
