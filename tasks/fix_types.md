# Improve Types

## Background

- Added guidance to `CLAUDE.md`
- Defined requirements in `docs/requirements.md`
- Organized claude domain types and type guards in `src/core/domain/claude/types.ts`
    - `SDKMessage`: Message returned when sending messages
    - `AssistantContent` `UserContent`: Type of `content` included in `SDKMessage` and log files, stored in message repository
- Added function to parse `content` in `src/core/domain/claude/ports/claudeService.ts`

## Task

- Refactor backend using types
- Refactor frontend using types
