import { useGLTF, useProgress } from "@react-three/drei";
import { useEffect } from "react";

export function ThreeDModel({ showModelQltyOf, threedModelSrc, setHasToShowPreview, ...props }) {
  const { progress } = useProgress();
  const { scene } = useGLTF(
    // showModelQltyOf === 'high'
    //   ? 'https://galileo-staging-assets.s3.amazonaws.com/threejs-assets/datsun_high_glb.glb'
    //   : 'https://galileo-staging-assets.s3.amazonaws.com/threejs-assets/lamborghini_venevo.glb'
    threedModelSrc
  );

  useEffect(() => {
    if (progress === 100) {
      setHasToShowPreview(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return <primitive object={scene} {...props} />;
}
