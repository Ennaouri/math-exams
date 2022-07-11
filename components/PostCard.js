import Link from "next/link";
import {Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button} from "reactstrap"
import moment from 'moment'

const PostCard = ({post}) => {
    return ( 
        <Card>
        <CardImg
          alt={post.title}
          src={post.thumbnail.url}
          top
          width="100%"
          height={315}
          className="p-3"
        />
        <CardBody>
          <CardTitle tag="h5">
          {post.title}
          </CardTitle>
          <CardSubtitle
            className="mb-2 text-muted"
            tag="h6"
          >
                        <div className="" >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>{' '}
              <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
            </div>
          </CardSubtitle>
          {post.excerpt}
          <Link type="button" href={`/posts/${post.slug}`}  role="button"><span className="btn btn-primary w-100 rounded mt-4 ">Consulter</span>
          </Link>
        </CardBody>
      </Card>
     );
}
 
export default PostCard;