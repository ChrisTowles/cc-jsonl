# Improve Chat UI

## Background

- Added guidance to `CLAUDE.md`
- Defined requirements in `docs/requirements.md`
- Documented expected chat log schema in `docs/schema.json`
- Created sample chat log data in `samples/`
- Implemented chat interface component in `src/components/chat/ChatInterface.tsx`
- Implemented message content display component in `src/components/chat/MessageContent.tsx`

## Task

- Support all Tools
- Improve message display methods
    - For ToolUse Bash, display up to `command` and put the entire `input` in `<details>`
    - For ToolUse Read, display up to `path` and put the entire `input` in `<details>`
    - Be creative with other tools according to specifications
