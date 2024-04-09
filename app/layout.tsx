import { PrismaClient } from "@prisma/client";
import CategoriesSideBar from "./components/CategoriesSideBar";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import RandomPosts from "./components/RandomPosts";
import RightSide from "./components/RightSide";
import "./globals.css";
import CarouselCard from "./components/CarouselCard";
import "./category/[slug]/Carousel.css";
import Footer from "./components/Footer";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'MatheMatiques Du Secondaire',
  description: 'les solutions de tous les examens de maths du secondaire qualifiants se trouvent désormais sur une seule plateforme avec des videos explicatifs',
}
 



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
  const undercategories = await prisma.underCategory.findMany();
  return undercategories;
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();
  const posts = await fetchPosts();
  const undercategories = await fetchUnderCategories();

  const randomPosts1 = posts[getRandomInt(posts.length)];
  const randomPosts2 = posts[getRandomInt(posts.length)];
  const randomPosts3 = posts[getRandomInt(posts.length)];
  const randomPosts4 = posts[getRandomInt(posts.length)];

  const randomPosts = [randomPosts1, randomPosts2, randomPosts3, randomPosts4];

  return (
    <html lang="en">
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-xl m-auto bg-white">
            <main>
              <Navbar />
              <Header />
              <main className="pt-12 bg-gray-100 pb-12">
                <div className="carousel-container">
                  <CarouselCard underCategories={undercategories} />
                </div>
                <div className="container mx-auto  flex flex-wrap lg:flex-nowrap">
                  <div className="w-full xl:w-3/12 hidden xl:block">
                    <CategoriesSideBar categories={categories} />

                    <RandomPosts posts={randomPosts} />
                  </div>
                <div className="xl:w-6/12 lg:w-9/12 w-full  xl:ml-6 lg:mr-6">
                {children}
                </div>
                 <div className="lg:w-3/12 w-full mt-8 lg:mt-0">
                  <RightSide undercategories={undercategories} />
                  </div>
                </div>
              </main>
            </main>
            <Footer />
          </main>
        </main>
       
      </body>
    </html>
  );
}
