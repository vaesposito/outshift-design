# Inline Rationale

A component for displaying AI-driven assessments, decisions, and explanations with intent-based visual theming. Ideal for security assessments, code reviews, policy decisions, and any AI-generated rationale that needs clear visual distinction.

## Preview

![Inline Rationale Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_inline_rationale_c95093e87a.png)

## Installation

```shell
hax init
hax add artifact inline-rationale
```

## Usage

The inline rationale component integrates with AI agents through CopilotKit. Agents automatically create rationale cards with appropriate intent-based theming based on the assessment type.

## Component Setup

```tsx
import { HAXInlineRationale, useInlineRationaleAction } from "@/hax/artifacts/inline-rationale";

export function AssessmentPage() {
  const [artifacts, setArtifacts] = useState([]);

  useInlineRationaleAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXInlineRationale
      assessmentType="security_assessment"
      intent="block"
      title="SQL Injection Vulnerability Detected"
      description="A critical vulnerability was found."
      summary={{ impact: "critical", exploitability: "high" }}
      rationale={[{ label: "Location", value: "src/api/users.ts:45" }]}
      confidence={95}
    />
  );
}
```
