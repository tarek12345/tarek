import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

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
  }, []);

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
              <FontAwesomeIcon icon={skill.icon} />
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
                <FontAwesomeIcon icon={skill.icon} size="2x" />
                <span>{skill.name}</span>
                <div className="circle-container">
                  {[...Array(10)].map((_, circleIndex) => (
                    <div
                      key={circleIndex}
                      className={`circle ${
                        circleIndex < Math.ceil(skill.level / 10)
                          ? "filled"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
