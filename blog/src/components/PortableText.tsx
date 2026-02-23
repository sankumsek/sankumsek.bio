'use client';

import React, { useEffect, useState } from 'react';
import { PortableText as PortableTextReact } from '@portabletext/react';
import Image from 'next/image';
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

// Simple text sanitization function
const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

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

      return (
        <div className="my-6">
          <pre className={`language-${language} rounded-lg overflow-x-auto`}>
            <code className={`language-${language}`}>
              {code}
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
      const href = value?.href || '#';
      const target = href.startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

      return (
        <a
          href={href}
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
  const [mounted, setMounted] = useState(false);

  // Apply syntax highlighting after component mounts
  useEffect(() => {
    setMounted(true);
    if (mounted) {
      Prism.highlightAll();
    }
  }, [content, mounted]);

  return (
    <div className="max-w-none prose prose-lg">
      <PortableTextReact value={content} components={components} />
    </div>
  );
}
