export interface Author {
  id: string;
  name: string;
  image?: string;
  avatar_url?: string;
  position?: string;
  description?: string;
  bio?: string;
  createdAt?: string | Date | any;
  created_at?: string | Date | any;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  image?: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  authorImage?: string;
  authorPosition?: string;
  authorDescription?: string;
  date: string;
  publishedAt?: string | Date | any;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}

export interface WebPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  status: 'published' | 'draft' | 'scheduled';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}
