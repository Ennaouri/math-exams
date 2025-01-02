import { PrismaClient } from "@prisma/client";
import React from "react";
import SmallCard from "../../../components/SmallCard";

const prisma = new PrismaClient();

const fetchPosts = async (slug: string) => {
  const underCategories = await prisma.underCategory.findUnique({
    where: {
      slug,
    },
    select: {
      posts: true,
    },
  });
  if (!underCategories) {
    throw new Error("error");
  }
  return underCategories.posts;
};
export default async function CategoryPosts({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await fetchPosts(params.slug);
  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          Populaires Postes
        </h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.map((post, index) => (
          <div key={index}>
              <SmallCard post={post} />
             
          </div>
          
        ))}
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
      </div>
      
    </div>
  );
}

