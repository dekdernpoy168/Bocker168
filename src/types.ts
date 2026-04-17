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
  date: string;
  publishedAt?: string | Date | any;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string | Date | any;
  updatedAt?: string | Date | any;
}
