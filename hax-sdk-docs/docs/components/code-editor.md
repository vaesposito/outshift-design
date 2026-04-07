# Code Editor

A powerful code editing component with syntax highlighting, multiple language support, and AI-assisted code generation. Perfect for documentation, tutorials, and collaborative coding environments.

## Preview

![Code Editor Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_code_editor_c829ba648c.png)

## Installation

```shell
hax init
hax add artifact code-editor
```

## Usage

The code editor component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create and populate code editors.

## Component Setup

```tsx
import { HAXCodeEditor, useCodeEditorAction } from "@/hax/artifacts/code-editor";

export function DocumentationPage() {
  const [artifacts, setArtifacts] = useState([]);

  useCodeEditorAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle code editor updates
    }
  });

  return (
    <HAXCodeEditor
      language="javascript"
      value={codeContent}
    />
  );
}
```
