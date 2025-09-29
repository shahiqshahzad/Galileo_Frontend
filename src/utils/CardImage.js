import React from "react";
import "./CardImageStyle.css";

export const CardImage = ({ src, alt, className, background }) => {
  return (
    <div
      className={`${className ? className : "container"} `}
      style={{
        background: background ? background : "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
      }}
    >
      <img
        src={src}
        alt={alt}
        className="image"
        style={
          {
            // background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
          }
        }
      />
    </div>
  );
};
