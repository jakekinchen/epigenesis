/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.mdx' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: any;
  export default content;
}