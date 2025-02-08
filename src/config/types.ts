export interface MenuItem {
  title: string;
  link: string;
}

export interface SiteConfig {
  SITE_URL: string;
  SITE_TITLE: string;
  SITE_DESCRIPTION: string;
  LANGUAGES: string[];
  GOOGLE_GTAG?: string;
}

export interface Config extends SiteConfig {
  MENUS: MenuItem[];
} 