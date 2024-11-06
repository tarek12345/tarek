import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';


export default function Route(props) {
  const [activeLink, setActiveLink] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSetActive = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false); // Close menu after clicking a link
  };

  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id); // Set active link for highlighting
      setIsMenuOpen(false); // Close menu after scrolling
    }
  };
  const scrollToSection2 = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id); // Set active link for highlighting
      setIsMenuOpen(false); // Close menu after scrolling
    }
  };
  const scrollToSection3 = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id); // Set active link for highlighting
      setIsMenuOpen(false); // Close menu after scrolling
    }
  };
  const scrollToSection4 = (id) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(id); // Set active link for highlighting
      setIsMenuOpen(false); // Close menu after scrolling
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="dlmenu">
      <Router>
        {/* Burger Icon */}
        <div className="burger-icon" onClick={toggleMenu}>
          ☰
        </div>
        
        {/* Menu */}
        <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link
                to="/"
                onClick={() => handleSetActive('/')}
                className={activeLink === '/' ? 'active' : ''}
              >
                {props.long === "FR" ? "Accueil" : "Home"}
              </Link>
            </li>
            <li>
              <a
                href="#section1"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#section1');
                }}
                className={activeLink === '#section1' ? 'active' : ''}
              >
                {props.long === "FR" ? "Sur moi" : "About me"}
              </a>
            </li>
            <li>
              <a
                href="#section2"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection2('#section2');
                }}
                className={activeLink === '#section2' ? 'active' : ''}
              >
                {props.long === "FR" ? "Compétences" : "Skills"}
              </a>
            </li>
            <li>
              <a
                href="#section3"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection3('#section3');
                }}
                className={activeLink === '#section3' ? 'active' : ''}
              >
                {props.long === "FR" ? "Mes projets" : "My projects"}
              </a>
            </li>
            <li>
              <a
                href="#section4"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection4('#section4');
                }}
                className={activeLink === '#section4' ? 'active' : ''}
              >
                {props.long === "FR" ? "Logiciels" : "Software"}
              </a>
            </li>
          </ul>
        </nav>
      </Router>
    </div>
  );
}
