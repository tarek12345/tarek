import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default function Route(props) {
  const [activeLink, setActiveLink] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const sections =[
  { id: '#section1', label: props.long === "FR" ? "Sur moi" : "About me" },
  { id: '#section2', label: props.long === "FR" ? "Compétences" : "Skills" },
  { id: '#section3', label: props.long === "FR" ? "Mes projets" : "My projects" },
  { id: '#section4', label: props.long === "FR" ? "Infos" : "Info" },
  { id: '#section5', label: props.long === "FR" ? "Logiciels" : "Software" }
];
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
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={section.id}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                  className={activeLink === section.id ? 'active' : ''}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Router>
    </div>
  );
}
