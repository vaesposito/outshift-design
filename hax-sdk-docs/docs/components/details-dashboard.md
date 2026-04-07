# Details Dashboard

A comprehensive information display component for presenting detailed data about entities, topics, or processes. Perfect for dashboards, profile pages, report summaries, and data deep-dives with statistics, tables, and hierarchical information.

## Preview

![Details Dashboard Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_details_dashboard_835145a3e7.png)

## Installation

```shell
hax init
hax add artifact details
```

## Usage

The details component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create comprehensive information displays.

## Component Setup

```tsx
import { HAXDetails, useDetailsAction } from "@/hax/artifacts/details";

export function ProfileDashboard() {
  const [artifacts, setArtifacts] = useState([]);

  useDetailsAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle details updates
    }
  });

  return (
    <HAXDetails
      title="User Profile"
      description="Comprehensive user analytics and activity summary"
      stats={topLevelStats}
      subtitle="Performance Metrics"
      substats={detailedMetrics}
      table={activityTable}
    />
  );
}
```
