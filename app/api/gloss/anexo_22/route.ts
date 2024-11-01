import path from "path";
import { promises as fs } from "fs";
// import { isAuthenticated } from "@/app/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // THIS IS COMMENTED BECAUSE THERE IS AN ISSUE WITH THE AUTHENTICATION
    // const session = await isAuthenticated();
    // if (!session) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { request_field } = await req.json();
    if (!request_field) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "anexo_22",
      `${request_field}.json`
    );
    const jsonData = await fs.readFile(filePath, "utf-8");

    return new NextResponse(jsonData, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
