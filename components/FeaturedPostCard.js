import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import Style from "../styles/FeaturedPostCard.module.css"

const FeaturedPostCard = ({ post }) => (
  <div className={Style.div1}>
    <div className={Style.div2}>
    <img src={post.thumbnail.url} alt={post.title} />
    </div>
    <div className={Style.div3} />
    <div className={Style.div4} >
      <p>{moment(post.createdAt).format('MMM DD, YYYY')}</p>
      <p >{post.title}</p>
      <div className={Style.div5}>
      </div>
    </div>
    <Link href={`/posts/${post.slug}`}><span className={Style.div6} /* "cursor-pointer absolute w-full h-full" */ /></Link>
  </div>
);

export default FeaturedPostCard;