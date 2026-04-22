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

function validUrl(url) {
  return url && url !== '#' ? url : null;
}

function deepPopulate(fields) {
  return fields.map((f) => `populate[${f}][populate]=*`).join('&');
}

/* ──────────────────────────────────────────────────────────
   Shared SDK fallback (identical across pages)
   ────────────────────────────────────────────────────────── */
const sdkFallback = {
  title: 'Build with the Hax SDK',
  description: 'The HAX SDK gives developers everything they need to integrate agents into their apps, without losing clarity, structure, or control. Use structured schemas, prebuilt components, and clear boundaries to keep agent behavior collaborative and predictable.',
  buttonLabel: 'Explore the SDK',
  buttonUrl: 'https://vaesposito.github.io/outshift-design/sdk.html#introduction',
  image: '/images/research/sdk-hero.png',
  darkImage: '/images/research/sdk-hero-dark.png',
};

/* ──────────────────────────────────────────────────────────
   Navigation
   ────────────────────────────────────────────────────────── */
const fallbackData = {
  nav: [
    { label: 'Initiatives', href: '/#initiatives', hasDropdown: true, children: [
      { label: 'The Human-Agent Experience', href: '/hax' },
      { label: 'Internet of Cognition', href: 'https://outshift.cisco.com/internet-of-cognition/explore', external: true },
    ]},
    // { label: 'About us', href: '/#about', hasDropdown: true },
    { label: 'Research', href: '/research', hasDropdown: true, children: [
      { group: 'Hax', groupHref: '/research', items: [
        { label: 'Foundational Principles', href: '/research/foundational-principles' },
        { label: 'Cognitive Frameworks', href: '/research/cognitive-frameworks' },
        { label: 'Societal Impact', href: '/research/societal-impact' },
        { label: 'Security & Privacy', href: '/research/security-privacy' },
        { label: 'Agent Impact Map', href: '/research/agent-impact-map' },
        { label: 'Cognitive Load Audit', href: '/research/cognitive-load-audit' },
        { label: 'Foresight Canvas', href: '/research/foresight-canvas' },
      ]},
    ]},
    { label: 'Blog', href: '/blog', hasDropdown: false },
  ],
  initiatives: [
    { title: 'HAX, The Human-Agent Experience', description: 'Designing for the Internet of Agents', badge: 'SDK', video: '/videos/agents.mp4', darkVideo: '/videos/agents-dark.mp4', reversed: false, href: '/hax', docHref: '/sdk#introduction', docLabel: 'Explore the SDK' },
    { title: 'Internet of Cognition', description: 'Enabling agents and humans to scale intelligence collectively.', badge: 'AI/ML', video: '/videos/cognition.mp4', darkVideo: '/videos/cognition-2.mp4', reversed: true, href: 'https://outshift.cisco.com/internet-of-cognition/explore', external: true },
  ],
  researchCards: [
    { title: 'Outshift research', description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.', image: '/images/hax-research.png', darkImage: '/images/hax-research-dark.png', tags: ['AI Research', 'Design Framework', 'Ethics'], href: '/research' },
  ],
  blogPosts: [
    { title: 'The Future of Design Systems', description: 'How we built a scalable design system that powers hundreds of products across the enterprise.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
    { title: 'Designing for Accessibility', description: 'Our approach to creating inclusive experiences that work for everyone.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
    { title: 'Remote Collaboration at Scale', description: 'Lessons learned from building tools for distributed teams across the globe.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
  ],
  blogHub: [
    { title: 'Navigating the Multi-Agent Future: Expert Perspectives on Human-Agent Interaction', description: 'The shifting landscape of work and interaction. This report presents key findings and actionable insights drawn from leading industry and academic experts on the future of human agent interaction.', author: 'Outshift by Cisco', date: 'April 2026', readTime: 'Whitepaper', tags: ['Research', 'AI', 'Product Design'], coverImage: '/images/blog/navigating-multi-agent-future.jpg', href: 'https://outshift-headless-cms-s3.s3.us-east-2.amazonaws.com/Navigating_The_Multi-Agent_Future.pdf', external: true },
    { title: 'The Future of Design Systems: Scalability and Consistency', description: 'Exploring how modern design systems are evolving to meet the demands of large-scale enterprise applications while maintaining flexibility and innovation.', author: 'Jaime Holland', date: 'March 1, 2026', readTime: '5 min read', tags: ['Design Systems', 'UX/UI'], coverGradient: 'linear-gradient(135deg, #0a3d5c 0%, #1a6e5c 100%)', href: '/blog/future-of-design-systems' },
    { title: 'User Research in the Age of AI: New Methodologies', description: 'How artificial intelligence is transforming user research practices and enabling deeper insights into user behavior and preferences.', author: 'Monserrat Gonzalez Gacel', date: 'March 1, 2026', readTime: '8 min read', tags: ['Research', 'AI'], coverGradient: 'linear-gradient(135deg, #1a2744 0%, #2d4a7a 100%)', href: '/blog/user-research-age-of-ai' },
    { title: 'Building Accessible Interfaces: A Practical Guide', description: 'Practical tips and techniques for creating web applications that are accessible to all users, regardless of their abilities or disabilities.', author: 'Valentina Esposito', date: 'March 1, 2026', readTime: '8 min read', tags: ['UX/UI', 'Accessibility'], coverGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)', href: '/blog/building-accessible-interfaces' },
    { title: 'Design Thinking Workshop: Lessons from the Field', description: 'Key takeaways and insights from facilitating design thinking workshops across diverse teams and industries.', author: 'Marc Sotelli', date: 'March 1, 2026', readTime: '5 min read', tags: ['Design Thinking', 'Workshop'], coverGradient: 'linear-gradient(135deg, #8b3a62 0%, #c94b4b 100%)', href: '/blog/design-thinking-workshop' },
    { title: 'Modern Web Development: Bridging Design and Code', description: 'Understanding how designers and developers can collaborate more effectively to create seamless digital experiences.', author: 'Krystelle Gonzalez', date: 'March 1, 2026', readTime: '7 min read', tags: ['Development', 'Collaboration'], coverGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', href: '/blog/modern-web-development' },
    { title: 'The Power of Cross-Functional Collaboration', description: 'How effective team collaboration leads to better product outcomes and a more cohesive user experience.', author: 'Serin Kuth', date: 'March 1, 2026', readTime: '5 min read', tags: ['Collaboration', 'Team'], coverGradient: 'linear-gradient(135deg, #1a5276 0%, #2ecc71 100%)', href: '/blog/cross-functional-collaboration' },
  ],
  homepage: null,
};

/* ──────────────────────────────────────────────────────────
   Homepage mapping helpers
   ────────────────────────────────────────────────────────── */
function mapInitiatives(strapiData) {
  if (!strapiData) return fallbackData.initiatives;
  const fbByTitle = {};
  const haxInitiativeFb = fallbackData.initiatives[0];
  fallbackData.initiatives.forEach((fb) => { fbByTitle[fb.title] = fb; });
  fbByTitle['Designing for the Internet of Agents'] = haxInitiativeFb;
  return strapiData
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => {
      const linkUrl = item.link?.url ? String(item.link.url) : '';
      const isHaxInitiative = item.slug === 'internet-of-agents' || linkUrl.includes('/hax');
      const fb = fbByTitle[item.title] || (isHaxInitiative ? haxInitiativeFb : {});
      return {
        title: item.title,
        description: item.description,
        badge: item.badge,
        video: item.media?.videoUrl || fb.video || '/videos/agents.mp4',
        darkVideo: fb.darkVideo || null,
        reversed: item.reversed || false,
        href: validUrl(item.link?.url) || fb.href || '#',
        external: validUrl(item.link?.url) ? (item.link.isExternal || false) : (fb.external || false),
        docHref: fb.docHref || null,
        docLabel: fb.docLabel || null,
      };
    });
}

function mapResearchCards(strapiData) {
  if (!strapiData) return fallbackData.researchCards;
  const imageMap = { hax: '/images/hax-research.png', 'internet-of-cognition': '/images/cognition-research.png' };
  const fbByTitle = {};
  fallbackData.researchCards.forEach((fb) => { fbByTitle[fb.title] = fb; });
  const primaryResearchFb = fallbackData.researchCards[0] || {};
  const mapped = strapiData
    .filter((item) => item.slug !== 'internet-of-cognition' && item.title !== 'Internet of Cognition')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => {
      const fb = fbByTitle[item.title] || (item.slug === 'hax' ? primaryResearchFb : {});
      return {
        title: item.slug === 'hax' ? 'Outshift research' : item.title,
        description: item.description,
        image: imageMap[item.slug] || fb.image || '/images/hax-research.png',
        darkImage: fb.darkImage || null,
        tags: (item.tags || []).map((t) => t.label),
        href: validUrl(item.link?.url) || fb.href || null,
        external: validUrl(item.link?.url) ? (item.link.isExternal || false) : (fb.external || false),
        comingSoon: fb.comingSoon || false,
      };
    });
  return mapped.length ? mapped : fallbackData.researchCards;
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

function mapNav() {
  return fallbackData.nav;
}

/* ──────────────────────────────────────────────────────────
   HOMEPAGE
   ────────────────────────────────────────────────────────── */
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
    nav: mapNav(),
    initiatives: mapInitiatives(strapiInitiatives),
    researchCards: mapResearchCards(strapiResearch),
    blogPosts: mapBlogPosts(strapiBlog),
    homepage: strapiHomepage,
    pageTitle: 'Outshift Design',
  };

  res.render('home', data);
});

/* ──────────────────────────────────────────────────────────
   RESEARCH HUB
   ────────────────────────────────────────────────────────── */
const fallbackResearch = {
  hero: { title: 'Research at Outshift', description: 'This is the home for Outshift product design research—where we explore design, AI, and human-centered technology together. A major part of our work is Hax (Human–Agent Experience): principles, methods, and studies that help teams build trustworthy, collaborative human–agent experiences for the emerging Internet of Agents. Use the topics below to go deeper.', image: '/images/research/hero.png', darkImage: '/images/research/hero-dark.png' },
  sectionHeader: { title: 'Research topics', subtitle: 'Frameworks and deep dives from our lab—human–agent interaction, cognition, ethics, security, and long-term impact.' },
  cta: sdkFallback,
  items: [
    { title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.', image: '/images/research/foundational-principles.png', darkImage: '/images/research/foundational-principles-dark.png', href: '/research/foundational-principles' },
    { title: 'Cognitive Frameworks', description: 'Our research relies on and develops theoretical models that explain how humans and AI agents process information and make decisions together. We explore cognitive load, mental models, and collaborative reasoning to create frameworks that inform better system design.', image: '/images/research/cognitive-framework.png', darkImage: '/images/research/cognitive-framework-dark.png', href: '/research/cognitive-frameworks' },
    { title: 'Societal Impact', description: "Agentic systems reshape how we work, access knowledge, and distribute power. Because these systems fundamentally alter society, impact is a design responsibility, not an afterthought. We must look beyond 'what works' to ask: Who does this serve? Who is excluded? What are the long term consequences of scaling?", image: '/images/research/societal-impact.png', darkImage: '/images/research/societal-impact-dark.png', href: '/research/societal-impact' },
    { title: 'Security & Privacy', description: 'As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.', image: '/images/research/security-privacy.png', darkImage: '/images/research/security-privacy-dark.png', href: '/research/security-privacy' },
    { title: 'Agent Impact Map', description: "Mapping the agent's complete socio-technical context, from stakeholders and decision-making roles to intentional boundaries, to ensure a responsible design from day one.", image: '/images/research/agent-impact.png', darkImage: '/images/research/agent-impact-dark.png', href: '/research/agent-impact-map' },
    { title: 'Cognitive Load Audit', description: "Evaluating the agent's impact on a user's mental effort to ensure its design is intuitive, clear and respects diverse cognitive styles.", image: '/images/research/cognitive-load-audit.png', darkImage: '/images/research/cognitive-load-audit-dark.png', href: '/research/cognitive-load-audit' },
    { title: 'Foresight Canvas', description: 'A speculative design process to anticipate the long-term, unintended consequences of our agent. This audit focuses on identifying second-order effects, potential for misuse, and systemic risks.', image: '/images/research/foresight-canvas.png', darkImage: '/images/research/foresight-canvas-dark.png', href: '/research/foresight-canvas' },
  ],
};

function mapResearchPage(strapiData) {
  if (!strapiData) return null;
  return {
    hero: strapiData.hero ? { title: strapiData.hero.title, description: strapiData.hero.description, image: strapiData.hero.image?.url || fallbackResearch.hero.image, darkImage: fallbackResearch.hero.darkImage } : null,
    sectionHeader: strapiData.sectionHeader ? { title: strapiData.sectionHeader.title, subtitle: strapiData.sectionHeader.subtitle } : null,
    cta: strapiData.cta ? { title: strapiData.cta.title, description: strapiData.cta.description, buttonLabel: strapiData.cta.buttonLabel, buttonUrl: strapiData.cta.buttonUrl, image: strapiData.cta.image?.url || fallbackResearch.cta.image } : null,
  };
}

app.get('/research', async (_req, res) => {
  const strapiPage = await fetchStrapi('research-page?populate=*');
  const page = mapResearchPage(strapiPage) || {};

  res.render('research', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Research',
    researchItems: fallbackResearch.items,
    hero: page.hero || fallbackResearch.hero,
    sectionHeader: page.sectionHeader || fallbackResearch.sectionHeader,
    cta: page.cta || fallbackResearch.cta,
  });
});

/* ──────────────────────────────────────────────────────────
   HAX PAGE
   ────────────────────────────────────────────────────────── */
const fallbackHax = {
  hero: {
    title: 'The Human-Agent Experience',
    description: "We're moving beyond assistants and copilots. Today's agents act with greater autonomy, coordinate across systems, and collaborate with humans in more nuanced ways. Designing for this shift requires new patterns of interaction and trust.",
  },
  heroDescription2: 'This work is grounded in years of design research and product development by the Outshift Product Design team, defining principles, frameworks, and patterns for agentic systems that are trustworthy, transparent, and truly collaborative.',
  heroVideo: '/videos/hax-hero.mp4',
  heroDarkVideo: '/videos/hax-hero-dark.mp4',
  patternsTitle: 'Human-Centered AI Patterns',
  patternsDescription: 'These 5 guiding principles emerged from studying how people interact with agentic systems. Using these patterns is the foundation for building trustworthy AI experiences that prioritize human control and agency.',
  patterns: [
    { key: 'control', title: 'Control', description: 'Humans guide how agents operate by setting boundaries, preferences, and intent. Control aligns autonomy with human goals.', images: ['/images/patterns/scope-boundaries.svg', '/images/patterns/permission-gates.svg', '/images/patterns/customization-autonomy.svg'], darkImages: ['/images/patterns/scope-boundaries-dark.svg', '/images/patterns/permission-gates-dark.svg', '/images/patterns/customization-autonomy-dark.svg'], alts: ['Scope & Boundaries', 'Permission Gates', 'Customization of Autonomy'] },
    { key: 'clarity', title: 'Clarity', description: 'Agents should make their reasoning, context, and confidence visible. Instead of acting like black boxes, they show how decisions are made so users can understand, question, or adjust them.', images: ['/images/patterns/clarity-1.svg', '/images/patterns/clarity-2.svg', '/images/patterns/clarity-3.svg', '/images/patterns/clarity-4.svg'], darkImages: ['/images/patterns/clarity-1-dark.svg', '/images/patterns/clarity-2-dark.svg', '/images/patterns/clarity-3-dark.svg', '/images/patterns/clarity-4-dark.svg'], alts: ['Clarity pattern 1', 'Clarity pattern 2', 'Clarity pattern 3', 'Clarity pattern 4'] },
    { key: 'recovery', title: 'Recovery', description: 'Agents will make mistakes, what matters is how fixable they are. Recovery means giving users clear, safe ways to undo actions, correct errors, and guide future behavior. It makes systems feel less brittle and more collaborative.', images: ['/images/patterns/recovery-1.svg', '/images/patterns/recovery-2.svg', '/images/patterns/recovery-3.svg', '/images/patterns/recovery-4.svg'], darkImages: ['/images/patterns/recovery-1-dark.svg', '/images/patterns/recovery-2-dark.svg', '/images/patterns/recovery-3-dark.svg', '/images/patterns/recovery-4-dark.svg'], alts: ['Recovery pattern 1', 'Recovery pattern 2', 'Recovery pattern 3', 'Recovery pattern 4'] },
    { key: 'collaboration', title: 'Collaboration', description: 'Autonomous agents should act as capable partners, not just tools waiting for commands. Collaboration means shared context, back-and-forth interaction, and joint ownership of outcomes. The agent contributes ideas, takes input, and improves the work in progress.', images: ['/images/patterns/collaboration-1.svg', '/images/patterns/collaboration-2.svg', '/images/patterns/collaboration-3.svg'], darkImages: ['/images/patterns/collaboration-1-dark.svg', '/images/patterns/collaboration-2-dark.svg', '/images/patterns/collaboration-3-dark.svg'], alts: ['Collaboration pattern 1', 'Collaboration pattern 2', 'Collaboration pattern 3'] },
    { key: 'traceability', title: 'Traceability', description: 'Traceability ensures agent decisions can be reviewed, understood, and improved over time. It makes behavior accountable across sessions, users, and workflows supporting debugging, learning, and workflow improvements.', images: ['/images/patterns/traceability-1.svg', '/images/patterns/traceability-2.svg', '/images/patterns/traceability-3.svg'], darkImages: ['/images/patterns/traceability-1-dark.svg', '/images/patterns/traceability-2-dark.svg', '/images/patterns/traceability-3-dark.svg'], alts: ['Traceability pattern 1', 'Traceability pattern 2', 'Traceability pattern 3'] },
  ],
  researchTitle: 'The Outshift Design Research Laboratory',
  researchDescription: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
  researchLink: { label: 'Explore the Research', url: '/research', isExternal: false },
  researchImage: '/images/hax-research.png',
  sdk: sdkFallback,
};

function mapHaxPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackHax.hero,
    heroDescription2: fallbackHax.heroDescription2,
    heroVideo: s.heroVideo || fallbackHax.heroVideo,
    heroDarkVideo: fallbackHax.heroDarkVideo,
    patternsTitle: s.patternsTitle || fallbackHax.patternsTitle,
    patternsDescription: s.patternsDescription || fallbackHax.patternsDescription,
    patterns: (s.patterns && s.patterns.length) ? s.patterns.map((p, idx) => ({
      key: p.key || (fallbackHax.patterns[idx]?.key || ''),
      title: p.title,
      description: p.description,
      images: (p.exampleImages && p.exampleImages.length) ? p.exampleImages.map((img) => img.url || img) : (fallbackHax.patterns[idx]?.images || []),
      darkImages: (p.exampleDarkImages && p.exampleDarkImages.length) ? p.exampleDarkImages.map((img) => img.url || img) : (fallbackHax.patterns[idx]?.darkImages || []),
      alts: (p.exampleImages && p.exampleImages.length) ? p.exampleImages.map((img) => img.alternativeText || img.name || p.title) : (fallbackHax.patterns[idx]?.alts || []),
    })) : fallbackHax.patterns,
    researchTitle: s.researchTitle || fallbackHax.researchTitle,
    researchDescription: s.researchDescription || fallbackHax.researchDescription,
    researchLink: s.researchLink ? { label: s.researchLink.label, url: s.researchLink.url, isExternal: s.researchLink.isExternal } : fallbackHax.researchLink,
    researchImage: s.researchImage?.url || fallbackHax.researchImage,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/hax', async (_req, res) => {
  const strapiData = await fetchStrapi(`hax-page?${deepPopulate(['hero', 'patterns', 'researchLink', 'sdk', 'seo'])}&populate[researchImage]=*`);
  const pageData = mapHaxPage(strapiData) || fallbackHax;

  res.render('hax', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 The Human-Agent Experience',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   FOUNDATIONAL PRINCIPLES
   ────────────────────────────────────────────────────────── */
const fallbackFoundational = {
  hero: { title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high-level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.' },
  heroImage: '/images/research/foundational-principles-hero.png',
  heroDarkImage: '/images/research/foundational-principles-hero-dark.png',
  pipelineTitle: 'Research to Design Pipeline',
  pipelineSubtitle: 'A collaborative design process that transforms raw research into practical design guidance and reusable patterns.',
  steps: [
    { stepNumber: '01', title: 'Framing the inquiry', subtitle: 'Research Framing', description: 'Define the phenomenon that you want to explore, not the feature or product.', quote: '"How might X change the way people Y in a world where Z is true?"<br>"How do operators build trust in agent decisions during incident response?"', bullets: ['Capture context: who, where, when, stakes.', 'Define time horizon (e.g. 5, 10, 20, years)'], deliverables: ['Research brief (scope, goals, assumptions)', 'A short intent statement: "This inquiry explores... in order to inform design decisions about... in tomorrow\'s world."'] },
    { stepNumber: '02', title: 'Research: Mapping the Present &amp; Emerging Signals', subtitle: 'Field input / Ground truth', description: 'Build a grounded understanding of what\'s already happening and what\'s starting to happen.', bullets: ['Desk research: academic papers, industry reports, patents, standards, policy, expert interviews.', 'Foresight inputs: horizon scanning, weak signals, trends, wildcards, tensions'], deliverables: ['Evidence map:<ul><li>Current practices &amp; pain points</li><li>Emerging technologies / norms</li></ul>', 'Insight clusters: 5-8 thematic clusters (e.g., "delegated decisions," "opacity of automation," "new forms of social risk")'] },
    { stepNumber: '03', title: 'Synthesis: From Signals to Principles', subtitle: 'Conceptual modeling', description: 'Transform raw findings into conceptual frameworks and actionable design principles.', bullets: ['Identify recurring tensions and design trade-offs', 'Draft principle statements grounded in evidence', 'Map principles to interaction patterns and heuristics'], deliverables: ['Principle cards with rationale, applicability, and known limitations', 'Pattern mapping matrix (principle &rarr; pattern &rarr; component)'] },
    { stepNumber: '04', title: 'Test the Bridge: Design Heuristics &amp; applicable methods', subtitle: 'Validation', description: 'Validate each pattern through heuristic evaluation, usability testing, and expert review to ensure the bridge between research and design guidance is sound.', bullets: ['Heuristic walkthroughs against real agent workflows', 'Expert panel review with domain specialists', 'Gap analysis: does the pattern address the original insight?'], deliverables: ['Evaluation report with findings and recommendations', 'Refined patterns with annotated revisions'] },
    { stepNumber: '05', title: 'Prototype &amp; Iterate the validation', subtitle: 'Implementation testing', description: 'Patterns are implemented in interactive prototypes and tested with real users, iterating until they meet our quality bar for clarity, effectiveness, and adoptability.', bullets: ['Build interactive prototypes embodying the pattern', 'Run usability sessions with target users', 'Iterate on both design and documentation'], deliverables: ['Validated prototype with test findings', 'Final pattern specification ready for documentation'] },
    { stepNumber: '06', title: 'Update Documentation &amp; Contribute', subtitle: 'Publication', description: 'Validated patterns are published to the Hax pattern library with full documentation, code examples, and usage guidelines. The library evolves as new research emerges.', bullets: ['Write pattern documentation with rationale and examples', 'Publish to the Hax pattern library', 'Tag with relevant themes for discoverability'], deliverables: ['Published pattern with code samples and usage guidelines', 'Changelog entry and contribution record'] },
  ],
  caseStudiesTitle: 'Case Studies',
  caseStudiesDescription: 'Real-world applications of our foundational principles in enterprise and research contexts.',
  caseStudies: [
    { title: 'Agent Transparency in Change Impact Assessment, Verification and Testing', tags: ['Infrastructure', 'Change management'], description: 'Building transparent AI systems that assess infrastructure changes, verify modifications, conduct automated testing, and manage approval workflows \u2014 all while maintaining clear visibility into agent decision-making and human oversight.', problem: 'Infrastructure changes carry high risk, but manual impact assessment, testing, and approval processes create bottlenecks. Organizations struggle to balance automation speed with safety and accountability, often lacking visibility into what AI agents are actually evaluating and why certain changes get flagged.', principles: ['Traceability', 'Control', 'Clarity'] },
    { title: 'Designing for AI Transparency in Enterprise Agentic Composites', tags: ['Multi-Agent', 'Enterprise'], description: 'When multiple agents collaborate within a composite system, understanding who did what \u2014 and why \u2014 becomes critical. This case study explores transparency design patterns for multi-agent workflows in enterprise settings.', problem: 'Multi-agent systems create opaque decision chains where audit trails, decision attribution, and user-facing explanations must maintain clarity without overwhelming cognitive load. Users lose trust when they can\'t trace outcomes to specific agents.', principles: ['Transparency', 'Explainability', 'Audit'] },
    { title: 'Multi-Agent Cascades: Guardrails for Chain Reactions', tags: ['Cascades', 'Safety'], description: 'When agents trigger other agents, cascading effects can quickly move beyond human oversight. This study maps the interaction patterns of multi-agent cascades and proposes design guardrails to keep humans meaningfully in the loop.', problem: 'Cascading agent actions can amplify errors, create unintended consequences, and move beyond human oversight. Without circuit breakers, approval gates, and progressive disclosure, organizations risk losing control over automated workflows.', principles: ['Human-in-the-Loop', 'Guardrails', 'Control'] },
  ],
  sdk: sdkFallback,
};

function splitNewlines(text) {
  if (!text) return [];
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

function mapFoundationalPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackFoundational.hero,
    heroImage: s.hero?.image?.url || fallbackFoundational.heroImage,
    heroDarkImage: fallbackFoundational.heroDarkImage,
    pipelineTitle: s.pipelineTitle || fallbackFoundational.pipelineTitle,
    pipelineSubtitle: s.pipelineSubtitle || fallbackFoundational.pipelineSubtitle,
    steps: (s.steps && s.steps.length) ? s.steps.map((st) => ({
      stepNumber: st.stepNumber,
      title: st.title,
      subtitle: st.subtitle,
      description: st.description,
      quote: st.quote,
      bullets: st.bullets ? splitNewlines(st.bullets) : [],
      deliverables: st.deliverables ? splitNewlines(st.deliverables) : [],
    })) : fallbackFoundational.steps,
    caseStudiesTitle: s.caseStudiesTitle || fallbackFoundational.caseStudiesTitle,
    caseStudiesDescription: s.caseStudiesDescription || fallbackFoundational.caseStudiesDescription,
    caseStudies: (s.caseStudies && s.caseStudies.length) ? s.caseStudies.map((cs, idx) => ({
      title: cs.title,
      tags: (cs.tags && cs.tags.length) ? cs.tags.map((t) => t.label || t) : (fallbackFoundational.caseStudies[idx]?.tags || []),
      description: cs.description,
      problem: cs.problem,
      principles: cs.principles ? splitNewlines(cs.principles) : (fallbackFoundational.caseStudies[idx]?.principles || []),
    })) : fallbackFoundational.caseStudies,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/foundational-principles', async (_req, res) => {
  const strapiData = await fetchStrapi(`foundational-principles-page?${deepPopulate(['hero', 'steps', 'caseStudies', 'sdk', 'seo'])}`);
  const pageData = mapFoundationalPage(strapiData) || fallbackFoundational;

  res.render('foundational-principles', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Foundational Principles',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   COGNITIVE FRAMEWORKS
   ────────────────────────────────────────────────────────── */
const fallbackCognitive = {
  hero: { title: 'Cognitive Frameworks', description: 'Physical and cognitive designs are key to understanding how people and AI systems share understanding, adapt to situations, and act meaningfully together. Grounded in embodied cognition, distributed cognition, and situated action, our research bridges theory and design to shape interactions that are intuitive, contextual, and genuinely collaborative.' },
  heroImage: '/images/research/cognitive-frameworks-hero.png',
  heroDarkImage: '/images/research/cognitive-frameworks-hero-dark.png',
  theoreticalTitle: 'Theoretical Foundations',
  theoreticalDescription: 'Grounding HAX design in established cognitive science',
  steps: [
    {
      number: '01', title: 'Distributed Cognition',
      description: "What if intelligence isn't just in our heads? Distributed cognition argues that thinking happens across people, tools, environments, and artifacts \u2014 not in any single mind.",
      keyConcepts: ['Cognition extends beyond individual brains', 'Knowledge lives in systems, tools, and social structures', 'Coordination happens through shared representations'],
      frameworkTitle: 'Framework for Human-AI Collaboration',
      frameworkDescription: 'In Designing agentic systems we consider cognitive processes to be distributed across human and AI agents working within the unified system. This helps us to conceptualize experiences that allow agents to seamlessly integrate into user workflows and interfaces that act as spaces of mutual sense-making and collaboration.',
      frameworkImages: ['/images/research/human-ai-diagram.svg', '/images/research/core-functionalities.svg'],
      frameworkDarkImages: ['/images/research/human-ai-diagram-dark.svg', '/images/research/core-functionalities-dark.svg'],
      frameworkImageAlts: ['Human-AI collaboration diagram', 'Core functionalities: Summarizing, Remembering, Suggesting, Contextualizing'],
      coreTitle: 'Core functionalities',
      whyTitle: 'Why this matters',
      whyText: "In AI-augmented systems, cognition isn't just human or machine \u2014 it's distributed across both. Understanding this helps us design interfaces that support shared awareness, coordination, and collective intelligence.",
      whyPosition: 'inside',
      useCases: [
        { tag: 'Scalability', title: 'Sead Graph Exploration: Turning Complexity into Comprehension', description: 'How distributed cognition principles helped transform complex graph data into intuitive, navigable interfaces.' },
        { tag: 'Security', title: 'Cognitive Load in Security Workflows: Reducing Alert Fatigue', description: 'Applying cognitive frameworks to simplify threat analysis and help analysts focus on what matters most.' },
        { tag: 'Collaboration', title: 'Multi-Agent Orchestration: Coordinating Intelligence at Scale', description: 'How distributed cognition informs the design of collaborative multi-agent systems that work alongside human teams.' },
      ],
    },
    {
      number: '02', title: 'Situated Action',
      description: "Cognition is shaped by context. Users rarely execute fixed plans all of the time\u2014they adapt in real time to their surroundings, constraints, and evolving goals. Our agents are built to thrive in these fluid, unpredictable settings\u2014sensing timing and environmental cues to provide assistance that feels natural, situationally aware, and attuned to the moment.",
      keyConcepts: ['Dynamic environmental adaptation.', 'Temporal awareness for timely interventions.', 'Cue recognition and response.', 'Improvisational support over rigid planning.'],
      frameworkTitle: 'Approaches',
      frameworkDescription: 'Agents that improvise and adapt based on environment, timing, and social context\u2014not rigid plans.',
      frameworkImages: ['/images/research/abstract-planning.svg', '/images/research/situated-action-card.svg'],
      frameworkDarkImages: ['/images/research/abstract-planning-dark.svg', '/images/research/situated-action-card-dark.svg'],
      frameworkImageAlts: ['Abstract Planning \u2014 Traditional approach', 'Situated Action \u2014 Our approach'],
      approachCards: true,
      whyTitle: 'Why this matters',
      whyText: 'Intelligence emerges from ongoing interaction with dynamic contexts, not from executing predetermined plans. For designers, this means creating systems that remain open, adaptive, and responsive\u2014shaping intelligence through interaction rather than instruction.',
      whyPosition: 'outside',
    },
    {
      number: '03', title: 'Embodiment',
      description: 'Thinking does not reside solely in the brain\u2014it unfolds through movement, rhythm, and our engagement with space and tools. Cognition is embodied: it happens as we gesture, coordinate, and attune to the world around us. We design agentic systems that recognize these sensorimotor dimensions of thought\u2014systems that seek to pick up on subtle cues of motion, rhythm, and spatial context to collaborate more intuitively with humans. Our current work explores agents capable of perceiving and responding to these embodied signals in real time, bridging the gap between mind, body, and machine.',
      keyConcepts: ['Gesture and physical movement recognition.', 'Rhythm and temporal patterns in interaction.', 'Spatial layout and environmental awareness.', 'Real-time sensorimotor feedback loops.'],
      frameworkTitle: 'How the Body Shapes Thinking: An Embodied Cognition Model',
      frameworkDescription: 'Thinking happens through the body\u2014agents can respond to physical, spatial, and temporal cues.',
      frameworkImages: ['/images/research/embodiment-diagram.svg'],
      frameworkDarkImages: ['/images/research/embodiment-diagram-dark.svg'],
      frameworkImageAlts: ['Embodied Cognition Model'],
      whyTitle: 'Why this matters',
      whyText: 'Cognition extends beyond the brain into physical gestures, spatial arrangements, and temporal rhythms of interaction. When designing agents that interact with users in the real world, we must consider how these embodied and environmental dynamics shape meaning, attention, and action\u2014ensuring that agents respond not just to words, but to movement, rhythm, and context as part of the cognitive process itself.',
      whyPosition: 'outside',
      useCases: [
        { tag: 'Research', title: 'Beyond Visual and Auditory Interaction: Investigating Tactile Perception', description: 'TMEET is a research initiative aiming to develop a framework for embodied digital communication.', author: 'Sarah Chen', date: 'March 1, 2026', readTime: '5 min read' },
      ],
    },
  ],
  bannerItems: [],
  sdk: sdkFallback,
};

function mapCognitivePage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackCognitive.hero,
    heroImage: s.hero?.image?.url || fallbackCognitive.heroImage,
    heroDarkImage: fallbackCognitive.heroDarkImage,
    theoreticalTitle: s.theoreticalTitle || fallbackCognitive.theoreticalTitle,
    theoreticalDescription: s.theoreticalDescription || fallbackCognitive.theoreticalDescription,
    steps: fallbackCognitive.steps,
    bannerItems: s.bannerItems ? splitNewlines(s.bannerItems) : fallbackCognitive.bannerItems,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/cognitive-frameworks', async (_req, res) => {
  const strapiData = await fetchStrapi(`cognitive-frameworks-page?${deepPopulate(['hero', 'sdk', 'seo'])}`);
  const pageData = mapCognitivePage(strapiData) || fallbackCognitive;

  res.render('cognitive-frameworks', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Cognitive Frameworks',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   SOCIETAL IMPACT
   ────────────────────────────────────────────────────────── */
const fallbackSocietal = {
  hero: { title: 'Societal Impact', description: "Agentic systems have profound ripple effects: they influence how we work, what knowledge is accessible, how power is distributed, and how we make decisions at scale. That's why we treat societal impact as a design responsibility, not a byproduct. We ask not just What works? but:" },
  heroImage: '/images/research/societal-impact/hero.png',
  heroDarkImage: '/images/research/societal-impact/hero-dark.png',
  heroListItems: ['Who does this serve?', 'Who might it exclude or harm?', 'What are the long-term consequences of deploying this system at scale?'],
  frameworkTitle: 'A Framework for Responsible Agent Design',
  frameworkDescription: 'To support teams building agentic systems, we developed a practical, five-part framework\u2014adaptable across roles, from UX designers to backend engineers.',
  steps: [
    { label: 'Contextual Inquiry', title: 'Design Begins with Understanding', image: '/images/research/societal-impact/contextual-inquiry.png', darkImage: '/images/research/societal-impact/contextual-inquiry-dark.png', imageAlt: 'Design Begins with Understanding', bullets: ['Map the full socio-technical system: who are the stakeholders, what are the workflows, where does agency shift?', 'Identify power dynamics: What decisions is the AI making or influencing? Who has override authority?', 'Conduct interviews, not just with users, but with those impacted by system outcomes (e.g., moderators, QA testers, policy teams).'], templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
    { label: 'Intentional Scope', title: 'What Should This Agent Do', image: '/images/research/societal-impact/intentional-scope.png', darkImage: '/images/research/societal-impact/intentional-scope-dark.png', imageAlt: 'What Should This Agent Do', bullets: ['Define clear boundaries: Where should the agent intervene, suggest, defer, or stay silent?', 'Prioritize augmentation over automation: Ask how the agent can make users more capable, not redundant.'], templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
    { label: 'Inclusive Cognitive Design', title: 'Respect Diverse Ways of Thinking & Working', image: '/images/research/societal-impact/inclusive-design.png', darkImage: '/images/research/societal-impact/inclusive-design-dark.png', imageAlt: 'Respect Diverse Ways of Thinking & Working', bullets: ['Design for neurodiversity and multilingualism.', 'Support different expertise levels\u2014novices, experts, non-coders, etc.', 'Minimize cognitive overload: surface what\u2019s necessary, when it\u2019s needed.'], templateLabel: 'Cognitive Load Audit', templateLink: '/research/cognitive-load-audit' },
    { label: 'Foresight & Feedback Loops', title: 'Built for Change. Expect the Unexpected', image: '/images/research/societal-impact/foresight.png', darkImage: '/images/research/societal-impact/foresight-dark.png', imageAlt: 'Built for Change. Expect the Unexpected', bullets: ['Use speculative scenarios to anticipate unintended consequences.', 'Include continuous user feedback mechanisms (not just surveys\u2014embedded nudges, annotations, corrections).'], templateLabel: 'Foresight Canvas', templateLink: '/research/foresight-canvas' },
  ],
  sdk: sdkFallback,
};

function mapSocietalPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackSocietal.hero,
    heroImage: s.hero?.image?.url || fallbackSocietal.heroImage,
    heroDarkImage: fallbackSocietal.heroDarkImage,
    heroListItems: s.heroListItems ? splitNewlines(s.heroListItems) : fallbackSocietal.heroListItems,
    frameworkTitle: s.frameworkTitle || fallbackSocietal.frameworkTitle,
    frameworkDescription: s.frameworkDescription || fallbackSocietal.frameworkDescription,
    steps: (s.steps && s.steps.length) ? s.steps.map((st, idx) => ({
      label: st.label,
      title: st.title,
      image: st.image?.url || (fallbackSocietal.steps[idx]?.image || ''),
      darkImage: fallbackSocietal.steps[idx]?.darkImage || null,
      imageAlt: st.imageAlt || st.title,
      bullets: st.bullets ? splitNewlines(st.bullets) : (fallbackSocietal.steps[idx]?.bullets || []),
      templateLabel: st.templateLabel || (fallbackSocietal.steps[idx]?.templateLabel || ''),
      templateLink: st.templateLink || (fallbackSocietal.steps[idx]?.templateLink || '#'),
    })) : fallbackSocietal.steps,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/societal-impact', async (_req, res) => {
  const strapiData = await fetchStrapi(`societal-impact-page?${deepPopulate(['hero', 'steps', 'sdk', 'seo'])}`);
  const pageData = mapSocietalPage(strapiData) || fallbackSocietal;

  res.render('societal-impact', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Societal Impact',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   SECURITY & PRIVACY
   ────────────────────────────────────────────────────────── */
const fallbackSecurity = {
  hero: { title: 'Security & Privacy', description: 'We\u2019re building the future of secure, autonomous multi-agent systems. As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.' },
  heroImage: '/images/research/security-privacy/hero.png',
  heroDarkImage: '/images/research/security-privacy/hero-dark.png',
  secureSystemsTitle: 'Building Secure Systems',
  secureCards: [
    { title: 'Enabling Safe Innovation', description: 'Strong security and privacy foundations support confident experimentation with autonomous agents while maintaining safety and trust.' },
    { title: 'Scaling Systems Responsibly', description: 'Adaptive protections keep pace with growing agent capabilities and increasingly complex environments.' },
    { title: 'Strengthening Trust', description: 'Clear safeguards and transparent data boundaries build confidence among users, developers, and stakeholders.' },
    { title: 'Supporting Global Interoperability', description: 'Unified, flexible frameworks help agent systems operate consistently across diverse regulatory and cultural contexts.' },
  ],
  keyQuestionsTitle: 'Key Questions',
  keyQuestions: [
    'How do we design security systems that adapt as agents become more autonomous and capable?',
    'What privacy guarantees can we provide when agents require rich contextual information to function effectively?',
    'What privacy guarantees can we provide when agents require rich contextual information to function effectively?',
    'How do traditional security models need to evolve for systems that reason, plan, and act independently?',
  ],
  researchApproachTitle: 'Research Approach',
  researchApproachDescription: 'Our research focuses on defining how autonomous agents can operate safely and responsibly as they take on more decision-making and contextual reasoning. We examine two foundational dimensions \u2014 security and privacy \u2014 to develop adaptive models that evolve alongside increasing agent capability.',
  researchItems: [
    { title: 'Adaptive Security for Autonomous Agents', description: 'The environments agents operate in are dynamic and unpredictable, calling for security models that can respond with similar agility. We focus on creating mechanisms that adapt to context, behavioral signals, and evolving system states.', exploreBullets: ['Dynamic policies that shift based on context and risk signals.', 'Behavioral guardrails that set clear boundaries for safe operation.', 'Continuous monitoring that flags anomalies and triggers fallback actions.'], image: '/images/research/security-privacy/adaptive-security.png', darkImage: '/images/research/security-privacy/adaptive-security-dark.png', imageAlt: 'Adaptive Security for Autonomous Agents' },
    { title: 'Privacy-Preserving Context for Intelligent Agents', description: 'Agents work with a wide range of context\u2014identity signals, system state, historical patterns, and environmental cues\u2014to operate effectively. Ensuring this context is handled in a safe, responsible, and transparent way is essential for building systems that remain both capable and trustworthy.', exploreBullets: ['Scoped access that provides only the context needed for each task.', 'Privacy techniques that protect data while keeping agents functional.', 'Clear data boundaries that show what is used, how, and why.'], image: '/images/research/security-privacy/privacy-context.png', darkImage: '/images/research/security-privacy/privacy-context-dark.png', imageAlt: 'Privacy-Preserving Context for Intelligent Agents' },
  ],
  useCases: [
    { title: 'Self Automation of Routine Tasks', description: 'Agents autonomously handle repetitive workflows while maintaining secure access boundaries and audit trails.', tags: ['Automation', 'Security'] },
    { title: 'Risk Analysis & Agentic Decisions', description: 'Multi-agent systems that assess risk factors collaboratively while preserving data isolation between organizational boundaries.', tags: ['Risk', 'Multi-Agent'] },
    { title: 'Adaptive Risk Detection', description: 'Agents that evolve their threat detection capabilities over time using privacy-preserving learning techniques.', tags: ['Detection', 'Privacy'] },
  ],
  sdk: sdkFallback,
};

function mapSecurityPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackSecurity.hero,
    heroImage: s.hero?.image?.url || fallbackSecurity.heroImage,
    heroDarkImage: fallbackSecurity.heroDarkImage,
    secureSystemsTitle: s.secureSystemsTitle || fallbackSecurity.secureSystemsTitle,
    secureCards: (s.secureCards && s.secureCards.length) ? s.secureCards.map((c) => ({ title: c.title, description: c.description })) : fallbackSecurity.secureCards,
    keyQuestionsTitle: s.keyQuestionsTitle || fallbackSecurity.keyQuestionsTitle,
    keyQuestions: s.keyQuestions ? splitNewlines(s.keyQuestions) : fallbackSecurity.keyQuestions,
    researchApproachTitle: s.researchApproachTitle || fallbackSecurity.researchApproachTitle,
    researchApproachDescription: s.researchApproachDescription || fallbackSecurity.researchApproachDescription,
    researchItems: (s.researchItems && s.researchItems.length) ? s.researchItems.map((ri, idx) => ({
      title: ri.title,
      description: ri.description,
      exploreBullets: ri.exploreBullets ? splitNewlines(ri.exploreBullets) : (fallbackSecurity.researchItems[idx]?.exploreBullets || []),
      image: ri.image?.url || (fallbackSecurity.researchItems[idx]?.image || ''),
      darkImage: fallbackSecurity.researchItems[idx]?.darkImage || null,
      imageAlt: ri.imageAlt || ri.title,
    })) : fallbackSecurity.researchItems,
    useCases: (s.useCases && s.useCases.length) ? s.useCases.map((uc, idx) => ({
      title: uc.title,
      description: uc.description,
      tags: (uc.tags && uc.tags.length) ? uc.tags.map((t) => t.label || t) : (fallbackSecurity.useCases[idx]?.tags || []),
    })) : fallbackSecurity.useCases,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/security-privacy', async (_req, res) => {
  const strapiData = await fetchStrapi(`security-privacy-page?${deepPopulate(['hero', 'secureCards', 'researchItems', 'useCases', 'sdk', 'seo'])}`);
  const pageData = mapSecurityPage(strapiData) || fallbackSecurity;

  res.render('security-privacy', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Security & Privacy',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   AGENT IMPACT MAP
   ────────────────────────────────────────────────────────── */
const fallbackImpactMap = {
  hero: { title: 'Agent Impact Map', description: "Mapping the agent's complete socio-technical context, from stakeholders and decision-making roles to intentional boundaries, to ensure a responsible design from day one." },
  heroImage: '/images/research/agent-impact-map/hero.png',
  heroDarkImage: '/images/research/agent-impact-map/hero-dark.png',
  templateTitle: 'Agent Impact Map',
  templateSubtitle: 'A mapping of the full socio-technical system of agent interactions to better understand the implications on user workflows.',
  instructions: [
    'Identify all human and non-human actors involved in the agent ecosystem (users, agents, databases, data sources, organizational stakeholders).',
    'Map the interactions, data flows, and dependencies between these actors across the full workflow.',
    'Highlight friction points, risks, and unintended consequences that may emerge within the system.',
  ],
  methodology: 'This methodology uses socio-technical systems mapping to analyze how human, organizational, and technical components interact across an agent-supported workflow. Designers begin by identifying all relevant actors, data flows, and contextual constraints, then visualize their interdependencies to reveal how agent behaviors shape user actions and decision points. Through these mappings, friction points, risks, and opportunities are surfaced, allowing designers to understand the broader implications of agent integration. The resulting richer priorities and shared foundation for making informed design decisions and aligning emerging agent technologies with real user needs and operational realities.',
  diagram: '/images/research/agent-impact-map/chart.svg',
  diagramDark: '/images/research/agent-impact-map/chart-dark.svg',
  sdk: sdkFallback,
};

function mapImpactMapPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackImpactMap.hero,
    heroImage: s.hero?.image?.url || fallbackImpactMap.heroImage,
    heroDarkImage: fallbackImpactMap.heroDarkImage,
    templateTitle: s.templateTitle || fallbackImpactMap.templateTitle,
    templateSubtitle: s.templateSubtitle || fallbackImpactMap.templateSubtitle,
    instructions: s.instructions ? splitNewlines(s.instructions.replace(/<[^>]+>/g, '')) : fallbackImpactMap.instructions,
    methodology: s.methodology ? s.methodology.replace(/<[^>]+>/g, '') : fallbackImpactMap.methodology,
    diagram: s.diagram?.url || fallbackImpactMap.diagram,
    diagramDark: fallbackImpactMap.diagramDark,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/agent-impact-map', async (_req, res) => {
  const strapiData = await fetchStrapi(`agent-impact-map-page?${deepPopulate(['hero', 'sdk', 'seo'])}&populate[diagram]=*`);
  const pageData = mapImpactMapPage(strapiData) || fallbackImpactMap;

  res.render('agent-impact-map', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Agent Impact Map',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   COGNITIVE LOAD AUDIT
   ────────────────────────────────────────────────────────── */
const fallbackCognitiveLoadAudit = {
  hero: { title: 'Cognitive Load Audit', description: "Evaluating the agent\u2019s impact on a user\u2019s mental effort to ensure its design is intuitive, clear, and respects diverse cognitive styles." },
  heroImage: '/images/research/cognitive-load-audit/hero.png',
  heroDarkImage: '/images/research/cognitive-load-audit/hero-dark.png',
  templateTitle: 'Cognitive Load Audit',
  templateSubtitle: 'Auditing the total mental effort (Cognitive Load) your agent demands is paramount to ensure diverse ways of thinking and acting are respected.',
  steps: [
    {
      title: 'First Step: List',
      instructions: [
        'Identify all tasks, decisions, and information a user must process when interacting with the agent.',
        'For each item, list the type (e.g. recall, decision, search) and the context in which it occurs.',
        'Then rate the cognitive effort on a simple scale (e.g. Low, Medium, High).',
        'Plot those on the matrix.',
        'Finally, combine tasks with high load: can we simplify, automate, defer or restructure to reduce the overall mental effort and shift the balance toward more intuitive user performance?',
      ],
      methodology: "This methodology profiles how cognitive load auditing reveals the real cost of the agent\u2019s UX. It helps designers characterize how the agent\u2019s information architecture, conversational patterns, and decision-making demands affect a user\u2019s ability to think clearly, act confidently, and maintain an appropriate level of control. Identifying when, the agent overloads users with choices, context switches, ambiguous cues, or high-frequency interactions leads to a cognitive overhead or low readability of the interface and its ability to support efficient and intuitive user performance.",
      diagram: '/images/research/cognitive-load-audit/step1.svg',
      diagramDark: '/images/research/cognitive-load-audit/step1-dark.svg',
    },
    {
      title: 'Second Step: Plot',
      instructions: [
        'For each item listed in the first step, plot the corresponding data point in the matrix.',
        'Place each item according to whether it is "primary or secondary information" and whether it is "mandatory or optional".',
        'Then rate each one by its importance and impact.',
        'Plot those on the matrix.',
        'Finally, combine tasks with high load: can we simplify, automate, defer or restructure to reduce the overall mental effort and shift the balance toward more intuitive user performance?',
      ],
      methodology: "This step moves from the cognitive load inventory to a strategic prioritization. After cataloging the information the user processes, the matrix maps each item by its nature (primary vs. secondary) and its role in the workflow (mandatory vs. optional). Plotting items into these quadrants lets designers visually identify what is essential to the core experience, what supports efficiency, and what may be safely deferred, hidden, or removed. The goal is to build an information architecture that reduces cognitive friction by surfacing only what matters most at each moment, respecting the user\u2019s limited cognitive bandwidth and ensuring that the agent\u2019s design does not overwhelm but instead supports efficient and intuitive user performance.",
      diagram: '/images/research/cognitive-load-audit/step2.svg',
      diagramDark: '/images/research/cognitive-load-audit/step2-dark.svg',
    },
  ],
  importanceNote: 'How essential the information is in accomplishing task or decision? Impact: how information affects overall user workflows?',
  sdk: sdkFallback,
};

function mapCognitiveLoadAuditPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackCognitiveLoadAudit.hero,
    heroImage: s.hero?.image?.url || fallbackCognitiveLoadAudit.heroImage,
    heroDarkImage: fallbackCognitiveLoadAudit.heroDarkImage,
    templateTitle: s.templateTitle || fallbackCognitiveLoadAudit.templateTitle,
    templateSubtitle: s.templateSubtitle || fallbackCognitiveLoadAudit.templateSubtitle,
    steps: fallbackCognitiveLoadAudit.steps,
    importanceNote: s.importanceNote || fallbackCognitiveLoadAudit.importanceNote,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/cognitive-load-audit', async (_req, res) => {
  const strapiData = await fetchStrapi(`cognitive-load-audit-page?${deepPopulate(['hero', 'sdk', 'seo'])}`);
  const pageData = mapCognitiveLoadAuditPage(strapiData) || fallbackCognitiveLoadAudit;

  res.render('cognitive-load-audit', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 Cognitive Load Audit',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   FORESIGHT CANVAS
   ────────────────────────────────────────────────────────── */
const fallbackForesightCanvas = {
  hero: { title: 'Foresight Canvas', description: "A speculative design process to anticipate the long-term, unintended consequences of our agent. This audit focuses on identifying second-order effects, potential for misuse, and systemic risks." },
  heroImage: '/images/research/foresight-canvas/hero.png',
  heroDarkImage: '/images/research/foresight-canvas/hero-dark.png',
  templateTitle: 'Foresight Canvas',
  templateSubtitle: 'Applying the Foresight & Feedback Loop to your agent helps to stress-test against future scenarios, surface unintended consequences, and ensure long-term viability and trust in an evolving world.',
  steps: [
    {
      title: 'Futures Wheel',
      instructions: [
        'Define the core innovation or capability your agent introduces at the center of the wheel.',
        'Identify first-order consequences: direct, immediate effects on users, workflows, and stakeholders.',
        'Map second-order consequences: ripple effects that emerge from those direct impacts, especially on organizations, markets, and society.',
        'Continue mapping higher-order effects as they branch outward, paying attention to unintended or non-obvious outcomes.',
        'For each consequence, assess whether it is positive, neutral, or negative and consider who is affected.',
        'Highlight areas of uncertainty or risk that require deeper investigation, monitoring, or design intervention.',
      ],
      methodology: "The Futures Wheel is a structured brainstorming tool originally developed by Jerome Glenn. It starts with a central event or change and maps outward in concentric rings of consequences. In the context of agent design, it helps teams move beyond immediate functionality to explore the broader systemic effects of deploying autonomous agents. By systematically tracing cause-and-effect chains, designers can surface hidden risks, anticipate unintended behaviors, and identify opportunities for proactive safeguards. This method is especially valuable in speculative design settings where the goal is to stress-test agent capabilities against plausible future scenarios before they reach production.\n\nResult: A Futures Wheel artifact documenting all orders of consequences related to the agent\u2019s core innovation, usable as a living reference for design decisions, risk assessments, and stakeholder communication.",
      diagram: '/images/research/foresight-canvas/step1.svg',
      diagramDark: '/images/research/foresight-canvas/step1-dark.svg',
    },
    {
      title: 'Futures Types',
      instructions: [
        'Start from the consequences identified in the Futures Wheel.',
        'Classify each scenario into one of four futures types: Positive, Negative, Plausible, or Dystopian.',
        'For each classification, describe the scenario and its implications for users, systems, and society.',
        'Identify design responses: what guardrails, fallback mechanisms, or ethical boundaries can be embedded to steer toward positive futures and mitigate negative ones?',
        'Use the resulting map to prioritize design interventions based on likelihood and severity of impact.',
      ],
      methodology: "The Futures Types framework draws on established futures studies methodology, particularly the work of Jim Dator and Sohail Inayatullah. It categorizes possible futures into archetypes, helping designers move from abstract speculation to actionable design priorities. By placing agent-related scenarios into Positive, Negative, Plausible, and Dystopian quadrants, teams gain a structured way to evaluate not just what could happen, but how desirable or dangerous each outcome might be. This approach bridges the gap between speculative foresight and practical design decisions, ensuring that autonomous systems are built with resilience, accountability, and ethical awareness from the start.\n\nResult: A Futures Types map that classifies agent-related scenarios into four quadrants, providing a clear framework for prioritizing design interventions and embedding safeguards against the most impactful negative outcomes.",
      diagram: '/images/research/foresight-canvas/step2.svg',
      diagramDark: '/images/research/foresight-canvas/step2-dark.svg',
    },
  ],
  sdk: sdkFallback,
};

function mapForesightCanvasPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackForesightCanvas.hero,
    heroImage: s.hero?.image?.url || fallbackForesightCanvas.heroImage,
    heroDarkImage: fallbackForesightCanvas.heroDarkImage,
    templateTitle: s.templateTitle || fallbackForesightCanvas.templateTitle,
    templateSubtitle: s.templateSubtitle || fallbackForesightCanvas.templateSubtitle,
    steps: fallbackForesightCanvas.steps,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/research/foresight-canvas', async (_req, res) => {
  const strapiData = await fetchStrapi(`foresight-canvas-page?${deepPopulate(['hero', 'sdk', 'seo'])}`);
  const pageData = mapForesightCanvasPage(strapiData) || fallbackForesightCanvas;

  res.render('foresight-canvas', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 Foresight Canvas',
    pageData,
  });
});

/* ──────────────────────────────────────────────────────────
   BLOG
   ────────────────────────────────────────────────────────── */
function mapBlogHub(strapiPosts) {
  if (!strapiPosts || !strapiPosts.length) return fallbackData.blogHub;
  return strapiPosts.map((item) => ({
    title: item.title,
    description: item.description,
    author: item.author,
    date: item.publishDate
      ? new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'March 1, 2026',
    readTime: item.readTime || '5 min read',
    tags: (item.tags || []).map((t) => t.label),
    coverGradient: 'linear-gradient(135deg, #1a2744 0%, #2d4a7a 100%)',
    href: `/blog/${item.slug}`,
    slug: item.slug,
    content: item.content || null,
  }));
}

app.get('/blog', async (_req, res) => {
  const strapiBlogPosts = await fetchStrapi('blog-posts?populate=*&sort=publishDate:desc');
  const blogPosts = mapBlogHub(strapiBlogPosts);

  const allTags = new Set();
  blogPosts.forEach((p) => (p.tags || []).forEach((t) => allTags.add(t)));

  res.render('blog', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Blog',
    blogPosts,
    categories: allTags.size ? Array.from(allTags) : ['Design Systems', 'UX/UI', 'Best Practices', 'Research', 'AI', 'Innovation', 'Accessibility', 'Design Thinking', 'Workshop', 'Collaboration', 'Development', 'Team', 'Product Design'],
  });
});

const articleData = {
  'building-accessible-interfaces': {
    toc: [
      { id: 'why-accessibility-matters', label: 'Why Accessibility Matters' },
      { id: 'core-principles', label: 'Core Principles of Accessible Design' },
      { id: 'practical-implementation', label: 'Practical Implementation' },
      { id: 'testing', label: 'Testing for Accessibility' },
      { id: 'building-culture', label: 'Building a Culture of Accessibility' },
    ],
    body: `
    <h2 id="why-accessibility-matters">Why Accessibility Matters</h2>
    <p>Accessibility isn't just a legal requirement or a box to check — it's a fundamental aspect of good design. When we build accessible interfaces, we create products that work better for everyone, not just users with disabilities.</p>
    <blockquote><p>"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect." — Tim Berners-Lee</p></blockquote>
    <p>Over one billion people worldwide live with some form of disability. By designing accessible interfaces, we're designing for a significant portion of the global population.</p>
    <h2 id="core-principles">Core Principles of Accessible Design</h2>
    <p>The Web Content Accessibility Guidelines (WCAG) are built around four core principles, often remembered by the acronym POUR:</p>
    <ul>
      <li><strong>Perceivable</strong> — Information and UI components must be presentable in ways all users can perceive.</li>
      <li><strong>Operable</strong> — Users must be able to interact with all controls and navigation.</li>
      <li><strong>Understandable</strong> — Content and the operation of the UI must be understandable.</li>
      <li><strong>Robust</strong> — Content must be robust enough to be interpreted by a wide variety of user agents.</li>
    </ul>
    <h2 id="practical-implementation">Practical Implementation</h2>
    <h3>Semantic HTML First</h3>
    <p>The foundation of accessible interfaces is semantic HTML. Using the correct HTML elements communicates meaning and structure to assistive technologies.</p>
    <h3>Color and Contrast</h3>
    <p>Ensure sufficient color contrast between text and backgrounds. WCAG 2.1 AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.</p>
    <h3>Keyboard Navigation</h3>
    <p>Every interactive element should be reachable and operable via keyboard. Implement visible focus indicators that clearly show which element is currently focused.</p>
    <h3>Screen Reader Compatibility</h3>
    <p>Test your interfaces with actual screen readers (VoiceOver, NVDA, JAWS). Provide descriptive alt text for images and use ARIA labels where visual context is missing.</p>
    <h2 id="testing">Testing for Accessibility</h2>
    <p>Accessibility testing should be integrated into your development workflow:</p>
    <ol>
      <li><strong>Automated scanning</strong> — Use tools like axe, Lighthouse, or WAVE.</li>
      <li><strong>Keyboard testing</strong> — Navigate your entire application using only a keyboard.</li>
      <li><strong>Screen reader testing</strong> — Verify content is announced correctly.</li>
      <li><strong>User testing</strong> — Include people with disabilities in your user research.</li>
    </ol>
    <hr class="article-divider">
    <h2 id="building-culture">Building a Culture of Accessibility</h2>
    <p>At Outshift, we embed accessibility into every stage of the design and development process. When everyone on the team understands and values accessibility, it naturally becomes part of how we build products.</p>
    <p>The journey toward fully accessible interfaces is ongoing, but every improvement matters. Start where you are, use the tools and techniques available, and keep learning.</p>`,
  },
  'future-of-design-systems': {
    toc: [
      { id: 'starting-with-foundations', label: 'Starting with Foundations' },
      { id: 'component-architecture', label: 'Component Architecture' },
      { id: 'scaling-across-teams', label: 'Scaling Across Teams' },
      { id: 'measuring-success', label: 'Measuring Success' },
      { id: 'conclusion', label: 'Conclusion' },
    ],
    body: `
    <p>Building a design system that scales across hundreds of products is no small feat. It requires careful planning, collaboration, and a deep understanding of both design principles and technical implementation. In this article, we share our journey and the lessons we learned along the way.</p>
    <h2 id="starting-with-foundations">Starting with Foundations</h2>
    <p>We began by establishing core design principles that would guide every decision. These principles needed to be flexible enough to accommodate diverse product needs while maintaining a consistent brand identity. We focused on creating a token-based system for colors, typography, spacing, and other fundamental design elements.</p>
    <h2 id="component-architecture">Component Architecture</h2>
    <p>Our component library was built with reusability and composability in mind. Each component was designed to be atomic, meaning it could stand alone or be combined with other components to create more complex interfaces. We established clear naming conventions and documentation standards to ensure the system remained accessible to all team members.</p>
    <h2 id="scaling-across-teams">Scaling Across Teams</h2>
    <p>As the design system grew, we implemented governance processes to maintain quality and consistency. We created a core team responsible for the system's evolution, while empowering product teams to contribute improvements and new components. Regular design system office hours and a dedicated Slack channel fostered community and collaboration.</p>
    <h2 id="measuring-success">Measuring Success</h2>
    <p>We track key metrics to understand the design system's impact: adoption rates across products, time saved in design and development, and consistency scores across our product portfolio. These metrics help us prioritize improvements and demonstrate value to stakeholders.</p>
    <hr class="article-divider">
    <h2 id="conclusion">Conclusion</h2>
    <p>Building a design system is an ongoing journey, not a destination. As our products evolve and new technologies emerge, our design system must evolve with them. The key is maintaining a balance between consistency and flexibility, always keeping the end user experience at the center of every decision.</p>`,
  },
  'user-research-age-of-ai': {
    toc: [
      { id: 'ai-powered-research', label: 'AI-Powered Research Methods' },
      { id: 'ethical-considerations', label: 'Ethical Considerations' },
      { id: 'practical-applications', label: 'Practical Applications' },
    ],
    body: `
    <h2 id="ai-powered-research">AI-Powered Research Methods</h2>
    <p>Artificial intelligence is opening new frontiers in user research. From automated sentiment analysis to predictive behavior modeling, AI tools are enabling researchers to process larger datasets and uncover patterns that would be impossible to detect manually.</p>
    <h2 id="ethical-considerations">Ethical Considerations</h2>
    <p>With great power comes great responsibility. AI-driven research must be conducted ethically, with proper consent, transparency about data usage, and safeguards against bias in algorithmic analysis.</p>
    <h2 id="practical-applications">Practical Applications</h2>
    <p>Teams are already using AI to automate transcription and coding of interviews, generate synthetic personas from large datasets, and predict user behavior patterns. These tools augment rather than replace human researchers.</p>`,
  },
  'design-thinking-workshop': {
    toc: [
      { id: 'workshop-design', label: 'Workshop Design and Facilitation' },
      { id: 'lessons-from-field', label: 'Lessons from the Field' },
      { id: 'remote-strategies', label: 'Remote Workshop Strategies' },
    ],
    body: `
    <h2 id="workshop-design">Workshop Design and Facilitation</h2>
    <p>Effective design thinking workshops require careful preparation, skilled facilitation, and a deep understanding of group dynamics. The best workshops create safe spaces for divergent thinking while maintaining focus on actionable outcomes.</p>
    <h2 id="lessons-from-field">Lessons from the Field</h2>
    <p>After facilitating dozens of workshops across industries, several key patterns emerge: diverse teams produce better outcomes, time constraints drive creativity, and follow-through is more important than the workshop itself.</p>
    <h2 id="remote-strategies">Remote Workshop Strategies</h2>
    <p>The shift to remote work has transformed workshop facilitation. Digital whiteboards, breakout rooms, and asynchronous exercises have become essential tools for distributed design thinking.</p>`,
  },
  'modern-web-development': {
    toc: [
      { id: 'design-development-gap', label: 'The Design-Development Gap' },
      { id: 'collaborative-workflows', label: 'Collaborative Workflows' },
      { id: 'looking-forward', label: 'Looking Forward' },
    ],
    body: `
    <h2 id="design-development-gap">The Design-Development Gap</h2>
    <p>Despite decades of progress, a significant gap remains between design intent and development implementation. Bridging this gap requires shared tools, shared language, and shared understanding of constraints and possibilities.</p>
    <h2 id="collaborative-workflows">Collaborative Workflows</h2>
    <p>Modern teams are finding success with design tokens, component-driven development, and shared design-development environments that allow real-time collaboration across disciplines.</p>
    <h2 id="looking-forward">Looking Forward</h2>
    <p>The future of web development lies in closer integration between design and code. Tools that allow designers to create production-ready components and developers to contribute to design systems are blurring the boundaries between disciplines.</p>`,
  },
  'cross-functional-collaboration': {
    toc: [
      { id: 'breaking-down-silos', label: 'Breaking Down Silos' },
      { id: 'communication-frameworks', label: 'Communication Frameworks' },
      { id: 'measuring-impact', label: 'Measuring Collaboration Impact' },
    ],
    body: `
    <h2 id="breaking-down-silos">Breaking Down Silos</h2>
    <p>The most innovative products emerge from teams that transcend traditional organizational boundaries. Cross-functional collaboration brings together diverse perspectives — design, engineering, product, research — to solve complex problems more effectively.</p>
    <h2 id="communication-frameworks">Communication Frameworks</h2>
    <p>Effective collaboration requires intentional communication structures. Regular sync meetings, shared documentation, and transparent decision-making processes help maintain alignment across functions.</p>
    <h2 id="measuring-impact">Measuring Collaboration Impact</h2>
    <p>Teams that invest in collaboration see measurable improvements in product quality, development velocity, and team satisfaction. The key is creating an environment where every voice is heard and valued.</p>`,
  },
};

app.get('/blog/:slug', async (req, res) => {
  const slug = req.params.slug;

  const strapiBlogPosts = await fetchStrapi('blog-posts?populate=*&sort=publishDate:desc');
  const allPosts = mapBlogHub(strapiBlogPosts);

  const strapiPost = strapiBlogPosts
    ? strapiBlogPosts.find((p) => p.slug === slug)
    : null;

  let post;
  let body;
  let toc;

  if (strapiPost) {
    post = allPosts.find((p) => p.slug === slug);
    body = strapiPost.content || (articleData[slug] ? articleData[slug].body : '<p>Article content coming soon.</p>');
    toc = articleData[slug] ? articleData[slug].toc : [];
  } else {
    post = fallbackData.blogHub.find(
      (p) => (p.href || '').replace(/^\/blog[#/]?/, '') === slug
    );
    const data = articleData[slug] || { toc: [], body: '<p>Article content coming soon.</p>' };
    body = data.body;
    toc = data.toc;
  }

  if (!post) {
    return res.status(404).render('blog', {
      title: 'Outshift Design',
      year: new Date().getFullYear(),
      nav: fallbackData.nav,
      pageTitle: 'Outshift Design — Blog',
      blogPosts: allPosts.length ? allPosts : fallbackData.blogHub,
      categories: ['Design Systems', 'UX/UI', 'Best Practices', 'Research', 'AI', 'Innovation', 'Accessibility', 'Design Thinking', 'Workshop', 'Collaboration', 'Development', 'Team', 'Product Design'],
    });
  }

  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && (p.href || '').replace(/^\/blog[#/]?/, '') !== slug)
    .slice(0, 2);

  res.render('blog-article', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: `${post.title} — Outshift Design`,
    post: { ...post, body, toc },
    relatedPosts,
  });
});

/* ──────────────────────────────────────────────────────────
   STYLEGUIDE & COMPONENTS
   ────────────────────────────────────────────────────────── */
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
  { displayName: 'HaxPage', kind: 'singleType', pluralName: 'hax-page', description: 'The Human-Agent Experience page \u2014 hero, patterns, research block, and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'heroVideo', type: 'string', required: false },
    { name: 'patternsTitle', type: 'string', required: false },
    { name: 'patternsDescription', type: 'text', required: false },
    { name: 'patterns', type: 'component[]', required: false, component: 'shared.pattern-panel' },
    { name: 'researchTitle', type: 'string', required: false },
    { name: 'researchDescription', type: 'text', required: false },
    { name: 'researchLink', type: 'component', required: false, component: 'shared.arrow-link' },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
  ]},
  { displayName: 'FoundationalPrinciplesPage', kind: 'singleType', pluralName: 'foundational-principles-page', description: 'Foundational Principles \u2014 pipeline steps, case studies, and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'pipelineTitle', type: 'string', required: false },
    { name: 'pipelineSubtitle', type: 'text', required: false },
    { name: 'steps', type: 'component[]', required: false, component: 'shared.pipeline-step' },
    { name: 'caseStudies', type: 'component[]', required: false, component: 'shared.case-study-card' },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
  ]},
  { displayName: 'CognitiveFrameworksPage', kind: 'singleType', pluralName: 'cognitive-frameworks-page', description: 'Cognitive Frameworks \u2014 theoretical foundations, banner items, and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'theoreticalTitle', type: 'string', required: false },
    { name: 'theoreticalDescription', type: 'text', required: false },
    { name: 'body', type: 'richtext', required: false },
    { name: 'bannerItems', type: 'text', required: false },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
  ]},
  { displayName: 'SocietalImpactPage', kind: 'singleType', pluralName: 'societal-impact-page', description: 'Societal Impact \u2014 framework steps and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'heroListItems', type: 'text', required: false },
    { name: 'frameworkTitle', type: 'string', required: false },
    { name: 'frameworkDescription', type: 'text', required: false },
    { name: 'steps', type: 'component[]', required: false, component: 'shared.responsible-step' },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
  ]},
  { displayName: 'SecurityPrivacyPage', kind: 'singleType', pluralName: 'security-privacy-page', description: 'Security & Privacy \u2014 secure system cards, research approach, use cases, and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'secureSystemsTitle', type: 'string', required: false },
    { name: 'secureCards', type: 'component[]', required: false, component: 'shared.simple-card' },
    { name: 'keyQuestions', type: 'text', required: false },
    { name: 'researchApproachTitle', type: 'string', required: false },
    { name: 'researchItems', type: 'component[]', required: false, component: 'shared.research-approach-item' },
    { name: 'useCases', type: 'component[]', required: false, component: 'shared.use-case-entry' },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
  ]},
  { displayName: 'AgentImpactMapPage', kind: 'singleType', pluralName: 'agent-impact-map-page', description: 'Agent Impact Map \u2014 template section, diagram, and SDK CTA.', fields: [
    { name: 'hero', type: 'component', required: true, component: 'shared.hero-block' },
    { name: 'templateTitle', type: 'string', required: false },
    { name: 'templateSubtitle', type: 'text', required: false },
    { name: 'instructions', type: 'richtext', required: false },
    { name: 'methodology', type: 'richtext', required: false },
    { name: 'diagram', type: 'media', required: false },
    { name: 'sdk', type: 'component', required: false, component: 'shared.cta-block' },
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
