import { XMLParser } from 'fast-xml-parser';

const alwaysArray = [
  'Comprobante.Conceptos.Concepto',
  'Comprobante.Complemento.ComercioExterior.Mercancias.Mercancia',
];

export const xmlParser = new XMLParser({
  allowBooleanAttributes: true,
  attributeNamePrefix: '',
  attributesGroupName: 'attributes',
  ignoreAttributes: false,
  ignoreDeclaration: true,
  ignorePiTags: true,
  isArray: (_, jpath) => {
    if (alwaysArray.includes(jpath)) {
      return true;
    }
    return false;
  },
  parseAttributeValue: true,
  removeNSPrefix: true,
});
