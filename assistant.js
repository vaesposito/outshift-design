/* ── Outshift Design – Site Assistant Widget ── */
(function () {
    'use strict';

    var BASE = 'https://vaesposito.github.io/outshift-design/';
    var GPT_URL = 'https://chatgpt.com/g/g-685c13d481b88191b229715939381141-human-agent-pattern-research';
    var PAGE = (function () {
        var p = window.location.pathname.split('/').pop() || 'index.html';
        return p.replace(/\.html$/, '');
    })();

    /* ── Styles ── */
    var css = `
#oa-btn {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #7c6af7, #3b82f6);
    border: none; cursor: pointer; padding: 0;
    box-shadow: 0 4px 20px rgba(124,106,247,0.45);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s; color: #fff; line-height: 1;
}
#oa-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(124,106,247,0.6); }
#oa-btn svg { width: 26px; height: 26px; display: block; flex-shrink: 0; pointer-events: none; }
#oa-panel {
    position: fixed; bottom: 96px; right: 28px; z-index: 9998;
    width: 380px; max-width: calc(100vw - 40px);
    height: 520px; max-height: calc(100vh - 120px);
    background: var(--color-bg, #fff);
    border: 1px solid var(--color-border, rgba(0,0,0,0.1));
    border-radius: 20px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06);
    display: none; flex-direction: column; overflow: hidden;
    animation: oaPanelIn 0.2s ease;
}
[data-theme="dark"] #oa-panel { background: #1a1f2e; border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
#oa-panel.is-open { display: flex; }
@keyframes oaPanelIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
.oa-header { display:flex; align-items:center; gap:10px; padding:14px 16px 12px; border-bottom:1px solid var(--color-border, rgba(0,0,0,0.08)); flex-shrink:0; }
[data-theme="dark"] .oa-header { border-color:rgba(255,255,255,0.08); }
.oa-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#7c6af7,#3b82f6); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.oa-avatar svg { width:16px; height:16px; color:#fff; pointer-events:none; }
.oa-title { font-size:0.88em; font-weight:600; color:var(--color-text,#111); }
.oa-sub { font-size:0.73em; color:var(--color-text-muted,#888); }
.oa-close { margin-left:auto; background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; display:flex; align-items:center; justify-content:center; transition:color 0.15s, background 0.15s; color:var(--color-text-muted,#888); }
.oa-close:hover { color:var(--color-text,#111); background:var(--color-hover,rgba(0,0,0,0.06)); }
.oa-close svg { width:16px; height:16px; pointer-events:none; }
.oa-messages { flex:1; overflow-y:auto; padding:14px 16px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth; }
.oa-msg { display:flex; gap:8px; align-items:flex-end; max-width:92%; }
.oa-msg--ai { align-self:flex-start; }
.oa-msg--user { align-self:flex-end; flex-direction:row-reverse; }
.oa-bubble { padding:9px 13px; border-radius:14px; font-size:0.84em; line-height:1.55; color:var(--color-text,#111); background:var(--color-surface,#f2f3f7); }
[data-theme="dark"] .oa-bubble { background:rgba(255,255,255,0.07); }
.oa-msg--user .oa-bubble { background:linear-gradient(135deg,#7c6af7,#3b82f6); color:#fff; border-bottom-right-radius:4px; }
.oa-msg--ai .oa-bubble { border-bottom-left-radius:4px; }
.oa-msg-avatar { width:26px; height:26px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#7c6af7,#3b82f6); display:flex; align-items:center; justify-content:center; }
.oa-msg-avatar svg { width:13px; height:13px; color:#fff; pointer-events:none; }
.oa-link { display:inline-flex; align-items:center; gap:4px; margin-top:6px; font-size:0.8em; color:#7c6af7; text-decoration:none; font-weight:500; cursor:pointer; }
.oa-link:hover { text-decoration:underline; }
.oa-link svg { width:11px; height:11px; pointer-events:none; }
.oa-typing { display:flex; gap:4px; align-items:center; padding:10px 13px; }
.oa-typing span { width:7px; height:7px; border-radius:50%; background:var(--color-text-muted,#888); animation:oaTyping 1.2s infinite ease-in-out; }
.oa-typing span:nth-child(2) { animation-delay:0.2s; }
.oa-typing span:nth-child(3) { animation-delay:0.4s; }
@keyframes oaTyping { 0%,60%,100% { transform:translateY(0); opacity:0.4; } 30% { transform:translateY(-5px); opacity:1; } }
.oa-inputbar { display:flex; align-items:flex-end; gap:8px; padding:10px 12px 12px; border-top:1px solid var(--color-border,rgba(0,0,0,0.08)); flex-shrink:0; }
[data-theme="dark"] .oa-inputbar { border-color:rgba(255,255,255,0.08); }
.oa-textarea { flex:1; padding:9px 12px; border-radius:12px; border:1px solid var(--color-border-medium,rgba(0,0,0,0.15)); background:var(--color-surface,#f2f3f7); color:var(--color-text,#111); font-size:0.85em; font-family:inherit; resize:none; line-height:1.5; min-height:38px; max-height:100px; outline:none; transition:border-color 0.15s; overflow-y:auto; }
[data-theme="dark"] .oa-textarea { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.12); color:#e0eeff; }
.oa-textarea:focus { border-color:#7c6af7; }
.oa-send { width:36px; height:36px; flex-shrink:0; border-radius:50%; border:none; cursor:pointer; padding:0; background:linear-gradient(135deg,#7c6af7,#3b82f6); color:#fff; display:flex; align-items:center; justify-content:center; transition:opacity 0.15s, transform 0.15s; }
.oa-send:hover { opacity:0.88; transform:scale(1.06); }
.oa-send svg { width:16px; height:16px; pointer-events:none; }
`;

    var ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
    var EXT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    var NAV_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    /* ── Helpers ── */
    // Internal site link — same tab, no external icon
    function siteLink(href, label) {
        return '<br><a class="oa-link" href="' + href + '">' + NAV_ICON + label + '</a>';
    }
    // External link — new tab, external icon
    function extLink(href, label) {
        return '<br><a class="oa-link" href="' + href + '" target="_blank" rel="noopener noreferrer">' + EXT_ICON + label + '</a>';
    }
    // Keep backward compat for any KB entries using link()
    function link(href, label) {
        if (href.indexOf(BASE) === 0 || href.indexOf('/') === 0) return siteLink(href, label);
        return extLink(href, label);
    }

    // Navigate within the HAX page, or link to hax.html#anchor from other pages
    function haxNav(panel, anchor, label) {
        var isHax = PAGE === 'hax';
        if (isHax) {
            // On the HAX page: scroll in place via data attributes (wired up in addMsg)
            return '<br><a class="oa-link" href="javascript:void(0)" data-hax-panel="' + panel + '" data-hax-anchor="' + (anchor || '') + '">' + NAV_ICON + 'Jump to ' + label + '</a>';
        }
        // On another page: navigate to hax.html with anchor hash (same tab)
        var hash = anchor ? '#' + anchor : '';
        return siteLink('hax.html' + hash, 'Go to ' + label + ' on HAX page');
    }

    // Scroll to any element by ID on the current page
    function anchorNav(anchorId, label) {
        return '<br><a class="oa-link" href="javascript:void(0)" data-anchor="' + anchorId + '">' + NAV_ICON + 'Jump to ' + label + '</a>';
    }

    var gptLink = extLink(GPT_URL, 'Deep-dive in the GPT assistant');

    /* ── Knowledge Base ── */
    var KB = [
        // ── GREETINGS / OVERVIEW ──
        { keys: ['hello','hi','hey','start','help','what can you do','what do you know'],
          answer: 'Hi! I\'m the <strong>Outshift Design assistant</strong>. Ask me anything about the site — patterns, research, tools, blog articles, or how to navigate.<br><br>Try:<br>• "What is HAX?"<br>• "Tell me about cognitive frameworks"<br>• "What is the foresight canvas?"<br>• "Show me the escalation paths pattern"<br>• "What articles are on the blog?"' },

        { keys: ['what is this site','what is outshift design','about this site','about outshift','who made this','who built this'],
          answer: 'This is the <strong>Outshift Design</strong> site — the design research hub for Outshift by Cisco. It publishes research-backed frameworks, interaction patterns, and practical tools for teams building AI agent products. The team focuses on the <strong>Human-Agent Experience (HAX)</strong> — making AI systems transparent, trustworthy, and collaborative.' + siteLink('index.html', 'Go to Homepage') },

        { keys: ['what pages','all pages','site map','sitemap','navigate','navigation','site structure','where is','what sections','show me everything'],
          answer: 'The site has these main sections:<br><br>🏠 <strong>Home</strong> — initiatives overview<br>🤖 <strong>HAX</strong> — 16 design patterns across 5 principles<br>📚 <strong>Research</strong> — 4 areas of design research:<br>&nbsp;&nbsp;↳ Foundational Principles<br>&nbsp;&nbsp;↳ Cognitive Frameworks<br>&nbsp;&nbsp;↳ Societal Impact (Agent Impact Map, Cognitive Load Audit, Foresight Canvas)<br>&nbsp;&nbsp;↳ Security &amp; Privacy<br>📝 <strong>Blog</strong> — articles and whitepapers<br>🔧 <strong>SDK</strong> — developer tools<br><br>'
            + siteLink('index.html', 'Homepage') + siteLink('hax.html', 'HAX') + siteLink('research.html', 'Research') + siteLink('blog.html', 'Blog') },

        // ── HOME / INITIATIVES ──
        { keys: ['homepage','home page','initiatives','internet of cognition','ioc'],
          answer: 'The <strong>homepage</strong> showcases two flagship initiatives:<br>• <strong>HAX</strong> — Human-Agent Experience: design patterns for human-agent collaboration<br>• <strong>Internet of Cognition</strong> — Cisco\'s vision for interconnected AI intelligence across networks<br><br>It also links to latest blog posts and research highlights.' + siteLink('index.html', 'Go to Homepage') },

        // ── HAX OVERVIEW ──
        { keys: ['what is hax','hax framework','human-agent experience','hax patterns','hax principles','explain hax'],
          answer: '<strong>HAX (Human-Agent Experience)</strong> is a research-backed design framework for building AI agent systems that are transparent, trustworthy, and collaborative. It organizes <strong>16 design patterns</strong> across <strong>5 principles</strong>:<br><br>1. <strong>Control</strong> — let humans set the rules<br>2. <strong>Clarity</strong> — show the agent\'s reasoning<br>3. <strong>Recovery</strong> — make mistakes clearly fixable<br>4. <strong>Collaboration</strong> — design for shared effort<br>5. <strong>Traceability</strong> — make behavior visible and reviewable<br><br>Developed by the Outshift product design team at Cisco.' + siteLink('hax.html', 'Open HAX') },

        { keys: ['hax page','hax sections','go to hax','hax navigation','hax sidebar'],
          answer: 'The <strong>HAX page</strong> has 5 sections in the left sidebar:<br>1. <strong>Control</strong> — Scope, Autonomy, Permission Gates<br>2. <strong>Clarity</strong> — Rationale, Confidence, Sources, Alternatives<br>3. <strong>Recovery</strong> — Undo/Redo, Editable Outputs, Safe Defaults, Escalation<br>4. <strong>Collaboration</strong> — Mixed Initiative, Co-editing, Role Clarity<br>5. <strong>Traceability</strong> — Action History, Visual Diffing, Behavior Tuning<br><br>Each section has: Description, Related Patterns, How to implement, and Common pitfalls.' + siteLink('hax.html', 'Open HAX') },

        { keys: ['all patterns','list patterns','16 patterns','how many patterns','list all'],
          answer: 'HAX has <strong>16 patterns</strong> across 5 principles:<br><br>🔵 <strong>Control:</strong> Scope &amp; Boundaries · Customization of Autonomy · Permission &amp; Confirmation Gates<br>🔵 <strong>Clarity:</strong> Inline Rationale · Confidence &amp; Uncertainty · Source Attribution · Alternatives &amp; Trade-offs<br>🔵 <strong>Recovery:</strong> Undo &amp; Redo · Editable Outputs · Safe Defaults · Escalation Paths<br>🔵 <strong>Collaboration:</strong> Mixed Initiative · Co-editing Interfaces · Role Clarity &amp; Turn Signals<br>🔵 <strong>Traceability:</strong> Action History · Visual Diffing · Behavior Tuning Over Time' + siteLink('hax.html', 'Explore all patterns') },

        // ── HAX: CONTROL ──
        { keys: ['control section','go to control','control principle','open control'],
          answer: 'The <strong>Control</strong> section covers how users set the rules for agent behavior. Three patterns: Scope &amp; Boundaries, Customization of Autonomy, and Permission &amp; Confirmation Gates.' + haxNav('control', 'control-desc', 'Control') },

        { keys: ['control','user control','human control','let human set the rules'],
          answer: '<strong>Control</strong> — Let the Human Set the Rules. Patterns:<br>• <em>Scope &amp; Boundaries</em> — define where the agent can act<br>• <em>Customization of Autonomy</em> — adjust agent independence<br>• <em>Permission &amp; Confirmation Gates</em> — require approval for high-stakes steps' + haxNav('control', 'control-desc', 'Control') },

        { keys: ['scope','boundaries','operational limits','where can agent act'],
          answer: '<strong>Scope &amp; Boundaries</strong>: users define the agent\'s operational domain — which tools, data, and actions are permitted. Surface limits visibly so users always know what the agent can and cannot do.' + haxNav('control', 'control-scope', 'Scope &amp; Boundaries') },

        { keys: ['customization of autonomy','autonomy level','agent autonomy','how autonomous','autonomy slider'],
          answer: '<strong>Customization of Autonomy</strong>: let users adjust how independently the agent acts — from fully supervised to mostly autonomous. Offer a clear dial or mode selector, and always show the current autonomy level.' + haxNav('control', 'control-authority', 'Customization of Autonomy') },

        { keys: ['permission','confirmation gates','permission gates','approve','approval','confirm action'],
          answer: '<strong>Permission &amp; Confirmation Gates</strong>: require explicit user approval before consequential or irreversible actions. Show what will happen, why, and offer a clear Accept/Reject choice. Reserve for high-impact steps to avoid approval fatigue.' + haxNav('control', 'control-pgates', 'Permission Gates') },

        // ── HAX: CLARITY ──
        { keys: ['clarity section','go to clarity','clarity principle','open clarity'],
          answer: 'The <strong>Clarity</strong> section covers making agent reasoning transparent. Four patterns: Inline Rationale, Confidence &amp; Uncertainty, Source Attribution, and Alternatives &amp; Trade-offs.' + haxNav('clarity', 'clarity-desc', 'Clarity') },

        { keys: ['clarity','transparent','agent reasoning','show reasoning','explain decision','why did the agent','make it clear'],
          answer: '<strong>Clarity</strong> — Show the agent\'s reasoning. Patterns:<br>• <em>Inline Rationale</em> — explain decisions where they appear<br>• <em>Confidence &amp; Uncertainty</em> — show how sure the agent is<br>• <em>Source Attribution</em> — show where info came from<br>• <em>Alternatives &amp; Trade-offs</em> — present other options considered' + haxNav('clarity', 'clarity-desc', 'Clarity') },

        { keys: ['inline rationale','rationale','why did it decide','explain reasoning'],
          answer: '<strong>Inline Rationale</strong>: explain the agent\'s reasoning right where a decision appears — not in a separate panel. Keep explanations concise and tied directly to the action or result.' + haxNav('clarity', 'clarity-ir', 'Inline Rationale') },

        { keys: ['confidence','uncertainty','how sure','probability','likelihood','confidence display'],
          answer: '<strong>Confidence &amp; Uncertainty Display</strong>: show users how confident the agent is using visual cues (bars, labels, color). When confidence is low, prompt for human input rather than proceeding autonomously.' + haxNav('clarity', 'clarity-cd', 'Confidence &amp; Uncertainty') },

        { keys: ['source attribution','sources','citation','where did it come from','reference','cite'],
          answer: '<strong>Source Attribution</strong>: always show where the agent\'s information originates. Link to sources where possible so users can verify claims independently.' + haxNav('clarity', 'clarity-sa', 'Source Attribution') },

        { keys: ['alternatives','trade-offs','tradeoffs','other options','what else was considered'],
          answer: '<strong>Alternatives &amp; Trade-offs</strong>: show what other options were considered and the trade-offs between them. This supports informed user decision-making and builds trust.' + haxNav('clarity', 'clarity-at', 'Alternatives &amp; Trade-offs') },

        // ── HAX: RECOVERY ──
        { keys: ['recovery section','go to recovery','recovery principle','open recovery'],
          answer: 'The <strong>Recovery</strong> section covers making agent mistakes clearly fixable. Four patterns: Undo &amp; Redo, Editable Outputs, Safe Defaults, and Escalation Paths.' + haxNav('recovery', 'recovery-desc', 'Recovery') },

        { keys: ['recovery','fix mistake','revert','rollback','undo agent','mistake recovery'],
          answer: '<strong>Recovery</strong> — Assume the agent will make mistakes; make them clearly fixable. Patterns:<br>• <em>Undo &amp; Redo</em> — time-travel through agent actions<br>• <em>Editable Outputs</em> — revise results before committing<br>• <em>Safe Defaults</em> — fall back to low-risk behavior when uncertain<br>• <em>Escalation Paths</em> — route to a human or stop the agent' + haxNav('recovery', 'recovery-desc', 'Recovery') },

        { keys: ['undo redo','undo/redo','undo and redo','go back','time travel','reverse action'],
          answer: '<strong>Undo &amp; Redo Support</strong>: make every agentic action reversible where possible. Maintain a visible action history so users can understand what happened and roll back specific steps with confidence.' + haxNav('recovery', 'recovery-undo', 'Undo &amp; Redo') },

        { keys: ['editable output','edit result','modify result','revise output','draft first'],
          answer: '<strong>Editable Outputs</strong>: the agent always presents results as drafts first. Users can tweak, accept, or reject before any action is committed. Key for building trust incrementally.' + haxNav('recovery', 'recovery-eo', 'Editable Outputs') },

        { keys: ['safe default','safe defaults','fallback','low risk behavior','conservative','when uncertain'],
          answer: '<strong>Safe Defaults</strong>: when the agent is uncertain, fall back to conservative, low-risk behavior and surface uncertainty rather than guessing. Design recovery flows before launch — they\'re harder to add later.' + haxNav('recovery', 'recovery-sd', 'Safe Defaults') },

        { keys: ['escalation','escalation paths','escalate','human handoff','stop agent','pause agent','interrupt agent','hand off to human'],
          answer: '<strong>Escalation Paths</strong>: always provide a clear way to pause, redirect, or hand off to a human. Escalation options must be visible at all times — not buried in menus.' + haxNav('recovery', 'recovery-ep', 'Escalation Paths') },

        // ── HAX: COLLABORATION ──
        { keys: ['collaboration section','go to collaboration','collaboration principle','open collaboration'],
          answer: 'The <strong>Collaboration</strong> section covers designing for shared effort. Three patterns: Mixed Initiative, Co-editing Interfaces, and Role Clarity &amp; Turn Signals.' + haxNav('collaboration', 'collaboration-desc', 'Collaboration') },

        { keys: ['collaboration','collaborate','shared effort','joint work','working with agent','human and agent together'],
          answer: '<strong>Collaboration</strong> — Design for shared effort and mutual input. Patterns:<br>• <em>Mixed Initiative</em> — fluid turn-taking between human and agent<br>• <em>Co-editing Interfaces</em> — shared workspace where both contribute<br>• <em>Role Clarity &amp; Turn Signals</em> — clear cues about who leads each step' + haxNav('collaboration', 'collaboration-desc', 'Collaboration') },

        { keys: ['mixed initiative','turn taking','who leads','proactive suggestion','fluid initiative','agent takes initiative'],
          answer: '<strong>Mixed Initiative</strong>: design so either party can lead based on context. The agent may proactively suggest; the user may redirect. Neither should be locked into a fixed role.' + haxNav('collaboration', 'collab-mi', 'Mixed Initiative') },

        { keys: ['co-editing','coediting','shared workspace','collaborative editing','both can edit','joint editing'],
          answer: '<strong>Co-editing Interfaces</strong>: place human and AI edits in a single visible shared workspace. AI suggestions appear as proposals, not automatic changes. The human is always the final editor.' + haxNav('collaboration', 'collab-ce', 'Co-editing Interfaces') },

        { keys: ['role clarity','turn signal','whose turn','who is acting','handoff signal','who is responsible','turn taking signal'],
          answer: '<strong>Role Clarity &amp; Turn Signals</strong>: clearly indicate who leads each workflow stage and signal when the user\'s input is needed. Reduces confusion in multi-step collaborative tasks.' + haxNav('collaboration', 'collab-rc', 'Role Clarity &amp; Turn Signals') },

        // ── HAX: TRACEABILITY ──
        { keys: ['traceability section','go to traceability','traceability principle','open traceability'],
          answer: 'The <strong>Traceability</strong> section covers making agent behavior visible and reviewable. Three patterns: Action History, Visual Diffing, and Behavior Tuning Over Time.' + haxNav('traceability', 'traceability-desc', 'Traceability') },

        { keys: ['traceability','trace','audit trail','reviewable','accountability','visible behavior','agent log'],
          answer: '<strong>Traceability</strong> — Make agent behavior visible, searchable &amp; open to review. Patterns:<br>• <em>Action History</em> — chronological log of all steps<br>• <em>Visual Diffing</em> — side-by-side before/after comparisons<br>• <em>Behavior Tuning Over Time</em> — visibility into how the agent adapts' + haxNav('traceability', 'traceability-desc', 'Traceability') },

        { keys: ['action history','event log','audit log','what happened','history of actions','log of actions'],
          answer: '<strong>Action History</strong>: maintain a time-stamped, plain-language log of all agent and user actions. Enables users to reconstruct events, understand causality, and hold the system accountable.' + haxNav('traceability', 'trace-ah', 'Action History') },

        { keys: ['visual diff','visual diffing','before after','compare changes','what changed visually','diff view'],
          answer: '<strong>Visual Diffing</strong>: show changes side-by-side with color highlights. Always pair the visual change with a plain-language explanation of <em>why</em> it was made. Let users accept, reject, or modify.' + haxNav('traceability', 'trace-vd', 'Visual Diffing') },

        { keys: ['behavior tuning','adaptive behavior','system learning','personalization over time','agent adapts','how agent changes'],
          answer: '<strong>Behavior Tuning Over Time</strong>: when the agent adapts its behavior, tell the user clearly — what changed, why, and how to override it. Never allow silent learning to erode user trust.' + haxNav('traceability', 'trace-bt', 'Behavior Tuning Over Time') },

        // ── HAX: IMPLEMENTATION / PITFALLS ──
        { keys: ['how to implement','implementation guide','implement a pattern','how do i build','how to design'],
          answer: 'Every principle section on the HAX page has a <strong>How to implement</strong> subsection with actionable steps. Click a principle in the left sidebar, then select "How to implement" from its submenu. Which principle are you working on?' + siteLink('hax.html', 'Open HAX') },

        { keys: ['pitfall','pitfalls','common mistakes','what to avoid','anti-pattern','common errors','what not to do'],
          answer: 'Every principle section on the HAX page includes a <strong>Common pitfalls</strong> card grid with real mistakes to avoid. Access them via the sidebar submenu under each principle → "Common pitfalls".' + siteLink('hax.html', 'Open HAX') },

        // ── GUIDING PRINCIPLES ──
        { keys: ['guiding principles','design principles','core principles','five principles','what are the principles'],
          answer: '<strong>Guiding Principles</strong> are the five core values anchoring how Outshift designs for autonomous agents alongside people:<br><br>1. <strong>Control</strong> — Humans guide how agents operate by setting boundaries, preferences, and intent<br>2. <strong>Clarity</strong> — Agents communicate their actions and reasoning clearly and visibly<br>3. <strong>Recovery</strong> — Every action is reversible or recoverable; mistakes are safe to make<br>4. <strong>Collaboration</strong> — Agents act as capable partners, not just tools waiting for commands<br>5. <strong>Traceability</strong> — Agent behavior is visible, searchable, and open to review<br><br>Use the tabs on the page to read each principle and browse illustrated examples.' + siteLink('guiding-principles.html', 'Open Guiding Principles') },

        // ── HUMAN-CENTERED AI PATTERNS ──
        { keys: ['human-centered ai patterns','human centered ai','pattern overview','patterns overview','hax overview page'],
          answer: '<strong>Human-Centered AI Patterns</strong> is the overview page for the HAX pattern library. It introduces all five guiding principles at a glance and shows how each shapes trustworthy human–agent partnerships — from how agents adapt to human intent (Control) to making behavior visible and reviewable (Traceability).' + siteLink('human-centered-ai-patterns.html', 'Open Pattern Overview') },

        // ── SDK ──
        { keys: ['sdk','hax sdk','what is the sdk','developer','developers','build with hax','implement hax in code'],
          answer: '<strong>HAX SDK</strong> provides developers with tools to implement Human-Agent Experience patterns in their products. It translates design patterns into code-level guidance and components for building trustworthy AI agent interfaces.' + siteLink('sdk.html', 'Open SDK') },

        // ── RESEARCH HUB ──
        { keys: ['research','research hub','research topics','research at outshift','what research'],
          answer: 'The <strong>Research</strong> section covers Outshift\'s design research across four areas:<br>• <strong>Foundational Principles</strong> — the research-to-design pipeline<br>• <strong>Cognitive Frameworks</strong> — theoretical foundations for human-AI interaction<br>• <strong>Societal Impact</strong> — responsible agent design tools<br>• <strong>Security &amp; Privacy</strong> — safe and trustworthy AI systems' + siteLink('research.html', 'Open Research') },

        // ── FOUNDATIONAL PRINCIPLES ──
        { keys: ['foundational principles','research pipeline','design pipeline','research to design','how does research become design'],
          answer: '<strong>Foundational Principles</strong> documents the research-to-design pipeline used by Outshift:<br><br>Framing → Mapping → Synthesis → Heuristics → Prototyping → Documentation<br><br>It translates high-level insights into practical patterns for user control, clarity, and human-AI collaboration.' + siteLink('foundational-principles.html', 'Open Foundational Principles') },

        // ── COGNITIVE FRAMEWORKS ──
        { keys: ['cognitive frameworks','theoretical foundation','cognitive science','mental model','dual process','embodied cognition','distributed cognition'],
          answer: '<strong>Cognitive Frameworks</strong> explores the theoretical foundations of human-AI interaction. It is grounded in three research areas:<br><br>• <strong>Distributed Cognition</strong> — how people and AI systems share understanding across tools, people, and environments<br>• <strong>Embodied Cognition</strong> — how physical and sensory context shapes interaction with AI<br>• <strong>Situated Action</strong> — how actions emerge from real-world context rather than pre-planned scripts<br><br>These frameworks bridge theory and design to create AI interactions that are intuitive, contextual, and genuinely collaborative.' + siteLink('cognitive-frameworks.html', 'Open Cognitive Frameworks') },

        { keys: ['cognitive load','mental effort','cognitive demand','what is cognitive load'],
          answer: '<strong>Cognitive Load</strong> refers to the total mental effort a user must exert when interacting with an AI system. Outshift studies this through the <strong>Cognitive Load Audit</strong> tool — a method for evaluating whether an agent\'s design is intuitive, clear, and respectful of diverse cognitive styles.' + siteLink('cognitive-load-audit.html', 'Open Cognitive Load Audit') },

        // ── SOCIETAL IMPACT ──
        { keys: ['societal impact','responsible design','social impact','who does it serve','harm','exclusion','long-term consequences'],
          answer: '<strong>Societal Impact</strong> treats the broader consequences of AI agents as a design responsibility, not a byproduct. The section asks: Who does this serve? Who might it exclude or harm? What are the long-term consequences at scale?<br><br>It includes three practical tools:<br>• <strong>Agent Impact Map</strong> — map the full socio-technical system<br>• <strong>Cognitive Load Audit</strong> — assess cognitive demands<br>• <strong>Foresight Canvas</strong> — anticipate future risks and unintended consequences' + siteLink('societal-impact.html', 'Open Societal Impact') },

        // ── AGENT IMPACT MAP ──
        { keys: ['agent impact map','impact map','socio-technical','stakeholder map','map the system','who is affected'],
          answer: '<strong>Agent Impact Map</strong> is a practical tool for mapping the complete socio-technical context of an AI agent — from stakeholders and decision-making roles to intentional boundaries.<br><br>How to use it:<br>1. Identify all human and non-human actors in the agent ecosystem<br>2. Map how information and decisions flow between them<br>3. Mark where the agent intervenes and what boundaries should exist<br>4. Assess impact on each stakeholder group<br><br>Goal: ensure responsible design from day one.' + siteLink('agent-impact-map.html', 'Open Agent Impact Map') },

        // ── COGNITIVE LOAD AUDIT ──
        { keys: ['cognitive load audit','load audit','mental effort audit','how hard is the agent to use','measure cognitive load'],
          answer: '<strong>Cognitive Load Audit</strong> is a tool for evaluating how much mental effort your agent demands from users — and whether that effort is appropriate and equitable.<br><br>How to use it:<br>1. Identify all tasks, decisions, and information a user must process<br>2. Rate each for intrinsic load (complexity), extraneous load (poor design), and germane load (learning value)<br>3. Redesign the highest-burden interactions first<br><br>Goal: ensure the agent respects diverse ways of thinking and acting.' + siteLink('cognitive-load-audit.html', 'Open Cognitive Load Audit') },

        // ── FORESIGHT CANVAS ──
        { keys: ['foresight canvas','foresight','speculative design','future scenarios','unintended consequences','second order effects','long term risk','stress test'],
          answer: '<strong>Foresight Canvas</strong> is a speculative design process for anticipating the long-term, unintended consequences of an AI agent.<br><br>How to use it:<br>1. Define the core innovation or capability of your agent<br>2. Map immediate, second-order, and third-order effects<br>3. Identify potential misuse scenarios and systemic risks<br>4. Design mitigations or hard limits proactively<br><br>Goal: stress-test against future scenarios and ensure long-term viability and trust.' + siteLink('foresight-canvas.html', 'Open Foresight Canvas') },

        // ── SECURITY & PRIVACY ──
        { keys: ['security','privacy','secure ai','ai security','privacy-preserving','adaptive security','safe agents','trustworthy systems'],
          answer: '<strong>Security &amp; Privacy</strong> covers how to build safe, autonomous multi-agent systems. Research areas include:<br><br>• <strong>Adaptive Security</strong> — evolving security models for autonomous agents<br>• <strong>Privacy-Preserving Context</strong> — how agents use user context without exposing sensitive data<br>• <strong>Responsible Scaling</strong> — maintaining safety as agents gain more capabilities<br>• <strong>Global Interoperability</strong> — trust across different systems and jurisdictions' + siteLink('security-privacy.html', 'Open Security &amp; Privacy') },

        // ── BLOG ──
        { keys: ['blog','articles','whitepapers','publications','papers','what can i read','latest articles'],
          answer: 'The <strong>Blog</strong> has three articles:<br><br>📄 <strong>Navigating the Multi-Agent Future</strong> — expert perspectives on the future of human-agent interaction (Krystelle Gonzalez Papaux, April 2026)<br>📄 <strong>The Strategic Role of Design in Shaping Ethical AI Systems</strong> — how interface design becomes the primary control layer for responsible AI (Krystelle Gonzalez Papaux, May 2026)<br>📄 <strong>Making Room for Agents in Expert Tools</strong> — how AI agents can integrate into expert workflows in security, network ops, policy admin, and finance (Marc Scibelli, May 2026)' + siteLink('blog.html', 'Open Blog') },

        { keys: ['navigating multi-agent','multi agent future','whitepaper','report 2026','multi-agent'],
          answer: '<strong>Navigating the Multi-Agent Future</strong> is a whitepaper presenting key findings and expert perspectives on the future of human-agent interaction. Written by Krystelle Gonzalez Papaux, April 2026.' + extLink('https://outshift-headless-cms-s3.s3.us-east-2.amazonaws.com/Navigating_The_Multi-Agent_Future.pdf', 'Read the whitepaper') },

        { keys: ['ethics','ai ethics','ethical ai','design ethics','strategic role of design','ethical systems'],
          answer: '<strong>The Strategic Role of Design in Shaping Ethical AI Systems</strong>: as AI moves toward agentic architectures, ethics can no longer be governed purely through policy. This report explores how interface design becomes the primary control layer for responsible human–AI interaction. Written by Krystelle Gonzalez Papaux, May 2026.' + extLink('files/ai-ethics-and-design.pdf', 'Read the report') },

        { keys: ['making room for agents','expert tools','marc scibelli','agents in expert tools','security investigation','network operations','policy admin','financial terminal','agent in workflow'],
          answer: '<strong>Making Room for Agents in Expert Tools</strong> explores how AI agents can integrate into four expert domains without replacing human expertise:<br><br>🔐 <strong>Security investigation</strong> — agent as evidence analyst<br>🌐 <strong>Network operations</strong> — agent as pattern recognizer<br>📋 <strong>Policy administration</strong> — agent as consequence analyst<br>💹 <strong>Financial terminals</strong> — agent as signal interpreter<br><br>Written by Marc Scibelli (Director, UI/UX Engineering), May 2026.' + siteLink('making-room-for-agents.html', 'Read the article') },

        // ── COMPANY ──
        { keys: ['outshift','what is outshift','cisco','outshift by cisco','who is outshift'],
          answer: '<strong>Outshift by Cisco</strong> is Cisco\'s emerging technology and incubation team focused on building the future of networking, security, and AI. The Outshift Design team develops research-backed frameworks and patterns for human-agent interaction, published on this site.' + extLink('https://outshift.cisco.com/', 'Visit Outshift') },

        { keys: ['team','who works here','who wrote this','authors','krystelle','marc scibelli'],
          answer: 'Content on this site is produced by the <strong>Outshift Design team at Cisco</strong>. Blog authors include:<br>• <strong>Krystelle Gonzalez Papaux</strong> — Navigating the Multi-Agent Future; The Strategic Role of Design in Shaping Ethical AI Systems<br>• <strong>Marc Scibelli</strong> (Director, UI/UX Engineering) — Making Room for Agents in Expert Tools' + siteLink('blog.html', 'Open Blog') },
    ];

    /* ── Find answer ── */
    function findAnswer(q) {
        var lower = q.toLowerCase().replace(/[?!.,]/g, '');
        var best = null, bestScore = 0;
        for (var i = 0; i < KB.length; i++) {
            for (var j = 0; j < KB[i].keys.length; j++) {
                var k = KB[i].keys[j];
                if (lower.indexOf(k) !== -1 && k.length > bestScore) {
                    best = KB[i].answer;
                    bestScore = k.length;
                }
            }
        }
        return best;
    }

    /* ── DOM ── */
    function inject() {
        // Styles
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Button
        var btn = document.createElement('button');
        btn.id = 'oa-btn';
        btn.setAttribute('aria-label', 'Open Outshift Design assistant');
        btn.title = 'Human-Agent Experience assistant';
        btn.innerHTML = ICON;
        document.body.appendChild(btn);

        // Panel
        var panel = document.createElement('div');
        panel.id = 'oa-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Human-Agent Experience assistant');
        panel.innerHTML = [
            '<div class="oa-header">',
              '<div class="oa-avatar">' + ICON + '</div>',
              '<div>',
                '<div class="oa-title">Outshift Design · Ask me anything</div>',
                '<div class="oa-sub">Powered by HAX Pattern Research GPT</div>',
              '</div>',
              '<button class="oa-close" id="oa-close" aria-label="Close">',
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
              '</button>',
            '</div>',
            '<div class="oa-messages" id="oa-messages"></div>',
            '<div class="oa-inputbar">',
              '<textarea class="oa-textarea" id="oa-input" placeholder="Ask a question…" rows="1"></textarea>',
              '<button class="oa-send" id="oa-send" aria-label="Send">',
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
              '</button>',
            '</div>'
        ].join('');
        document.body.appendChild(panel);

        /* ── References ── */
        var closeBtn = document.getElementById('oa-close');
        var sendBtn = document.getElementById('oa-send');
        var input = document.getElementById('oa-input');
        var messages = document.getElementById('oa-messages');
        var opened = false;

        /* ── Message helpers ── */
        function addMsg(role, html) {
            var wrap = document.createElement('div');
            wrap.className = 'oa-msg oa-msg--' + role;
            if (role === 'ai') {
                wrap.innerHTML = '<div class="oa-msg-avatar">' + ICON + '</div><div class="oa-bubble">' + html + '</div>';
            } else {
                wrap.innerHTML = '<div class="oa-bubble">' + html.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
            }
            // Wire up HAX nav links
            wrap.querySelectorAll('[data-hax-panel]').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    var panelName = a.getAttribute('data-hax-panel');
                    var anchor = a.getAttribute('data-hax-anchor');
                    var filterBtn = document.querySelector('.pattern-filter[data-panel="' + panelName + '"]') ||
                                    document.querySelector('.pattern-filter[data-pattern="' + panelName + '"]');
                    if (filterBtn) filterBtn.click();
                    if (anchor) {
                        setTimeout(function () {
                            var el = document.getElementById(anchor);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 140);
                    }
                });
            });
            // Wire up generic anchor nav links
            wrap.querySelectorAll('[data-anchor]').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    var el = document.getElementById(a.getAttribute('data-anchor'));
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
            messages.appendChild(wrap);
            messages.scrollTop = messages.scrollHeight;
        }

        function addTyping() {
            var wrap = document.createElement('div');
            wrap.className = 'oa-msg oa-msg--ai';
            wrap.id = 'oa-typing';
            wrap.innerHTML = '<div class="oa-msg-avatar">' + ICON + '</div><div class="oa-bubble oa-typing"><span></span><span></span><span></span></div>';
            messages.appendChild(wrap);
            messages.scrollTop = messages.scrollHeight;
        }
        function removeTyping() { var t = document.getElementById('oa-typing'); if (t) t.remove(); }

        function welcome() {
            if (!opened) {
                opened = true;
                addMsg('ai', 'Hi! I\'m the <strong>Human-Agent Experience assistant</strong>.<br>I can help you navigate the site, explain HAX patterns, or point you to research.<br><br>Try: <em>"What is HAX?"</em> or <em>"Show me Escalation Paths"</em>');
            }
        }

        /* ── Send ── */
        function send() {
            var q = input.value.trim();
            if (!q) return;
            input.value = '';
            input.style.height = '';
            addMsg('user', q);
            addTyping();
            setTimeout(function () {
                removeTyping();
                var ans = findAnswer(q);
                if (ans) {
                    addMsg('ai', ans + gptLink);
                } else {
                    addMsg('ai', 'I don\'t have a specific answer for that. The <strong>HAX Pattern Research GPT</strong> can help with detailed questions about human-agent design.' + gptLink);
                }
            }, 600 + Math.random() * 400);
        }

        /* ── Events ── */
        btn.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('is-open');
            if (isOpen) { welcome(); setTimeout(function () { input.focus(); }, 120); }
        });
        closeBtn.addEventListener('click', function () { panel.classList.remove('is-open'); });
        sendBtn.addEventListener('click', send);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
        input.addEventListener('input', function () {
            this.style.height = '';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') panel.classList.remove('is-open');
        });
        // Fix: use btn.contains() so clicking SVG child still counts as clicking the button
        document.addEventListener('click', function (e) {
            if (panel.classList.contains('is-open') && !panel.contains(e.target) && !btn.contains(e.target)) {
                panel.classList.remove('is-open');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
