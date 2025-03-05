import React, { useState, useEffect } from "react";
import "./Carousel.css";
import { PrismaClient } from "@prisma/client";
import CarouselCard from "../../components/CarouselCard";
import Card from "../components/Card";
import SmallCard from "../components/SmallCard";

interface Card {
  id: number;
  title: string;
  content: string;
}

const prisma = new PrismaClient();
const fetchCategoryUndercatgories = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      underCategories: true,
    },
  });

  if (!category) {
    throw new Error();
  }
  return category.underCategories;
};

const Carousel = async ({ params }: { params: { slug: string } }) => {
  const underCategories = await fetchCategoryUndercatgories(params.slug);

  return (
    <>
      <div>
        <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
          <h5 className="text-base uppercase font-semibold font-roboto">
            Under Categories
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {underCategories.map((underCategory, index) => (
           <div key={index}>
                       
                       <SmallCard undercategory={underCategory} />
                       
                     </div>
                   ))}
          
        </div>
      </div>
    </>
  );
};

export default Carousel;
