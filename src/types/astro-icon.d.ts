declare module 'astro-icon/components' {
  interface Props {
    name: string;
    class?: string;
    width?: number;
    height?: number;
  }
  
  export function Icon(props: Props): any;
} 