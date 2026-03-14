import { MetadataRoute } from 'next';
import { getRoadmap, getWikiArticles, getEducationArticles, getStrategies } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solquant.xyz';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/strategies',
    '/education',
    '/docs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes from Notion
  const [roadmap, wiki, education, strategies] = await Promise.all([
    getRoadmap(),
    getWikiArticles(),
    getEducationArticles(),
    getStrategies(),
  ]);

  const roadmapRoutes = (roadmap || [])
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/lab/${item.slug}`,
      lastModified: item.date && !isNaN(new Date(item.date).getTime()) ? new Date(item.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const wikiRoutes = (wiki || [])
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/docs/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const educationRoutes = (education || [])
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/education/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const strategyRoutes = (strategies || [])
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/strategies/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

  return [
    ...staticRoutes,
    ...roadmapRoutes,
    ...wikiRoutes,
    ...educationRoutes,
    ...strategyRoutes,
  ];
}
