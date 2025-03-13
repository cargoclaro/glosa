import { writeFileSync } from "fs";
import { xmlParser } from "./xml-parser";

const xmlUrl = "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15KAM1Uj24cxAwqMmpsYVRUeW6jkbtTlr5Qf7D"

async function parseXml() {
  const file = await fetch(xmlUrl);
  const xmlData = await file.text();
  const jsonData = xmlParser.parse(xmlData, true);
  writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
}

parseXml();
