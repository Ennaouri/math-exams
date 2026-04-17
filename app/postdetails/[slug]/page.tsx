import React from "react";
import "./postDetails.css";
import type { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPostDetailsByPostSlug } from "@/lib/db";

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post?.name ?? 'Post',
  };
}

export default async function PostDetails({
  params,
}: {
  params: { slug: string };
}) {
  const postdetails = await getPostDetailsByPostSlug(params.slug);
  const sortedPosts = postdetails.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  
  const post = await getPostBySlug(params.slug);
  
  return (
    <>
      <div className="">
        <div className="rounded-sm overflow-hidden bg-white shadow-sm">
          <div className="">
            <img src={post?.thumbnail} className="w-full h-96 " alt={post?.name}/>
          </div>
          <div className=" pb-5">
            <h2 className="px-5 block text-2xl font-semibold text-gray-700 font-roboto">
              {post?.name}
            </h2>
            <div className="px-5 mt-2 flex space-x-4">
              <div className="flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-user"></i>
                </span>
                Cours
              </div>
              <div className="px-5 flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-clock"></i>
                </span>
                {post?.created_at?.toDateString()}
              </div>
            </div>
            <div id="accordionExample" className="px-1 md:px-5 ">
              {sortedPosts.map((postDetail) => (
                <div className="rounded-t-lg   bg-white dark:border-neutral-600 dark:bg-body-dark">
                  <div
                    id="collapseOne"
                    className="!visible"
                    data-twe-collapse-item
                    data-twe-collapse-show
                    aria-labelledby="headingOne"
                    data-twe-parent="#accordionExample"
                  >
                    <div className="py-4">
                      <div className="rounded-t-lg  bg-white">
                        <h2 className="px-5 mb-0" id="headingOne">
                          {postDetail.name}
                        </h2>
                        <div
                          id="collapseOne"
                          className="!visible"
                          data-twe-collapse-item
                          data-twe-collapse-show
                          aria-labelledby="headingOne"
                          data-twe-parent="#accordionExample"
                        >
                          <div className="py-4">
                            <div
                              className="paragraph atag video-container"
                              dangerouslySetInnerHTML={{
                                __html: `<div>${postDetail.description}</div>`,
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
      <script dangerouslySetInnerHTML={{ __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});" }} />

    </>
  );
}
