import MainContent from "./components/MainContent";
import { getPosts, getCategories } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPosts();
  const categories = await getCategories();

  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          Categories
        </h5>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {category.thumbnail && (
                <img 
                  src={category.thumbnail} 
                  alt={category.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <MainContent posts={posts} />
      </div>
    </div>
  );
}
