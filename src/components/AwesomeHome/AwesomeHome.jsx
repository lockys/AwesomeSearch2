import React, { useState, useEffect, useRef } from 'react';
import classes from './AwesomeHome.module.css';

const FULL_TEXT = 'awesomesearch';
const MAIN_LEN = 7; // 'awesome' | 'search'
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz';

function AnimatedWordmark({ triggerRef }) {
  const containerRef = useRef(null);
  const lockedRef = useRef(new Set());

  const [lockedSet, setLockedSet] = useState(new Set());
  const [chars, setChars] = useState(() =>
    Array.from(FULL_TEXT, () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
  );

  useEffect(() => {
    const START = 180;
    const GAP = 80;

    const lockTimeouts = Array.from(FULL_TEXT, (_, i) =>
      setTimeout(() => {
        lockedRef.current = new Set([...lockedRef.current, i]);
        setLockedSet(new Set(lockedRef.current));
      }, START + i * GAP)
    );

    const scrambleId = setInterval(() => {
      setChars(
        Array.from(FULL_TEXT, (ch, i) =>
          lockedRef.current.has(i)
            ? ch
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
      );
    }, 55);

    const stopId = setTimeout(
      () => clearInterval(scrambleId),
      START + FULL_TEXT.length * GAP + 300
    );

    return () => {
      lockTimeouts.forEach(clearTimeout);
      clearTimeout(stopId);
      clearInterval(scrambleId);
    };
  }, []);

  useEffect(() => {
    let rafId = null;
    triggerRef.current = (clientX) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const spans = containerRef.current.querySelectorAll('[data-ch]');
        spans.forEach((span) => {
          if (clientX === null) {
            span.style.transform = '';
          } else {
            const r = span.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const dist = Math.abs(clientX - cx);
            const raise = Math.max(0, 20 * Math.exp(-(dist * dist) / (2 * 55 * 55)));
            span.style.transform = raise > 0.3 ? `translateY(-${raise.toFixed(1)}px)` : '';
          }
        });
      });
    };
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      triggerRef.current = null;
    };
  }, [triggerRef]);

  return (
    <span className={classes.Wordmark} ref={containerRef}>
      <style>{`
        @keyframes charlock {
          0%   { filter: brightness(4); transform: scale(1.25) translateY(-3px); }
          45%  { filter: brightness(1.3); transform: scale(1.05) translateY(1px); }
          100% { filter: brightness(1); transform: scale(1) translateY(0); }
        }
      `}</style>
      {Array.from(FULL_TEXT, (_, i) => {
        const isLocked = lockedSet.has(i);
        const isSuffix = i >= MAIN_LEN;
        const ch = isLocked ? FULL_TEXT[i] : chars[i];
        return (
          <span
            key={i}
            data-ch="1"
            style={{
              display: 'inline-block',
              transition: 'transform 90ms ease-out, opacity 120ms ease-out',
              color: isSuffix ? 'var(--amber)' : undefined,
              opacity: isLocked ? 1 : 0.3,
              animation: isLocked ? 'charlock 380ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export default function AwesomeHome({
  subjects,
  categories,
  subjectsArray,
  onSearch,
  onCategoryFilter,
  onOpen,
}) {
  const [q, setQ] = useState('');
  const logoTriggerRef = useRef(null);
  const inputRef = useRef(null);

  const submit = (val) => {
    const trimmed = (val ?? q).trim();
    if (trimmed.length >= 2) onSearch(trimmed);
  };

  // Read cached star counts for trending
  const repoInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem('repoInfo')) || {};
    } catch {
      return {};
    }
  })();

  const enriched = subjectsArray.map((item) => ({
    ...item,
    stars: repoInfo[item.repo]?.stars || 0,
  }));

  const trending = [...enriched]
    .filter((item) => item.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6);

  const cats = categories
    .map((c) => ({
      name: c,
      count: subjectsArray.filter((d) => d.cate === c).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={classes.HomeView}>
      {/* Hero */}
      <div className={classes.Hero}>
        <div
          className={classes.LogoBlock}
          onMouseMove={(e) => logoTriggerRef.current?.(e.clientX)}
          onMouseLeave={() => logoTriggerRef.current?.(null)}
        >
          <div className={classes.LogoText}>
            <AnimatedWordmark triggerRef={logoTriggerRef} />
          </div>
        </div>

        <div className={classes.SearchBox}>
          <span className={classes.SearchPrompt}>❯</span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => {
              const val = e.target.value;
              setQ(val);
              if (val.trim().length >= 2) onSearch(val.trim());
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Try: react, python, machine learning, selfhosted…"
            className={classes.SearchInput}
            data-testid="search-input"
            aria-label="Search awesome lists"
          />
          <button
            onClick={() => submit()}
            disabled={q.trim().length < 2}
            className={classes.SearchBtn}
            style={{
              background:
                q.trim().length >= 2 ? 'var(--amber)' : 'var(--bg-panel)',
              color:
                q.trim().length >= 2 ? 'var(--bg-sunk)' : 'var(--dim)',
              cursor: q.trim().length >= 2 ? 'pointer' : 'default',
            }}
          >
            Search ↵
          </button>
        </div>

        <div className={classes.Chips}>
          <span className={classes.ChipsLabel}>Try</span>
          {['react', 'rust', 'docker', 'machine-learning', 'selfhosted', 'flutter'].map((t) => (
            <button key={t} onClick={() => submit(t)} className={classes.Chip}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Trending (only shown if we have cached star data) */}
      {trending.length > 0 && (
        <div className={classes.Section}>
          <div className={classes.SectionHeader}>
            <h2 className={classes.SectionTitle}>
              <span className={classes.TitleBar} />
              Trending
            </h2>
            <span className={classes.SectionSub}>by stars</span>
          </div>
          <div className={classes.TrendingGrid}>
            {trending.map((item, i) => (
              <div
                key={item.repo}
                className={classes.TrendingCard}
                onClick={() => onOpen(item.repo)}
              >
                <div className={classes.TrendingCardTop}>
                  <span className={classes.TrendingNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={classes.TrendingName}>{item.name}</span>
                  <span className={classes.TrendingStars}>
                    ★{' '}
                    {item.stars >= 1000
                      ? `${(item.stars / 1000).toFixed(1)}k`
                      : item.stars}
                  </span>
                </div>
                <div className={classes.TrendingRepo}>{item.repo}</div>
                <div className={classes.TrendingMeta}>
                  <span className={classes.CatBadge}>{item.cate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse by category */}
      <div className={classes.Section}>
        <div className={classes.SectionHeader}>
          <h2 className={classes.SectionTitle}>
            <span className={classes.TitleBar} />
            Browse by category
          </h2>
        </div>
        <div className={classes.CatGrid}>
          {cats.map((c) => (
            <button
              key={c.name}
              onClick={() => onCategoryFilter ? onCategoryFilter(c.name) : onSearch(c.name.toLowerCase())}
              className={classes.CatCard}
            >
              <span className={classes.CatName}>{c.name}</span>
              <span className={classes.CatCount}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className={classes.About}>
        <p>
          Built by{' '}
          <a href="https://github.com/lockys" target="_blank" rel="noopener noreferrer" className={classes.AboutLink}>
            @lockys
          </a>
          {' '}&{' '}
          <a href="https://github.com/john-lin" target="_blank" rel="noopener noreferrer" className={classes.AboutLink}>
            @john-lin
          </a>
          {' '}· Powered by{' '}
          <a href="https://github.com/sindresorhus/awesome" target="_blank" rel="noopener noreferrer" className={classes.AboutLink}>
            sindresorhus/awesome
          </a>
          {' '}· Search by{' '}
          <a href="https://fusejs.io" target="_blank" rel="noopener noreferrer" className={classes.AboutLink}>
            Fuse.js
          </a>
        </p>
      </div>
    </div>
  );
}
