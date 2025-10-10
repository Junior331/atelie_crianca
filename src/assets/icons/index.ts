import whatsapp from "./whatsapp.png";
import fallback from "../images/placeholder.svg";
import eventos_100 from "./eventos_100.png";
import agilidade from "./agilidade.png";
import ecritorio from "./ecritorio.png";
import equipe from "./equipe.png";
import experiencia from "./experiencia.png";
import mobiliario from "./mobiliario.png";
import paleta_de_cores from "./paleta_de_cores.png";
import treinamento from "./treinamento.png";

export const icons = {
  fallback,
  whatsapp,
  eventos_100,
  agilidade,
  ecritorio,
  equipe,
  experiencia,
  mobiliario,
  paleta_de_cores,
  treinamento,
};

type IIcon = keyof typeof icons;

export const getIcon = (id: IIcon) => {
  return icons[id] ?? icons.fallback;
};
