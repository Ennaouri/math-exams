"use client"

import Error from 'next/error';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


export interface CategoryCardType {
  id : number;
  name : string;
  thumbnail : string;
  slug : string;
}

interface Props {
  categories : CategoryCardType[];
}

export default async function CarouselCard({categories}: Props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentCardIndex]);

  const nextSlide = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex + 3;
      return nextIndex >= categories.length ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex - 3;
      return nextIndex < 0 ? categories.length - 3 : nextIndex;
    });
  };
  return (
    <>
    <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>
      <div className="card-container">
        {categories.slice(currentCardIndex, currentCardIndex + 3).map((card) => (
          <div
          className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer"
        >
          <Link href={`/category/${card.slug}`}>
          <img
            src={card.thumbnail}
            alt=""
            className="w-full h-36"
          />
          <div className="p-1">
            <h3 className="font-bold text-2xl mb-2">{card.name}</h3>
            <div className="flex items-start">
              <div className="flex mb-2">*****</div>
              <p className="ml-2">77 reviews</p>
            </div>
            <div className="flex text-reg font-light capitalize">
              <p className=" mr-3">Mexican</p>
              <p className="mr-3">$$$$</p>
              <p>Toronto</p>
            </div>
            <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
          </div>
          </Link>
      </div>
        ))}
      </div>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>
      </>
  )
}
