import { OuterLoaderCircle, InnerLoaderCircle } from "../../../../../assets";

export function ThreedViewLoader() {
  return (
    <div className="loader">
      <img src={OuterLoaderCircle} alt="outer circle" className="loader-outer-circle" />
      <img src={InnerLoaderCircle} alt="inner circle" className="loader-inner-circle" />
    </div>
  );
}
