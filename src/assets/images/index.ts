import mesa_01 from "./mesa_01.jpeg";
import mesa_02 from "./mesa_02.jpeg";
import mesa_03 from "./mesa_03.jpeg";
import mesa_04 from "./mesa_04.jpeg";
import mesa_05 from "./mesa_05.jpeg";
import fallback from "./placeholder.svg";
import banner_home from "./banner_home.png";

export const images = {
  mesa_01,
  mesa_02,
  mesa_03,
  mesa_04,
  mesa_05,
  fallback,
  banner_home,
};

type IImage = keyof typeof images;

export const getImage = (id: IImage) => {
  return images[id] ?? images.fallback;
};
