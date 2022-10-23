import Head from 'next/head'
import Link from 'next/link'
import About from '../components/About'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import PostWidget from '../components/PostWidget'
import FeaturedPosts from '../sections/FeaturedPost'
import { getPosts } from '../services'

const index = ({examPosts}) =>  {

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
            </div>
          ))}
            </div>
            <div className='col-md-4'>
            <PostWidget />
            <Categories />
            </div>
            <About />
          </div>
        </div>
    </div>
  )
}
export default index;

export async function getStaticProps() {
  const examPosts = (await getPosts()) || [];
  return {
    props: { examPosts },
    revalidate:10
  }
  
}