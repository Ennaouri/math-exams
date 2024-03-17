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
      {/* <header className="w-full container mx-auto">
        <div className="flex flex-col items-center py-12">
            <a className="font-bold text-gray-800 uppercase hover:text-gray-700 text-5xl" href="#">
                {postdetails[0].name}
            </a>
            <p className="text-lg text-gray-600">
                Lorem Ipsum Dolor Sit Amet
            </p>
        </div>
    </header> */}
      {/* <nav className="w-full py-4 border-t border-b bg-gray-100" x-data="{ open: false }">
        <div className="block sm:hidden">
            <a
                href="#"
                className=" md:hidden text-base font-bold uppercase text-center flex justify-center items-center"
                
            >
                Topics <i className='fas ml-2 fa-chevron-up'></i>
            </a>
        </div>
        <div className="blockw-full flex-grow sm:flex sm:items-center sm:w-auto">
            <div className="w-full container mx-auto flex flex-col sm:flex-row items-center justify-center text-sm font-bold uppercase mt-0 px-6 py-2">
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Technology</a>
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Automotive</a>
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Finance</a>
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Politics</a>
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Culture</a>
                <a href="#" className="hover:bg-gray-400 rounded py-2 px-4 mx-2">Sports</a>
            </div>
        </div>
    </nav> */}

      {/* <div id="accordionExample">
          {postdetails.map((post) => (
            <div className="rounded-t-lg  border-neutral-200 bg-white dark:border-neutral-600 dark:bg-body-dark">
              <div
                id="collapseOne"
                className="!visible"
                data-twe-collapse-item
                data-twe-collapse-show
                aria-labelledby="headingOne"
                data-twe-parent="#accordionExample"
              >
                <div className="px-5 py-4">
                  <div className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-body-dark">
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
                          dangerouslySetInnerHTML={{ __html: post.description }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      <div className="xl:w-6/12 lg:w-9/12 w-full  xl:ml-6 lg:mr-6">
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
                            <div className="paragraph atag"
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

           {/*  <p className="bg-green-50 border border-green-500 p-3 text-sm  mt-5">
              <span className="text-xl mr-1 text-gray-400">
                <i className="fas fa-quote-left"></i>
              </span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Doloribus blanditiis earum nam, quisquam magnam aut odio aliquam
              inventore quibusdam mollitia! Alias, mollitia eveniet iure quidem
              natus quis assumenda consectetur beatae. Lorem, ipsum dolor
              quibusdam.
              <span className="text-xl ml-1 text-gray-400">
                <i className="fas fa-quote-right"></i>
              </span>
            </p>

            <ul className="mt-6 pl-5  space-y-2">
              <li className="text-sm">
                <span className="mr-1">
                  <i className="fas fa-angle-right"></i>
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis.
              </li>
              <li className="text-sm">
                <span className="mr-1">
                  <i className="fas fa-angle-right"></i>
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis.
              </li>
              <li className="text-sm">
                <span className="mr-1">
                  <i className="fas fa-angle-right"></i>
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis.
              </li>
              <li className="text-sm">
                <span className="mr-1">
                  <i className="fas fa-angle-right"></i>
                </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis.
              </li>
            </ul>

            <p className="text-gray-500 text-sm mt-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis et sunt saepe accusamus eum ex sint est neque provident
              tempore, minus laborum repudiandae vitae temporibus nesciunt, sed
              enim quo harum a id, alias maiores! Incidunt iusto minus explicabo
              itaque iure recusandae
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
}
