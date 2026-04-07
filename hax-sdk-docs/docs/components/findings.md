# Findings

A component for displaying key insights, recommendations, or discoveries with source attribution chips for credibility and verification.

## Preview

![Findings Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_findings_2b1f14920b.png)

## Installation

```shell
hax init
hax add artifact findings
```

## Usage

The findings component integrates with AI agents through CopilotKit. Agents automatically create findings panels when presenting research results, audit findings, or analysis summaries with source references.

## Component Setup

```tsx
import { HAXFindings, useFindingsAction } from "@/hax/artifacts/findings";

export function ResearchPage() {
  const [artifacts, setArtifacts] = useState([]);

  useFindingsAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXFindings
      title="Security Audit Results"
      findings={[
        {
          id: "1",
          title: "SQL Injection Vulnerability",
          description: "Unsanitized user input in authentication module",
          sources: [
            { label: "OWASP Top 10" },
            { label: "CVE-2024-1234" }
          ]
        },
        {
          id: "2",
          title: "Database Query Optimization",
          description: "N+1 query pattern detected in orders endpoint",
          sources: [{ label: "APM Report" }]
        }
      ]}
    />
  );
}
```
