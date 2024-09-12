"use client";
import { Post } from "@prisma/client";
import React, { useEffect } from "react";
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
  
  const recentPost = getRecentPost(posts);
  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          Postes Populaires
        </h5>
      </div>
      <FirstCard post={recentPost} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.map((post, index) => (
          <div key={index}>
            
            {(index+1 ) % 3 === 0 && index < posts.length - 1 ? (
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
            ) : <SmallCard post={post} />}
            
          </div>
        ))}
      </div>
    </div>
  );
}
