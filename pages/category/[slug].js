import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { getCategories, getCategoryPost } from '../../services';
import PostCard from '../../components/PostCard';
import Categories from '../../components/Categories';
import Loader from '../../components/Loader';

const CategoryPost = ({ posts }) => {
  const router = useRouter();

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

  if (router.isFallback) {
    return <Loader />;
  }

  return (
    <div className="container ">
      <div className="row">
        <div className="col-md-8">
          {posts.map((post, index) => (
            <div key={index}>
            <PostCard key={index} post={post.node} />
            <div style={{ overflow : "hidden", margin: "5px"}}>
<ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-format="fluid"
     data-ad-layout-key="+3x+oy-1o-3y+u9"
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="9119408825"></ins>
     </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryPost;

// Fetch data at build time
export async function getStaticProps({ params }) {
  const posts = await getCategoryPost(params.slug);
  return {
    props: { posts },
  };
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticPaths() {
  const categories = await getCategories();
  return {
    paths: categories.map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
}