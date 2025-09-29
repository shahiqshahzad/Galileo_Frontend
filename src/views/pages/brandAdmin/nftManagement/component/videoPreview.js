import React, { useEffect } from "react";
import "video-react/dist/video-react.css"; // import CSS styles
import { Player } from "video-react";
import { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@mui/material/styles";
import { Icons } from "shared/Icons/Icons";

const Video = ({ vid, handleToggle, setHandleToggle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  const videoRef = useRef(null);
  const theme = useTheme();

  const useStyles = makeStyles(() => ({
    videoReactStyle: {
      background: theme.palette.mode === "dark" ? "#262626 !important" : "#000"
    }
  }));
  const classes = useStyles();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        setShown(false);
        videoRef.current.pause();
      } else {
        setShown(true);
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (handleToggle) {
      videoRef.current.toggleFullscreen();
      setHandleToggle(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleToggle]);

  return (
    <>
      <div className="video-wrapper" style={{ width: "28%", height: "200px", overflow: "hidden" }}>
        <Player fluid={false} height="100%" ref={videoRef} onClick={togglePlay} className={classes.videoReactStyle}>
          <source src={vid} />
        </Player>
        <div className={shown === false ? "svg-overlay" : "svg-overlay-display-none"} onClick={togglePlay}>
          {Icons?.videoButton}
        </div>
      </div>
      {/* <button onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button> */}
    </>
  );
};

export default Video;
