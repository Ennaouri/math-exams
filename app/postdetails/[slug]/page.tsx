import { PrismaClient } from "@prisma/client";
import React from "react";
import "./postDetails.css"

const prisma = new PrismaClient();

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
                            <div className="paragraph atag video-container"
                              dangerouslySetInnerHTML={{
                                __html: post.description,
                              }}
                            ></div>
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
