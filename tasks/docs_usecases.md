# Define Use Cases

## Background

- Guidance has been documented in `CLAUDE.md`
- Requirements have been defined in `docs/requirements.md`
- Expected chat log schema has been documented in `docs/schema.json`

## Task

- Enumerate the use cases necessary to satisfy the requirements definition

## Conditions

- Target files
    - `docs/usecases_web.tsv`
    - `docs/usecases_daemon.tsv`
- Write in TSV format
- `docs/usecase_web.tsv` columns
    - Target path (use wildcards for common layout cases)
    - Use case name
    - Description
- `docs/usecase_daemon.tsv` columns
    - Use case name
    - Description
- Target path and use case name may be duplicated
- The combination of [target path, use case name] must be unique
