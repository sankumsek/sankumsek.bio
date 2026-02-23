// Fetch all published posts with pagination
export const postsQuery = `
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->{name, image},
    "categories": categories[]->{ title, slug },
    mainImage
  }
`;

// Fetch single post by slug
export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    "author": author->{name, image, bio},
    "categories": categories[]->{ title, slug },
    mainImage,
    seo
  }
`;

// Count total published posts
export const postCountQuery = `
  count(*[_type == "post" && !(_id in path("drafts.**"))])
`;
