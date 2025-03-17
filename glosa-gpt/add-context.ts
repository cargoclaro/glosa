import fs from "fs";
import OpenAI from "openai";
import { config } from "dotenv";

config();

const openai = new OpenAI();

async function main(filePath: string) {
  let result;
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    // Download the file content from the URL
    const res = await fetch(filePath);
    const buffer = await res.arrayBuffer();
    const urlParts = filePath.split("/");
    const fileName = urlParts[urlParts.length - 1];
    if (!fileName) {
      throw new Error("File name not found");
    }
    const file = new File([buffer], fileName);
    result = await openai.files.create({
      file: file,
      purpose: "assistants",
    });
  } else {
    // Handle local file path
    const fileContent = fs.createReadStream(filePath);
    result = await openai.files.create({
      file: fileContent,
      purpose: "assistants",
    });
  }
  const fileId = result.id;
  await openai.vectorStores.files.create(
    "vs_67d7695b431c8191b1cf2b09e77f7584",
    {
        file_id: fileId,
    }
  );
}

main("glosa-gpt/anexo22.pdf");