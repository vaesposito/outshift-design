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
      { group: 'The Human-Agent Experience', groupHref: '/hax', items: [] },
      { label: 'Internet of Cognition', href: 'https://outshift.cisco.com/internet-of-cognition/explore', external: true },
    ]},
    // { label: 'About us', href: '/#about', hasDropdown: true },
    { label: 'Research', href: '/research', hasDropdown: true, hubDropdown: true, children: [
      { label: 'Foundational Principles', href: '/research/foundational-principles' },
      { label: 'Cognitive Frameworks', href: '/research/cognitive-frameworks' },
      { group: 'Societal Impact', groupHref: '/research/societal-impact', items: [
        { label: 'Agent Impact Map', href: '/research/agent-impact-map' },
        { label: 'Cognitive Load Audit', href: '/research/cognitive-load-audit' },
        { label: 'Foresight Canvas', href: '/research/foresight-canvas' },
      ]},
      { label: 'Security & Privacy', href: '/research/security-privacy' },
    ]},
    { label: 'Blog', href: '/blog', hasDropdown: false },
  ],
  initiatives: [
    { title: 'HAX, The Human-Agent Experience', description: 'Designing for the Internet of Agents', badge: 'SDK', video: '/videos/agents.mp4', darkVideo: '/videos/agents-dark.mp4', reversed: false, href: '/hax', docHref: '/sdk#introduction', docLabel: 'Explore the SDK', docExternal: true, textCtaLabel: 'Learn about HAX', textCtaHref: '/hax' },
    { title: 'Internet of Cognition', description: 'Enabling agents and humans to scale intelligence collectively.', badge: 'AI/ML', video: '/videos/cognition.mp4', darkVideo: '/videos/cognition-2.mp4', reversed: true, href: 'https://outshift.cisco.com/internet-of-cognition/explore', external: true, docHref: 'https://outshift.cisco.com/internet-of-cognition/explore', docLabel: 'Learn about IoC', docExternal: true },
  ],
  researchCards: [
    { title: 'Outshift research', description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.', image: '/images/hax-research.png', darkImage: '/images/hax-research-dark.png', tags: ['AI Research', 'Design Framework', 'Ethics'], href: '/research' },
  ],
  blogPosts: [
    { title: 'Navigating the Multi-Agent Future', description: 'Expert perspectives on human–agent interaction and key findings from leading industry and academic voices.', author: 'Outshift by Cisco', date: 'April 2026', readTime: 'Whitepaper', href: 'https://outshift-headless-cms-s3.s3.us-east-2.amazonaws.com/Navigating_The_Multi-Agent_Future.pdf', external: true },
    { title: 'The Strategic Role of Design in Shaping Ethical AI Systems', description: 'How interface design becomes the primary control layer for responsible human–AI interaction.', author: 'Outshift by Cisco', date: 'May 2026', readTime: 'Whitepaper', href: '/files/ai-ethics-and-design.pdf', external: true },
  ],
  blogHub: [
    { title: 'Navigating the Multi-Agent Future: Expert Perspectives on Human-Agent Interaction', description: 'The shifting landscape of work and interaction. This report presents key findings and actionable insights drawn from leading industry and academic experts on the future of human agent interaction.', author: 'Outshift by Cisco', date: 'April 2026', readTime: 'Whitepaper', tags: ['Research', 'AI', 'Product Design'], coverImage: '/images/blog/navigating-multi-agent-future.png', href: 'https://outshift-headless-cms-s3.s3.us-east-2.amazonaws.com/Navigating_The_Multi-Agent_Future.pdf', external: true },
    { title: 'The Strategic Role of Design in Shaping Ethical AI Systems', description: 'As AI systems evolve toward agentic and autonomous architectures, ethics can no longer be governed purely through policy and model training. This report explores how interface design becomes the primary control layer for responsible human–AI interaction.', author: 'Outshift by Cisco', date: 'May 2026', readTime: 'Whitepaper', tags: ['Research', 'AI Ethics', 'Product Design'], coverImage: '/images/blog/ai-ethics-cover.png', href: '/files/ai-ethics-and-design.pdf', external: true },
    { title: 'Designing for Uncertainty: Patterns for Human-AI Trust', description: 'How design teams can build trust into AI-powered products by making uncertainty visible, controllable, and recoverable — a practical guide for product designers.', author: 'Outshift Design Team', date: 'Coming soon', readTime: 'Article', tags: ['Design', 'UX/UI'], coverGradient: 'linear-gradient(135deg, #1a2744 0%, #2d4a7a 100%)', href: '#' },
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
        docExternal: fb.docExternal || false,
        textCtaLabel: fb.textCtaLabel || null,
        textCtaHref: fb.textCtaHref || null,
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
  items: [
    { key: 'foundational-principles', title: 'Foundational Principles', description: 'We build foundational design principles and frameworks for AI-human interaction. Our research lab translates high level insights into practical patterns and solutions that prioritize user control, clarity, and effective collaboration between humans and AI agents.', image: '/images/research/foundational-principles.png', darkImage: '/images/research/foundational-principles-dark.png', href: '/research/foundational-principles' },
    { key: 'cognitive-frameworks', title: 'Cognitive Frameworks', description: 'Our research relies on and develops theoretical models that explain how humans and AI agents process information and make decisions together. We explore cognitive load, mental models, and collaborative reasoning to create frameworks that inform better system design.', image: '/images/research/cognitive-framework.png', darkImage: '/images/research/cognitive-framework-dark.png', href: '/research/cognitive-frameworks' },
    { key: 'societal-impact', title: 'Societal Impact', description: "Agentic systems reshape how we work, access knowledge, and distribute power. Because these systems fundamentally alter society, impact is a design responsibility, not an afterthought. We must look beyond 'what works' to ask: Who does this serve? Who is excluded? What are the long term consequences of scaling?", image: '/images/research/societal-impact.png', darkImage: '/images/research/societal-impact-dark.png', href: '/research/societal-impact' },
    { key: 'security-privacy', title: 'Security & Privacy', description: 'As AI agents grow more capable and autonomous, they open the door to new ways of working and building. This progress also gives us a chance to evolve our security and privacy models to support safer, more resilient agent ecosystems.', image: '/images/research/security-privacy.png', darkImage: '/images/research/security-privacy-dark.png', href: '/research/security-privacy' },
  ],
};

function mapResearchPage(strapiData) {
  if (!strapiData) return null;
  return {
    hero: strapiData.hero ? { title: strapiData.hero.title, description: strapiData.hero.description, image: strapiData.hero.image?.url || fallbackResearch.hero.image, darkImage: fallbackResearch.hero.darkImage } : null,
    sectionHeader: strapiData.sectionHeader ? { title: strapiData.sectionHeader.title, subtitle: strapiData.sectionHeader.subtitle } : null,
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
  });
});

/* ──────────────────────────────────────────────────────────
   HAX PAGE
   ────────────────────────────────────────────────────────── */
const fallbackHaxPatterns = [
  {
    key: 'control', title: 'Control',
    subtitle: 'Keep humans informed and in charge — always',
    description: 'Give users clear ways to guide, pause, or override the agent at any point.',
    whatItMeans: 'Control means users can intervene, redirect, or stop agent behavior at any stage. It\'s not about micromanaging every step — it\'s about having accessible, meaningful levers when they matter.',
    whyItMatters: 'When users feel in control, they trust the system enough to let it do more. Without it, even helpful agents feel risky or unpredictable. Control creates the psychological safety that makes agentic systems usable.',
    relatedPatterns: [
      { subnavId: 'control-scope', name: 'Scope & Boundaries', description: 'Users define operational limits for AI behavior. The agent operates within these boundaries, avoiding unintended actions.', componentLabel: 'Interaction example: Instruction / Scope', callouts: [{ num: 1, title: 'Instruction mode', desc: 'Users define interaction boundaries by selecting input modes, guiding the agent to operate safely within intended, user-controlled scopes.' }, { num: 2, title: 'Task specific boundaries', desc: 'Specific checkboxes define what the AI is allowed to change and what it must avoid. These help define clear behavioral constraints.' }] },
      { subnavId: 'control-authority', name: 'Customization of Autonomy', description: 'Users control the spectrum of autonomy, from passive suggestions to full automation based on their comfort and context.', componentLabel: 'Interaction example: Authority Sliders', callouts: [{ num: 1, title: 'Autonomy level is visible', desc: 'The current mode is displayed clearly so users always know how much independent action the agent is allowed to take.' }, { num: 2, title: 'Users can set context-specific controls', desc: 'Different autonomy settings can be applied to different task types.' }] },
      { subnavId: 'control-pgates', name: 'Permission & Confirmation Gates', description: 'Explicit checkpoints require human approval before proceeding. Safeguards critical operations through shared decision-making.', componentLabel: 'Interaction example: Kill switch and preview modes', callouts: [{ num: 1, title: 'Immediate agent shutdown', desc: 'A prominent "Disable Agent" toggle gives users a fast, irreversible way to halt all agent activity.' }, { num: 2, title: 'Visible control settings', desc: 'The system shows settings upfront allowing the user to assess whether to make decisions based on risks and live situations.' }] },
    ],
    howToImplement: ['Include reasoning explanations alongside every recommendation or decision', 'Make explanations accessible through plain language and visual aids', 'Use progressive disclosure to offer both quick summaries and detailed explanations', 'Show alternative options considered and why they were not chosen', 'Provide clear source citations and links for verification', 'Display confidence levels and uncertainty ranges where relevant'],
    commonPitfalls: [{ title: 'Opaque decision logic', description: 'Users can\'t tell why the agent made a choice' }, { title: 'Over explanation', description: 'Flooding users with too much technical detail and overwhelming them' }],
  },
  {
    key: 'clarity', title: 'Clarity',
    subtitle: 'Make agent reasoning legible and trustworthy',
    description: 'Transparent reasoning helps users understand, verify, and trust agent outputs.',
    whatItMeans: 'Clarity means users can see not just what the agent decided, but why — with enough context to evaluate and act confidently. It reduces cognitive load and prevents blind trust.',
    whyItMatters: 'Without clarity, users either blindly trust outputs or constantly second-guess them. Clear reasoning builds calibrated trust — users engage more effectively and catch errors faster.',
    relatedPatterns: [
      { subnavId: 'clarity-ir', name: 'Inline Rationale', description: 'Agents articulate why they made recommendations. Rationale should be accessible, understandable, and relevant to help users make sense of the thinking.', componentLabel: 'Interaction example: Inline Rationale', callouts: [{ num: 1, title: 'Agent\'s reasoning surfaced', desc: 'The agent labels its own decision logic, making invisible prioritization visible so users can understand, question, or reorder.' }, { num: 2, title: 'Reasoning is accessible, not buried', desc: 'Rationale appears directly within the interface at the point of action.' }, { num: 3, title: 'User can act directly from the rationale view', desc: 'The interface allows users to approve, modify, or reject directly from where rationale is shown.' }] },
      { subnavId: 'clarity-cd', name: 'Confidence & Uncertainty Displays', description: 'Disclosing confidence levels helps users interpret outcomes effectively and calibrate trust appropriately for transparent decision support.', componentLabel: 'Interaction example: Diagnostic Report', callouts: [{ num: 1, title: 'Confidence scores are shown inline', desc: 'Each finding includes a visual confidence bar so users can quickly assess reliability at a glance.' }, { num: 2, title: 'Actionable items are surfaced clearly', desc: 'The interface distinguishes findings that require action from those that are informational.' }, { num: 3, title: 'Uncertainty is visualised, not hidden', desc: 'Low-confidence results are shown with reduced fill and a distinct label.' }, { num: 4, title: 'Context is preserved per finding', desc: 'Each row includes its category and source, giving users the context to act.' }] },
      { subnavId: 'clarity-sa', name: 'Source Attribution', description: 'Revealing where information came from helps users verify and contextualize outputs, supporting accountability and enabling further inquiry.', componentLabel: 'Interaction example: Findings with Sources', callouts: [{ num: 1, title: 'Source labels are visually distinct and clickable', desc: 'The source elements are styled for immediate recognition and likely interactive.' }, { num: 2, title: 'Claims supported by cited references', desc: 'Each recommendation is backed by named sources, allowing users to verify the rationale.' }] },
      { subnavId: 'clarity-at', name: 'Alternatives & Trade-offs', description: 'Showing what the agent didn\'t choose and why helps users understand trade-offs. It creates transparency and supports participatory decision-making.', componentLabel: 'Interaction example: Suggested Actions', callouts: [{ num: 1, title: 'Consequences and benefits are explicit', desc: 'Includes options with a clear summary of what it changes and what the effect will be.' }, { num: 2, title: 'Multiple actions presented side-by-side', desc: 'The interface surfaces more than one possible action instead of a single automated path.' }, { num: 3, title: 'Supports informed trade-off decisions', desc: 'By presenting pros and cons transparently, the system helps users make context-aware decisions.' }, { num: 4, title: 'Labels indicate duration and reversibility', desc: 'Visual tags communicate whether an option is temporary, reversible, or long-term.' }] },
    ],
    howToImplement: ['Include reasoning explanations alongside every recommendation or decision', 'Make explanations accessible through plain language and visual aids', 'Use progressive disclosure to offer both quick summaries and detailed explanations', 'Show alternative options considered and why they were not chosen', 'Provide clear source citations and links for verification', 'Display confidence levels and uncertainty ranges where relevant'],
    commonPitfalls: [{ title: 'Opaque decision logic', description: 'Users can\'t tell why the agent made a choice' }, { title: 'Over explanation', description: 'Flooding users with too much technical detail and overwhelming them' }],
  },
  {
    key: 'recovery', title: 'Recovery',
    subtitle: 'Assume the agent will make mistakes, make them clearly fixable',
    description: 'Agents will make mistakes — what matters is how fixable they are.',
    whatItMeans: 'Recovery means giving users clear, safe ways to undo actions, correct errors, and guide future behavior. It makes systems feel less brittle and more collaborative.',
    whyItMatters: 'Without recovery, even small errors can erode trust and stall progress. Clear ways to fix mistakes turn agent failures into moments of learning for both the system and the person using it.',
    relatedPatterns: [
      { subnavId: 'recovery-undo', name: 'Undo & Redo Support', description: 'This pattern provides a safety net, protecting users from unintended consequences and reinforcing their control.', componentLabel: 'Interaction example: Undo & Redo Support', callouts: [{ num: 1, title: 'Actions are reversible by default', desc: 'The interface includes options like Undo or Revert for each automated change.' }, { num: 2, title: 'Justification for actions builds trust', desc: 'A short, plain-language explanation helps users understand the rationale behind changes.' }, { num: 3, title: 'Multiple levels of recovery available', desc: 'Users can revert or approve individual changes or apply recovery to all actions at once.' }] },
      { subnavId: 'recovery-eo', name: 'Editable Outputs', description: 'Agents should hand off control. Editable outputs ensure humans retain authorship and can correct or improve AI-generated content easily.', componentLabel: 'Interaction example: Editable Outputs', callouts: [{ num: 1, title: 'Human-in-the-loop decision making', desc: 'The interface shows multiple alternatives, but waits for the user to select one.' }, { num: 2, title: 'Language supports co-creation', desc: 'AI\'s phrasing encourages collaboration reinforcing the user as the final authority.' }, { num: 3, title: 'Selected output is not final', desc: 'Once the user picks an option, the system surfaces editable fields instead of applying the change directly.' }] },
      { subnavId: 'recovery-sd', name: 'Safe Defaults', description: 'Defaulting to conservative actions prevents harm and sets user-friendly expectations, particularly in early use or high-risk environments.', componentLabel: 'Interaction example: Safe Defaults', callouts: [{ num: 1, title: 'Builds trust through predictable, gradual control', desc: 'Safe, consistent defaults help users gain confidence and expand control at their own pace.' }, { num: 2, title: 'Activation/Deactivation requires explicit user intent', desc: 'Features that could affect security or behavior are opt-in only.' }] },
      { subnavId: 'recovery-ep', name: 'Escalation Paths', description: 'Agents should never trap users. Providing clear escape routes to human assistance or manual control is vital for safety and trust.', componentLabel: 'Interaction example: Escalation Paths', callouts: [{ num: 1, title: 'Manual input and escalation always available', desc: 'Users can directly provide input or ask their own questions at any time.' }, { num: 2, title: 'Clear option to proceed independently', desc: 'The "Go to terminal" button offers an immediate escape route.' }] },
    ],
    howToImplement: ['Design agents to offer fallback options or manual alternatives instead of total failure', 'Use feedback from failure and recovery experiences to continuously improve system behavior', 'Make recovery options easy to find, context-sensitive, and layered from simple to advanced controls'],
    commonPitfalls: [{ title: 'Failing to learn from recovery events', description: 'Failing to analyze recovery patterns can lead to repeated mistakes' }, { title: 'Lack of granular control', description: 'Using only high-level revision features frustrates users who want to undo specific AI actions' }, { title: 'Inconsistent recovery experiences', description: 'Recovery mechanisms that work differently across the system confuse users' }, { title: 'Unclear recovery guidance', description: 'Vague errors and unclear paths lead to frustration and reduced trust' }],
  },
  {
    key: 'collaboration', title: 'Collaboration',
    subtitle: 'Design for shared effort and mutual input',
    description: 'Design for shared effort and mutual input between humans and AI agents.',
    whatItMeans: 'Autonomous agents should act as capable partners, not just tools waiting for commands. Collaboration means shared context, back-and-forth interaction, and joint ownership of outcomes.',
    whyItMatters: 'Collaboration builds stronger results than automation alone. When people and agents shape outcomes together, users stay engaged and push toward more creative, effective solutions.',
    relatedPatterns: [
      { subnavId: 'collab-mi', name: 'Mixed Initiative', description: 'This pattern fosters adaptive turn-taking between human and agent. It supports fluid collaboration by allowing both to lead based on context.', componentLabel: 'Interaction example: Mixed Initiative', callouts: [{ num: 1, title: 'Agent proactively initiates based on context', desc: 'Allow the agent to proactively detect issues or make suggestions, especially when it has useful context the user may not.' }, { num: 2, title: 'Build on each other\'s contributions', desc: 'Design interactions so the agent can refine its outputs in response to human edits or questions.' }] },
      { subnavId: 'collab-ce', name: 'Co-editing Interfaces', description: 'Shared content and workspace for both AI and humans foster transparency — building clarity and trust.', componentLabel: 'Interaction example: Co-editing Interfaces', callouts: [{ num: 1, title: 'Keep AI suggestions non-intrusive', desc: 'Present changes as proposals, not automatic edits. Let users review, accept, modify, or reject.' }, { num: 2, title: 'Work in shared view', desc: 'Both AI and human should operate on the same content in the same workspace.' }, { num: 3, title: 'User always has final say', desc: 'The human is the editor-in-chief. AI assists, but never publishes or commits changes on its own.' }, { num: 4, title: 'Make editing modalities clear', desc: 'Let users choose how the AI helps — proofreading, rewriting, suggesting changes, etc.' }] },
      { subnavId: 'collab-rc', name: 'Role Clarity & Turn Signals', description: 'Clear handoffs and visible role signals reduce confusion in multi-step tasks. This makes collaboration feel more natural and efficient.', componentLabel: 'Interaction example: Role Clarity & Turn Signals', callouts: [{ num: 1, title: 'Clear stage-based ownership', desc: 'Break workflows into visible stages and indicate who leads each one.' }, { num: 2, title: 'Attribute every action', desc: 'Label actions clearly as system-initiated or human-initiated.' }, { num: 3, title: 'Signal when it\'s the user\'s turn', desc: 'Use prompts, buttons, or callouts to indicate when the system is waiting for user input.' }] },
    ],
    howToImplement: ['Define clear, intuitive ways for control to shift between human and AI', 'Let the AI learn from collaborative successes and adapt its behavior to match individual user styles', 'Maintain a unified workspace that tracks contributions, context, and progress from both human and AI participants', 'Gracefully handle simultaneous edits with merging, version comparison, or deferring to human review when needed'],
    commonPitfalls: [{ title: 'Lack of transparency', description: 'Users don\'t understand how to influence the agent or override agent actions' }, { title: 'Assumed alignment', description: 'The agent acts without confirming intent or context' }, { title: 'Rigid flows', description: 'The system doesn\'t adapt when users try to collaborate or redirect' }, { title: 'Binary choices', description: 'Only offering accept/reject rather than co-create options' }],
  },
  {
    key: 'traceability', title: 'Traceability',
    subtitle: 'Make agent behavior visible, searchable & open to review',
    description: 'Traceability ensures agent decisions can be reviewed, understood, and improved over time.',
    whatItMeans: 'Traceability ensures agent decisions can be reviewed, understood, and improved over time. It makes behavior accountable across sessions, users, and workflows supporting debugging, learning, and workflow improvements.',
    whyItMatters: 'As agents evolve, so do their decisions. Traceability allows teams to track changes, understand outcomes, and stay aligned in multi-user environments. It turns opaque processes into something you can audit, learn from, and improve.',
    relatedPatterns: [
      { subnavId: 'trace-ah', name: 'Action History', description: 'A chronological record of agent behavior supports traceability and builds long-term accountability in agentic systems.', componentLabel: 'Interaction example: Action History', callouts: [{ num: 1, title: 'Make events time-stamped and ordered', desc: 'List all system and human actions in a clear sequence. Timestamps build trust and help reconstruct events during audits.' }, { num: 2, title: 'Include cause and effect where possible', desc: 'Show how one step led to the next. This helps users understand the rationale and logic behind changes.' }, { num: 3, title: 'Capture both automated and manual steps', desc: 'Record not just user input, but also system decisions for a full picture of accountability.' }, { num: 4, title: 'Use clear, plain language', desc: 'Write log entries in simple, readable terms — no code dumps or vague system jargon.' }] },
      { subnavId: 'trace-vd', name: 'Visual Diffing', description: 'Visual comparisons make agent-driven changes easier to audit and validate. This helps detect subtle alterations or unintended consequences.', componentLabel: 'Interaction example: Visual Diffing', callouts: [{ num: 1, title: 'Use side-by-side comparisons', desc: 'Display the original and updated states in parallel columns.' }, { num: 2, title: 'Include the why, not just the what', desc: 'Pair the visual change with a short explanation of the reason or logic behind it.' }, { num: 3, title: 'Highlight what changed', desc: 'Use color or styling to draw attention to fields or values that were modified.' }, { num: 4, title: 'Let the user validate or intervene', desc: 'Offer a clear way to accept, reject, or adjust the change.' }] },
      { subnavId: 'trace-bt', name: 'Behavior Tuning Over Time', description: 'Adaptive agents learn from usage and tune their actions to better suit user preferences. This supports trust, efficiency, and personalization.', componentLabel: 'Interaction example: Behavior Tuning Over Time', callouts: [{ num: 1, title: 'Call out what triggered the change', desc: 'Clearly state the condition or threshold that caused the system to respond differently than before.' }, { num: 2, title: 'Compare past vs. present behavior', desc: 'Provide users a way to see what\'s new vs. what used to happen.' }, { num: 3, title: 'Explain the system\'s current decision logic', desc: 'Let users understand why the system acted in this instance and how it may influence future behavior.' }, { num: 4, title: 'Allow control or rollback', desc: 'Include an option to undo, override, or adjust the system\'s adaptive behavior.' }] },
    ],
    howToImplement: ['Make it easy to trace outputs back to the inputs, prompts, or interactions that influenced them', 'Provide interfaces that let users review, filter, and explore past actions and decisions in a structured, searchable way', 'Record all system and AI actions with timestamps, inputs, outputs, and relevant context to support clear trace trails', 'Ensure the system\'s behavior can be independently reviewed and traced to support transparency'],
    commonPitfalls: [{ title: 'False consistency', description: 'The system behaves differently in similar situations' }, { title: 'No feedback loop', description: 'Users don\'t see whether the action succeeded or failed' }],
  },
];

const fallbackHax = {
  hero: {
    title: 'The Human-Agent Experience',
    description: "We are moving beyond simple assistants. Today's agents act with greater autonomy, coordinate across systems, and collaborate with humans in nuanced ways. To support this shift, our product design team has developed research-backed principles and patterns for creating systems that are transparent, trustworthy, and truly collaborative.",
  },
  heroVideo: '/videos/hax-hero.mp4',
  heroDarkVideo: '/videos/hax-hero-dark.mp4',
  patternsTitle: 'Human-Centered AI Patterns',
  patternsDescription: 'These 5 guiding principles emerged from studying how people interact with agentic systems. Using these patterns is the foundation for building trustworthy AI experiences that prioritize human control and agency.',
  patterns: fallbackHaxPatterns,
  researchTitle: 'The Outshift Design Research Laboratory',
  researchDescription: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
  researchLink: { label: 'Explore the Research', url: '/research', isExternal: false },
  researchImage: '/images/hax-research.png',
  sdk: sdkFallback,
};

function mapHaxPattern(p, fb) {
  return {
    key: p.key || fb.key,
    title: p.title || fb.title,
    subtitle: p.subtitle || fb.subtitle || '',
    description: p.description || fb.description,
    whatItMeans: p.whatItMeans || fb.whatItMeans || '',
    whyItMatters: p.whyItMatters || fb.whyItMatters || '',
    relatedPatterns: (p.relatedPatterns && p.relatedPatterns.length)
      ? p.relatedPatterns.map((rp, ri) => {
          const frp = fb.relatedPatterns?.[ri] || {};
          return {
            subnavId: rp.subnavId || frp.subnavId || '',
            name: rp.name || frp.name || '',
            description: rp.description || frp.description || '',
            componentLabel: rp.componentLabel || frp.componentLabel || '',
            callouts: (rp.callouts && Array.isArray(rp.callouts) && rp.callouts.length)
              ? rp.callouts
              : (frp.callouts || []),
          };
        })
      : (fb.relatedPatterns || []),
    howToImplement: (p.howToImplement && Array.isArray(p.howToImplement) && p.howToImplement.length)
      ? p.howToImplement
      : (fb.howToImplement || []),
    commonPitfalls: (p.commonPitfalls && p.commonPitfalls.length)
      ? p.commonPitfalls.map((c) => ({ title: c.title, description: c.description }))
      : (fb.commonPitfalls || []),
    images: (p.exampleImages && p.exampleImages.length) ? p.exampleImages.map((img) => img.url || img) : (fb.images || []),
    darkImages: (p.exampleDarkImages && p.exampleDarkImages.length) ? p.exampleDarkImages.map((img) => img.url || img) : (fb.darkImages || []),
    alts: (p.exampleImages && p.exampleImages.length) ? p.exampleImages.map((img) => img.alternativeText || img.name || p.title) : (fb.alts || []),
  };
}

function mapHaxPage(s) {
  if (!s) return null;
  return {
    hero: s.hero ? { title: s.hero.title, description: s.hero.description } : fallbackHax.hero,
    heroDescription2: fallbackHax.heroDescription2,
    heroVideo: s.heroVideo || fallbackHax.heroVideo,
    heroDarkVideo: fallbackHax.heroDarkVideo,
    patternsTitle: s.patternsTitle || fallbackHax.patternsTitle,
    patternsDescription: s.patternsDescription || fallbackHax.patternsDescription,
    patterns: (s.patterns && s.patterns.length)
      ? s.patterns.map((p, idx) => mapHaxPattern(p, fallbackHaxPatterns[idx] || {}))
      : fallbackHaxPatterns,
    researchTitle: s.researchTitle || fallbackHax.researchTitle,
    researchDescription: s.researchDescription || fallbackHax.researchDescription,
    researchLink: s.researchLink ? { label: s.researchLink.label, url: s.researchLink.url, isExternal: s.researchLink.isExternal } : fallbackHax.researchLink,
    researchImage: s.researchImage?.url || fallbackHax.researchImage,
    sdk: s.sdk ? { title: s.sdk.title, description: s.sdk.description, buttonLabel: s.sdk.buttonLabel, buttonUrl: s.sdk.buttonUrl, image: s.sdk.image?.url || sdkFallback.image, darkImage: sdkFallback.darkImage } : sdkFallback,
  };
}

app.get('/hax', async (_req, res) => {
  const strapiData = await fetchStrapi(
    'hax-page?populate[hero]=*' +
    '&populate[patterns][populate][relatedPatterns]=*' +
    '&populate[patterns][populate][commonPitfalls]=*' +
    '&populate[patterns][populate][exampleImages]=*' +
    '&populate[patterns][populate][exampleDarkImages]=*' +
    '&populate[researchLink]=*&populate[researchImage]=*' +
    '&populate[sdk][populate]=*&populate[seo]=*'
  );
  const pageData = mapHaxPage(strapiData) || fallbackHax;

  res.render('hax', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 The Human-Agent Experience',
    pageData,
  });
});

app.get('/human-centered-ai-patterns', (_req, res) => {
  res.render('human-centered-ai-patterns', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 Human-Centered AI Patterns',
  });
});

app.get('/guiding-principles', async (_req, res) => {
  const strapiData = await fetchStrapi(`hax-page?${deepPopulate(['hero', 'patterns', 'researchLink', 'sdk', 'seo'])}&populate[researchImage]=*`);
  const pageData = mapHaxPage(strapiData) || fallbackHax;
  res.render('guiding-principles', {
    title: 'Outshift Design',
    year: new Date().getFullYear(),
    nav: fallbackData.nav,
    pageTitle: 'Outshift Design \u2014 Guiding principles',
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
    { slug: 'contextual-inquiry', label: 'Contextual Inquiry', title: 'Design Begins with Understanding', image: '/images/research/societal-impact/contextual-inquiry.png', darkImage: '/images/research/societal-impact/contextual-inquiry-dark.png', imageAlt: 'Design Begins with Understanding', bullets: ['Map the full socio-technical system: who are the stakeholders, what are the workflows, where does agency shift?', 'Identify power dynamics: What decisions is the AI making or influencing? Who has override authority?', 'Conduct interviews, not just with users, but with those impacted by system outcomes (e.g., moderators, QA testers, policy teams).'], templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
    { slug: 'intentional-scope', label: 'Intentional Scope', title: 'What Should This Agent Do', image: '/images/research/societal-impact/intentional-scope.png', darkImage: '/images/research/societal-impact/intentional-scope-dark.png', imageAlt: 'What Should This Agent Do', bullets: ['Define clear boundaries: Where should the agent intervene, suggest, defer, or stay silent?', 'Prioritize augmentation over automation: Ask how the agent can make users more capable, not redundant.'], templateLabel: 'Agent Impact Map', templateLink: '/research/agent-impact-map' },
    { slug: 'inclusive-cognitive-design', label: 'Inclusive Cognitive Design', title: 'Respect Diverse Ways of Thinking & Working', image: '/images/research/societal-impact/inclusive-design.png', darkImage: '/images/research/societal-impact/inclusive-design-dark.png', imageAlt: 'Respect Diverse Ways of Thinking & Working', bullets: ['Design for neurodiversity and multilingualism.', 'Support different expertise levels\u2014novices, experts, non-coders, etc.', 'Minimize cognitive overload: surface what\u2019s necessary, when it\u2019s needed.'], templateLabel: 'Cognitive Load Audit', templateLink: '/research/cognitive-load-audit' },
    { slug: 'foresight-feedback-loops', label: 'Foresight & Feedback Loops', title: 'Built for Change. Expect the Unexpected', image: '/images/research/societal-impact/foresight.png', darkImage: '/images/research/societal-impact/foresight-dark.png', imageAlt: 'Built for Change. Expect the Unexpected', bullets: ['Use speculative scenarios to anticipate unintended consequences.', 'Include continuous user feedback mechanisms (not just surveys\u2014embedded nudges, annotations, corrections).'], templateLabel: 'Foresight Canvas', templateLink: '/research/foresight-canvas' },
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
      slug: st.slug || fallbackSocietal.steps[idx]?.slug || (st.label || '').toString().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
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
    { name: 'docLink', type: 'component', required: false, component: 'shared.arrow-link', description: 'Primary CTA button (e.g. Explore the SDK / Learn about IoC)' },
    { name: 'textCtaLabel', type: 'string', required: false, description: 'Text-only secondary CTA label (e.g. Learn about HAX)' },
    { name: 'textCtaHref', type: 'string', required: false, description: 'URL for the text-only secondary CTA' },
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
