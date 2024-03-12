
import { PrismaClient } from '@prisma/client'
import Header from './components/Header'
import Card from './components/Card';
import { select } from '@material-tailwind/react';


export interface CategoryCardType {
  id : number;
  name : string;
  thumbnail : string;
  slug : string;
}
const prisma = new PrismaClient()

const fetchCategories = async (): Promise<CategoryCardType[]> => {
  const categories = await prisma.category.findMany({
    select : {
      id : true,
      name : true,
      thumbnail : true,
      slug : true,
    }
  });

  return categories;
}



export default async function Home() {
  const categories = await fetchCategories()

  return (

    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap">
      {categories.map((category) => (
        <Card category={category}/>
      ))}
      
      </div>
    </main>
  )
}
