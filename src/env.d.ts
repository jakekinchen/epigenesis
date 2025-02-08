/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/mdx/client" />

declare namespace JSX {
  interface IntrinsicElements {
    // Allow any props for any HTML element in Astro files
    [elemName: string]: any;
  }
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
    interface IntrinsicElements {
      [elemName: string]: {
        class?: string;
        className?: string;
        [key: string]: any;
      };
    }
  }
}

declare module '*.mdx' {
  const content: any;
  export default content;
}

declare module '*.md' {
  const content: any;
  export default content;
}