import { XMLParser } from "fast-xml-parser";
import { writeFileSync } from "fs";

const xmlUrl = "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KAM1Uj24cxAwqMmpsYVRUeW6jkbtTlr5Qf7D"

const alwaysArray = [
  "Comprobante.Conceptos"
];

const parser = new XMLParser({
  allowBooleanAttributes: true,
  ignoreAttributes: false,
  ignoreDeclaration: true,
  ignorePiTags: true,
  isArray: (_, jpath) => {
    if (alwaysArray.includes(jpath)) return true;
    return false;
  },
  parseAttributeValue: true,
  removeNSPrefix: true,
});

async function parseXml() {
  const file = await fetch(xmlUrl);
  const xmlData = await file.text();
  const jsonData = parser.parse(xmlData, true);
  writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
}

parseXml();
