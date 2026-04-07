# Mindmap

An interactive mindmap component for visualizing hierarchical relationships and branching concepts. Perfect for brainstorming sessions, project planning, concept mapping, and knowledge organization with automatic layout algorithms.

## Preview

![Mindmap Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_mindmap_357455c6f9.png)

## Installation

```shell
hax init
hax add artifact mindmap
```

## Usage

The mindmap component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create structured mindmaps with appropriate layouts.

## Component Setup

```tsx
import { HAXMindmap, useMindmapAction } from "@/hax/artifacts/mindmap";

export function BrainstormingSession() {
  const [artifacts, setArtifacts] = useState([]);

  useMindmapAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle mindmap updates
    }
  });

  return (
    <HAXMindmap
      title="Project Planning"
      nodes={mindmapNodes}
      connections={mindmapConnections}
      layoutAlgorithm="layered"
    />
  );
}
```
