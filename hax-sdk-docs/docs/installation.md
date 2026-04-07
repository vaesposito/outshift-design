# Installation

Complete setup guide for installing and configuring HAX in your project.

## Overview

HAX (Human-Agent eXperience) is a modular system that enhances chat interfaces with structured commands, behavioral rules, and external agent integration.

### Prerequisites

- Node.js 18+ and npm
- An existing React/Next.js project
- CopilotKit already installed in your project

## Install HAX

```shell
npm install @outshift-open/hax
npm install -g @outshift-open/hax-cli
```

Initialize HAX in your project:

```shell
hax init
```

This creates:

- `hax/` directory in your project root
- Base configuration files
- TypeScript definitions
- Initial project structure

## Configure HAX

The `hax init` command creates a base configuration file at `hax/config.ts`:

```tsx
export const haxConfig = {
  version: "1.0.0",
  components: [],

  chat: {
    enableCommands: false,
    enableFileUpload: false,
    enableRules: false,
  },

  adapter: {
    enabled: false,
    protocol: "REST",
    baseURL: "",
  }
};
```

## Add Components

Use the HAX CLI to add specific components to your project:

```shell
# Add an artifact component
hax add artifact source-attribution

# Add a composer
hax add composer chat-commands

# Add a UI component
hax add ui button
```

Each component is self-contained with its own types, actions, and rendering logic.

---
