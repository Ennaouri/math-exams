import { PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import Card from "./components/Card";
import { select } from "@material-tailwind/react";
import Link from "next/link";

export interface CategoryCardType {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
}
const prisma = new PrismaClient();

const fetchCategories = async (): Promise<CategoryCardType[]> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      thumbnail: true,
      description: true,
      slug: true,
    },
  });

  return categories;
};

export default async function Home() {
  const categories = await fetchCategories();

  return (
    <main>
      <Header />
      <div className="container mx-auto flex flex-wrap py-6">
        <section className="w-full md:w-2/3 flex flex-col items-center px-3">
          {categories.map((category) => (
            <Card category={category} />
          ))}

          <div className="flex items-center py-8">
            <a
              href="#"
              className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center"
            >
              1
            </a>
            <a
              href="#"
              className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center"
            >
              2
            </a>
            <a
              href="#"
              className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3"
            >
              Next <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </section>
        <aside className="w-full md:w-1/3 flex flex-col items-center px-3">
          <div className="w-full bg-white shadow flex flex-col my-4 p-6">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">
              Let's stay in touch
              <br />
              <span className="text-primary dark:text-primary-400">Join our social media</span>
            </h2>
          </div>          
            <div className="flex flex-wrap justify-center">
              <a href="https://www.facebook.com/profile.php?id=100090559545163&locale=fr_FR"
                type="button"
                target="_blank"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                className="mr-2 mb-2 inline-block rounded bg-[#1877f2] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              >
                <span className="[&>svg]:h-4 [&>svg]:w-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </span>
              </a>
              <a href="https://www.instagram.com/simohammednouri/"
                type="button"
                target="_blank"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                className="mr-2 mb-2 inline-block rounded bg-[#c13584] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              >
                <span className="[&>svg]:h-4 [&>svg]:w-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </span>
              </a>
        
              <a href="https://www.linkedin.com/in/mohammed-ennaouri-bb9640158/"
                type="button"
                target="_blank"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                className="mr-2 mb-2 inline-block rounded bg-[#0077b5] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              >
                <span className="[&>svg]:h-4 [&>svg]:w-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                  >
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                  </svg>
                </span>
              </a>
              <a href="https://www.youtube.com/@LowDiscovery"
              target="_blank"
                type="button"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                className="mb-2 inline-block rounded bg-[#ff0000] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              >
                <span className="[&>svg]:h-4 [&>svg]:w-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 576 512"
                  >
                    <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
          <div className="w-full mt-8 bg-white shadow-sm rounded-sm p-4 ">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">Popular Posts</h3>
                    <div className="space-y-4">
                        <a href="#" className="flex group">
                            <div className="flex-shrink-0">
                                <img src="https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/ThumbnailSeries2bacSVTetPCLimitesEtContinuit%C3%A9%20(1)-EUzZBZz9jk9bPuZGdd1UJPG3saMT1S.png" className="h-14 w-20 lg:w-14 xl:w-20 rounded object-cover" />
                            </div>
                            <div className="flex-grow pl-3">
                                <h5
                                    className="text-md leading-5 block font-roboto font-semibold  transition group-hover:text-blue-500">
                                    Team Bitbose geared up to attend Blockchain
                                </h5>
                                <div className="flex text-gray-400 text-sm items-center">
                                    <span className="mr-1 text-xs"><i className="far fa-clock"></i></span>
                                    June 11, 2021
                                </div>
                            </div>
                        </a>
                        <a href="#" className="flex group">
                            <div className="flex-shrink-0">
                                <img src="https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/ThumbnailSeries2bacSVTetPCLimitesEtContinuit%C3%A9%20(1)-EUzZBZz9jk9bPuZGdd1UJPG3saMT1S.png" className="h-14 w-20 lg:w-14 xl:w-20 rounded object-cover" />
                            </div>
                            <div className="flex-grow pl-3">
                                <h5
                                    className="text-md leading-5 block font-roboto font-semibold  transition group-hover:text-blue-500">
                                    After a Caribbean Hurricane, the Battle
                                </h5>
                                <div className="flex text-gray-400 text-sm items-center">
                                    <span className="mr-1 text-xs"><i className="far fa-clock"></i></span>
                                    March 27, 2021
                                </div>
                            </div>
                        </a>
                        <a href="#" className="flex group">
                            <div className="flex-shrink-0">
                                <img src="https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/ThumbnailSeries2bacSVTetPCLimitesEtContinuit%C3%A9%20(1)-EUzZBZz9jk9bPuZGdd1UJPG3saMT1S.png" className="h-14 w-20 lg:w-14 xl:w-20 rounded object-cover" />
                            </div>
                            <div className="flex-grow pl-3">
                                <h5
                                    className="text-md leading-5 block font-roboto font-semibold  transition group-hover:text-blue-500">
                                    California sheriff’s deputy shot during ‘ambush’
                                </h5>
                                <div className="flex text-gray-400 text-sm items-center">
                                    <span className="mr-1 text-xs"><i className="far fa-clock"></i></span>
                                    Aprile 17, 2021
                                </div>
                            </div>
                        </a>
                    </div>
                    </div>
        </aside>
      </div>
    </main>
  );
}
