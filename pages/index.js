import Head from 'next/head'
import Link from 'next/link'
import About from '../components/About'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import PostWidget from '../components/PostWidget'
import FeaturedPosts from '../sections/FeaturedPost'
import { getPosts} from '../services'
import React, { useEffect } from 'react';
import Adsense, { AdUnit } from '@eisberg-labs/next-google-adsense'

const Index = ({examPosts}) =>  {
  useEffect(() => {
    // Execute the script when the component mounts
    try{
      if(window.hasOwnProperty('adsbygoogle')){
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch(e){
      console.error('could not initialize adsense ad')
    }
  }, []);

  const inArticleAds = ['9602021917', '2150179983']
 /* const handleScriptLoad = () => {
    try{
      if(window.adsbygoogle){
        console.log("pushing ads")
        adsbygoogle.push({})
      }else{
        scriptElement!.addEventListener("load", handleScriptLoad)
        console.log("waiting until adsense lib is loaded")
      }
    } catch {
      console.log("error in adsense : ", error)
    }
  }*/
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
            {(index + 1) % 3 === 0 && index < examPosts.length - 1 && (
              /*<div style={{ overflow : "hidden", margin: "5px"}}>
              <ins className="adsbygoogle"
              style={{display:"block"}}
              data-ad-format="auto"
              data-ad-client="ca-pub-5587331919297301"
              data-ad-slot="9602021917"
              data-full-width-responsive="true"
              ></ins>
              </div>*/
              <>
                    <Adsense client_id='ca-pub-5587331919297301'/>
      <AdUnit className="adsbygoogle"
                  style={{"display":"block"}}
                  data-ad-client="ca-pub-5587331919297301"
                  data-ad-slot="9602021917"
                  data-ad-format="auto"
                  data-full-width-responsive="true"/>
              </>
            )}
            </div>

          ))}
            </div>
            <div className='col-md-4'>
            <PostWidget />
            <Categories />
            <div style={{ overflow : "hidden", margin: "5px"}}>
           {/* <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="5074960913"
     data-ad-format="auto"
            data-full-width-responsive="true"></ins>*/}
                          <>
                    <Adsense client_id='ca-pub-5587331919297301'/>
      <AdUnit className="adsbygoogle"
                  style={{"display":"block"}}
                  data-ad-client="ca-pub-5587331919297301"
                  data-ad-slot="5074960913"
                  data-ad-format="auto"
                  data-full-width-responsive="true"/>
              </>
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