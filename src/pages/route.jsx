import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

export default function Page() {
  const [activeLink, setActiveLink] = useState('/');

  const handleSetActive = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="dlmenu">
      <Router>
        <nav>
          <ul>
            <li>
              <Link
                to="/"
                onClick={() => handleSetActive('/')}
                className={activeLink === '/' ? 'active' : ''}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/#section1"
                onClick={() => handleSetActive('#section1')}
                className={activeLink === '#section1' ? 'active' : ''}
              >
                À Propos
              </Link>
            </li>
            {/* Repeat for additional links as needed */}
          </ul>
        </nav>
      </Router>
    </div>
  );
}
