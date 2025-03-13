import { XMLParser } from "fast-xml-parser";
import { writeFileSync } from "fs";

const xmlUrl = "https://jsht6r4dkc.ufs.sh/f/sP56sMGH6Y15DShVFnWvXf1H4BGpPhqDTbi9LIkRoZlxA503"

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

async function parseXml() {
  const file = await fetch(xmlUrl);
  const xmlData = await file.text();
  const jsonData = parser.parse(xmlData, true);
  writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
}

parseXml();
