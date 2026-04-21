"use client";


import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

export interface CategoryCardType {
  id: number;
  name: string;
  thumbnail: string;
  slug: string;
}

interface Props {
  underCategories: CategoryCardType[];
}

export default function CarouselCard({ underCategories }: Props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
 

  const nextSlide = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex + 3;
      return nextIndex >= underCategories.length ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex - 3;
      return nextIndex < 0 ? underCategories.length - 3 : nextIndex;
    });
  };
  return (
    <div className="card-container" >
      <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>
      <div className="carousel-container">
        {underCategories
          .slice(currentCardIndex, currentCardIndex + 4)
          .map((card) => (
            <Link 
              key={card.id}
              href={`/category/${card.slug}/posts`} 
              className="w-64 h-72 m-3 rounded-lg overflow-hidden border cursor-pointer bg-white hover:shadow-xl transition-shadow block"
            >
              <div className="relative h-36 w-full">
                <Image 
                  src={card.thumbnail || '/placeholder.jpg'} 
                  alt={card.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-2">
                <h3 className="font-bold text-xl">{card.name}</h3>
              </div>
            </Link>
          ))}
      </div>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}