# Improve Upsert Processing

## Background

- Added guidance to `CLAUDE.md`
- Multiple repository adapters exist in `src/core/adapters/` directory
- Drizzle has `onConflictDoUpdate` method

## Task

- Since the same log file may be processed duplicately, use `onConflictDoUpdate` in `create` method for upsert processing
- Remove `upsert` method as it becomes unnecessary
