---
name: redux-state-normalization
description: "Guidance for normalizing Redux state shape to eliminate data duplication, simplify reducers, and improve performance. Use when designing Redux state for relational or nested data, refactoring deeply nested state, modeling one-to-many or many-to-many entity relationships, transforming API responses with Normalizr, or reviewing Redux state structure for maintainability issues."
---

# Redux State Normalization

Normalized state stores each piece of data in one place, referenced by ID elsewhere — like a
relational database in Redux.

## When to Normalize

Normalize when state has:
- Repeated nested objects (same user object in multiple posts)
- Updates that must be reflected in multiple places
- Deep nesting that makes reducer logic complex
- Performance issues from re-rendering unrelated components

## Core Rules

1. Each entity type gets its own lookup table (`byId` + `allIds`)
2. Reference related entities by ID, never embed them
3. Use join tables for many-to-many relationships
4. Separate entities, UI state, and simple domain data at the top level

## Quick Reference

```js
// Entity table shape
{
  entityType: {
    byId: { "id1": { id: "id1", ...fields } },
    allIds: ["id1", "id2"]  // preserves order
  }
}
```

## Detailed Patterns

See [references/normalization-patterns.md](references/normalization-patterns.md) for:
- One-to-many and many-to-many relationship examples
- Reducer patterns (add/update/delete/batch upsert)
- Top-level state organization (entities / ui / domain)
- Normalizr schema definitions and usage

Load that file when implementing any of those patterns.
