'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

interface PostAnalyticsProps {
  title: string;
  slug: string;
  categories: string[];
}

export default function PostAnalytics({ title, slug, categories }: PostAnalyticsProps) {
  const readFired = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('post-viewed', {
        title,
        slug,
        categories: categories.join(', '),
      });
    }
  }, [title, slug, categories]);

  useEffect(() => {
    const handleScroll = () => {
      if (readFired.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.75) {
        readFired.current = true;
        if (window.umami) {
          window.umami.track('post-read', { title, slug });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [title, slug]);

  return null;
}
