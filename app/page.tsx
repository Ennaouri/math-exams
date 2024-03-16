import { PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import Card from "./components/Card";
import { select } from "@material-tailwind/react";
import Link from "next/link";
import CategoriesSideBar from "./components/CategoriesSideBar";
import RandomPosts from "./components/RandomPosts";
import MainContent from "./components/MainContent";
import RightSide from "./components/RightSide";

export interface CategoryCardType {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
}
const prisma = new PrismaClient();

const fetchCategories = async (): Promise<CategoryCardType[]> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      thumbnail: true,
      description: true,
      slug: true,
    },
  });

  return categories;
};

const fetchPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

const fetchUnderCategories = async () => {
  const undercategories = await prisma.underCategory.findMany()
  return undercategories
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export default async function Home() {
  const categories = await fetchCategories();
  const posts = await fetchPosts();
  const undercategories = await fetchUnderCategories();

  const randomPosts1 = posts[getRandomInt(posts.length)];
  const randomPosts2 = posts[getRandomInt(posts.length)];
  const randomPosts3 = posts[getRandomInt(posts.length)];
  const randomPosts4 = posts[getRandomInt(posts.length)];

  const randomPosts = [randomPosts1, randomPosts2, randomPosts3, randomPosts4];

  return (
    <main>
      <Header />
      <main className="pt-12 bg-gray-100 pb-12">
        <div className="container mx-auto  flex flex-wrap lg:flex-nowrap">
          <div className="w-3/12 hidden xl:block">
            <CategoriesSideBar categories={categories} />

            <RandomPosts posts={randomPosts} />
          </div>

          <MainContent posts={posts} />

          <RightSide undercategories = {undercategories}/>
        </div>
      </main>
    </main>
  );
}
