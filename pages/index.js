import Head from 'next/head'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import PostWidget from '../components/PostWidget'
import FeaturedPosts from '../sections/FeaturedPost'
import { getPosts } from '../services'

const index = ({examPosts}) =>  {
  return (
    <div>
        <Head>     
          <title>Solutions des examens du secondaire en mathématiques |</title>
          <meta name='description' content='les solutions de tous les examens de maths du secondaire qualifiants se trouvent désormé sur une seule plateforme avec des videos explicatifs et un contenu ecrit' />
          <meta name='robots' content='index, follow' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Hero />
        <div className='container'>
          <FeaturedPosts />
          <div className='row'>
            <div className='col-md-8'>
            {examPosts.map((post, index) => (
            <PostCard key={index} post={post.node} />
          ))}
            </div>
            <div className='col-md-4'>
            <PostWidget />
            <Categories />
            </div>
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