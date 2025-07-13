# Improve Models

## Background

- Added guidance to `CLAUDE.md`
- Defined requirements in `docs/requirements.md`
- Documented expected chat log schema in `docs/schema.json`
- Model definitions are inappropriate

## Task

- Improve model definitions
- Modify database schema to match model definitions
- Modify logic to match model definitions

## Conditions

- Add LogEntryBase `uuid`, `parentUuid`, `cwd` to message model
    - `uuid` should be unique, upsert if duplicated
- Add `cwd` to session model as well
    - Use the latest message's `cwd` as the session's `cwd`
- SummaryLog can be ignored
