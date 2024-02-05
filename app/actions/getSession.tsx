import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nerxtauth]";

export default async function getSession() {
  return await getServerSession(authOptions);
}
