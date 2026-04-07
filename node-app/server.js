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
      { label: 'The Human-Agent Experience', href: '/hax' },
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
    { label: 'Blog', href: '/blog', hasDropdown: false },
  ],
  initiatives: [
    {
      title: 'Designing for the Internet of Agents',
      description: 'Hax: The Framework Guiding Human-Agent Collaboration',
      badge: 'SDK',
      video: '/videos/agents.mp4',
      reversed: false,
      href: '/hax',
    },
    {
      title: 'Internet of Cognition',
      description: 'Enabling agents and humans to scale intelligence collectively.',
      badge: 'AI/ML',
      video: '/videos/cognition.mp4',
      reversed: true,
      href: 'https://outshift.cisco.com/internet-of-cognition/explore',
      external: true,
    },
  ],
  researchCards: [
    {
      title: 'Hax',
      description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
      image: '/images/hax-research.png',
      tags: ['AI Research', 'Design Framework', 'Ethics'],
      href: '/research',
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
  blogHub: [
    { title: 'The Future of Design Systems: Scalability and Consistency', description: 'Exploring how modern design systems are evolving to meet the demands of large-scale enterprise applications while maintaining flexibility and innovation.', author: 'Jaime Holland', date: 'March 1, 2026', readTime: '5 min read', tags: ['Design Systems', 'UX/UI'], coverGradient: 'linear-gradient(135deg, #0a3d5c 0%, #1a6e5c 100%)', href: '/blog/future-of-design-systems' },
    { title: 'User Research in the Age of AI: New Methodologies', description: 'How artificial intelligence is transforming user research practices and enabling deeper insights into user behavior and preferences.', author: 'Monserrat Gonzalez Gacel', date: 'March 1, 2026', readTime: '8 min read', tags: ['Research', 'AI'], coverGradient: 'linear-gradient(135deg, #1a2744 0%, #2d4a7a 100%)', href: '/blog/user-research-age-of-ai' },
    { title: 'Building Accessible Interfaces: A Practical Guide', description: 'Practical tips and techniques for creating web applications that are accessible to all users, regardless of their abilities or disabilities.', author: 'Valentina Esposito', date: 'March 1, 2026', readTime: '8 min read', tags: ['UX/UI', 'Accessibility'], coverGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)', href: '/blog/building-accessible-interfaces' },
    { title: 'Design Thinking Workshop: Lessons from the Field', description: 'Key takeaways and insights from facilitating design thinking workshops across diverse teams and industries.', author: 'Marc Sotelli', date: 'March 1, 2026', readTime: '5 min read', tags: ['Design Thinking', 'Workshop'], coverGradient: 'linear-gradient(135deg, #8b3a62 0%, #c94b4b 100%)', href: '/blog/design-thinking-workshop' },
    { title: 'Modern Web Development: Bridging Design and Code', description: 'Understanding how designers and developers can collaborate more effectively to create seamless digital experiences.', author: 'Krystelle Gonzalez', date: 'March 1, 2026', readTime: '7 min read', tags: ['Development', 'Collaboration'], coverGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', href: '/blog/modern-web-development' },
    { title: 'The Power of Cross-Functional Collaboration', description: 'How effective team collaboration leads to better product outcomes and a more cohesive user experience.', author: 'Serin Kuth', date: 'March 1, 2026', readTime: '5 min read', tags: ['Collaboration', 'Team'], coverGradient: 'linear-gradient(135deg, #1a5276 0%, #2ecc71 100%)', href: '/blog/cross-functional-collaboration' },
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
      href: item.link?.url || '#',
      external: item.link?.isExternal || false,
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
      href: item.link?.url || null,
      external: item.link?.isExternal || false,
      comingSoon: false,
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

function mapNav() {
  return fallbackData.nav;
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
    nav: mapNav(),
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
    buttonUrl: 'https://vaesposito.github.io/outshift-design/sdk.html#introduction',
    image: '/images/research/sdk-hero.png',
  },
  items: [
    { title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.', image: '/images/research/foundational-principles.png', href: '/research/foundational-principles' },
    { title: 'Cognitive Frameworks', description: 'Our research relies on and develops theoretical models that explain how humans and AI agents process information and make decisions together. We explore cognitive load, mental models, and collaborative reasoning to create frameworks that inform better system design.', image: '/images/research/cognitive-framework.png' },
    { title: 'Societal Impact', description: "Agentic systems reshape how we work, access knowledge, and distribute power. Because these systems fundamentally alter society, impact is a design responsibility, not an afterthought. We must look beyond 'what works' to ask: Who does this serve? Who is excluded? What are the long term consequences of scaling?", image: '/images/research/societal-impact.png' },
    { title: 'Security & Privacy', description: 'As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.', image: '/images/research/security-privacy.png' },
    { title: 'Agent Impact Map', description: "Mapping the agent's complete socio-technical context, from stakeholders and decision-making roles to intentional boundaries, to ensure a responsible design from day one.", image: '/images/research/agent-impact.png' },
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
  const strapiPage = await fetchStrapi('research-page?populate=*');
  const page = mapResearchPage(strapiPage) || {};

  res.render('research', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Research Behind Hax',
    researchItems: fallbackResearch.items,
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

app.get('/hax', (_req, res) => {
  res.render('hax', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 The Human-Agent Experience',
  });
});

app.get('/blog', (_req, res) => {
  res.render('blog', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design — Blog',
    blogPosts: fallbackData.blogHub,
    categories: ['Design Systems', 'UX/UI', 'Best Practices', 'Research', 'AI', 'Innovation', 'Accessibility', 'Design Thinking', 'Workshop', 'Collaboration', 'Development', 'Team', 'Product Design'],
  });
});

const articleBodies = {
  'building-accessible-interfaces': `
    <h2>Why Accessibility Matters</h2>
    <p>Accessibility isn't just a legal requirement or a box to check — it's a fundamental aspect of good design. When we build accessible interfaces, we create products that work better for everyone, not just users with disabilities. Curb cuts, originally designed for wheelchair users, benefit parents with strollers, delivery workers, and cyclists alike. The same principle applies to digital accessibility.</p>
    <blockquote><p>"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect." — Tim Berners-Lee</p></blockquote>
    <p>Over one billion people worldwide live with some form of disability. By designing accessible interfaces, we're not serving a niche audience — we're designing for a significant portion of the global population. Moreover, accessible design often leads to cleaner code, better SEO, and improved usability for all users.</p>
    <h2>Core Principles of Accessible Design</h2>
    <p>The Web Content Accessibility Guidelines (WCAG) are built around four core principles, often remembered by the acronym POUR:</p>
    <ul>
      <li><strong>Perceivable</strong> — Information and UI components must be presentable in ways all users can perceive.</li>
      <li><strong>Operable</strong> — Users must be able to interact with all controls and navigation.</li>
      <li><strong>Understandable</strong> — Content and the operation of the UI must be understandable.</li>
      <li><strong>Robust</strong> — Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.</li>
    </ul>
    <h2>Practical Implementation</h2>
    <h3>Semantic HTML First</h3>
    <p>The foundation of accessible interfaces is semantic HTML. Using the correct HTML elements communicates meaning and structure to assistive technologies.</p>
    <h3>Color and Contrast</h3>
    <p>Ensure sufficient color contrast between text and backgrounds. WCAG 2.1 AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Never rely on color alone to convey information.</p>
    <h3>Keyboard Navigation</h3>
    <p>Every interactive element should be reachable and operable via keyboard. Implement visible focus indicators that clearly show which element is currently focused.</p>
    <h3>Screen Reader Compatibility</h3>
    <p>Test your interfaces with actual screen readers (VoiceOver, NVDA, JAWS). Provide descriptive alt text for images, use ARIA labels where visual context is missing, and ensure dynamic content changes are announced.</p>
    <h2>Testing for Accessibility</h2>
    <p>Accessibility testing should be integrated into your development workflow, not treated as an afterthought:</p>
    <ol>
      <li><strong>Automated scanning</strong> — Use tools like axe, Lighthouse, or WAVE to catch common issues early.</li>
      <li><strong>Keyboard testing</strong> — Navigate your entire application using only a keyboard.</li>
      <li><strong>Screen reader testing</strong> — Test with at least one screen reader to verify content is announced correctly.</li>
      <li><strong>User testing</strong> — Include people with disabilities in your user research.</li>
    </ol>
    <h2>Building a Culture of Accessibility</h2>
    <p>At Outshift, we've found that the most effective approach is to embed accessibility into every stage of the design and development process, rather than treating it as a separate workstream. When everyone on the team understands and values accessibility, it naturally becomes part of how we build products.</p>
    <p>The journey toward fully accessible interfaces is ongoing, but every improvement matters. Start where you are, use the tools and techniques available, and keep learning. Your users will thank you.</p>`,
  'future-of-design-systems': `
    <h2>The Evolution of Design Systems</h2>
    <p>Design systems have transformed from simple style guides into complex, living ecosystems that power entire product suites. As organizations scale, the challenge of maintaining consistency while enabling innovation becomes increasingly critical.</p>
    <h2>Scalability Challenges</h2>
    <p>When a design system serves hundreds of products and thousands of developers, traditional approaches break down. Token-based architecture, component composition patterns, and automated testing become essential tools for managing complexity at scale.</p>
    <h2>The Future</h2>
    <p>AI-assisted design, dynamic theming, and cross-platform component libraries are reshaping what's possible. The next generation of design systems will be more adaptive, more intelligent, and more deeply integrated into the development workflow.</p>`,
  'user-research-age-of-ai': `
    <h2>AI-Powered Research Methods</h2>
    <p>Artificial intelligence is opening new frontiers in user research. From automated sentiment analysis to predictive behavior modeling, AI tools are enabling researchers to process larger datasets and uncover patterns that would be impossible to detect manually.</p>
    <h2>Ethical Considerations</h2>
    <p>With great power comes great responsibility. AI-driven research must be conducted ethically, with proper consent, transparency about data usage, and safeguards against bias in algorithmic analysis.</p>
    <h2>Practical Applications</h2>
    <p>Teams are already using AI to automate transcription and coding of interviews, generate synthetic personas from large datasets, and predict user behavior patterns. These tools augment rather than replace human researchers.</p>`,
  'design-thinking-workshop': `
    <h2>Workshop Design and Facilitation</h2>
    <p>Effective design thinking workshops require careful preparation, skilled facilitation, and a deep understanding of group dynamics. The best workshops create safe spaces for divergent thinking while maintaining focus on actionable outcomes.</p>
    <h2>Lessons from the Field</h2>
    <p>After facilitating dozens of workshops across industries, several key patterns emerge: diverse teams produce better outcomes, time constraints drive creativity, and follow-through is more important than the workshop itself.</p>
    <h2>Remote Workshop Strategies</h2>
    <p>The shift to remote work has transformed workshop facilitation. Digital whiteboards, breakout rooms, and asynchronous exercises have become essential tools for distributed design thinking.</p>`,
  'modern-web-development': `
    <h2>The Design-Development Gap</h2>
    <p>Despite decades of progress, a significant gap remains between design intent and development implementation. Bridging this gap requires shared tools, shared language, and shared understanding of constraints and possibilities.</p>
    <h2>Collaborative Workflows</h2>
    <p>Modern teams are finding success with design tokens, component-driven development, and shared design-development environments that allow real-time collaboration across disciplines.</p>
    <h2>Looking Forward</h2>
    <p>The future of web development lies in closer integration between design and code. Tools that allow designers to create production-ready components and developers to contribute to design systems are blurring the boundaries between disciplines.</p>`,
  'cross-functional-collaboration': `
    <h2>Breaking Down Silos</h2>
    <p>The most innovative products emerge from teams that transcend traditional organizational boundaries. Cross-functional collaboration brings together diverse perspectives — design, engineering, product, research — to solve complex problems more effectively.</p>
    <h2>Communication Frameworks</h2>
    <p>Effective collaboration requires intentional communication structures. Regular sync meetings, shared documentation, and transparent decision-making processes help maintain alignment across functions.</p>
    <h2>Measuring Collaboration Impact</h2>
    <p>Teams that invest in collaboration see measurable improvements in product quality, development velocity, and team satisfaction. The key is creating an environment where every voice is heard and valued.</p>`,
};

app.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug;
  const post = fallbackData.blogHub.find(
    (p) => (p.href || '').replace(/^\/blog[#/]?/, '') === slug
  );
  if (!post) {
    return res.status(404).render('blog', {
      title: 'Outshift Design',
      year: new Date().getFullYear(),
      nav: fallbackData.nav,
      pageTitle: 'Outshift Design — Blog',
      blogPosts: fallbackData.blogHub,
      categories: ['Design Systems', 'UX/UI', 'Best Practices', 'Research', 'AI', 'Innovation', 'Accessibility', 'Design Thinking', 'Workshop', 'Collaboration', 'Development', 'Team', 'Product Design'],
    });
  }
  res.render('blog-article', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: `${post.title} — Outshift Design`,
    post: { ...post, body: articleBodies[slug] || '<p>Article content coming soon.</p>' },
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
