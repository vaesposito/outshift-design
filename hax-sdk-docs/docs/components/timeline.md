# Timeline

A chronological activity tracker with status indicators and AI agent integration. Perfect for project tracking, process workflows, and real-time status updates.

## Preview

![Activity Timeline](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_timeline_8570b08804.png)

## Installation

```shell
hax init
hax add artifact timeline
```

## Usage

The timeline component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create and update timeline activities with appropriate status indicators.

## Component Setup

```tsx
import { HAXTimeline, useTimelineAction } from "@/hax/artifacts/timeline";

export function ProjectTracker() {
  const [artifacts, setArtifacts] = useState([]);

  useTimelineAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle timeline updates
    }
  });

  return (
    <HAXTimeline
      title="Project Activity"
      items={timelineActivities}
    />
  );
}
```
