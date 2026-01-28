"use server";

import { cookies } from "next/headers";

export async function getToken() {
  const token = (await cookies()).get("user")?.value;
  if (!token) return null;
  const jwtToken = JSON.parse(token).jwt_token;
  return jwtToken;
}
