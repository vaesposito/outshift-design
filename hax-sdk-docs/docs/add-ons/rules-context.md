# Rules Context

A powerful rule management system that allows users to create, configure, and apply behavioral rules that govern how AI agents respond in different scenarios. Provides persistent rule storage, import/export capabilities, and seamless integration with chat conversations.

## Preview

![Rules Context Preview](https://cisco-outshift.s3.ap-south-1.amazonaws.com/agntcy/v4-sdk-rulescontext.png)

### Features

- Create custom rules with names, descriptions, and content
- Toggle rules active/inactive for different contexts
- Import rules from files (`.rules`, `.cursorrules`, etc.)
- Persistent storage in browser localStorage

## Installation

```shell
hax init
hax add composer rules-context
```

## Usage

The rules context system provides a management interface and context integration for behavioral rules.

## Component Setup

```tsx
import { RulesProvider, useRules, RulesModal } from "@/hax/composer/rules-context";

export function ChatWithRules() {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <RulesProvider>
      <div className="chat-interface">
        <button onClick={() => setShowRulesModal(true)}>
          Manage Rules
        </button>
        <RulesModal
          open={showRulesModal}
          onOpenChange={setShowRulesModal}
        />
        {/* Chat interface */}
      </div>
    </RulesProvider>
  );
}
```
