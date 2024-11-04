import React, { useEffect, useState } from 'react';
import programming from "../../assets/programming.jpg";
import Header from '../../layout/header/header';
import Footer from '../../layout/footer/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'; // Import the downward arrow icon

export default function Home() {
  const [language, setLanguage] = useState("FR");

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === "FR" ? "EN" : "FR"));
  };

  useEffect(() => {
  }, [language]);

  const [compteur, setComteur] = useState([
    { namfr: "Projet", namen: "Project", value: "400" },
    { namfr: "Expérience", namen: "Experience", value: "6" },
  ]);

  const [count, setCount] = useState(compteur.map(item => ({ ...item, animatedValue: 0 })));

  useEffect(() => {
    count.forEach((item, index) => {
      const targetValue = parseInt(item.value, 10);
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / targetValue));

      let currentCount = 0;

      const interval = setInterval(() => {
        if (currentCount < targetValue) {
          currentCount++;
          setCount(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index].animatedValue = currentCount;
            return newCounts;
          });
        } else {
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    });
  }, []);

  return (
    <>
      <Header long={language} toggleLanguage={toggleLanguage} />

      <div className="allsection ">
        <div id="section1" className="container">
          <div className="img-right">
            <img
              src={programming}
              alt="sectionimageone"
              className="circular-image"
            />

            <h2>
              {language === "FR" ? "Sur moi" : "About me"}{" "}
              <FontAwesomeIcon icon={faArrowDown} />{" "}
            </h2>
          </div>
          <div className="img-left container">
            <p>
              Dynamique et polyvalent, je suis passionné par l'innovation et la
              résolution de problèmes. Fort d'une solide formation en ingénierie,
              j'ai acquis une expertise dans le développement de solutions
              technologiques efficaces et durables. Mon expérience
              professionnelle m'a permis de développer des compétences en
              gestion de projet et en travail d'équipe, ainsi qu'une capacité à
              m'adapter rapidement à de nouveaux environnements. Toujours avide
              d'apprendre et de relever de nouveaux défis, je suis à la
              recherche d'opportunités où je pourrai mettre à profit mes
              compétences et contribuer au succès de projets stimulants.
            </p>
            <div className="container text-center mt-5">
              <div className="row">
                {count.map((item, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">  {language === "FR" ? item.namfr : item.namen}</h5>
                        <h2 className="display-4 valuecompteur">{item.animatedValue} +</h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer long={language} />
    </>
  );
}
