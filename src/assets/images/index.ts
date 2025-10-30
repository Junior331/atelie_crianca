import mesa_01 from "./mesa_01.jpeg";
import mesa_02 from "./mesa_02.jpeg";
import mesa_03 from "./mesa_03.jpeg";
import mesa_04 from "./mesa_04.jpeg";
import mesa_05 from "./mesa_05.jpeg";
import fallback from "./placeholder.svg";
import capa_grupo from "./capa_grupo.png";
import banner_home from "./banner_home.png";
import capa_mobiliario from "./capa_mobiliario.png";
import capa_corporativo from "./capa_corporativo.png";
import mesa3 from "./mesa3.jpg";
import cadeira03 from "./cadeira 03.jpg";
import cadeira02 from "./cadeira02.jpg";
import cadeirs from "./cadeirs.jpg";
import mesa from "./mesa.png";
import mesa2 from "./mesa2.png";

export const images = {
  mesa,
  mesa2,
  mesa3,
  mesa_01,
  mesa_02,
  mesa_03,
  mesa_04,
  mesa_05,
  fallback,
  cadeirs,
  cadeira03,
  cadeira02,
  capa_grupo,
  banner_home,
  capa_mobiliario,
  capa_corporativo,
};

type IImage = keyof typeof images;

export const getImage = (id: IImage) => {
  return images[id] ?? images.fallback;
};
