# Capability Manifest

A component for displaying AI agent capabilities, constraints, alerts, and connection status. Essential for setting user expectations during agent initialization and preventing mental model mismatches.

## Preview

![Capability Manifest Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_capability_manifest_6dca181fbd.png)

## Installation

```shell
hax init
hax add artifact capability-manifest
```

## Usage

The capability manifest component displays agent capabilities at session start. Agents dynamically render their available tools, constraints, and connection status in a standardized format.

## Component Setup

```tsx
import { HAXCapabilityManifest, useCapabilityManifestAction } from "@/hax/artifacts/capability-manifest";

export function AgentHandshake() {
  const [artifacts, setArtifacts] = useState([]);

  useCapabilityManifestAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data, id: Date.now() }]);
    }
  });

  return (
    <HAXCapabilityManifest
      data={{
        agentName: "Data Analyst",
        agentRole: "Agent",
        statusText: "Ready for interaction",
        capabilities: [
          { id: "1", name: "SQL Query", status: "enabled" },
          { id: "2", name: "Visualization", status: "enabled" }
        ],
        connectionStatus: "connected",
        sessionId: "HAX-2024-001"
      }}
    />
  );
}
```
