# Search Improvement Design

**Date:** 2026-03-24
**Status:** Approved

## Problem

The current search returns too many irrelevant (noisy) results. Users expect stricter matching — typing "reac" should only surface React-related items, not loosely fuzzy-matched noise.

## Root Causes

1. **Fuse.js threshold too permissive** — default `0.6` allows matches with only ~40% similarity, producing many weak results.
2. **No `minMatchCharLength`** — single-character queries match everything.
3. **Results not sorted by score** — `includeScore` is unused, so weaker matches appear alongside strong ones in arbitrary order.
4. **Fuse instance recreated every keystroke** — the index is rebuilt on each `onChange` event, wasting CPU and causing unnecessary re-indexing.

## Approach: Tighten Fuse.js Config

Adjust Fuse.js options and fix instance lifecycle. No architectural changes needed.

### Config Changes

| Setting | Before | After | Effect |
|---|---|---|---|
| `threshold` | `0.6` (default) | `0.3` | Only matches with >70% similarity pass |
| `minMatchCharLength` | `1` (default) | `2` | Single-char queries return nothing |
| `includeScore` | unused | `true` | Results sorted best-first |
| Fuse instance | recreated every keystroke | created once on mount | Faster, no wasted work |

### threshold: 0.3 rationale

Fuse.js threshold ranges from `0` (exact) to `1` (match anything). The current `0.6` is too permissive for a name-only search. `0.3` retains useful typo tolerance (e.g., "recat" still finds "react") while eliminating weak fuzzy matches that share only incidental characters.

## Changes

### `src/containers/AwesomeSearch/AwesomeSearch.jsx`

1. In `getSubjectEntries()` (after building `subjectsArray`), instantiate Fuse once and store as `this.fuse`:
   ```js
   this.fuse = new Fuse(subjectsArray, {
     keys: ['name'],
     threshold: 0.3,
     minMatchCharLength: 2,
     includeScore: true,
   });
   ```

2. In `searchInputOnChangeHandler`, remove the inline Fuse construction and use `this.fuse`:
   ```js
   // Remove:
   const options = { keys: ['name'] };
   const fuse = new Fuse(this.state.subjectsArray, options);
   const result = fuse.search(event.target.value);

   // Replace with:
   const result = this.fuse.search(event.target.value);
   ```

3. In `searchInputOnFocusHandler`, same replacement — use `this.fuse` instead of constructing inline.

## Out of Scope

- Searching by category or description fields
- Displaying match score to users
- Pagination or "load more" for results
- Search history
