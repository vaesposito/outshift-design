/**
 * Seed script for HAX page pattern panels.
 * Run from the strapi-app directory:
 *   npx ts-node src/seed-hax-patterns.ts
 * or via the Strapi bootstrap lifecycle in src/index.ts.
 *
 * This script upserts all 5 panels (Control, Clarity, Recovery, Collaboration,
 * Traceability) with their subtitles, What it means / Why this matters copy,
 * related patterns, how-to lists, and common pitfalls.
 */

const panels = [
  {
    key: "control",
    title: "Control",
    subtitle: "Keep humans informed and in charge — always",
    description:
      "Give users clear ways to guide, pause, or override the agent at any point. The agent acts, but the human decides.",
    whatItMeans:
      "Control means users can intervene, redirect, or stop agent behavior at any stage. It's not about micromanaging every step — it's about having accessible, meaningful levers when they matter.",
    whyItMatters:
      "When users feel in control, they trust the system enough to let it do more. Without it, even helpful agents feel risky or unpredictable. Control creates the psychological safety that makes agentic systems usable.",
    relatedPatterns: [
      {
        subnavId: "control-scope",
        name: "Scope & Boundaries",
        description:
          "Users define operational limits for AI behavior. The agent operates within these boundaries, avoiding unintended actions.",
        componentLabel: "Component example: Instruction / Scope",
        callouts: [
          {
            num: 1,
            title: "Instruction mode",
            desc: "Users define interaction boundaries by selecting input modes, guiding the agent to operate safely within intended, user-controlled scopes.",
          },
          {
            num: 2,
            title: "Task specific boundaries",
            desc: "Specific checkboxes define what the AI is allowed to change and what it must avoid. These help define clear behavioral constraints.",
          },
        ],
      },
      {
        subnavId: "control-authority",
        name: "Customization of Autonomy",
        description:
          "Users control the spectrum of autonomy, from passive suggestions to full automation based on their comfort and context.",
        componentLabel: "Component example: Authority Sliders",
        callouts: [
          {
            num: 1,
            title: "Autonomy level is visible",
            desc: "The current mode is displayed clearly so users always know how much independent action the agent is allowed to take.",
          },
          {
            num: 2,
            title: "Users can set context-specific controls",
            desc: "Different autonomy settings can be applied to different task types, balancing efficiency with oversight where it matters most.",
          },
        ],
      },
      {
        subnavId: "control-pgates",
        name: "Permission & Confirmation Gates",
        description:
          "Explicit checkpoints require human approval before proceeding. Safeguards critical operations through shared decision-making.",
        componentLabel: "Component example: Kill switch and preview modes",
        callouts: [
          {
            num: 1,
            title: "Immediate agent shutdown",
            desc: "A prominent \"Disable Agent\" toggle gives users a fast, irreversible way to halt all agent activity.",
          },
          {
            num: 2,
            title: "Visible control settings",
            desc: "The system shows settings upfront allowing the user to assess whether to make decisions based on risks and live situations.",
          },
        ],
      },
    ],
    howToImplement: [
      "Include reasoning explanations alongside every recommendation or decision",
      "Make explanations accessible through plain language and visual aids",
      "Use progressive disclosure to offer both quick summaries and detailed explanations",
      "Show alternative options considered and why they were not chosen",
      "Provide clear source citations and links for verification",
      "Display confidence levels and uncertainty ranges where relevant",
    ],
    commonPitfalls: [
      {
        title: "Opaque decision logic",
        description: "Users can't tell why the agent made a choice",
      },
      {
        title: "Over explanation",
        description:
          "Flooding users with too much technical detail and overwhelming them with too much detail",
      },
    ],
  },
  {
    key: "clarity",
    title: "Clarity",
    subtitle: "Make agent reasoning legible and trustworthy",
    description:
      "Transparent reasoning helps users understand, verify, and trust agent outputs — turning black-box decisions into legible choices.",
    whatItMeans:
      "Clarity means users can see not just what the agent decided, but why — with enough context to evaluate and act confidently. It reduces cognitive load and prevents blind trust.",
    whyItMatters:
      "Without clarity, users either blindly trust outputs or constantly second-guess them. Both extremes are costly. Clear reasoning builds calibrated trust — users engage more effectively and catch errors faster.",
    relatedPatterns: [
      {
        subnavId: "clarity-ir",
        name: "Inline Rationale",
        description:
          "Agents articulate why they made recommendations. Rationale should be accessible, understandable, and relevant to help users make sense of the thinking.",
        componentLabel: "Component example: Inline Rationale",
        callouts: [
          {
            num: 1,
            title: "Agent's reasoning surfaced",
            desc: "The agent labels its own decision logic, making invisible prioritization visible so users can understand, question, or reorder.",
          },
          {
            num: 2,
            title: "Reasoning is accessible, not buried",
            desc: "Rationale appears directly within the interface at the point of action — not in logs or hidden panels.",
          },
          {
            num: 3,
            title: "User can act directly from the rationale view",
            desc: "The interface allows users to approve, modify, or reject directly from where rationale is shown.",
          },
        ],
      },
      {
        subnavId: "clarity-cd",
        name: "Confidence & Uncertainty Displays",
        description:
          "Disclosing confidence levels helps users interpret outcomes effectively and calibrate trust appropriately for transparent decision support.",
        componentLabel: "Component example: Diagnostic Report",
        callouts: [
          {
            num: 1,
            title: "Confidence scores are shown inline",
            desc: "Each finding includes a visual confidence bar so users can quickly assess reliability at a glance.",
          },
          {
            num: 2,
            title: "Actionable items are surfaced clearly",
            desc: "The interface distinguishes findings that require action from those that are informational.",
          },
          {
            num: 3,
            title: "Uncertainty is visualised, not hidden",
            desc: "Low-confidence results are shown with reduced fill and a distinct label, making uncertainty legible.",
          },
          {
            num: 4,
            title: "Context is preserved per finding",
            desc: "Each row includes its category and source, giving users the context to act without digging elsewhere.",
          },
        ],
      },
      {
        subnavId: "clarity-sa",
        name: "Source Attribution",
        description:
          "Revealing where information came from helps users verify and contextualize outputs, supporting accountability and enabling further inquiry.",
        componentLabel: "Component example: Findings with Sources",
        callouts: [
          {
            num: 1,
            title: "Source labels are visually distinct and clickable",
            desc: "The source elements are styled for immediate recognition and likely interactive, improving usability and clarity.",
          },
          {
            num: 2,
            title: "Claims supported by cited references",
            desc: "Each recommendation is backed by named sources, allowing users to verify the rationale and explore more details independently.",
          },
        ],
      },
      {
        subnavId: "clarity-at",
        name: "Alternatives & Trade-offs",
        description:
          "Showing what the agent didn't choose and why helps users understand trade-offs. It creates transparency and supports participatory decision-making.",
        componentLabel: "Component example: Suggested Actions",
        callouts: [
          {
            num: 1,
            title: "Consequences and benefits are explicit",
            desc: "Includes options with a clear summary of what it changes and what the effect will be.",
          },
          {
            num: 2,
            title: "Multiple actions presented side-by-side",
            desc: "The interface surfaces more than one possible action instead of a single automated path.",
          },
          {
            num: 3,
            title: "Supports informed trade-off decisions",
            desc: "By presenting pros and cons transparently, the system helps users make context-aware decisions.",
          },
          {
            num: 4,
            title: "Labels indicate duration and reversibility",
            desc: "Visual tags communicate whether an option is temporary, reversible, or long-term.",
          },
        ],
      },
    ],
    howToImplement: [
      "Include reasoning explanations alongside every recommendation or decision",
      "Make explanations accessible through plain language and visual aids",
      "Use progressive disclosure to offer both quick summaries and detailed explanations",
      "Show alternative options considered and why they were not chosen",
      "Provide clear source citations and links for verification",
      "Display confidence levels and uncertainty ranges where relevant",
    ],
    commonPitfalls: [
      {
        title: "Opaque decision logic",
        description: "Users can't tell why the agent made a choice",
      },
      {
        title: "Over explanation",
        description:
          "Flooding users with too much technical detail and overwhelming them with too much detail",
      },
    ],
  },
  {
    key: "recovery",
    title: "Recovery",
    subtitle: "Assume the agent will make mistakes, make them clearly fixable",
    description:
      "Agents will make mistakes — what matters is how fixable they are. Recovery means giving users clear, safe ways to undo actions, correct errors, and guide future behavior.",
    whatItMeans:
      "Agents will make mistakes, what matters is how fixable they are. Recovery means giving users clear, safe ways to undo actions, correct errors, and guide future behavior. It makes systems feel less brittle and more collaborative.",
    whyItMatters:
      "Without recovery, even small errors can erode trust and stall progress. Clear ways to fix mistakes turn agent failures into moments of learning for both the system and the person using it.",
    relatedPatterns: [
      {
        subnavId: "recovery-undo",
        name: "Undo & Redo Support",
        description:
          "This pattern is essential in agentic systems or tools with automation because it provides a safety net. It protects users from unintended consequences and reinforcing their control.",
        componentLabel: "Component example: Undo & Redo Support",
        callouts: [
          {
            num: 1,
            title: "Actions are reversible by default",
            desc: "The interface includes options like Undo or Revert for each automated change.",
          },
          {
            num: 2,
            title: "Justification for actions builds trust",
            desc: "A short, plain-language explanation helps users understand the rationale behind changes.",
          },
          {
            num: 3,
            title: "Multiple levels of recovery available",
            desc: "Users can revert or approve individual changes or apply recovery to all actions at once.",
          },
        ],
      },
      {
        subnavId: "recovery-eo",
        name: "Editable Outputs",
        description:
          "Agents should hand off control. Editable outputs ensure that humans retain authorship and can correct or improve AI-generated content easily.",
        componentLabel: "Component example: Editable Outputs",
        callouts: [
          {
            num: 1,
            title: "Human-in-the-loop decision making",
            desc: "The interface shows multiple alternatives, but waits for the user to select one.",
          },
          {
            num: 2,
            title: "Language supports co-creation",
            desc: "AI's phrasing encourages collaboration reinforcing the user as the final authority.",
          },
          {
            num: 3,
            title: "Selected output is not final",
            desc: "Once the user picks an option, the system surfaces editable fields instead of applying the change directly.",
          },
        ],
      },
      {
        subnavId: "recovery-sd",
        name: "Safe Defaults",
        description:
          "Defaulting to conservative actions prevents harm and sets user-friendly expectations, particularly in early use or high-risk environments.",
        componentLabel: "Component example: Safe Defaults",
        callouts: [
          {
            num: 1,
            title: "Builds trust through predictable, gradual control",
            desc: "Safe, consistent defaults help users gain confidence and expand control at their own pace.",
          },
          {
            num: 2,
            title: "Activation/Deactivation requires explicit user intent",
            desc: "Features that could affect security or behavior are opt-in only.",
          },
        ],
      },
      {
        subnavId: "recovery-ep",
        name: "Escalation Paths",
        description:
          "Agents should never trap users. Providing clear escape routes to human assistance or manual control is vital for safety and trust.",
        componentLabel: "Component example: Escalation Paths",
        callouts: [
          {
            num: 1,
            title: "Manual input and escalation always available",
            desc: "Users can directly provide input or ask their own questions at any time.",
          },
          {
            num: 2,
            title: "Clear option to proceed independently",
            desc: "The \"Go to terminal\" button offers an immediate escape route.",
          },
        ],
      },
    ],
    howToImplement: [
      "Design agents to offer fallback options or manual alternatives instead of total failure",
      "Use feedback from failure and recovery experiences to continuously improve system behavior",
      "Make recovery options easy to find, context-sensitive, and layered from simple to advanced controls",
    ],
    commonPitfalls: [
      {
        title: "Failing to learn from recovery events",
        description:
          "Failing to analyze recovery patterns can lead to repeated mistakes, missing the opportunity to learn from user corrections and improve AI performance over time",
      },
      {
        title: "Lack of granular control",
        description:
          "Using only high-level revision features frustrates users who want to undo specific AI actions without losing their own work",
      },
      {
        title: "Inconsistent recovery experiences",
        description:
          "Recovery mechanisms that work differently across different parts of the system confuse users and create cognitive overhead",
      },
      {
        title: "Unclear recovery guidance",
        description:
          "Users need clear explanations and recovery options when things go wrong. Vague errors and unclear paths lead to frustration and reduced trust",
      },
    ],
  },
  {
    key: "collaboration",
    title: "Collaboration",
    subtitle: "Design for shared effort and mutual input",
    description:
      "Design for shared effort and mutual input between humans and AI agents.",
    whatItMeans:
      "Autonomous agents should act as capable partners, not just tools waiting for commands. Collaboration means shared context, back-and-forth interaction, and joint ownership of outcomes. The agent contributes ideas, takes input, and improves the work in progress.",
    whyItMatters:
      "Collaboration builds stronger results than automation alone. When people and agents shape outcomes together, users stay engaged and push toward more creative, effective solutions.",
    relatedPatterns: [
      {
        subnavId: "collab-mi",
        name: "Mixed Initiative",
        description:
          "This pattern fosters adaptive turn-taking between human and agent. It supports fluid collaboration by allowing both to lead based on context.",
        componentLabel: "Component example: Mixed Initiative",
        callouts: [
          {
            num: 1,
            title: "Agent proactively initiates based on context",
            desc: "Allow the agent to proactively detect issues or make suggestions, especially when it has useful context the user may not.",
          },
          {
            num: 2,
            title: "Build on each other's contributions",
            desc: "Design interactions so the agent can refine its outputs in response to human edits or questions.",
          },
        ],
      },
      {
        subnavId: "collab-ce",
        name: "Co-editing Interfaces",
        description:
          "Shared content and workspace for both AI and humans foster transparency — building clarity and trust.",
        componentLabel: "Component example: Co-editing Interfaces",
        callouts: [
          {
            num: 1,
            title: "Keep AI suggestions non-intrusive",
            desc: "Present changes as proposals, not automatic edits. Let users review, accept, modify, or reject.",
          },
          {
            num: 2,
            title: "Work in shared view",
            desc: "Both AI and human should operate on the same content in the same workspace.",
          },
          {
            num: 3,
            title: "User always has final say",
            desc: "The human is the editor-in-chief. AI assists, but never publishes or commits changes on its own.",
          },
          {
            num: 4,
            title: "Make editing modalities clear",
            desc: "Let users choose how the AI helps — proofreading, rewriting, suggesting changes, etc.",
          },
        ],
      },
      {
        subnavId: "collab-rc",
        name: "Role Clarity & Turn Signals",
        description:
          "Clear handoffs and visible role signals reduce confusion in multi-step tasks. This principle makes collaboration feel more natural and efficient.",
        componentLabel: "Component example: Role Clarity & Turn Signals",
        callouts: [
          {
            num: 1,
            title: "Clear stage-based ownership",
            desc: "Break workflows into visible stages and indicate who leads each one.",
          },
          {
            num: 2,
            title: "Attribute every action",
            desc: "Label actions clearly as system-initiated or human-initiated.",
          },
          {
            num: 3,
            title: "Signal when it's the user's turn",
            desc: "Use prompts, buttons, or callouts to indicate when the system is waiting for user input.",
          },
        ],
      },
    ],
    howToImplement: [
      "Define clear, intuitive ways for control to shift between human and AI",
      "Let the AI learn from collaborative successes and adapt its behavior to match individual user styles and preferences",
      "Maintain a unified workspace that tracks contributions, context, and progress from both human and AI participants",
      "Gracefully handle simultaneous edits with merging, version comparison, or deferring to human review when needed",
    ],
    commonPitfalls: [
      {
        title: "Lack of transparency",
        description:
          "Users don't understand how to influence the agent or override agent actions",
      },
      {
        title: "Assumed alignment",
        description: "The agent acts without confirming intent or context",
      },
      {
        title: "Rigid flows",
        description:
          "The system doesn't adapt when users try to collaborate or redirect",
      },
      {
        title: "Binary choices",
        description: "Only offering accept/reject rather than co-create options",
      },
    ],
  },
  {
    key: "traceability",
    title: "Traceability",
    subtitle: "Make agent behavior visible, searchable & open to review",
    description:
      "Traceability ensures agent decisions can be reviewed, understood, and improved over time.",
    whatItMeans:
      "Traceability ensures agent decisions can be reviewed, understood, and improved over time. It makes behavior accountable across sessions, users, and workflows supporting debugging, learning, and workflow improvements.",
    whyItMatters:
      "As agents evolve, so do their decisions. Traceability allows teams to track changes, understand outcomes, and stay aligned in multi-user environments. It turns opaque processes into something you can audit, learn from, and improve.",
    relatedPatterns: [
      {
        subnavId: "trace-ah",
        name: "Action History",
        description:
          "A chronological record of agent behavior supports traceability and builds long-term accountability in agentic systems.",
        componentLabel: "Component example: Action History",
        callouts: [
          {
            num: 1,
            title: "Make events time-stamped and ordered",
            desc: "List all system and human actions in a clear sequence. Timestamps build trust and help reconstruct events during audits.",
          },
          {
            num: 2,
            title: "Include cause and effect where possible",
            desc: "Show how one step led to the next. This helps users understand the rationale and logic behind changes.",
          },
          {
            num: 3,
            title: "Capture both automated and manual steps",
            desc: "Record not just user input, but also system decisions for a full picture of accountability.",
          },
          {
            num: 4,
            title: "Use clear, plain language",
            desc: "Write log entries in simple, readable terms — no code dumps or vague system jargon.",
          },
        ],
      },
      {
        subnavId: "trace-vd",
        name: "Visual Diffing",
        description:
          "Visual comparisons make agent-driven changes easier to audit and validate. This helps detect subtle alterations or unintended consequences.",
        componentLabel: "Component example: Visual Diffing",
        callouts: [
          {
            num: 1,
            title: "Use side-by-side comparisons",
            desc: "Display the original and updated states in parallel columns.",
          },
          {
            num: 2,
            title: "Include the why, not just the what",
            desc: "Pair the visual change with a short explanation of the reason or logic behind it.",
          },
          {
            num: 3,
            title: "Highlight what changed",
            desc: "Use color or styling to draw attention to fields or values that were modified.",
          },
          {
            num: 4,
            title: "Let the user validate or intervene",
            desc: "Offer a clear way to accept, reject, or adjust the change.",
          },
        ],
      },
      {
        subnavId: "trace-bt",
        name: "Behavior Tuning Over Time",
        description:
          "Adaptive agents learn from usage and tune their actions to better suit user preferences. This supports trust, efficiency, and personalization.",
        componentLabel: "Component example: Behavior Tuning Over Time",
        callouts: [
          {
            num: 1,
            title: "Call out what triggered the change",
            desc: "Clearly state the condition or threshold that caused the system to respond differently than before.",
          },
          {
            num: 2,
            title: "Compare past vs. present behavior",
            desc: "Provide users a way to see what's new vs. what used to happen.",
          },
          {
            num: 3,
            title: "Explain the system's current decision logic",
            desc: "Let users understand why the system acted in this instance and how it may influence future behavior.",
          },
          {
            num: 4,
            title: "Allow control or rollback",
            desc: "Include an option to undo, override, or adjust the system's adaptive behavior.",
          },
        ],
      },
    ],
    howToImplement: [
      "Make it easy to trace outputs back to the inputs, prompts, or interactions that influenced them",
      "Provide interfaces that let users review, filter, and explore past actions and decisions in a structured, searchable way",
      "Record all system and AI actions with timestamps, inputs, outputs, and relevant context to support clear trace trails",
      "Ensure the system's behavior can be independently reviewed and traced to support transparency and hold the system accountable",
    ],
    commonPitfalls: [
      {
        title: "False consistency",
        description: "The system behaves differently in similar situations",
      },
      {
        title: "No feedback loop",
        description: "Users don't see whether the action succeeded or failed",
      },
    ],
  },
];

export default panels;
