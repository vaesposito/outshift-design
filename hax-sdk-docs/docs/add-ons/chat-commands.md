# Chat Commands

An enhanced chat interface system that transforms traditional text conversations into structured, command-driven interactions. Enables precise agent delegation, context management, and tool execution through intuitive command syntax.

## Preview

![Chat Commands Preview](https://cisco-outshift.s3.ap-south-1.amazonaws.com/agntcy/v4-sdk-chatcommands.png)

### Command Syntax

- `@agent` — Delegate tasks to specific agents
- `+file` — Add files and context to conversations
- `/tool` — Force execution of specific tools

## Installation

```shell
hax init
hax add composer chat-commands
```

## Usage

The chat commands system enhances existing chat interfaces with structured command processing and intelligent suggestions.

## Component Setup

```tsx
import { CommandRegistryProvider, useChatCommands, CommandSuggestions, CommandHints } from "@/hax/composer/chat-commands";

export function EnhancedChat() {
  const { commandType, showSuggestions, detectCommand } = useChatCommands();

  return (
    <CommandRegistryProvider>
      <div className="chat-interface">
        <CommandHints showSuggestions={showSuggestions} />
        <textarea
          onChange={(e) => detectCommand(e.target.value, e.target.selectionStart)}
        />
        <CommandSuggestions
          showSuggestions={showSuggestions}
          commandType={commandType}
        />
      </div>
    </CommandRegistryProvider>
  );
}
```
