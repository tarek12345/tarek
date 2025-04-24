import React, { useEffect, useState,useRef } from 'react';
import programming from "../../assets/programming.jpg";
import bitbakedimg from "../../assets/bitbakedimg.png";
import githubimg from "../../assets/githubimg.png";
import gitlabimg from "../../assets/gitlabimg.png";
import vscodeimg from "../../assets/vscodeimg.png";
import dockerdsktop from "../../assets/dockerdsktop.png";
import ZohoSprintimg from "../../assets/ZohoSprintimg.png";
import jiraimg from "../../assets/jiraimg.png";
import zohocc from "../../assets/zohocc.png";
import XD from "../../assets/XD.png";
import whatsapp from "../../assets/whatsapp.png"
import Header from '../../layout/header/header';
import Footer from '../../layout/footer/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown,faSearch,faCode,faLayerGroup ,faLeaf,faDatabase } from '@fortawesome/free-solid-svg-icons'; // Icônes solid
import {
  faHtml5,
  faCss3Alt,
  faJsSquare,
  faReact,
  faAngular,
  faBootstrap,
  faWordpress ,
  faVuejs   ,faPhp,faLaravel
} from '@fortawesome/free-brands-svg-icons'; // Icônes brands

import Competences from './sectionhome/competences';
import Projects from './sectionhome/projects';
import Logiciels from './sectionhome/logiciels';
import Contact from './sectionhome/infos';
import Searchformplus from '../../componsants/searchformplus';


export default function Home() {
  const [language, setLanguage] = useState("FR");
  const [activeLink, setActiveLink] = useState('/');
  const [compteur] = useState([
    { namfr: "Projet", namen: "Project", value: "400" },
    { namfr: "Expérience", namen: "Experience", value: "6" },
  ]);
  const [skills] = useState([
    { name: "HTML 5", level: 100, icon: faHtml5 },
    { name: "CSS 3", level: 100, icon: faCss3Alt },
    { name: "Tailwind CSS", level: 80, icon: faBootstrap },
    { name: "Bootstrap", level: 95, icon: faBootstrap },
    { name: "Matriel ui", level: 95, icon: faLayerGroup  },
    { name: "MySQL ", level: 70, icon: faDatabase  },
    { name: "MongoDB ", level: 65, icon: faLeaf   },
    { name: "Php", level: 80, icon: faPhp  },
    { name: "JavaScript", level: 80, icon: faJsSquare },
    { name: "TypeScript", level: 80, icon: faJsSquare },
    { name: "React JS", level: 90, icon: faReact },
    { name: "Angular JS", level: 80, icon: faAngular },
    { name: "Vue JS", level: 70, icon: faVuejs }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "REST API", level: 80, icon: faCode },
    { name: "Next JS", level: 90, icon: faJsSquare }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Wordpress elemntor", level: 100, icon: faWordpress },
    { name: "Wordpress divi", level: 100, icon: faWordpress }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Wordpress Gutenberg", level: 90, icon: faWordpress }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée.
    { name: "Seo", level: 80, icon: faSearch }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée
    { name: "Laravel", level: 60, icon: faLaravel }, // Si faNode n'est pas disponible, utilisez une autre icône appropriée

  ]);
  const imgsatware = [
    { caption: "Bitbucket", urlthaimber: bitbakedimg },
    { caption: "Git hub", urlthaimber: githubimg },
    { caption: "Git lab", urlthaimber: gitlabimg },
    { caption: "Vs code", urlthaimber: vscodeimg },
    { caption: "Docker desktop", urlthaimber: dockerdsktop },
    { caption: "Zoho Sprint", urlthaimber: ZohoSprintimg },
    { caption: "Zoho CRM", urlthaimber: zohocc },
    {caption: "Jira CRM", urlthaimber: jiraimg },
    {caption: "Adope xd", urlthaimber: XD },
    
  ];
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
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "FR" ? "EN" : "FR"));
  };
    // Gérer la recherche
    const handleSearch = (searchCriteria) => {
      console.log("Recherche effectuée avec :", searchCriteria);
      // Ajoutez ici la logique pour traiter les résultats de recherche.
      alert(`Vous avez recherché : ${searchCriteria}`);
    };
  useEffect(() => {

  }, [activeLink])
  

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
              {language === "FR" ? "Qui je suis" : "About me"}{" "}
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
            <button className="btn-hover color-7"  onClick={(e) => {
                  e.preventDefault();
                  scrollToSection2('#section2');
                }}>
              {language === "FR" ? "En savoir plus" : "Learn more"}{" "}
              <FontAwesomeIcon icon={faArrowDown} />{" "}
            </button>
          </div>
        </div>
      </div>
      <div className='secton-cp'>
      <Competences  long={language}  skills={skills} />
      <Searchformplus  long={language}  skills={skills} imgsatware={imgsatware}/>
      </div>

      <Projects  long={language}/>
      <Contact  long={language}/>
      <Logiciels  long={language} saft={imgsatware}/>
     
      <Footer long={language} />
      <div className="fixed-bottom right-100 p-300 p-3" style={{zIndex:6 , left: "initial"}}>
       <a href="https://wa.me/50269194?text=Bonjour je suis intéressé pour  un autre  oprtunité" target="_blank">
       <img src={whatsapp} width="60" alt="whatsupp" />
       </a>
      </div>
    </>
  );
}
