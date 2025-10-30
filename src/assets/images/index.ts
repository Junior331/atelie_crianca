import mesa_01 from "./mesa_01.jpeg";
import mesa_02 from "./mesa_02.jpeg";
import mesa_03 from "./mesa_03.jpeg";
import mesa_04 from "./mesa_04.jpeg";
import mesa_05 from "./mesa_05.jpeg";
import fallback from "./placeholder.svg";
import capa_grupo from "./capa_grupo.png";
import banner_home from "./banner_home.png";
import capa_mobiliario from "./capa_mobiliario.png";

export const images = {
  mesa_01,
  mesa_02,
  mesa_03,
  mesa_04,
  mesa_05,
  fallback,
  capa_grupo,
  banner_home,
  capa_mobiliario,
};

type IImage = keyof typeof images;

export const getImage = (id: IImage) => {
  return images[id] ?? images.fallback;
};
