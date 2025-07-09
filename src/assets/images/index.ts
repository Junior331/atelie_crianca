import fallback from "./placeholder.svg";
import banner_home from "./banner_home.png";

export const images = {
  fallback,
  banner_home,
};

type IImage = keyof typeof images;

export const getImage = (id: IImage) => {
  return images[id] ?? images.fallback;
};
