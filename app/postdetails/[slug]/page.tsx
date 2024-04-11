"use client";
import { PrismaClient } from "@prisma/client";
import React, { useEffect } from "react";
import "./postDetails.css";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const prisma = new PrismaClient();

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

const fetchPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
  });
  if (!post) {
    throw new Error();
  }
  return post;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.slug;
  const post = await fetchPost(id);
  return {
    title: post.name,
  };
}

const fetchPostDetails = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      postDetails: true,
    },
  });
  if (!post) {
    throw new Error();
  }
  return post.postDetails;
};

export default async function PostDetails({
  params,
}: {
  params: { slug: string };
}) {
  const postdetails = await fetchPostDetails(params.slug);
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
  });
  return (
    <>
      <div className="">
        <div className="rounded-sm overflow-hidden bg-white shadow-sm">
          <div className="">
            <img src={post?.thumbnail} className="w-full h-96 " />
          </div>
          <div className="p-4 pb-5">
            <h2 className="block text-2xl font-semibold text-gray-700 font-roboto">
              {post?.name}
            </h2>
            <div className="mt-2 flex space-x-4">
              <div className="flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-user"></i>
                </span>
                Cours
              </div>
              <div className="flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-clock"></i>
                </span>
                {post?.created_at.toDateString()}
              </div>
            </div>
            <div id="accordionExample">
              {postdetails.map((post) => (
                <div className="rounded-t-lg   bg-white dark:border-neutral-600 dark:bg-body-dark">
                  <div
                    id="collapseOne"
                    className="!visible"
                    data-twe-collapse-item
                    data-twe-collapse-show
                    aria-labelledby="headingOne"
                    data-twe-parent="#accordionExample"
                  >
                    <div className="px-5 py-4">
                      <div className="rounded-t-lg  bg-white">
                        <h2 className="mb-0" id="headingOne">
                          {post.name}
                        </h2>
                        <div
                          id="collapseOne"
                          className="!visible"
                          data-twe-collapse-item
                          data-twe-collapse-show
                          aria-labelledby="headingOne"
                          data-twe-parent="#accordionExample"
                        >
                          <div className="px-5 py-4">
                            <div
                              className="paragraph atag video-container"
                              dangerouslySetInnerHTML={{
                                __html: post.description,
                              }}
                            ></div>
                            <div style={{ overflow: "hidden", margin: "5px" }}>
                              <ins
                                className="adsbygoogle"
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                }}
                                data-ad-layout="in-article"
                                data-ad-format="fluid"
                                data-ad-client="ca-pub-5587331919297301"
                                data-ad-slot="5512454890"
                              ></ins>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
