# Refactor Watcher

## Background

- Added guidance to `CLAUDE.md`
- Defined requirements in `docs/requirements.md`
- Implemented monitoring and storage service in `src/watcher/` directory
- `src/watcher/` deviates from hexagonal architecture design

## Task

- Implement the processing in `src/watcher/` directory as an application service that combines adapters
