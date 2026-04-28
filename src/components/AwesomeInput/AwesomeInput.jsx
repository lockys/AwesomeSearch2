import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import classes from './AwesomeInput.module.css';

function Kbd({ children }) {
  return (
    <span className={classes.Kbd}>{children}</span>
  );
}

function MatchBar({ score }) {
  // Fuse score: 0 = perfect, threshold (0.3) = worst shown
  const pct = Math.round(Math.max(0, Math.min(1, 1 - (score || 0) / 0.3)) * 100);
  return (
    <div className={classes.MatchBarWrap}>
      <div className={classes.MatchBarTrack}>
        <div className={classes.MatchBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={classes.MatchScore}>
        .{String((score || 0).toFixed(2)).slice(2).padEnd(2, '0')}
      </span>
    </div>
  );
}

function Highlight({ text, query }) {
  if (!query || query.length < 2) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const hit = lower.indexOf(q);
  if (hit !== -1) {
    return (
      <>
        {text.slice(0, hit)}
        <span className={classes.MatchHit}>{text.slice(hit, hit + q.length)}</span>
        {text.slice(hit + q.length)}
      </>
    );
  }
  // Subsequence highlight
  const out = [];
  let ti = 0;
  for (let qi = 0; qi < q.length && ti < text.length; qi++) {
    while (ti < text.length && text[ti].toLowerCase() !== q[qi]) {
      out.push(<span key={`p${ti}`}>{text[ti]}</span>);
      ti++;
    }
    if (ti < text.length) {
      out.push(<span key={`h${ti}`} className={classes.MatchHit}>{text[ti]}</span>);
      ti++;
    }
  }
  if (ti < text.length) out.push(<span key="rest">{text.slice(ti)}</span>);
  return <>{out}</>;
}

const AwesomeInput = ({
  query,
  setQuery,
  results,
  isCategoryFilter = false,
  onOpen,
  onClear,
  autoFocus = true,
}) => {
  const [selected, setSelected] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const handleResultsScroll = useCallback((e) => {
    const el = e.currentTarget;
    setScrolled(el.scrollTop > 40);
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      navigator.vibrate?.(50);
    }
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [results]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${selected}"]`);
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      onOpen(results[selected].item.repo);
    } else if (e.key === 'Tab' && results.length > 0) {
      e.preventDefault();
      setQuery(results[0].item.name);
    } else if (e.key === 'Escape') {
      onClear?.();
    }
  };

  const hasResults = results.length > 0;
  const noResults = query.trim().length >= 2 && !hasResults;

  return (
    <div className={classes.SearchView}>
      {/* Input row */}
      <div className={`${classes.InputSection} ${scrolled ? classes.InputSectionScrolled : ''}`}>
        <div className={classes.SubLabel}>
          Fuzzy search · {query ? `${results.length} matches` : 'type to search'}
        </div>
        <div className={classes.InputBox}>
          <span className={classes.InputPrompt}>❯</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search awesome lists… (try: react, python, docker)"
            className={classes.Input}
            data-testid="search-input"
            aria-label="Search awesome lists"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={onClear}
              className={classes.ClearBtn}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className={classes.Hints}>
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
          <span><Kbd>↵</Kbd> open</span>
          <span><Kbd>⇥</Kbd> complete top</span>
          <span className={classes.HintsRight}>
            threshold <span className={classes.HintVal}>0.3</span>
            &nbsp;·&nbsp;min <span className={classes.HintVal}>2</span>
          </span>
        </div>
      </div>

      {/* Results */}
      {noResults && (
        <div className={classes.EmptyState}>
          <div className={classes.EmptyIcon}>∅</div>
          <div className={classes.EmptyTitle}>
            No matches for <span className={classes.HintVal}>"{query}"</span>
          </div>
          <div className={classes.EmptyHint}>Try fewer or different characters.</div>
        </div>
      )}

      {hasResults && (
        <div ref={listRef} className={classes.ResultList} onScroll={handleResultsScroll} data-testid="search-results">
          {results.map((r, idx) => {
            const isSel = idx === selected;
            return (
              <div
                key={r.item.repo + idx}
                data-idx={idx}
                onMouseEnter={() => setSelected(idx)}
                onClick={() => onOpen(r.item.repo)}
                className={`${classes.ResultRow} ${isSel ? classes.ResultRowSel : ''}`}
                role="option"
                aria-selected={isSel}
                data-testid="search-result-item"
              >
                {isSel && <div className={classes.SelAccent} />}
                <div className={classes.RepoName} data-testid="search-result-link">
                  <Highlight text={r.item.name} query={isCategoryFilter ? '' : query} />
                </div>
                <div className={classes.RepoPath}>{r.item.repo}</div>
                <span className={classes.CatBadge}>{r.item.cate}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default withRouter(AwesomeInput);
