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
    <div className="bg-white  p-4 pb-4 mb-4">
      <h4>Categories</h4>
      <hr />
      {categories.map((category, index) => (
        <Link key={index} href={`/category/${category.slug}`}>
          <span className='categoriepointer'>{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Categories;