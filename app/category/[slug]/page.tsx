

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
    {/*<div className='flex'>
    <div className='basis-1/3'>
      {categories.map((category) => (
        <Card category={category}/>
      ))}</div>
      <div className='flex'>
      {categories.map((category) => (
        <Card category={category}/>
      ))}
      </div>

      
      </div>*/}
      <div className="container mx-auto flex flex-wrap py-6">
    <section className="w-full md:w-2/3 flex flex-col items-center px-3">
      {categories.map((category) =>(
        <Card category={category} />
      ))}

            <div className="flex items-center py-8">
                <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
                <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
                <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
            </div>
    </section>
    <aside className="w-full md:w-1/3 flex flex-col items-center px-3">
    <div className="w-full bg-white shadow flex flex-col my-4 p-6">
                <p className="text-xl font-semibold pb-5">About Us</p>
                <p className="pb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis est eu odio sagittis tristique. Vestibulum ut finibus leo. In hac habitasse platea dictumst.</p>
                <a href="#" className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                    Get to know us
                </a>
            </div>
            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
                <p className="text-xl font-semibold pb-5">Instagram</p>
                <div className="grid grid-cols-3 gap-3">
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=1" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=2" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=3" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=4" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=5" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=6" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=7" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=8" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=9" />
                </div>
                <a href="#" className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-6">
                    <i className="fab fa-instagram mr-2"></i> Follow @dgrzyb
                </a>
            </div>
    </aside>

    </div>
    
    </>
  );
};

export default Carousel;

