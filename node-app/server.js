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
    { label: 'Initiatives', href: '/#initiatives', hasDropdown: true, children: [
      { label: 'The Human-Agent Experience', href: '/#initiatives' },
      { label: 'Internet of Cognition', href: 'https://outshift.cisco.com/internet-of-cognition/explore', external: true },
    ]},
    { label: 'About us', href: '/#about', hasDropdown: true },
    { label: 'Research', href: '/research', hasDropdown: true, children: [
      { group: 'Hax', groupHref: '/research', items: [
        { label: 'Foundational Principles', href: '/research/foundational-principles' },
        { label: 'Cognitive Frameworks', href: '#' },
        { label: 'Societal Impact', href: '#' },
        { label: 'Security & Privacy', href: '#' },
      ]},
    ]},
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
      comingSoon: true,
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
      comingSoon: true,
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

const fallbackResearch = {
  hero: {
    title: 'Exploring the Research Behind Hax',
    description: 'The HAX Research Laboratory is a design research initiative focused on exploring the foundational principles of Human-Agent Collaboration. We provide essential empirical and conceptual understanding, insights, and frameworks to help designers and innovators shape intuitive and effective Human-Agent interactions for the emerging Internet of Agents.',
    image: '/images/research/hero.png',
  },
  sectionHeader: {
    title: 'Advancing the Science of Human Agent Interaction',
    subtitle: 'Investigating how humans and agents think, act, and build together',
  },
  cta: {
    title: 'Build with the Hax SDK',
    description: 'The HAX SDK gives developers everything they need to integrate agents into their apps, without losing clarity, structure, or control. Use structured schemas, prebuilt components, and clear boundaries to keep agent behavior collaborative and predictable.',
    buttonLabel: 'Explore the SDK',
    buttonUrl: '#',
    image: '/images/research/sdk-hero.png',
  },
  items: [
    { title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.', image: '/images/research/foundational-principles.png' },
    { title: 'Cognitive Frameworks', description: 'Our research relies on and develops theoretical models that explain how humans and AI agents process information and make decisions together. We explore cognitive load, mental models, and collaborative reasoning to create frameworks that inform better system design.', image: '/images/research/cognitive-framework.png' },
    { title: 'Societal Impact', description: "Agentic systems reshape how we work, access knowledge, and distribute power. Because these systems fundamentally alter society, impact is a design responsibility, not an afterthought. We must look beyond 'what works' to ask: Who does this serve? Who is excluded? What are the long term consequences of scaling?", image: '/images/research/societal-impact.png' },
    { title: 'Security & Privacy', description: 'As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.', image: '/images/research/security-privacy.png' },
    { title: 'Agent Impact Map', description: "Mapping the agent's complete socio-technical context, from stakeholders and decision-making roles to intentional boundaries, to ensure a responsible design from day one.", image: '/images/research/foresight-canvas.png' },
    { title: 'Cognitive Load Audit', description: "Evaluating the agent's impact on a user's mental effort to ensure its design is intuitive, clear and respects diverse cognitive styles.", image: '/images/research/cognitive-load-audit.png' },
    { title: 'Foresight Canvas', description: 'A speculative design process to anticipate the long-term, unintended consequences of our agent. This audit focuses on identifying second-order effects, potential for misuse, and systemic risks.', image: '/images/research/foresight-canvas.png' },
  ],
};

function mapResearchPage(strapiData) {
  if (!strapiData) return null;
  return {
    hero: strapiData.hero ? {
      title: strapiData.hero.title,
      description: strapiData.hero.description,
      image: strapiData.hero.image?.url || fallbackResearch.hero.image,
    } : null,
    sectionHeader: strapiData.sectionHeader ? {
      title: strapiData.sectionHeader.title,
      subtitle: strapiData.sectionHeader.subtitle,
    } : null,
    cta: strapiData.cta ? {
      title: strapiData.cta.title,
      description: strapiData.cta.description,
      buttonLabel: strapiData.cta.buttonLabel,
      buttonUrl: strapiData.cta.buttonUrl,
      image: strapiData.cta.image?.url || fallbackResearch.cta.image,
    } : null,
  };
}

function mapResearchItems(strapiData) {
  if (!strapiData) return fallbackResearch.items;
  return strapiData
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.media?.image?.url || '/images/research/foundational-principles.png',
    }));
}

app.get('/research', async (_req, res) => {
  const [strapiPage, strapiCards] = await Promise.all([
    fetchStrapi('research-page?populate=*'),
    fetchStrapi('research-cards?populate=*&sort=order:asc'),
  ]);

  const page = mapResearchPage(strapiPage) || {};

  res.render('research', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Research Behind Hax',
    researchItems: mapResearchItems(strapiCards),
    hero: page.hero || fallbackResearch.hero,
    sectionHeader: page.sectionHeader || fallbackResearch.sectionHeader,
    cta: page.cta || fallbackResearch.cta,
  });
});

app.get('/research/foundational-principles', (_req, res) => {
  const pageData = {
    title: 'Foundational Principles',
    description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high-level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.',
    heroImage: '/images/research/foundational-principles-hero.png',
    pipelineTitle: 'Research to Design Pipeline',
    pipelineSubtitle: 'A collaborative design process that transforms raw research into practical design guidance and reusable patterns.',
    steps: [
      { title: 'Framing the inquiry', subtitle: 'Research Framing', description: 'Define the phenomenon that you want to explore, not the feature or product.', quote: '"How might X change the way people Y in a world where Z is true?"<br>"How do operators build trust in agent decisions during incident response?"', bullets: ['Capture context: who, where, when, stakes.', 'Define time horizon (e.g. 5, 10, 20, years)'], deliverables: ['Research brief (scope, goals, assumptions)', 'A short intent statement: "This inquiry explores... in order to inform design decisions about... in tomorrow\'s world."'] },
      { title: 'Research: Mapping the Present &amp; Emerging Signals', subtitle: 'Field input / Ground truth', description: 'Build a grounded understanding of what\'s already happening and what\'s starting to happen.', bullets: ['Desk research: academic papers, industry reports, patents, standards, policy, expert interviews.', 'Foresight inputs: horizon scanning, weak signals, trends, wildcards, tensions'], deliverables: ['Evidence map:<ul><li>Current practices &amp; pain points</li><li>Emerging technologies / norms</li></ul>', 'Insight clusters: 5-8 thematic clusters (e.g., "delegated decisions," "opacity of automation," "new forms of social risk")'] },
      { title: 'Synthesis: From Signals to Principles', subtitle: 'Conceptual modeling', description: 'Transform raw findings into conceptual frameworks and actionable design principles.', bullets: ['Identify recurring tensions and design trade-offs', 'Draft principle statements grounded in evidence', 'Map principles to interaction patterns and heuristics'], deliverables: ['Principle cards with rationale, applicability, and known limitations', 'Pattern mapping matrix (principle &rarr; pattern &rarr; component)'] },
      { title: 'Test the Bridge: Design Heuristics &amp; applicable methods', subtitle: 'Validation', description: 'Validate each pattern through heuristic evaluation, usability testing, and expert review to ensure the bridge between research and design guidance is sound.', bullets: ['Heuristic walkthroughs against real agent workflows', 'Expert panel review with domain specialists', 'Gap analysis: does the pattern address the original insight?'], deliverables: ['Evaluation report with findings and recommendations', 'Refined patterns with annotated revisions'] },
      { title: 'Prototype &amp; Iterate the validation', subtitle: 'Implementation testing', description: 'Patterns are implemented in interactive prototypes and tested with real users, iterating until they meet our quality bar for clarity, effectiveness, and adoptability.', bullets: ['Build interactive prototypes embodying the pattern', 'Run usability sessions with target users', 'Iterate on both design and documentation'], deliverables: ['Validated prototype with test findings', 'Final pattern specification ready for documentation'] },
      { title: 'Update Documentation &amp; Contribute', subtitle: 'Publication', description: 'Validated patterns are published to the Hax pattern library with full documentation, code examples, and usage guidelines. The library evolves as new research emerges.', bullets: ['Write pattern documentation with rationale and examples', 'Publish to the Hax pattern library', 'Tag with relevant themes for discoverability'], deliverables: ['Published pattern with code samples and usage guidelines', 'Changelog entry and contribution record'] },
    ],
    caseStudies: [
      {
        title: 'Agent Transparency in Change Impact Assessment, Verification and Testing',
        tags: ['Infrastructure', 'Change management'],
        description: 'Building transparent AI systems that assess infrastructure changes, verify modifications, conduct automated testing, and manage approval workflows \u2014 all while maintaining clear visibility into agent decision-making and human oversight.',
        problem: 'Infrastructure changes carry high risk, but manual impact assessment, testing, and approval processes create bottlenecks. Organizations struggle to balance automation speed with safety and accountability, often lacking visibility into what AI agents are actually evaluating and why certain changes get flagged.',
        principles: ['Traceability', 'Control', 'Clarity'],
      },
      {
        title: 'Designing for AI Transparency in Enterprise Agentic Composites',
        tags: ['Multi-Agent', 'Enterprise'],
        description: 'When multiple agents collaborate within a composite system, understanding who did what \u2014 and why \u2014 becomes critical. This case study explores transparency design patterns for multi-agent workflows in enterprise settings.',
        problem: 'Multi-agent systems create opaque decision chains where audit trails, decision attribution, and user-facing explanations must maintain clarity without overwhelming cognitive load. Users lose trust when they can\'t trace outcomes to specific agents.',
        principles: ['Transparency', 'Explainability', 'Audit'],
      },
      {
        title: 'Multi-Agent Cascades: Guardrails for Chain Reactions',
        tags: ['Cascades', 'Safety'],
        description: 'When agents trigger other agents, cascading effects can quickly move beyond human oversight. This study maps the interaction patterns of multi-agent cascades and proposes design guardrails to keep humans meaningfully in the loop.',
        problem: 'Cascading agent actions can amplify errors, create unintended consequences, and move beyond human oversight. Without circuit breakers, approval gates, and progressive disclosure, organizations risk losing control over automated workflows.',
        principles: ['Human-in-the-Loop', 'Guardrails', 'Control'],
      },
    ],
  };

  res.render('foundational-principles', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Foundational Principles',
    pageData,
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

function parseFields(attributes) {
  return Object.entries(attributes).map(([name, def]) => ({
    name,
    type: def.type === 'component' ? (def.repeatable ? 'component[]' : 'component') : def.type,
    required: !!def.required,
    component: def.component || null,
  }));
}

const strapiComponents = [
  { displayName: 'NavItem', icon: '🔗', description: 'Navigation menu item with label, URL, dropdown flag, and order.', fields: parseFields({ label: { type: 'string', required: true }, href: { type: 'string', required: true }, hasDropdown: { type: 'boolean' }, order: { type: 'integer' } }) },
  { displayName: 'ArrowLink', icon: '➡️', description: 'Call-to-action arrow link with label, URL, and external flag.', fields: parseFields({ label: { type: 'string', required: true }, url: { type: 'string', required: true }, isExternal: { type: 'boolean' } }) },
  { displayName: 'Tag', icon: '#️⃣', description: 'Reusable label tag for categorization with optional color.', fields: parseFields({ label: { type: 'string', required: true }, url: { type: 'string' }, color: { type: 'enumeration' } }) },
  { displayName: 'MediaBlock', icon: '🖼️', description: 'Flexible media block supporting images and videos with alt text.', fields: parseFields({ mediaType: { type: 'enumeration', required: true }, image: { type: 'media' }, videoUrl: { type: 'string' }, altText: { type: 'string', required: true }, caption: { type: 'string' } }) },
  { displayName: 'SocialLink', icon: '🌐', description: 'Social media link with platform enum and accessibility label.', fields: parseFields({ platform: { type: 'enumeration', required: true }, url: { type: 'string', required: true }, ariaLabel: { type: 'string', required: true } }) },
  { displayName: 'SeoMeta', icon: '🔍', description: 'SEO metadata with title, description, OG image, and canonical URL.', fields: parseFields({ metaTitle: { type: 'string', required: true }, metaDescription: { type: 'text' }, ogImage: { type: 'media' }, canonicalUrl: { type: 'string' } }) },
  { displayName: 'HeroBlock', icon: '🏔️', description: 'Reusable hero section with title, description, and image.', fields: parseFields({ title: { type: 'string', required: true }, description: { type: 'text', required: true }, image: { type: 'media' } }) },
  { displayName: 'SectionHeader', icon: '📌', description: 'Section header with title and optional subtitle.', fields: parseFields({ title: { type: 'string', required: true }, subtitle: { type: 'string' } }) },
  { displayName: 'CtaBlock', icon: '🎯', description: 'Call-to-action block with title, description, button, and image.', fields: parseFields({ title: { type: 'string', required: true }, description: { type: 'text', required: true }, buttonLabel: { type: 'string', required: true }, buttonUrl: { type: 'string', required: true }, image: { type: 'media' } }) },
];

const strapiContentTypes = [
  { displayName: 'Homepage', kind: 'singleType', pluralName: 'homepage', description: 'Homepage configuration — hero, sections, navigation, footer, and social links.', fields: [
    { name: 'heroTitle', type: 'string', required: true },
    { name: 'heroSubtitle', type: 'string', required: true },
    { name: 'heroDescription', type: 'text', required: false },
    { name: 'heroCtaLabel', type: 'string', required: false },
    { name: 'heroCtaUrl', type: 'string', required: false },
    { name: 'navigation', type: 'component[]', required: false, component: 'shared.nav-item' },
    { name: 'footerLinks', type: 'component[]', required: false, component: 'shared.arrow-link' },
    { name: 'socialLinks', type: 'component[]', required: false, component: 'shared.social-link' },
    { name: 'seo', type: 'component', required: false, component: 'shared.seo-meta' },
  ]},
  { displayName: 'ResearchPage', kind: 'singleType', pluralName: 'research-page', description: 'Research page — hero, section header, CTA block, and SEO.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'sectionHeader', type: 'component', required: false, component: 'shared.section-header' },
    { name: 'cta', type: 'component', required: false, component: 'shared.cta-block' },
    { name: 'seo', type: 'component', required: false, component: 'shared.seo-meta' },
  ]},
  { displayName: 'Initiative', kind: 'collection', pluralName: 'initiatives', description: 'Featured initiative cards on the homepage with badge, media, and ordering.', fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'description', type: 'text', required: true },
    { name: 'slug', type: 'uid', required: true },
    { name: 'badge', type: 'string', required: true },
    { name: 'media', type: 'component', required: true, component: 'shared.media-block' },
    { name: 'link', type: 'component', required: false, component: 'shared.arrow-link' },
    { name: 'reversed', type: 'boolean', required: false },
    { name: 'order', type: 'integer', required: false },
  ]},
  { displayName: 'ResearchCard', kind: 'collection', pluralName: 'research-cards', description: 'Research cards with category (research-area / design-tool), media, tags, and ordering.', fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'description', type: 'text', required: true },
    { name: 'slug', type: 'uid', required: true },
    { name: 'category', type: 'enumeration', required: true },
    { name: 'media', type: 'component', required: true, component: 'shared.media-block' },
    { name: 'tags', type: 'component[]', required: false, component: 'shared.tag' },
    { name: 'link', type: 'component', required: false, component: 'shared.arrow-link' },
    { name: 'order', type: 'integer', required: false },
  ]},
  { displayName: 'BlogPost', kind: 'collection', pluralName: 'blog-posts', description: 'Blog articles with author, publish date, rich content, tags, and SEO.', fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'description', type: 'text', required: true },
    { name: 'slug', type: 'uid', required: true },
    { name: 'author', type: 'string', required: true },
    { name: 'publishDate', type: 'date', required: true },
    { name: 'readTime', type: 'string', required: false },
    { name: 'content', type: 'richtext', required: false },
    { name: 'coverImage', type: 'media', required: false },
    { name: 'tags', type: 'component[]', required: false, component: 'shared.tag' },
    { name: 'seo', type: 'component', required: false, component: 'shared.seo-meta' },
  ]},
];

app.get('/components', (_req, res) => {
  res.render('components', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Component Library',
    components: strapiComponents,
    contentTypes: strapiContentTypes,
  });
});

app.listen(PORT, () => {
  console.log(`Outshift Design running at http://localhost:${PORT}`);
  console.log(`Strapi API: ${STRAPI_URL}`);
});
