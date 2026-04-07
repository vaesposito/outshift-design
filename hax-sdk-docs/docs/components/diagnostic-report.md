# Diagnostic Report

A structured table component for presenting diagnostic findings with confidence levels, rationale, and actionable recommendations. Ideal for troubleshooting, root cause analysis, and system health assessments.

## Preview

![Diagnostic Report Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_diagnostic_report_7b255baa32.png)

## Installation

```shell
hax init
hax add artifact diagnostic-report
```

## Usage

The diagnostic report integrates with AI agents through CopilotKit. Agents automatically create diagnostic tables when presenting troubleshooting results, root cause analysis, or system health assessments.

## Component Setup

```tsx
import { HAXDiagnosticReport, useDiagnosticReportAction } from "@/hax/artifacts/diagnostic-report";

export function TroubleshootingPage() {
  const [artifacts, setArtifacts] = useState([]);

  useDiagnosticReportAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXDiagnosticReport
      title="Service Degradation Analysis"
      items={[
        {
          id: "1",
          suspectedCause: "Memory leak in workers",
          confidence: 85,
          confidenceLevel: "high",
          rationale: "Heap grows 12MB/hr under load",
          recommendedAction: "Profile heap"
        },
        {
          id: "2",
          suspectedCause: "Connection pool exhaustion",
          confidence: 62,
          confidenceLevel: "medium",
          rationale: "Pool nearing max at peak traffic",
          recommendedAction: "Increase pool size"
        }
      ]}
    />
  );
}
```
