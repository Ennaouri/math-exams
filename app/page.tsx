import { PrismaClient } from "@prisma/client";
import MainContent from "./components/MainContent";

const prisma = new PrismaClient();

const fetchPosts = async () => {
  const posts = await prisma.post.findMany();
  console.log("inside posts : ", posts)
  if(!posts){
    throw new Error("no posts found")
}
  return posts;
};

export default async function Home() {
  const posts = await fetchPosts();
  console.log("posts are : ", posts)

  return (
      <MainContent posts={posts} />
  );
}
