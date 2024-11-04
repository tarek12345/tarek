import React, { useState } from 'react';
import programming from "../../assets/programming.jpg";
import Header from '../../layout/header/header';
import Footer from '../../layout/footer/footer';
export default function Home(props) {
  const [language, setLanguage] = useState("FR");

  return (
    <>
    <Header long={language}/>
   
    <div className="allsection ">
      <div id="section1" className='container'>
    
        <div className='img-right'>
    
          <img src={programming} alt="sectionimageone" className='circular-image' />
          <h2>Sur moi</h2>
        </div>
        <div className='img-left'>
        
          <p>
            Dynamique et polyvalent, je suis passionné par l'innovation et la
            résolutionde problèmes. Fort d'une solide formation en ingénierie,
            j'ai acquis une expertise dans le développement de solutions
            technologiques efficaces et durables. Mon expérience professionnelle
            m'a permis de développer des compétences en gestion de projet et en
            travail d'équipe, ainsi qu'une capacité à m'adapter rapidement à de
            nouveaux environnements. Toujoursavide d'apprendre et de relever de
            nouveaux défis, je suis à la recherche d'opportunités où je pourrai
            mettre à profit mes compétences et contribuer au succès de projets
            stimulants
          </p>
        </div>
      </div>
    </div>
     <Footer long={language}/>
     </>
  );
}
