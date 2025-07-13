# Change Claude Code Library

## Background

- Added guidance to `CLAUDE.md`
- Defined requirements in `docs/requirements.md`
- Incorrect Claude Code SDK is being used for message sending

## Task

- Change from `@anthropic-ai/sdk` to `@anthropic-ai/claude-code`

## Conditions

- Usage: <https://docs.anthropic.com/ja/docs/claude-code/sdk#typescript>
- Always specify session model `cwd` when sending messages
- Specify session ID when sending to existing session

## How to specify session ID and cwd

```ts
query({
  ...params,
  options: {
    resume: `${sessionId}`,
    cwd: `${cwd}`
  }
});
```
