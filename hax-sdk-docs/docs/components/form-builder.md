# Form Builder

A dynamic form component with validation, multiple field types, and user-friendly interfaces. Perfect for user registration, settings configuration, surveys, contact forms, and structured data entry workflows.

## Preview

![Form Builder Preview](https://hax-design-prod-s3.s3.us-east-2.amazonaws.com/v4_sdk_form_builder_3c605a1fae.png)

## Installation

```shell
hax init
hax add artifact form
```

## Usage

The form component integrates with AI agents through CopilotKit. Users interact with AI agents through natural language, and the agents automatically create appropriate forms with proper field types and validation.

## Component Setup

```tsx
import { HAXForm, useFormAction } from "@/hax/artifacts/form";

export function RegistrationPage() {
  const [artifacts, setArtifacts] = useState([]);

  useFormAction({
    addOrUpdateArtifact: (type, data) => {
      // Handle form updates
    }
  });

  const handleFormSubmit = (formTitle, data) => {
    console.log('Form submitted:', formTitle, data);
  };

  return (
    <HAXForm
      title="User Registration"
      fields={formFields}
      onFormSubmit={handleFormSubmit}
    />
  );
}
```
