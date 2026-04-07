# Source Attribution

A transparent citation component for displaying claims with their supporting sources as clickable badges. Perfect for research findings, recommendations, fact-checking, and building trust through verifiable information sources.

## Preview

![Source Attribution Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_source_attribution_df5cc12f96.png)

## Installation

```shell
hax init
hax add artifact source-attribution
```

## Usage

The source attribution component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create proper citations with verifiable sources.

## Component Setup

```tsx
import { HAXSourceAttribution, useSourceAttributionAction } from "@/hax/artifacts/source-attribution";

export function ResearchPage() {
  const [artifacts, setArtifacts] = useState([]);

  useSourceAttributionAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle source attribution updates
    }
  });

  return (
    <HAXSourceAttribution
      title="Market Research Findings"
      claim="The global AI market is expected to reach $1.8 trillion by 2030"
      description="Key findings from recent market analysis reports"
      sources={researchSources}
    />
  );
}
```
