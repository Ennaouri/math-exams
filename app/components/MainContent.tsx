"use client";
import { Post } from "@/lib/types";
import React, { useEffect } from "react";
import FirstCard from "./FirstCard";
import SmallCard from "./SmallCard";

const getRecentPost = (posts: Post[]) => {
  if (!posts || posts.length === 0) return null;
  
  let minIndex: number[] = [];
  posts.forEach((post) => {
    minIndex.push(Date.now() - new Date(post.created_at).getTime());
  });
  return posts[minIndex.indexOf(Math.min.apply(null, minIndex))];
};

export default function MainContent({ posts }: { posts: Post[] }) {
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
    const backgroundColor = window.getComputedStyle(body).backgroundColor;
                        if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                            console.log('The body has a transparent background color.');
                        } else {
                            console.log('The body does not have a transparent background color.');
                        }
                      }
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("could not initialize adsense ad");
      }
    }
  }, []);
  
  const recentPost = getRecentPost(posts);
  
  if (!posts || posts.length === 0) {
    return (
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          No posts available yet.
        </h5>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          Postes Populaires
        </h5>
      </div>
      {recentPost && <FirstCard post={recentPost} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.map((post, index) => (
          <div key={index}>
            
            <SmallCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}