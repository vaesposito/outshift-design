# Custom Repositories

Extend HAX with custom component repositories to share artifacts, composers, and UI components across teams and organizations.

## Overview

HAX supports multiple component repositories, allowing you to:

- Share components internally across teams and projects
- Create private component libraries for your organization
- Fork and customize existing HAX components
- Distribute specialized components for specific domains
- Maintain version control over component updates

## Repository Structure

A HAX repository follows a standardized structure:

```
your-hax-repo/
├── cli/src/registry/github-registry/
│   ├── artifacts.json
│   ├── ui.json
│   └── composers.json
├── hax/
│   ├── artifacts/
│   ├── components/ui/
│   └── composers/
├── templates/
└── docs/
```

## Setting Up a Custom Repository

Create a new repository structure:

```shell
# Initialize a new HAX registry repository
hax admin init-registry --github=your-org/your-hax-components

# Or initialize locally and push manually
mkdir my-hax-components
cd my-hax-components
hax admin init-registry --local
```

## Add Components

Add your custom components to the appropriate directories:

```shell
# Add an artifact component
cp -r my-custom-timeline hax/artifacts/
# Update artifacts.json with component metadata

# Add a UI component
cp my-button.tsx hax/components/ui/
# Update ui.json with component metadata

# Add a composer
cp -r my-chat-feature hax/composers/
# Update composers.json with component metadata
```

## Update Registry Metadata

Edit the JSON files to register your components:

```json
{
  "my-timeline": {
    "type": "registry:artifacts",
    "dependencies": ["react", "date-fns"],
    "registryDependencies": ["button"],
    "files": [
      { "name": "timeline.tsx", "type": "registry:component" },
      { "name": "action.ts", "type": "registry:hook" },
      { "name": "types.ts", "type": "registry:types" },
      { "name": "index.ts", "type": "registry:index" }
    ]
  }
}
```

## Validate Registry

Ensure your repository structure is correct:

```shell
hax admin validate-registry
```
