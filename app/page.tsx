import MainContent from "./components/MainContent";
import { getPosts } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPosts();

  return (
      <MainContent posts={posts} />
  );
}
