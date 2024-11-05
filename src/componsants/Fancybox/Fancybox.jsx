// components/Fancybox/Fancybox.js
import { useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import "./Fancybox.css";

export default function Fancybox({ galleryName, images }) {
  useEffect(() => {
    // Initialize Fancybox for the specified gallery name
    NativeFancybox.bind(`[data-fancybox='${galleryName}']`, {
      loop: true,
    });

    // Cleanup Fancybox bindings when the component unmounts
    return () => {
      NativeFancybox.destroy();
    };
  }, [galleryName]);

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <a
          key={index}
          href={image.thumbnail}  // Ensure this is the full-size image
          data-fancybox={galleryName}
          data-caption={image.caption}
          className="fancybox-image-wrapper"
        >
          <img src={image.thumbnail} alt={image.caption} className="fancybox-image" />
          <div className="overlay">
            <FontAwesomeIcon icon={faSearchPlus} className="overlay-icon" />
          </div>
        </a>
      ))}
    </div>
  );
}
