# File Upload

A file sharing system that integrates with chat interfaces to provide seamless file upload capabilities with AI agents. Supports drag-and-drop, file picker, and inline file management.

## Preview

![File Upload Preview](https://cisco-outshift.s3.ap-south-1.amazonaws.com/agntcy/v4-sdk-fileupload.png)

## Installation

```shell
hax init
hax add composer file-upload
```

## Usage

The file upload system integrates with chat interfaces to provide seamless file sharing capabilities with AI agents.

## Component Setup

```tsx
import { useFileUploadAction, FilePickerInput, DragAndDropZone } from "@/hax/composer/file-upload";

export function ChatWithFileUpload() {
  const [artifacts, setArtifacts] = useState([]);

  useFileUploadAction({
    addOrUpdateArtifact: (type, data) => {
      setArtifacts(prev => [...prev, { type, data }]);
    }
  });

  return (
    <div className="chat-interface">
      <FilePickerInput
        onFileSelection={handleFiles}
        dragAndDropEnabled={true}
      />
      {/* Chat messages */}
    </div>
  );
}
```
