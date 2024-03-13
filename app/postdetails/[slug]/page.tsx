import { PrismaClient } from '@prisma/client'
import React from 'react'
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'

const prisma = new PrismaClient()

const fetchPostDetails = async(slug: string) =>{
    const post = await prisma.post.findUnique({
        where:{
            slug
        },
        select:{
            postDetails: true
        }
    })
    if(!post){
        throw new Error()
    }
    return post.postDetails
}
export default async function PostDetails({params} : {params : {slug: string}}) {
  const postdetails = await fetchPostDetails(params.slug)
  return (
    <>
    <header className="w-full container mx-auto">
        <div className="flex flex-col items-center py-12">
            <a className="font-bold text-gray-800 uppercase hover:text-gray-700 text-5xl" href="#">
                {postdetails[0].name}
            </a>
            <p className="text-lg text-gray-600">
                Lorem Ipsum Dolor Sit Amet
            </p>
        </div>
    </header>
    <nav className="w-full py-4 border-t border-b bg-gray-100" x-data="{ open: false }">
        <div className="block sm:hidden">
            <a
                href="#"
                className="block md:hidden text-base font-bold uppercase text-center flex justify-center items-center"
                
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
    </nav>
    <div className="container mx-auto flex flex-wrap py-6">
    <section className="w-full md:w-2/3 flex flex-col items-center px-3">
    <div id="accordionExample">
        {postdetails.map((post) => (
            <div
       className="rounded-t-lg  border-neutral-200 bg-white dark:border-neutral-600 dark:bg-body-dark">
  
      <div
        id="collapseOne"
         className="!visible"
        data-twe-collapse-item
        data-twe-collapse-show
        aria-labelledby="headingOne"
        data-twe-parent="#accordionExample">
        <div  className="px-5 py-4">
        <div
       className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-body-dark">
      <h2  className="mb-0" id="headingOne">
          {post.name}
          
      </h2>
      <div
        id="collapseOne"
         className="!visible"
        data-twe-collapse-item
        data-twe-collapse-show
        aria-labelledby="headingOne"
        data-twe-parent="#accordionExample">
        <div  className="px-5 py-4">
        <div dangerouslySetInnerHTML={{__html:post.description}}
          
          
          ></div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
        ))}
    
  
  </div>
            <div className="flex items-center py-8">
                <a href="#" className="h-10 w-10 bg-blue-800 hover:bg-blue-600 font-semibold text-white text-sm flex items-center justify-center">1</a>
                <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center">2</a>
                <a href="#" className="h-10 w-10 font-semibold text-gray-800 hover:text-gray-900 text-sm flex items-center justify-center ml-3">Next <i className="fas fa-arrow-right ml-2"></i></a>
            </div>
    </section>
    <aside className="w-full md:w-1/3 flex flex-col items-center px-3">
    <div className="w-full bg-white shadow flex flex-col my-4 p-6">
                <p className="text-xl font-semibold pb-5">About Us</p>
                <p className="pb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis est eu odio sagittis tristique. Vestibulum ut finibus leo. In hac habitasse platea dictumst.</p>
                <a href="#" className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                    Get to know us
                </a>
            </div>
            <div className="w-full bg-white shadow flex flex-col my-4 p-6">
                <p className="text-xl font-semibold pb-5">Instagram</p>
                <div className="grid grid-cols-3 gap-3">
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=1" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=2" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=3" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=4" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=5" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=6" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=7" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=8" />
                    <img className="hover:opacity-75" src="https://source.unsplash.com/collection/1346951/150x150?sig=9" />
                </div>
                <a href="#" className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-6">
                    <i className="fab fa-instagram mr-2"></i> Follow @dgrzyb
                </a>
            </div>
    </aside>

    </div>
    
  </>
  )
}
