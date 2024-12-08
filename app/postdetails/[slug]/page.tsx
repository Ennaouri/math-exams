import { PrismaClient } from "@prisma/client";
import React, { useEffect } from "react";
import "./postDetails.css";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const prisma = new PrismaClient();

/* useEffect(() => {
  // Execute the script when the component mounts
  var ads = document.getElementsByClassName("adsbygoogle").length;
  for (var i = 0; i < ads; i++) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("could not initialize adsense ad");
    }
  }
}, []); */
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
  const sortedPosts = postdetails.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  
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
                {post?.created_at.toDateString()}
              </div>
            </div>
            <div id="accordionExample" className="px-1 md:px-5 ">
              {sortedPosts.map((post) => (
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
                          <div className="py-4">
                            <div
                              className="paragraph atag video-container"
                              dangerouslySetInnerHTML={{
                                __html: `<div>${post.description}</div>`,
                              }}
                            ></div>
{/* <iframe className="pdfIframe" src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/primitives_compressed-lplYikkNoQPWZM8UaSx5uJOu2N58xo.pdf" title="Viewer" />
 */}    
 {/* <object  data="coursContinuité.pdf" type="application/pdf"  width="100%" height="80vh" >
    <embed src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/CoursContinuit%C3%A9_compressed_compressed-dJMKiZ4XJtcOC2Wr6b9Mv2sCAWNLZb.pdf" width="100%" height="600px"/> 
</object> */}
{/* <object data="https://drive.google.com/viewerng/viewer?embedded=true&url=https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/S%C3%A9rie2bacEtudeDeFonction-compress%C3%A9-Z7FcSGpMT5Kh1C5rsCtby5OUITtR1v.pdf" type="application/pdf"></object> */}




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
