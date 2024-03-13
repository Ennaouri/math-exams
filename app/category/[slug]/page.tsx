

import React, { useState, useEffect } from 'react';
import './Carousel.css';
import { PrismaClient } from '@prisma/client';
import CarouselCard from '../components/CarouselCard';
import Card from '../components/Card';

interface Card {
  id: number;
  title: string;
  content: string;
}

const prisma = new PrismaClient()
const fetchCategoryUndercatgories = async (slug : string) => {
  const category = await prisma.category.findUnique({
      where : {
          slug
      },
      select : {
          underCategories: true
      }
  })

  if(!category){
      throw new Error
  }
  return category.underCategories
}



const Carousel = async({params} : {params : {slug : string}}) => {
  const categories = await fetchCategoryUndercatgories(params.slug)

  return (
    <>
    <div className="carousel-container">
      <CarouselCard  categories={categories}/>
    </div>
    <div className='flex'>
    <div className='basis-1/3'>{categories.map((category) => (
        <Card category={category}/>
      ))}</div>
      <div className='flex'>
      {categories.map((category) => (
        <Card category={category}/>
      ))}
      </div>

      
      </div>
    
    </>
  );
};

export default Carousel;

