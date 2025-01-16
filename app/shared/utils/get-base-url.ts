"use server";

import { headers } from "next/headers";

function getBaseUrl() {
  const host = headers().get("host") ?? "localhost:3000";
  const port = headers().get("x-forwarded-proto") ?? "http";
  return `${port}://${host}`;
}

export default getBaseUrl;
