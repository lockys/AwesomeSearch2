# Search Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten Fuse.js search config to eliminate noisy results and fix the instance lifecycle so it's created once after data loads.

**Architecture:** Single file change to `AwesomeSearch.jsx`. Store the Fuse instance as `this.fuse` on the class after data loads, replace all inline `new Fuse(...)` calls with `this.fuse`, and add null guards to both handler methods.

**Tech Stack:** React 18 (class component), Fuse.js v6, Vitest + React Testing Library

---

## File Map

- **Modify:** `src/containers/AwesomeSearch/AwesomeSearch.jsx` — add `this.fuse` instantiation in `getSubjectEntries`, update `searchInputOnChangeHandler` and `searchInputOnFocusHandler`
- **Modify:** `src/containers/AwesomeSearch/AwesomeSearch.test.jsx` — add tests for single-char suppression and search behavior with new threshold

---

### Task 1: Write failing tests for the new search behavior

**Files:**
- Modify: `src/containers/AwesomeSearch/AwesomeSearch.test.jsx`

- [ ] **Step 1: Add test data with enough items to exercise fuzzy matching**

Open `src/containers/AwesomeSearch/AwesomeSearch.test.jsx`. Replace the existing `mockSubjects` with a richer dataset that makes threshold and minMatchCharLength assertions meaningful:

```js
const mockSubjects = {
  'Front-End': [
    { name: 'React', repo: 'sindresorhus/awesome-react', cate: 'Front-End' },
    { name: 'Vue.js', repo: 'vuejs/awesome-vue', cate: 'Front-End' },
    { name: 'Angular', repo: 'PatrickJS/awesome-angular', cate: 'Front-End' },
  ],
  'Back-End': [
    { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' },
    { name: 'Django', repo: 'wsvincent/awesome-django', cate: 'Back-End' },
    { name: 'Rails', repo: 'gramantin/awesome-rails', cate: 'Back-End' },
  ],
};
```

- [ ] **Step 2: Add import for fireEvent**

At the top of the test file, add `fireEvent` to the RTL import:

```js
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
```

- [ ] **Step 3: Write test — single-char input suppresses results**

Add this test inside the `describe('AwesomeSearch', ...)` block:

```js
it('does not show search results when only one character is typed', async () => {
  axios.get.mockResolvedValue({ data: mockSubjects });
  render(
    <MemoryRouter>
      <AwesomeSearch {...defaultProps} />
    </MemoryRouter>
  );

  // Wait for data to load
  const input = await screen.findByPlaceholderText('Search AwesomeLists!');

  // Type a single character
  fireEvent.change(input, { target: { value: 'R' } });

  // No result items should be visible
  expect(screen.queryByRole('link', { name: /React/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 4: Write test — close match query returns results**

```js
it('shows matching results when query closely matches a list name', async () => {
  axios.get.mockResolvedValue({ data: mockSubjects });
  render(
    <MemoryRouter>
      <AwesomeSearch {...defaultProps} />
    </MemoryRouter>
  );

  const input = await screen.findByPlaceholderText('Search AwesomeLists!');

  fireEvent.change(input, { target: { value: 'React' } });

  await waitFor(() => {
    expect(screen.getByRole('link', { name: /React/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Write test — weak match does not appear**

This tests that threshold 0.3 rejects weak fuzzy matches. "zzz" has no meaningful similarity to any list name:

```js
it('does not show results for a query with no close matches', async () => {
  axios.get.mockResolvedValue({ data: mockSubjects });
  render(
    <MemoryRouter>
      <AwesomeSearch {...defaultProps} />
    </MemoryRouter>
  );

  const input = await screen.findByPlaceholderText('Search AwesomeLists!');

  fireEvent.change(input, { target: { value: 'zzz' } });

  // None of the mock list names should appear
  expect(screen.queryByRole('link', { name: /React/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Node/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 6: Run tests to confirm they fail (or pass on pre-existing behavior)**

```bash
npm test -- --reporter=verbose 2>&1 | tail -40
```

Expected: The single-char test likely passes already (the current code may produce no results for "R" with default Fuse config — but it still exercises the right behavior). The close-match test should pass. The no-match test should pass. If any fail unexpectedly, note the failure message before moving on.

---

### Task 2: Implement the Fuse.js config changes

**Files:**
- Modify: `src/containers/AwesomeSearch/AwesomeSearch.jsx:32-65` (getSubjectEntries), `88-111` (the two handlers)

- [ ] **Step 1: Add `this.fuse` instantiation in `getSubjectEntries`**

Find the `getSubjectEntries` method. After the `reduce` call that builds `subjectsArray` (line ~47-50) and before `this.setState({ subjectsArray })`, add:

```js
this.fuse = new Fuse(subjectsArray, {
  keys: ['name'],
  threshold: 0.3,
  minMatchCharLength: 2,
});
```

The surrounding context should look like this after the change:

```js
let subjectsArray = Object.keys(subjects.data)
  .map((subject) => subjects.data[subject])
  .reduce((arr, el) => arr.concat(el), []);

this.fuse = new Fuse(subjectsArray, {
  keys: ['name'],
  threshold: 0.3,
  minMatchCharLength: 2,
});

this.setState({ subjectsArray: subjectsArray });
```

- [ ] **Step 2: Replace `searchInputOnChangeHandler` inline Fuse with `this.fuse`**

Replace the entire method body:

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

- [ ] **Step 3: Replace `searchInputOnFocusHandler` inline Fuse with `this.fuse`**

Replace the entire method body:

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

Note: the `subjectsArray` destructure is no longer needed in this handler — remove it.

- [ ] **Step 4: Run tests to confirm all pass**

```bash
npm test -- --reporter=verbose 2>&1 | tail -40
```

Expected: All tests pass, including the three new ones added in Task 1.

- [ ] **Step 5: Commit**

```bash
git add src/containers/AwesomeSearch/AwesomeSearch.jsx src/containers/AwesomeSearch/AwesomeSearch.test.jsx
git commit -m "feat: tighten Fuse.js search config to reduce noisy results"
```
