# Contextual Explanation

A structured explanation component for presenting system changes, agent decisions, or automated actions with supporting details and action buttons.

## Preview

![Contextual Explanation Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_contextual_explanation_bacc3b8c92.png)

## Installation

```shell
hax init
hax add artifact contextual-explanation
```

## Usage

The contextual explanation component integrates with AI agents through CopilotKit. Agents automatically create explanation cards when they need to communicate why something happened, with structured details and action buttons.

## Component Setup

```tsx
import { HAXContextualExplanation, useContextualExplanationAction } from "@/hax/artifacts/contextual-explanation";

export function SystemEventsPage() {
  const [artifacts, setArtifacts] = useState([]);

  useContextualExplanationAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXContextualExplanation
      title="Network Routing Update"
      alertTitle="Why this happened"
      alertDescription="Agent detected high latency and switched to backup route"
      details={[
        { label: "Previous Route", value: "us-west-1 → us-east-1", isBoldLabel: true },
        { label: "New Route", value: "us-west-1 → eu-west-1 → us-east-1", isBoldLabel: true },
        { label: "Latency Improvement", value: "45ms → 28ms (-38%)" }
      ]}
      secondaryButtonLabel="Revert"
      primaryButtonLabel="Keep Change"
    />
  );
}
```
