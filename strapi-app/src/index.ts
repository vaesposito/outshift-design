import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedContent(strapi);
  },
};

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const apis = ['initiative', 'research-card', 'blog-post', 'homepage'];
  const actions = ['find', 'findOne'];

  for (const api of apis) {
    for (const action of actions) {
      const existing = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            role: publicRole.id,
            action: `api::${api}.${api}.${action}`,
          },
        });

      if (!existing) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .create({
            data: {
              role: publicRole.id,
              action: `api::${api}.${api}.${action}`,
              enabled: true,
            },
          });
      }
    }
  }

  strapi.log.info('Public API permissions configured.');
}

async function createAndPublish(strapi: Core.Strapi, uid: string, data: any) {
  const doc = await strapi.documents(uid as any).create({ data });
  await strapi.documents(uid as any).publish({ documentId: doc.documentId });
  return doc;
}

async function seedContent(strapi: Core.Strapi) {
  const initiativeCount = await strapi.documents('api::initiative.initiative').count({});
  if (initiativeCount > 0) return;

  strapi.log.info('Seeding initial content...');

  await createAndPublish(strapi, 'api::initiative.initiative', {
    title: 'Designing for the Internet of Agents',
    description: 'Hax: The Framework Guiding Human-Agent Collaboration',
    slug: 'internet-of-agents',
    badge: 'SDK',
    media: {
      mediaType: 'video',
      videoUrl: '/videos/agents.mp4',
      altText: 'Internet of Agents visualization',
    },
    link: { label: 'Learn more', url: '#', isExternal: false },
    reversed: false,
    order: 1,
  });

  await createAndPublish(strapi, 'api::initiative.initiative', {
    title: 'Internet of Cognition',
    description: 'Enabling agents and humans to scale intelligence collectively.',
    slug: 'internet-of-cognition',
    badge: 'AI/ML',
    media: {
      mediaType: 'video',
      videoUrl: '/videos/cognition.mp4',
      altText: 'Internet of Cognition visualization',
    },
    link: { label: 'Learn more', url: '#', isExternal: false },
    reversed: true,
    order: 2,
  });

  await createAndPublish(strapi, 'api::research-card.research-card', {
    title: 'Hax',
    description:
      'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
    slug: 'hax',
    media: { mediaType: 'image', altText: 'Hax research visual' },
    tags: [
      { label: 'AI Research', color: 'cyan' },
      { label: 'Design Framework', color: 'cyan' },
      { label: 'Ethics', color: 'cyan' },
    ],
    link: { label: 'Learn more', url: '#', isExternal: false },
    order: 1,
  });

  await createAndPublish(strapi, 'api::research-card.research-card', {
    title: 'Internet of Cognition',
    description:
      'Exploring the future of interconnected cognitive systems and their impact on human decision making and collaboration.',
    slug: 'internet-of-cognition',
    media: { mediaType: 'image', altText: 'Internet of Cognition research visual' },
    tags: [
      { label: 'Cognitive Systems', color: 'cyan' },
      { label: 'Future Research', color: 'cyan' },
      { label: 'Collaboration', color: 'cyan' },
    ],
    link: { label: 'Learn more', url: '#', isExternal: false },
    order: 2,
  });

  await createAndPublish(strapi, 'api::blog-post.blog-post', {
    title: 'The Future of Design Systems',
    description:
      'How we built a scalable design system that powers hundreds of products across the enterprise.',
    slug: 'future-of-design-systems',
    author: 'Sarah Chen',
    publishDate: '2026-03-01',
    readTime: '5 min read',
  });

  await createAndPublish(strapi, 'api::blog-post.blog-post', {
    title: 'Designing for Accessibility',
    description:
      'Our approach to creating inclusive experiences that work for everyone.',
    slug: 'designing-for-accessibility',
    author: 'Sarah Chen',
    publishDate: '2026-03-01',
    readTime: '5 min read',
  });

  await createAndPublish(strapi, 'api::blog-post.blog-post', {
    title: 'Remote Collaboration at Scale',
    description:
      'Lessons learned from building tools for distributed teams across the globe.',
    slug: 'remote-collaboration-at-scale',
    author: 'Sarah Chen',
    publishDate: '2026-03-01',
    readTime: '5 min read',
  });

  await createAndPublish(strapi, 'api::homepage.homepage', {
    heroTitle: 'Design evolves fast',
    heroSubtitle: 'We evolve faster',
    heroDescription:
      "Meet the Outshift product design team, Cisco's innovative force for incubation. We specialize in driving ideation and fostering alignment across cross-functional teams.",
    heroCtaLabel: 'See Our Work',
    heroCtaUrl: '#initiatives',
    initiativesSectionTitle: 'Featured Initiatives',
    initiativesSectionSubtitle:
      "Explore our recent projects and see how we're shaping the future of enterprise software.",
    researchSectionTitle: 'Innovation & Research',
    researchSectionDescription:
      'Discover our research explorations across the intersection of design, AI, and human-centered technology.',
    blogSectionTitle: 'Latest from Our Blog',
    blogSectionDescription: 'Insights, learnings, and stories from our design team.',
    navigation: [
      { label: 'Initiatives', href: '#initiatives', hasDropdown: true, order: 1 },
      { label: 'About us', href: '#about', hasDropdown: true, order: 2 },
      { label: 'Blog', href: '#blog', hasDropdown: false, order: 3 },
    ],
    footerLinks: [
      { label: 'Explore Outshift', url: '#', isExternal: true },
      { label: 'Explore Cisco', url: '#', isExternal: true },
    ],
    socialLinks: [
      { platform: 'x', url: '#', ariaLabel: 'X' },
      { platform: 'linkedin', url: '#', ariaLabel: 'LinkedIn' },
      { platform: 'youtube', url: '#', ariaLabel: 'YouTube' },
    ],
  });

  strapi.log.info('Seed data created successfully.');
}
