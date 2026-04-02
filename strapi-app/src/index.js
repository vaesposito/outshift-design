'use strict';

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    const initiativeCount = await strapi.documents('api::initiative.initiative').count();
    if (initiativeCount > 0) return;

    strapi.log.info('Seeding initial content...');

    await strapi.documents('api::initiative.initiative').create({
      data: {
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
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::initiative.initiative').create({
      data: {
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
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::research-card.research-card').create({
      data: {
        title: 'Hax',
        description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
        slug: 'hax',
        media: {
          mediaType: 'image',
          altText: 'Hax research visual',
        },
        tags: [
          { label: 'AI Research', color: 'cyan' },
          { label: 'Design Framework', color: 'cyan' },
          { label: 'Ethics', color: 'cyan' },
        ],
        link: { label: 'Learn more', url: '#', isExternal: false },
        order: 1,
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::research-card.research-card').create({
      data: {
        title: 'Internet of Cognition',
        description: 'Exploring the future of interconnected cognitive systems and their impact on human decision making and collaboration.',
        slug: 'internet-of-cognition',
        media: {
          mediaType: 'image',
          altText: 'Internet of Cognition research visual',
        },
        tags: [
          { label: 'Cognitive Systems', color: 'cyan' },
          { label: 'Future Research', color: 'cyan' },
          { label: 'Collaboration', color: 'cyan' },
        ],
        link: { label: 'Learn more', url: '#', isExternal: false },
        order: 2,
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'The Future of Design Systems',
        description: 'How we built a scalable design system that powers hundreds of products across the enterprise.',
        slug: 'future-of-design-systems',
        author: 'Sarah Chen',
        publishDate: '2026-03-01',
        readTime: '5 min read',
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'Designing for Accessibility',
        description: 'Our approach to creating inclusive experiences that work for everyone.',
        slug: 'designing-for-accessibility',
        author: 'Sarah Chen',
        publishDate: '2026-03-01',
        readTime: '5 min read',
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'Remote Collaboration at Scale',
        description: 'Lessons learned from building tools for distributed teams across the globe.',
        slug: 'remote-collaboration-at-scale',
        author: 'Sarah Chen',
        publishDate: '2026-03-01',
        readTime: '5 min read',
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::homepage.homepage').create({
      data: {
        heroTitle: 'Design evolves fast',
        heroSubtitle: 'We evolve faster',
        heroDescription: "Meet the Outshift product design team, Cisco's innovative force for incubation. We specialize in driving ideation and fostering alignment across cross-functional teams.",
        heroCtaLabel: 'See Our Work',
        heroCtaUrl: '#initiatives',
        initiativesSectionTitle: 'Featured Initiatives',
        initiativesSectionSubtitle: "Explore our recent projects and see how we're shaping the future of enterprise software.",
        researchSectionTitle: 'Innovation & Research',
        researchSectionDescription: 'Discover our research explorations across the intersection of design, AI, and human-centered technology.',
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
        publishedAt: new Date(),
      },
    });

    strapi.log.info('Seed data created successfully.');
  },
};
