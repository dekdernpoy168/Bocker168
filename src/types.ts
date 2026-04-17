export interface Author {
  id: string;
  name: string;
  image?: string;
  position?: string;
  description?: string;
  createdAt?: string | Date | any;
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
