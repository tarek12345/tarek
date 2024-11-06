import React, { useEffect, useState,useRef } from 'react';
import programming from "../../assets/programming.jpg";
import Header from '../../layout/header/header';
import Footer from '../../layout/footer/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'; // Import the downward arrow icon
import Competences from './sectionhome/competences';
import Projects from './sectionhome/projects';
import Logiciels from './sectionhome/logiciels';
import Contact from './sectionhome/infos';


export default function Home() {
  const [language, setLanguage] = useState("FR");
  const [activeLink, setActiveLink] = useState('/');
  const [compteur] = useState([
    { namfr: "Projet", namen: "Project", value: "400" },
    { namfr: "Expérience", namen: "Experience", value: "6" },
  ]);

  const [count, setCount] = useState(
    compteur.map((item) => ({ ...item, animatedValue: 0 }))
  );

  // Using a ref to hold count data for the interval function
  const countRef = useRef(count);
  countRef.current = count;
  const scrollToSection2 = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id); // Set active link for highlighting
    }
  };
  
  useEffect(() => {
    count.forEach((item, index) => {
      const targetValue = parseInt(item.value, 10);
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / targetValue));

      let currentCount = 0;

      const interval = setInterval(() => {
        if (currentCount < targetValue) {
          currentCount++;
          setCount((prevCounts) => {
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

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "FR" ? "EN" : "FR"));
  };

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
          <div className="img-left container p-4">
            <p className="mt-4">
              {language === "FR"
                ? "Dynamique et polyvalent, je suis passionné par l'innovation et la résolution de problèmes. Fort d'une solide formation en ingénierie, j'ai acquis une expertise dans le développement de solutions technologiques efficaces et durables. Mon expérience professionnelle m'a permis de développer des compétences en gestion de projet et en travail d'équipe, ainsi qu'une grande capacité d'adaptation à de nouveaux environnements. Toujours avide d'apprendre et de relever de nouveaux défis, je suis à la recherche d'opportunités où je pourrai mettre à profit mes compétences et contribuer au succès de projets stimulants."
                : "Dynamic and versatile, I am passionate about innovation and problem-solving. With a solid background in engineering, I have developed expertise in creating efficient and sustainable technological solutions. My professional experience has allowed me to gain project management and teamwork skills, as well as the ability to adapt quickly to new environments. Always eager to learn and take on new challenges, I am seeking opportunities where I can apply my skills and contribute to the success of exciting projects."}
            </p>
            <div className="container text-center mt-5">
              <div className="row">
                {count.map((item, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h2 className="display-4 valuecompteur">
                          {item.animatedValue} +
                        </h2>
                        <h5 className="card-title">
                          {" "}
                          {language === "FR" ? item.namfr : item.namen}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button class="btn-hover color-7"  onClick={(e) => {
                  e.preventDefault();
                  scrollToSection2('#section2');
                }}>
              {language === "FR" ? "En savoir plus" : "Learn more"}{" "}
              <FontAwesomeIcon icon={faArrowDown} />{" "}
            </button>
          </div>
        </div>
      </div>
      <Competences  long={language}/>
      <Projects  long={language}/>
      <Contact  long={language}/>
      <Logiciels  long={language}/>
      <Footer long={language} />
    </>
  );
}
