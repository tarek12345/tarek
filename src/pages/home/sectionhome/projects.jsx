import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Fancybox from "../../../componsants/Fancybox/Fancybox";
import bforbiz from "../../../assets/b-forbiz.png";
import flashcartegrise from "../../../assets/flashcartegrise.png";
import lesrousses from "../../../assets/lesrousses.png";
import Bbord from "../../../assets/bborad.png";
import Bborddetaile from "../../../assets/bboraddetaille.png";
import yellowsmidth from "../../../assets/buildersite.png";
import yellowsmidthdetaile from "../../../assets/ys-auth.png";
import yellowsmidthlist from "../../../assets/ysdetaille.png";
export default function Projects(props) {
  // Define separate image arrays for each project type
  const wordpressImages = [
    {
      url: "https://www.lesrousses.com/",
      thumbnail: lesrousses,
      caption: "Station des  rousses",
      captionen: "Station  rousses",
    },
    {
      url: "https://www.b-forbiz.com/",
      thumbnail: bforbiz,
      caption: "b-forbiz",
      captionen: "b-forbiz"
    },
    {
      url: "https://www.flash-carte-grise.fr/",
      thumbnail: flashcartegrise,
      caption: "Flach carte grise",
      captionen: "Flach carte grise",
      
    },
  ];

  const angularImages = [
    {
      url: "https://bboard.b-forbiz.com/login",
      thumbnail: Bbord,
      caption: "Authentification",
      captionen: "Authentication",
    },
    {
      url: "https://bboard.b-forbiz.com/index/administration",
      thumbnail: Bborddetaile,
      caption: " Tableaux du bord",
      captionen: "Bbord",
    },
  ];

  const reactImages = [
    {
      url: "https://ysbuilder.b-forbiz.com/editor/",
      thumbnail: yellowsmidthdetaile,
      caption: "Crée site",
      captionen: "Create  website",
    },
    {
      url: "https://ysbuilder.b-forbiz.com/",
      thumbnail: yellowsmidthlist,
      caption: "Listes des  sites ",
      captionen: "Site Lists",
    },
    {
      url: "https://ysbuilder.b-forbiz.com/",
      thumbnail: yellowsmidth,
      caption: "Bbord bforbiz",
    },
  ];

  return (
    <div id="section3">
      <div className="img-right">
      <sup> {props.long === "FR" ? "Mes Exemples" : "My Examples"}</sup> <h2>
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
            {props.long === "FR"
              ? " Projets WordPress"
              : "   Projects WordPress"}
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
            {props.long === "FR" ? "Projets Angular" : "   Projects Angular"}
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
            {props.long === "FR" ? "Projets React" : "   Projects React"}
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
          <Fancybox galleryName="wordpress-gallery" images={wordpressImages} longth={props} />
        </div>
        <div
          className="tab-pane fade"
          id="pills-angular"
          role="tabpanel"
          aria-labelledby="pills-angular-tab"
          tabIndex="1"
        >
          <Fancybox galleryName="angular-gallery" images={angularImages} longth={props}/>
        </div>
        <div
          className="tab-pane fade"
          id="pills-react"
          role="tabpanel"
          aria-labelledby="pills-react-tab"
          tabIndex="2"
        >
          <Fancybox galleryName="react-gallery" images={reactImages} longth={props}/>
        </div>
      </div>
    </div>
  );
}
