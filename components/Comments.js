import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import Style from '../styles/CommentsForm.module.css'

import { getComments } from '../services';

const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments(slug).then((result) => {
      setComments(result);
    });
  }, [slug]);

  return (
    <>
      {comments.length > 0 && (
        <div className={Style.div1}>
          <h3 >
            {comments.length}
            {' '}
            Comments
          </h3>
            {comments.map((comment, index) => (
              <div key={index} className="border-bottom border-light mb-4 pb-4">
                <p className="mb-4">
                  <strong>{comment.name}</strong>
                  {' '}
                  on
                  {' '}
                  {moment(comment.createdAt).format('MMM DD, YYYY')}
                </p>
                <p className="border border-dark p-5">{parse(comment.comment)}</p>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Comments;