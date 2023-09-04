import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Link from 'next/link';

import { getSimilarPosts, getRecentPosts } from '../services';

const PostWidget = ({ categories, slug }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    var ads = document.getElementsByClassName('adsbygoogle').length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('could not initialize adsense ad')
      }
    }
    
    if (slug) {
      getSimilarPosts(categories, slug).then((result) => {
        setRelatedPosts(result);
      });
    } else {
      getRecentPosts().then((result) => {
        setRelatedPosts(result);
      });
    }
  }, [slug, categories]);

  return (
    <div className="container bg-white p-4 mb-4">
      <h4 >{slug ? 'Related Posts' : 'Recent Posts'}</h4>
      <hr/>
      {relatedPosts.map((post, index) => (
        <div key={index}>
        <div  className="row items-center w-full mb-4 align-items-center categoriepointer">
          <div className="col-2">
            <img
              alt={post.title}
              height="60px"
              width="60px"
              className=""
              src={post.thumbnail.url}
            />
          </div>
          <div className="col-10 ">
            <p><small>{moment(post.createdAt).format('MMM DD, YYYY')}</small></p>
            <Link href={`/posts/${post.slug}/`} className="" key={index}><small>{post.title}</small></Link>
          </div>
        </div>
        <div style={{ overflow : "hidden", margin: "5px"}}>
        <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-format="fluid"
     data-ad-layout-key="-hq-g+0-6p+jg"
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="6742611200"></ins>
        </div>
        </div>
      ))}
    </div>
  );
};

export default PostWidget;