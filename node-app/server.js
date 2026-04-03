const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

async function fetchStrapi(endpoint) {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

const fallbackData = {
  nav: [
    { label: 'Initiatives', href: '/#initiatives', hasDropdown: true },
    { label: 'About us', href: '/#about', hasDropdown: true },
    { label: 'Research', href: '/research', hasDropdown: false },
    { label: 'Blog', href: '/#blog', hasDropdown: false },
  ],
  initiatives: [
    {
      title: 'Designing for the Internet of Agents',
      description: 'Hax: The Framework Guiding Human-Agent Collaboration',
      badge: 'SDK',
      video: '/videos/agents.mp4',
      reversed: false,
    },
    {
      title: 'Internet of Cognition',
      description: 'Enabling agents and humans to scale intelligence collectively.',
      badge: 'AI/ML',
      video: '/videos/cognition.mp4',
      reversed: true,
    },
  ],
  researchCards: [
    {
      title: 'Hax',
      description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
      image: '/images/hax-research.png',
      tags: ['AI Research', 'Design Framework', 'Ethics'],
    },
    {
      title: 'Internet of Cognition',
      description: 'Exploring the future of interconnected cognitive systems and their impact on human decision making and collaboration.',
      image: '/images/cognition-research.png',
      tags: ['Cognitive Systems', 'Future Research', 'Collaboration'],
    },
  ],
  blogPosts: [
    { title: 'The Future of Design Systems', description: 'How we built a scalable design system that powers hundreds of products across the enterprise.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
    { title: 'Designing for Accessibility', description: 'Our approach to creating inclusive experiences that work for everyone.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
    { title: 'Remote Collaboration at Scale', description: 'Lessons learned from building tools for distributed teams across the globe.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
  ],
  homepage: null,
};

function mapInitiatives(strapiData) {
  if (!strapiData) return fallbackData.initiatives;
  return strapiData
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      title: item.title,
      description: item.description,
      badge: item.badge,
      video: item.media?.videoUrl || '/videos/agents.mp4',
      reversed: item.reversed || false,
    }));
}

function mapResearchCards(strapiData) {
  if (!strapiData) return fallbackData.researchCards;
  const imageMap = { 'hax': '/images/hax-research.png', 'internet-of-cognition': '/images/cognition-research.png' };
  return strapiData
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: imageMap[item.slug] || '/images/hax-research.png',
      tags: (item.tags || []).map((t) => t.label),
    }));
}

function mapBlogPosts(strapiData) {
  if (!strapiData) return fallbackData.blogPosts;
  return strapiData.map((item) => ({
    title: item.title,
    description: item.description,
    author: item.author,
    date: item.publishDate
      ? new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'March 1, 2026',
    readTime: item.readTime || '5 min read',
  }));
}

function mapNav(homepage) {
  if (!homepage?.navigation?.length) return fallbackData.nav;
  return homepage.navigation
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      label: item.label,
      href: item.href,
      hasDropdown: item.hasDropdown,
    }));
}

app.get('/', async (_req, res) => {
  const [strapiInitiatives, strapiResearch, strapiBlog, strapiHomepage] = await Promise.all([
    fetchStrapi('initiatives?populate=*&sort=order:asc'),
    fetchStrapi('research-cards?populate=*&sort=order:asc'),
    fetchStrapi('blog-posts?populate=*&sort=publishDate:desc'),
    fetchStrapi('homepage?populate=*'),
  ]);

  const data = {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: mapNav(strapiHomepage),
    initiatives: mapInitiatives(strapiInitiatives),
    researchCards: mapResearchCards(strapiResearch),
    blogPosts: mapBlogPosts(strapiBlog),
    homepage: strapiHomepage,
    pageTitle: 'Outshift Design',
  };

  res.render('home', data);
});

app.get('/research', (_req, res) => {
  const researchItems = [
    { title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.', image: '/images/research/foundational-principles.png' },
    { title: 'Cognitive Frameworks', description: 'Our research relies on and develops theoretical models that explain how humans and AI agents process information and make decisions together. We explore cognitive load, mental models, and collaborative reasoning to create frameworks that inform better system design.', image: '/images/research/cognitive-framework.png' },
    { title: 'Industry Impact', description: 'A deep dive into how agent-based solutions are transforming enterprise workflows. From customer support to engineering operations, this research quantifies efficiency gains and explores emerging patterns of human-agent collaboration.', image: '/images/research/societal-impact.png' },
    { title: 'Security & Privacy', description: 'A strategic exploration of trust boundaries in agent systems, covering secure data handling, permission models, adversarial robustness, and how to build agents that respect user privacy by design.', image: '/images/research/security-privacy.png' },
    { title: 'Agent Impact Map', description: 'Mapping the ripple effects of agent deployments across organizations, from productivity metrics to team dynamics. This research provides frameworks for measuring and predicting agent impact at scale.', image: '/images/research/foresight-canvas.png' },
    { title: 'Cognition-Level Audit', description: 'Methodologies for evaluating agent reasoning quality, decision coherence, and alignment with human intent. This audit framework ensures agents maintain high cognitive fidelity across diverse tasks.', image: '/images/research/cognitive-load-audit.png' },
    { title: 'Proactive Gateways', description: 'Research into anticipatory agent behaviors that enable systems to proactively surface relevant information and actions before users explicitly request them, reducing friction in complex workflows.', image: '/images/research/proactive-gateways.png' },
  ];

  res.render('research', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Research Behind Hax',
    researchItems,
  });
});

app.get('/styleguide', (_req, res) => {
  res.render('styleguide', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Style Guide',
  });
});

app.listen(PORT, () => {
  console.log(`Outshift Design running at http://localhost:${PORT}`);
  console.log(`Strapi API: ${STRAPI_URL}`);
});
