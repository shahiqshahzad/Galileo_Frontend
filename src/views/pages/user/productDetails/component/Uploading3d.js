import { ThreedViewLoader } from "./ThreedViewLoader";

export function Uploading3d({ className }) {
  return (
    <div className={`uploading-3d ${className}`}>
      <ThreedViewLoader />
      <p>Uploading 3D view...</p>
    </div>
  );
}
