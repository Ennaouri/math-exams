import About from '../components/About'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import PostWidget from '../components/PostWidget'
import FeaturedPosts from '../sections/FeaturedPost'
import { getPosts} from '../services'
import React, { useEffect } from 'react';

const Index = ({examPosts}) =>  {
  useEffect(() => {
    // Execute the script when the component mounts
    var ads = document.getElementsByClassName('adsbygoogle').length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('could not initialize adsense ad')
      }
    }
  }, []);

  return (
    <div>
        <Hero />
        <div className='container'>
        <div style={{ overflow : "hidden", margin: "5px"}}>
        <ins className="adsbygoogle"
     style={{display:"block", textAlign:"center"}}
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="1332094746"
     data-full-width-responsive="true"
     ></ins>
     </div>
          <FeaturedPosts />
          <div className='row'>
            <div className='col-md-8'>
            {examPosts.map((post, index) => (
              <div key={index}>
            <PostCard  post={post.node} />
            {(index + 1) % 2 === 0 && index < examPosts.length - 1 && (
              <div style={{ overflow : "hidden", margin: "5px"}}>
              <ins className="adsbygoogle"
              style={{display:"block"}}
              data-ad-format="auto"
              data-ad-client="ca-pub-5587331919297301"
              data-ad-slot="9602021917"
              data-full-width-responsive="true"
              ></ins>
              </div>
            )}
            </div>

          ))}
            </div>
            <div className='col-md-4'>
            <Categories />
            
            <div style={{ overflow : "hidden", margin: "5px"}}>
            <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-format="autorelaxed"
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="1112602893"
     data-full-width-responsive="true"
     ></ins>
     </div>
     <PostWidget />
            <div style={{ overflow : "hidden", margin: "5px"}}>
            <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="5074960913"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
     </div>
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