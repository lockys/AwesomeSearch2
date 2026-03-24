# Search Improvement Design

**Date:** 2026-03-24
**Status:** Approved

## Problem

The current search returns too many irrelevant (noisy) results. Users expect stricter matching — typing "reac" should only surface React-related items, not loosely fuzzy-matched noise.

## Root Causes

1. **Fuse.js threshold too permissive** — default `0.6` allows matches with only ~40% similarity, producing many weak results.
2. **No `minMatchCharLength`** — single-character queries match everything.
3. **Results not sorted by relevance** — Fuse.js returns sorted results by default but the current instance is configured with defaults, meaning weaker matches appear in arbitrary positions.
4. **Fuse instance recreated every keystroke** — the index is rebuilt on each `onChange` event, wasting CPU.

## Approach: Tighten Fuse.js Config

Adjust Fuse.js options and fix instance lifecycle. No architectural changes.

### Config Changes

| Setting | Before | After | Effect |
|---|---|---|---|
| `threshold` | `0.6` (default) | `0.3` | Stricter matching — allows small typos, rejects loose matches |
| `minMatchCharLength` | `1` (default) | `2` | Single-char queries return no results |
| Fuse instance | recreated every keystroke | created once after data loads | Faster, no wasted work |

**Note on `includeScore`:** Intentionally omitted. Fuse.js v6 always wraps results as `{ item, refIndex }[]` and already returns them sorted best-first by default — no extra configuration is needed. Adding `includeScore: true` would only add a `score` field that no consumer uses; the downstream `AwesomeInput` component already accesses `el.item.name` / `el.item.repo` / `el.item.cate` correctly.

### threshold: 0.3 rationale

Fuse.js threshold ranges from `0` (exact match only) to `1` (match anything). `0.3` is a moderately strict threshold: it allows small typos ("recat" → "react") while rejecting weak fuzzy matches that share only incidental characters. The current `0.6` is too permissive for a name-only search against short strings.

## Changes

### `src/containers/AwesomeSearch/AwesomeSearch.jsx`

**1. Instantiate Fuse once after data loads, in `getSubjectEntries()`:**

Use the local `subjectsArray` variable (built by the `reduce` call) immediately before calling `this.setState({ subjectsArray })`. Do not use `this.state.subjectsArray` — that is asynchronous and may not reflect the new value yet.

```js
// After the reduce call, before setState:
this.fuse = new Fuse(subjectsArray, {
  keys: ['name'],
  threshold: 0.3,
  minMatchCharLength: 2,
});
this.setState({ subjectsArray: subjectsArray });
```

**2. Update `searchInputOnChangeHandler`:**

Add a null guard and use `this.fuse` instead of constructing a new instance inline:

```js
searchInputOnChangeHandler = (event) => {
  if (!this.fuse) return;
  const result = this.fuse.search(event.target.value);
  this.setState({
    search: event.target.value,
    searchResult: result.slice(0, 20),
    showResult: true,
  });
};
```

Remove the `options` object and inline `new Fuse(...)` that are currently there.

**3. Update `searchInputOnFocusHandler`:**

The focus handler must always set `showResult: true` (its primary purpose). Only skip the search call if `this.fuse` is not yet available:

```js
searchInputOnFocusHandler = () => {
  const { search } = this.state;
  const updates = { showResult: true };
  if (this.fuse && search) {
    updates.searchResult = this.fuse.search(search).slice(0, 20);
  }
  this.setState(updates);
};
```

Remove the `subjectsArray.length > 0` guard (replaced by `this.fuse` null check) and the inline `new Fuse(...)`.

## UX Behavior Notes

- **Single-character input:** With `minMatchCharLength: 2`, typing one character returns an empty results list (no dropdown items shown). This is intentional — it eliminates noise from queries like "a" or "c" that currently match hundreds of items.
- **Data not yet loaded:** If the user focuses the search input before the awesome.json fetch completes, `this.fuse` is null. The focus handler still sets `showResult: true` but skips the search, leaving `searchResult` as an empty array. No crash, no stale results.

## Out of Scope

- Searching by category or description fields
- Displaying match score to users
- Pagination or "load more" for results
- Search history
