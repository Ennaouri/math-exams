"use client";


import Link from "next/link";
import React, { useEffect, useState } from "react";

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
            <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
              <Link href={`/category/${card.slug}/posts`}>
                <img src={card.thumbnail} alt="" className="w-full h-36" />
                <div className="p-1">
                  <h3 className="font-bold text-2xl mb-2">{card.name}</h3>
                </div>
              </Link>
            </div>
          ))}
      </div>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}
