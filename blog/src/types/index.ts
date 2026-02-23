// Type definitions for blog application
// Will be populated with Post, Author, Category, etc.

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  author: Author;
  categories?: Category[];
  mainImage?: SanityImage;
  body: PortableTextBlock[];
  seo?: SEO;
}

export interface Author {
  name: string;
  slug: { current: string };
  image?: SanityImage;
  bio?: PortableTextBlock[];
}

export interface Category {
  title: string;
  slug: { current: string };
  description?: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: any;
}
