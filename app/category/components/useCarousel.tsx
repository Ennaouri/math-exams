import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';


const prisma = new PrismaClient()

const fetchCategoryUndercatgories = async () => {
  const category = await prisma.category.findMany()

  if(!category){
      throw new Error
  }
  return category
}

export const useCarousel = async() => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const categories = await fetchCategoryUndercatgories()
  console.log(categories)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => {
        const nextIndex = prevIndex + 3;
        return nextIndex >= categories.length ? 0 : nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentCardIndex]);

  return { currentCardIndex, setCurrentCardIndex };
};
