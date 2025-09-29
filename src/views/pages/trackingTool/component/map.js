import React from "react";
import GoogleMapReact from "google-map-react";

const Map = ({ latitude, longitude }) => {
  const center = { lat: latitude, lng: longitude };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDV3MoYtL2bj84pB6v9Brk1Z68pWn7Bkc4" }}
        defaultCenter={center}
        defaultZoom={11}
      ></GoogleMapReact>
    </div>
  );
};

export default Map;
