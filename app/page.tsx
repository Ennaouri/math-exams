import { PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import Card from "./components/Card";
import { select } from "@material-tailwind/react";
import Link from "next/link";
import CategoriesSideBar from "./components/CategoriesSideBar";
import RandomPosts from "./components/RandomPosts";
import MainContent from "./components/MainContent";
import RightSide from "./components/RightSide";

const prisma = new PrismaClient();

const fetchPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

export default async function Home() {
  const posts = await fetchPosts();

  return (
      <MainContent posts={posts} />
  );
}
