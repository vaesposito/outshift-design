# Thinking Process

A component for visualizing AI reasoning, decision-making steps, and workflow progress with collapsible sections and status indicators.

## Preview

![Thinking Process Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_thinking_process_a40f14a67e.png)

## Installation

```shell
hax init
hax add artifact thinking-process
```

## Usage

The thinking process component integrates with AI agents through CopilotKit. Agents automatically create reasoning visualizations when performing multi-step analysis, debugging, or decision-making workflows.

## Component Setup

```tsx
import { HAXThinkingProcess, useThinkingProcessAction } from "@/hax/artifacts/thinking-process";

export function AnalysisPage() {
  const [artifacts, setArtifacts] = useState([]);

  useThinkingProcessAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXThinkingProcess
      title="AI Reasoning"
      badge="HAX 04"
      steps={[
        { id: "1", title: "Analyzing input data", description: "Processing user query", status: "completed" },
        { id: "2", title: "Searching knowledge base", status: "in-progress" },
        { id: "3", title: "Generating response", status: "pending" }
      ]}
      metrics={[
        { label: "Steps Completed", value: "1/3" },
        { label: "Confidence", value: "85%" }
      ]}
    />
  );
}
```
