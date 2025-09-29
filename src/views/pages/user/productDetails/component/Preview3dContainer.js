import { ThreeDModel } from "./ThreeDModel";
import { CloseIcon } from "../../../../../assets";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage, OrbitControls } from "@react-three/drei";
import { useState } from "react";

const canvasStyle = {
  position: "absolute",
  top: 50,
  inset: 0,
  width: "100%",
  height: "100%",
  touchAction: "none"
};

export function Preview3dContainer({
  showModelQltyOf,
  handleCloseBtnClick,
  className,
  setHasToShowPreview,
  threedModelSrc
}) {
  const [hasToGiveHint, setHasToGiveHint] = useState(localStorage.getItem("3d-hint-view") ? false : true);

  const handleCanvasMouseDown = () => {
    setHasToGiveHint(false);
    localStorage.setItem("3d-hint-view", 1);
  };

  return (
    <div className={`preview-3d-container ${className}`}>
      <button className="close-button" onClick={() => handleCloseBtnClick()}>
        <img src={CloseIcon} alt="close" />
      </button>

      <div className="canvas-container" onMouseDown={handleCanvasMouseDown}>
        <Canvas style={canvasStyle}>
          <color attach="background" args={["#CBD5E1"]} />
          <OrbitControls rotateSpeed={0.5} />
          <PresentationControls>
            <Stage shadows={false}>
              <ThreeDModel
                showModelQltyOf={showModelQltyOf}
                setHasToShowPreview={setHasToShowPreview}
                threedModelSrc={threedModelSrc}
              />
            </Stage>
          </PresentationControls>
        </Canvas>

        <div className={`viewer-hint ${hasToGiveHint ? "" : "hint-hide"}`}>
          <div>
            <span className="icon" />
            <span>
              click & hold <br /> to rotate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
