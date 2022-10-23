import Link from 'next/link';
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import Categories from '../../components/Categories';
import Comments from '../../components/Comments';
import CommentsForm from '../../components/CommentsForm';
import PostDetail from '../../components/PostDetails';
import PostWidget from '../../components/PostWidget';
import { getPosts, getPostDetails } from '../../services';
import Style from '../../styles/SinglePost.module.css'
const SinglePost = ({examPosts}) => {

    return (
      <div className='container m-auto p-2 mb-4 mt-4'>
      <div className='row'>
          <div className='col-md-8'>
          <div>
            <PostDetail post={examPosts} />
<UncontrolledAccordion
  defaultOpen={[
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ]}
  stayOpen
>
    {examPosts.examDetails.map((rubrique,index) => (
      <AccordionItem key={index}>
          <AccordionHeader targetId={`${index+1}`}>
          {rubrique.title}
          </AccordionHeader>
          <AccordionBody accordionId={`${index+1}`}>
          <div dangerouslySetInnerHTML={{__html:rubrique.description.html}}
          
            className={Style.formatter}
            ></div>
          </AccordionBody>
      </AccordionItem>
    ))}

</UncontrolledAccordion>
<CommentsForm slug={examPosts.slug} />
            <Comments slug={examPosts.slug} />
</div>
            
          
          </div>
          <div className="col-md-4">
            <div className="relative lg:sticky top-8">
              <PostWidget /* slug={post.slug} categories={post.categories.map((category) => category.slug)}  *//>
              <Categories />
            </div>
          </div>
      </div>
  </div>
     );
}
 
export default SinglePost;

// Fetch data at build time
export async function getStaticProps({ params }) {
    const data = await getPostDetails(params.slug);
    return {
      props: {
        examPosts : data,
      },
    };
  }
  
  // Specify dynamic routes to pre-render pages based on data.
  // The HTML is generated at build time and will be reused on each request.
  export async function getStaticPaths() {
    const examPosts = await getPosts();
    return {
      paths: examPosts.map(({ node: { slug } }) => ({ params: { slug } })),
      fallback: false,
    };
  }