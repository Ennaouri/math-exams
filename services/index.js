import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_API;

export const getPosts = async () => {
  const query = gql`
query MyQuery {
  examPostsConnection {
    edges {
      cursor
      node {
        createdAt
        slug
        title
        excerpt
        thumbnail {
          url
        }
        categories {
          name
          slug
        }
        content {
          html
          raw
        }
      }
    }
  }
}
  `;

  const result = await request(graphqlAPI, query);

  return result.examPostsConnection.edges;
};

export const getCategories = async () => {
  const query = gql`
    query GetGategories {
        categories {
          name
          slug
          thumbnail {
            url
          }
        }
    }
  `;

  const result = await request(graphqlAPI, query);

  return result.categories;
};

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug : String!) {
        examPost(where: {slug: $slug}) {
        title
        excerpt
        thumbnail {
          url
        }
        examDetails {
          id
          title
          description {
            html
          }
        }
        content{
          raw
        }
        createdAt
        slug
        categories {
          name
          slug
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });
  return result.examPost;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
        examPosts(
        where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
        last: 3
      ) {
        title
        thumbnail {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query, { slug, categories });
  return result.examPosts;
};

export const getAdjacentPosts = async (createdAt, slug) => {
  const query = gql`
    query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
      next:examPost(
        first: 1
        orderBy: createdAt_ASC
        where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
      ) {
        title
        thumbnail {
          url
        }
        createdAt
        slug
      }
      previous:examPost(
        first: 1
        orderBy: createdAt_DESC
        where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
      ) {
        title
        thumbnail {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug, createdAt });

  return { next: result.next[0], previous: result.previous[0] };
};

export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
        examPostsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          cursor
          node {
            createdAt
            slug
            title
            excerpt
            thumbnail {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });
  return result.examPostsConnection.edges;
}

export const getFeaturedPosts = async () => {
  const query = gql`
    query GetCategoryPost() {
        examPosts(where: {featuredPost: true}) {
        
        thumbnail {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

  const result = await request(graphqlAPI, query);

  return result.examPosts;
};

export const submitComment = async (obj) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  });

  return result.json();
};

export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug:String!) {
      comments(where: {examPost: {slug:$slug}}){
        name
        createdAt
        comment
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.comments;
};

export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails() {
        examPosts(
        orderBy: createdAt_ASC
        last: 3
      ) {
        title
        thumbnail {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query);

  return result.examPosts;
};