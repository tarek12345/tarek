import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Fancybox from "../../../componsants/Fancybox/Fancybox";
import bforbiz from "../../../assets/b-forbiz.png";
import flashcartegrise from "../../../assets/flashcartegrise.png";
import lesrousses from "../../../assets/lesrousses.png";

export default function Projects(props) {
  // Define separate image arrays for each project type
  const wordpressImages = [
    { url: "https://www.lesrousses.com/", thumbnail: lesrousses, caption: "Flach carte grise" },
    { url: "https://www.b-forbiz.com/", thumbnail: bforbiz, caption: "b-forbiz" },
    { url: "https://www.flash-carte-grise.fr/", thumbnail: flashcartegrise, caption: "Flach carte grise" },
  ];
  
  const angularImages = [
    { url: "/path/to/angular-image1.jpg", thumbnail: "/path/to/angular-thumbnail1.jpg", caption: "Angular Image 1" }
  ];
  
  const reactImages = [
    { url: "/path/to/react-image1.jpg", thumbnail: "/path/to/react-thumbnail1.jpg", caption: "React Image 1" },
    { url: "/path/to/react-image2.jpg", thumbnail: "/path/to/react-thumbnail2.jpg", caption: "React Image 2" },
  ];

  return (
    <div id="section3">
      <div className="img-right">
        <h2>
          {props.long === "FR" ? "Mes projets" : "My projects"}{" "}
          <FontAwesomeIcon icon={faArrowDown} />
        </h2>
      </div>
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-wordpress-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-wordpress"
            type="button"
            role="tab"
            aria-controls="pills-wordpress"
            aria-selected="true"
          >
            Projets WordPress
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-angular-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-angular"
            type="button"
            role="tab"
            aria-controls="pills-angular"
            aria-selected="false"
          >
            Projets Angular
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-react-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-react"
            type="button"
            role="tab"
            aria-controls="pills-react"
            aria-selected="false"
          >
            Projets React
          </button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-wordpress"
          role="tabpanel"
          aria-labelledby="pills-wordpress-tab"
          tabIndex="0"
        >
          <Fancybox galleryName="wordpress-gallery" images={wordpressImages} />
        </div>
        <div
          className="tab-pane fade"
          id="pills-angular"
          role="tabpanel"
          aria-labelledby="pills-angular-tab"
          tabIndex="1"
        >
          <Fancybox galleryName="angular-gallery" images={angularImages} />
        </div>
        <div
          className="tab-pane fade"
          id="pills-react"
          role="tabpanel"
          aria-labelledby="pills-react-tab"
          tabIndex="2"
        >
          <Fancybox galleryName="react-gallery" images={reactImages} />
        </div>
      </div>
    </div>
  );
}
