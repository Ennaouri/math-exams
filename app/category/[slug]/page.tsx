"use client";
import React, { useEffect } from "react";
import './Carousel.css';
import { PrismaClient } from '@prisma/client';
import CarouselCard from '../../components/CarouselCard';
import Card from '../components/Card';
import SmallCard from '../components/SmallCard';

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
  useEffect(() => {
    // Execute the script when the component mounts
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("could not initialize adsense ad");
      }
    }
  }, []);
  
  const underCategories = await fetchCategoryUndercatgories(params.slug)

  return (
    <>
    <div >
         <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">Under Categories</h5>
        
      </div>
     

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {underCategories.map((underCategory, index) =>(
        
        <div key={index}>
            
            {(index+1 ) % 3 === 0 && index < underCategories.length - 1 ? (
              <div style={{ overflow: "hidden", margin: "5px" }}>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-format="fluid"
                  data-ad-layout-key="+1s+qf+1+f+9b"
                  data-ad-client="ca-pub-5587331919297301"
                  data-ad-slot="5295729441"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            ) : <SmallCard undercategory={underCategory}  />}
            
          </div>
      ))}
      </div>
    </div>
            
    </>
  );
};

export default Carousel;

