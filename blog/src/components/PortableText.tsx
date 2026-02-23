'use client';

import React, { useEffect } from 'react';
import { PortableText as PortableTextReact } from '@portabletext/react';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Import additional language support
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

import { urlFor } from '@/lib/sanity.image';
import type { PortableTextBlock } from '@/types';

interface PortableTextProps {
  content: PortableTextBlock[];
}

// Custom serializers for different block types
const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value).url();
      const alt = value.alt || 'Blog post image';

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
          {value.alt && (
            <figcaption className="text-center text-sm text-gray-600 mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: any) => {
      const language = value.language || 'javascript';
      const code = value.code || '';

      // Sanitize code to prevent XSS
      const sanitizedCode = DOMPurify.sanitize(code, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      return (
        <div className="my-6">
          <pre className={`language-${language} rounded-lg overflow-x-auto`}>
            <code className={`language-${language}`}>
              {sanitizedCode}
            </code>
          </pre>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-5 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-bold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6 text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
    number: ({ children }: any) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }: any) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

      // Sanitize href to prevent XSS
      const sanitizedHref = DOMPurify.sanitize(value?.href || '#', {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      return (
        <a
          href={sanitizedHref}
          target={target}
          rel={rel}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default function PortableText({ content }: PortableTextProps) {
  // Apply syntax highlighting after component mounts
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  // Sanitize the entire content structure to prevent XSS
  const sanitizedContent = React.useMemo(() => {
    return content.map((block) => {
      // Create a deep copy to avoid mutating original
      const sanitizedBlock = { ...block };

      // Sanitize text content in blocks
      if (sanitizedBlock._type === 'block' && Array.isArray(sanitizedBlock.children)) {
        sanitizedBlock.children = sanitizedBlock.children.map((child: any) => {
          if (child.text) {
            return {
              ...child,
              text: DOMPurify.sanitize(child.text, {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              }),
            };
          }
          return child;
        });
      }

      return sanitizedBlock;
    });
  }, [content]);

  return (
    <div className="max-w-none">
      <PortableTextReact value={sanitizedContent} components={components} />
    </div>
  );
}
