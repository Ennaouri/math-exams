"use client";
import { Post } from "@prisma/client";
import React from "react";
import FirstCard from "./FirstCard";
import SmallCard from "./SmallCard";

const getRecentPost = (posts: Post[]) => {
  let minIndex: number[] = [];
  posts.forEach((post) => {
    minIndex.push(Date.now() - post.created_at.getTime());
  });
  return posts[minIndex.indexOf(Math.min.apply(null, minIndex))];
};

export default function MainContent({ posts }: { posts: Post[] }) {
  const recentPost = getRecentPost(posts);
  return (
    <div className="xl:w-6/12 lg:w-9/12 w-full  xl:ml-6 lg:mr-6">
         <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">Popular Posts</h5>
        
      </div>
      <FirstCard post={recentPost} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.toReversed().map((post) => (
          <SmallCard post={post} />
        ))}
      </div>
    </div>
  );
}
