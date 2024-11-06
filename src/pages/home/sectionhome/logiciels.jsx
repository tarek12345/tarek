import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import programming from "../../../assets/programming.jpg";
import Slidersofware from '../../../componsants/slider/slidersofware';
export default function Logiciels(props) {
  return (
    <div id="section1" className="container">
    <div className="img-right">
      <img
        src={programming}
        alt="sectionimageone"
        className="circular-image"
      />

      <h2>
        {props.long === "FR" ? "Sur moi" : "About me"}{" "}
        <FontAwesomeIcon icon={faArrowDown} />{" "}
      </h2>
    </div>
     <div className="img-left container p-4">
        <Slidersofware />
      </div>
      </div>
  )
}
