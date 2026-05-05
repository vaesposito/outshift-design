import type { Core } from '@strapi/strapi';
import panelData from './seed-hax-patterns';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedContent(strapi);
    await seedPages(strapi);
    await fixPageContent(strapi);
    await updateHaxPatterns(strapi);
  },
};

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const apis = [
    'initiative',
    'research-card',
    'blog-post',
    'homepage',
    'research-page',
    'hax-page',
    'foundational-principles-page',
    'cognitive-frameworks-page',
    'societal-impact-page',
    'security-privacy-page',
    'agent-impact-map-page',
  ];
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
    title: 'HAX, The Human-Agent Experience',
    description: 'Designing for the Internet of Agents',
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
    media: { mediaType: 'image', altText: 'The Outshift Design Research Laboratory' },
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

const sdkBlock = {
  title: 'Build with the Hax SDK',
  description: 'The HAX SDK gives developers everything they need to integrate agents into their apps, without losing clarity, structure, or control. Use structured schemas, prebuilt components, and clear boundaries to keep agent behavior collaborative and predictable.',
  buttonLabel: 'Explore the SDK',
  buttonUrl: 'https://vaesposito.github.io/outshift-design/sdk.html#introduction',
};

async function seedPages(strapi: Core.Strapi) {
  const haxExists = await strapi.documents('api::hax-page.hax-page' as any).findFirst({});
  if (haxExists) return;

  strapi.log.info('Seeding page content...');

  // ── Hax Page ──
  await createAndPublish(strapi, 'api::hax-page.hax-page', {
    hero: {
      title: 'The Human-Agent Experience',
      description: "We're moving beyond assistants and copilots. Today's agents act with greater autonomy, coordinate across systems, and collaborate with humans in more nuanced ways. Designing for this shift requires new patterns of interaction and trust.",
    },
    heroVideo: '/videos/hax-hero.mp4',
    patternsTitle: 'Human-Centered AI Patterns',
    patternsDescription: 'These 5 guiding principles emerged from studying how people interact with agentic systems. Using these patterns is the foundation for building trustworthy AI experiences that prioritize human control and agency.',
    patterns: panelData.map(({ key, title, subtitle, description, whatItMeans, whyItMatters, relatedPatterns, howToImplement, commonPitfalls }) => ({
      key,
      title,
      subtitle,
      description,
      whatItMeans,
      whyItMatters,
      relatedPatterns,
      howToImplement,
      commonPitfalls,
    })),
    researchTitle: 'The Outshift Design Research Laboratory',
    researchDescription: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
    researchLink: { label: 'Explore the Research', url: '/research', isExternal: false },
    sdk: sdkBlock,
  });

  // ── Security & Privacy Page ──
  await createAndPublish(strapi, 'api::security-privacy-page.security-privacy-page', {
    hero: {
      title: 'Security & Privacy',
      description: 'We\u2019re building the future of secure, autonomous multi-agent systems. As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.',
    },
    secureSystemsTitle: 'Building Secure Systems',
    secureCards: [
      { title: 'Enabling Safe Innovation', description: 'Strong security and privacy foundations support confident experimentation with autonomous agents while maintaining safety and trust.' },
      { title: 'Scaling Systems Responsibly', description: 'Adaptive protections keep pace with growing agent capabilities and increasingly complex environments.' },
      { title: 'Strengthening Trust', description: 'Clear safeguards and transparent data boundaries build confidence among users, developers, and stakeholders.' },
      { title: 'Supporting Global Interoperability', description: 'Unified, flexible frameworks help agent systems operate consistently across diverse regulatory and cultural contexts.' },
    ],
    keyQuestionsTitle: 'Key Questions',
    keyQuestions: 'How do we design security systems that adapt as agents become more autonomous and capable?\nWhat privacy guarantees can we provide when agents require rich contextual information to function effectively?\nWhat privacy guarantees can we provide when agents require rich contextual information to function effectively?\nHow do traditional security models need to evolve for systems that reason, plan, and act independently?',
    researchApproachTitle: 'Research Approach',
    researchApproachDescription: 'Our research focuses on defining how autonomous agents can operate safely and responsibly as they take on more decision-making and contextual reasoning. We examine two foundational dimensions \u2014 security and privacy \u2014 to develop adaptive models that evolve alongside increasing agent capability.',
    researchItems: [
      { title: 'Adaptive Security for Autonomous Agents', description: 'The environments agents operate in are dynamic and unpredictable, calling for security models that can respond with similar agility. We focus on creating mechanisms that adapt to context, behavioral signals, and evolving system states.', exploreBullets: 'Dynamic policies that shift based on context and risk signals.\nBehavioral guardrails that set clear boundaries for safe operation.\nContinuous monitoring that flags anomalies and triggers fallback actions.', imageAlt: 'Adaptive Security for Autonomous Agents' },
      { title: 'Privacy-Preserving Context for Intelligent Agents', description: 'Agents work with a wide range of context\u2014identity signals, system state, historical patterns, and environmental cues\u2014to operate effectively. Ensuring this context is handled in a safe, responsible, and transparent way is essential for building systems that remain both capable and trustworthy.', exploreBullets: 'Scoped access that provides only the context needed for each task.\nPrivacy techniques that protect data while keeping agents functional.\nClear data boundaries that show what is used, how, and why.', imageAlt: 'Privacy-Preserving Context for Intelligent Agents' },
    ],
    useCases: [
      { title: 'Self Automation of Routine Tasks', description: 'Agents autonomously handle repetitive workflows while maintaining secure access boundaries and audit trails.', tags: [{ label: 'Automation' }, { label: 'Security' }] },
      { title: 'Risk Analysis & Agentic Decisions', description: 'Multi-agent systems that assess risk factors collaboratively while preserving data isolation between organizational boundaries.', tags: [{ label: 'Risk' }, { label: 'Multi-Agent' }] },
      { title: 'Adaptive Risk Detection', description: 'Agents that evolve their threat detection capabilities over time using privacy-preserving learning techniques.', tags: [{ label: 'Detection' }, { label: 'Privacy' }] },
    ],
    sdk: sdkBlock,
  });

  // ── Agent Impact Map Page ──
  await createAndPublish(strapi, 'api::agent-impact-map-page.agent-impact-map-page', {
    hero: {
      title: 'Agent Impact Map',
      description: "Mapping the agent's complete socio-technical context, from stakeholders and decision-making roles to intentional boundaries, to ensure a responsible design from day one.",
    },
    templateTitle: 'Agent Impact Map',
    templateSubtitle: 'A mapping of the full socio-technical system of agent interactions to better understand the implications on user workflows.',
    instructions: '1. Identify all human and non-human actors involved in the agent ecosystem (users, agents, databases, data sources, organizational stakeholders).\n2. Map the interactions, data flows, and dependencies between these actors across the full workflow.\n3. Highlight friction points, risks, and unintended consequences that may emerge within the system.',
    methodology: 'This methodology uses socio-technical systems mapping to analyze how human, organizational, and technical components interact across an agent-supported workflow. Designers begin by identifying all relevant actors, data flows, and contextual constraints, then visualize their interdependencies to reveal how agent behaviors shape user actions and decision points. Through these mappings, friction points, risks, and opportunities are surfaced, allowing designers to understand the broader implications of agent integration. The resulting richer priorities and shared foundation for making informed design decisions and aligning emerging agent technologies with real user needs and operational realities.',
    sdk: sdkBlock,
  });

  // ── Societal Impact Page ──
  await createAndPublish(strapi, 'api::societal-impact-page.societal-impact-page', {
    hero: {
      title: 'Societal Impact',
      description: "Agentic systems have profound ripple effects: they influence how we work, what knowledge is accessible, how power is distributed, and how we make decisions at scale. That's why we treat societal impact as a design responsibility, not a byproduct. We ask not just What works? but:",
    },
    heroListItems: 'Who does this serve?\nWho might it exclude or harm?\nWhat are the long-term consequences of deploying this system at scale?',
    frameworkTitle: 'A Framework for Responsible Agent Design',
    frameworkDescription: 'To support teams building agentic systems, we developed a practical, five-part framework\u2014adaptable across roles, from UX designers to backend engineers.',
    steps: [
      { label: 'Contextual Inquiry', title: 'Design Begins with Understanding', imageAlt: 'Design Begins with Understanding', bullets: 'Map the full socio-technical system: who are the stakeholders, what are the workflows, where does agency shift?\nIdentify power dynamics: What decisions is the AI making or influencing? Who has override authority?\nConduct interviews, not just with users, but with those impacted by system outcomes (e.g., moderators, QA testers, policy teams).', templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
      { label: 'Intentional Scope', title: 'What Should This Agent Do', imageAlt: 'What Should This Agent Do', bullets: 'Define clear boundaries: Where should the agent intervene, suggest, defer, or stay silent?\nPrioritize augmentation over automation: Ask how the agent can make users more capable, not redundant.', templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
      { label: 'Inclusive Cognitive Design', title: 'Respect Diverse Ways of Thinking & Working', imageAlt: 'Respect Diverse Ways of Thinking & Working', bullets: 'Design for neurodiversity and multilingualism.\nSupport different expertise levels\u2014novices, experts, non-coders, etc.\nMinimize cognitive overload: surface what\u2019s necessary, when it\u2019s needed.', templateLabel: 'Cognitive Load Audit' },
      { label: 'Foresight & Feedback Loops', title: 'Built for Change. Expect the Unexpected', imageAlt: 'Built for Change. Expect the Unexpected', bullets: 'Use speculative scenarios to anticipate unintended consequences.\nInclude continuous user feedback mechanisms (not just surveys\u2014embedded nudges, annotations, corrections).', templateLabel: 'Foresight Canvas' },
    ],
    sdk: sdkBlock,
  });

  // ── Cognitive Frameworks Page ──
  await createAndPublish(strapi, 'api::cognitive-frameworks-page.cognitive-frameworks-page', {
    hero: {
      title: 'Cognitive Frameworks',
      description: 'Physical and cognitive designs are key to understanding how people and AI systems share understanding, adapt to situations, and act meaningfully together. Grounded in embodied cognition, distributed cognition, and situated action, our research bridges theory and design to shape interactions that are intuitive, contextual, and genuinely collaborative.',
    },
    theoreticalTitle: 'Theoretical Foundations',
    theoreticalDescription: 'Grounding HAX design in established cognitive science',
    bannerItems: 'Situated Interaction\nAuxiliary interactions\nInvestigating Tactile Components',
    sdk: sdkBlock,
  });

  // ── Foundational Principles Page ──
  await createAndPublish(strapi, 'api::foundational-principles-page.foundational-principles-page', {
    hero: {
      title: 'Foundational Principles',
      description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high-level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.',
    },
    pipelineTitle: 'Research to Design Pipeline',
    pipelineSubtitle: 'A collaborative design process that transforms raw research into practical design guidance and reusable patterns.',
    steps: [
      { stepNumber: '01', title: 'Framing the inquiry', subtitle: 'Research Framing', description: 'Define the phenomenon that you want to explore, not the feature or product.', quote: '"How might X change the way people Y in a world where Z is true?"\n"How do operators build trust in agent decisions during incident response?"', bullets: 'Capture context: who, where, when, stakes.\nDefine time horizon (e.g. 5, 10, 20, years)', deliverables: 'Research brief (scope, goals, assumptions)\nA short intent statement: "This inquiry explores... in order to inform design decisions about... in tomorrow\'s world."' },
      { stepNumber: '02', title: 'Research: Mapping the Present & Emerging Signals', subtitle: 'Field input / Ground truth', description: "Build a grounded understanding of what's already happening and what's starting to happen.", bullets: 'Desk research: academic papers, industry reports, patents, standards, policy, expert interviews.\nForesight inputs: horizon scanning, weak signals, trends, wildcards, tensions', deliverables: 'Evidence map: Current practices & pain points, Emerging technologies / norms\nInsight clusters: 5-8 thematic clusters' },
      { stepNumber: '03', title: 'Synthesis: From Signals to Principles', subtitle: 'Conceptual modeling', description: 'Transform raw findings into conceptual frameworks and actionable design principles.', bullets: 'Identify recurring tensions and design trade-offs\nDraft principle statements grounded in evidence\nMap principles to interaction patterns and heuristics', deliverables: 'Principle cards with rationale, applicability, and known limitations\nPattern mapping matrix (principle > pattern > component)' },
      { stepNumber: '04', title: 'Test the Bridge: Design Heuristics & applicable methods', subtitle: 'Validation', description: 'Validate each pattern through heuristic evaluation, usability testing, and expert review.', bullets: 'Heuristic walkthroughs against real agent workflows\nExpert panel review with domain specialists\nGap analysis: does the pattern address the original insight?', deliverables: 'Evaluation report with findings and recommendations\nRefined patterns with annotated revisions' },
      { stepNumber: '05', title: 'Prototype & Iterate the validation', subtitle: 'Implementation testing', description: 'Patterns are implemented in interactive prototypes and tested with real users.', bullets: 'Build interactive prototypes embodying the pattern\nRun usability sessions with target users\nIterate on both design and documentation', deliverables: 'Validated prototype with test findings\nFinal pattern specification ready for documentation' },
      { stepNumber: '06', title: 'Update Documentation & Contribute', subtitle: 'Publication', description: 'Validated patterns are published to the Hax pattern library with full documentation, code examples, and usage guidelines.', bullets: 'Write pattern documentation with rationale and examples\nPublish to the Hax pattern library\nTag with relevant themes for discoverability', deliverables: 'Published pattern with code samples and usage guidelines\nChangelog entry and contribution record' },
    ],
    caseStudiesTitle: 'Case Studies',
    caseStudiesDescription: 'Real-world applications of our foundational principles in enterprise and research contexts.',
    caseStudies: [
      { title: 'Agent Transparency in Change Impact Assessment, Verification and Testing', description: 'Building transparent AI systems that assess infrastructure changes, verify modifications, conduct automated testing, and manage approval workflows \u2014 all while maintaining clear visibility into agent decision-making and human oversight.', problem: 'Infrastructure changes carry high risk, but manual impact assessment, testing, and approval processes create bottlenecks.', tags: [{ label: 'Infrastructure' }, { label: 'Change management' }], principles: 'Traceability\nControl\nClarity' },
      { title: 'Designing for AI Transparency in Enterprise Agentic Composites', description: 'When multiple agents collaborate within a composite system, understanding who did what \u2014 and why \u2014 becomes critical.', problem: 'Multi-agent systems create opaque decision chains where audit trails, decision attribution, and user-facing explanations must maintain clarity.', tags: [{ label: 'Multi-Agent' }, { label: 'Enterprise' }], principles: 'Transparency\nExplainability\nAudit' },
      { title: 'Multi-Agent Cascades: Guardrails for Chain Reactions', description: 'When agents trigger other agents, cascading effects can quickly move beyond human oversight.', problem: 'Cascading agent actions can amplify errors, create unintended consequences, and move beyond human oversight.', tags: [{ label: 'Cascades' }, { label: 'Safety' }], principles: 'Human-in-the-Loop\nGuardrails\nControl' },
    ],
    sdk: sdkBlock,
  });

  strapi.log.info('Page seed data created successfully.');
}

async function fixPageContent(strapi: Core.Strapi) {
  const sp = await strapi.documents('api::security-privacy-page.security-privacy-page' as any).findFirst({
    populate: { hero: true },
  });

  if (!sp) return;

  const correctKeyQuestions = 'How do we design security systems that adapt as agents become more autonomous and capable?\nWhat privacy guarantees can we provide when agents require rich contextual information to function effectively?\nWhat privacy guarantees can we provide when agents require rich contextual information to function effectively?\nHow do traditional security models need to evolve for systems that reason, plan, and act independently?';

  const needsHeroFix = sp.hero && sp.hero.title !== 'Security & Privacy';
  const needsKqFix = sp.keyQuestions !== correctKeyQuestions;

  if (needsHeroFix || needsKqFix) {
    strapi.log.info('Fixing Security & Privacy page content...');
    const updateData: any = {};
    if (needsHeroFix) {
      updateData.hero = {
        title: 'Security & Privacy',
        description: 'We\u2019re building the future of secure, autonomous multi-agent systems. As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.',
      };
    }
    if (needsKqFix) {
      updateData.keyQuestions = correctKeyQuestions;
    }
    await strapi.documents('api::security-privacy-page.security-privacy-page' as any).update({
      documentId: sp.documentId,
      data: updateData,
      status: 'published',
    });
    strapi.log.info('Security & Privacy page content fixed.');
  }
}

async function updateHaxPatterns(strapi: Core.Strapi) {
  const haxPage = await strapi.documents('api::hax-page.hax-page' as any).findFirst({
    populate: { patterns: { populate: ['relatedPatterns', 'commonPitfalls'] } },
  });

  if (!haxPage) return;

  // Check if patterns already have the correct rich fields.
  // Verify the first control-pattern uses the correct subnavId ('control-scope' = 'Scope & Boundaries').
  const firstPattern = haxPage.patterns?.[0];
  const firstRelated = firstPattern?.relatedPatterns?.[0];
  const alreadyCorrect =
    firstPattern?.subtitle &&
    firstRelated?.subnavId === 'control-scope' &&
    firstRelated?.name === 'Scope & Boundaries';
  if (alreadyCorrect) {
    strapi.log.info('Hax page patterns already up to date, skipping.');
    return;
  }

  strapi.log.info('Updating Hax page patterns with rich content...');

  const updatedPatterns = panelData.map(({ key, title, subtitle, description, whatItMeans, whyItMatters, relatedPatterns, howToImplement, commonPitfalls }) => ({
    key,
    title,
    subtitle,
    description,
    whatItMeans,
    whyItMatters,
    relatedPatterns,
    howToImplement,
    commonPitfalls,
  }));

  await strapi.documents('api::hax-page.hax-page' as any).update({
    documentId: haxPage.documentId,
    data: { patterns: updatedPatterns },
    status: 'published',
  });

  strapi.log.info('Hax page patterns updated successfully.');
}
