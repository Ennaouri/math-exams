import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '../services';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((newCategories) => {
      setCategories(newCategories);
    });
  }, []);

  return (
    <div className="bg-white p-4 pb-4 mb-4">
      <h4>Catégories</h4>
      <hr />
      {categories.map((category, index) => (
        
        <div key={index} className="row items-center w-full mb-4 align-items-center categoriepointer">
          <div style={{ overflow : "hidden", margin: "5px"}}>
          <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="6921417058"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
     </div>
        <div className="col-2">
          <img
            alt={category.title}
            height="60px"
            width="60px"
            className=""
            src={category.thumbnail.url}
          />
        </div>
        <div className="col-10 ">
          <Link key={index} href={`/category/${category.slug}`}>
          <span >{category.name}</span>
        </Link>
        </div>
      </div>
      ))}
    </div>
  );
};

export default Categories;