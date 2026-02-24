import { cookies } from "next/headers";
import { getServerReviews } from "@/lib/server-api";
import HomeClient from "./HomeClient";

export default async function Home() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { reviews } = await getServerReviews({ limit: 20, cookieHeader });

  return <HomeClient initialReviews={reviews} />;
}



