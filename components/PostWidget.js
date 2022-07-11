import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';

import { getSimilarPosts, getRecentPosts } from '../services';

const PostWidget = ({ categories, slug }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      getSimilarPosts(categories, slug).then((result) => {
        setRelatedPosts(result);
      });
    } else {
      getRecentPosts().then((result) => {
        setRelatedPosts(result);
      });
    }
  }, [slug]);

  return (
    <div className="container bg-white p-4 mb-4">
      <h4 >{slug ? 'Related Posts' : 'Recent Posts'}</h4>
      <hr/>
      {relatedPosts.map((post, index) => (
        <div key={index} className="row items-center w-full mb-4 align-items-center categoriepointer">
          <div className="col-2">
            <Image
              alt={post.title}
              height="60px"
              width="60px"
              unoptimized
              className=""
              src={post.thumbnail.url}
            />
          </div>
          <div className="col-10 ">
            <p><small>{moment(post.createdAt).format('MMM DD, YYYY')}</small></p>
            <Link href={`/posts/${post.slug}/`} className="" key={index}><small>{post.title}</small></Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostWidget;