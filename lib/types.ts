export interface Category {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface UnderCategory {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  underCategoryId: number;
  created_at: Date;
  updated_at: Date;
}

export interface PostDetails {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  slug: string;
  post_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  created_at: Date;
}
