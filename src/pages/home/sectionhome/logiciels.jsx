import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import programming from "../../../assets/logiciels.png";
import Slidersofware from '../../../componsants/slider/slidersofware';
export default function Logiciels(props) {
  return (
    <div id="section5" className="container">
        
    <div className="img-right">
    <h2>
        <FontAwesomeIcon icon={faArrowDown} />{" "}
        {props.long === "FR" ? "Logiciels" : "Software"}{" "}
       
      </h2>
      <img
        src={programming}
        alt="sectionimageone"
        className="circular-image"
      />

     
    </div>
     <div className="img-left container p-4">
        
        <Slidersofware  translate={props}/>
      </div>
      </div>
  )
}
