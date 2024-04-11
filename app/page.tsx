import { PrismaClient } from "@prisma/client";
import MainContent from "./components/MainContent";

const prisma = new PrismaClient();

const fetchPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

export default async function Home() {
  const posts = await fetchPosts();
  console.log("posts are : ", posts)

  return (
      <MainContent posts={posts} />
  );
}
