// Definir los límites geográficos (latitud/longitud) del mapa en el SVG
const latMin = 14.532; // Latitud sur de México
const latMax = 32.718; // Latitud norte de México
const lonMin = -118.455; // Longitud oeste de México
const lonMax = -86.709; // Longitud este de México

// Definir los límites del viewBox del SVG
const xMin = 0; // Coordenada x mínima en el viewBox
const xMax = 999; // Coordenada x máxima en el viewBox
const yMin = 0; // Coordenada y mínima en el viewBox
const yMax = 679; // Coordenada y máxima en el viewBox

const latLonToSvgCoords = (lat: number, lon: number) => {
  // Calcular cx (coordenada x en el SVG)
  const cx = xMin + ((lon - lonMin) / (lonMax - lonMin)) * (xMax - xMin);

  // Calcular cy (coordenada y en el SVG, nota que el eje y está invertido)
  const cy = yMax - ((lat - latMin) / (latMax - latMin)) * (yMax - yMin);

  return { cx, cy };
};

export default latLonToSvgCoords;
