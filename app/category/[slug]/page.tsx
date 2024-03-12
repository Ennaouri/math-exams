

import React, { useState, useEffect } from 'react';
import './Carousel.css';
import { PrismaClient } from '@prisma/client';
import CarouselCard from '../components/CarouselCard';

interface Card {
  id: number;
  title: string;
  content: string;
}

const prisma = new PrismaClient()
const fetchCategories = async () => {
  
    const categories = await prisma.category.findMany()
  
    if(!categories){
      throw Error
    }
  return categories
}

const cardsData: Card[] = [
  { id: 1, title: 'Card 1', content: 'Content for card 1' },
  { id: 2, title: 'Card 2', content: 'Content for card 2' },
  { id: 3, title: 'Card 3', content: 'Content for card 3' },
  { id: 4, title: 'Card 4', content: 'Content for card 4' },
  { id: 5, title: 'Card 5', content: 'Content for card 5' },
  { id: 6, title: 'Card 6', content: 'Content for card 6' },
];

const Carousel: React.FC = async() => {
  const categories = await fetchCategories()

  return (
    <div className="carousel-container">
      <CarouselCard  categories={categories}/>
    </div>
  );
};

export default Carousel;
