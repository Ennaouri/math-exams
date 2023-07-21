import Head from 'next/head'
import Link from 'next/link'
import About from '../components/About'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import PostWidget from '../components/PostWidget'
import FeaturedPosts from '../sections/FeaturedPost'
import { getPosts, getFeaturedPosts } from '../services'
import React, { useEffect } from 'react';

const Index = ({examPosts, getFeaturedPosts}) =>  {
  useEffect(() => {
    // Execute the script when the component mounts
    (adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div>
        <Hero />
        <div className='container'>
          <FeaturedPosts />
          <div className='row'>
            <div className='col-md-8'>
            {examPosts.map((post, index) => (
              <div key={index}>
            <PostCard  post={post.node} />
            {console.log(index)}
            {(index + 1) % 3 === 0 && index < examPosts.length - 1 && (
              <ins className="adsbygoogle"
              style={{display:"block"}}
              data-ad-format="fluid"
              data-ad-layout-key="-6t+ed+2i-1n-4w"
              data-ad-client="ca-pub-5587331919297301"
              data-ad-slot="2150179983"></ins>
            )}
            </div>

          ))}
            </div>
            <div className='col-md-4'>
            <PostWidget />
            <Categories />
            <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="5074960913"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
            </div>
            <About />
          </div>
        </div>
    </div>
  )
}
export default Index;

export async function getStaticProps() {
  
  const examPosts = (await getPosts()) || [];
  return {
    props: { examPosts },
    revalidate:10
  }
  
}