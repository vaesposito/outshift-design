# Data Visualizer

A powerful chart and graph component built on Chart.js for displaying quantitative data and trends. Perfect for dashboards, analytics, and data-driven insights with support for all major chart types.

## Preview

![Data Visualizer Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_data_visualizer_ea095ad957.png)

## Installation

```shell
hax init
hax add artifact data-visualizer
```

## Usage

The data visualizer component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create appropriate charts and graphs.

## Component Setup

```tsx
import { HAXDataVisualizer, useDataVisualizerAction } from "@/hax/artifacts/data-visualizer";

export function AnalyticsDashboard() {
  const [artifacts, setArtifacts] = useState([]);

  useDataVisualizerAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle chart updates
    }
  });

  return (
    <HAXDataVisualizer
      type="line"
      data={chartData}
      options={chartOptions}
    />
  );
}
```
