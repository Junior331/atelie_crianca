import whatsapp from "./whatsapp.png";
import fallback from "../images/placeholder.svg";

export const icons = {
  fallback,
  whatsapp,
};

type IIcon = keyof typeof icons;

export const getIcon = (id: IIcon) => {
  return icons[id] ?? icons.fallback;
};
