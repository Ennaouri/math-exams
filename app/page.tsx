import { PrismaClient } from "@prisma/client";
import MainContent from "./components/MainContent";

const prisma = new PrismaClient();

const fetchPosts = async () => {
  const posts = await prisma.post.findMany();
  if(!posts){
    throw new Error("no posts found")
}
  return posts;
};

export default async function Home() {
  const posts = await fetchPosts();

  return (
      <MainContent posts={posts} />
  );
}
