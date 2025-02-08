/// <reference types="react" />

import type { ReactElement } from 'react';

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P & {
      'client:load'?: boolean;
      'client:idle'?: boolean;
      'client:visible'?: boolean;
      'client:media'?: string;
      'client:only'?: boolean | string;
      'client:transition'?: boolean;
    }, context?: any): ReactElement<any, any> | null;
  }
}

declare module 'astro:content' {
  interface Render {
    '.mdx': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro' {
  interface AstroBuiltinAttributes {
    'client:load'?: boolean;
    'client:idle'?: boolean;
    'client:visible'?: boolean;
    'client:media'?: string;
    'client:only'?: boolean | string;
    'client:transition'?: boolean;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'astro-slot': any;
    }
  }
} 