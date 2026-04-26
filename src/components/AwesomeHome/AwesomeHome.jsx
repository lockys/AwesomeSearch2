import React, { useState, useEffect, useRef } from 'react';
import classes from './AwesomeHome.module.css';

const SYNONYMS = ['awesome', 'curated', 'indexed', 'awesome'];
const SUFFIX = '.search';

function AnimatedWordmark() {
  const [displayed, setDisplayed] = useState('');
  const [suffix, setSuffix] = useState('');
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timeouts = [];
    const q = (fn, ms) => timeouts.push(setTimeout(fn, ms));

    const typeWord = (word, onDone) => {
      let i = 0;
      const step = () => {
        i++;
        setDisplayed(word.slice(0, i));
        if (i < word.length) q(step, 60 + Math.random() * 40);
        else q(onDone, 900);
      };
      step();
    };

    const eraseWord = (word, onDone) => {
      let i = word.length;
      const step = () => {
        i--;
        setDisplayed(word.slice(0, i));
        if (i > 0) q(step, 35);
        else q(onDone, 180);
      };
      step();
    };

    const typeSuffix = () => {
      let i = 0;
      const step = () => {
        i++;
        setSuffix(SUFFIX.slice(0, i));
        if (i < SUFFIX.length) q(step, 70);
      };
      q(step, 200);
    };

    const runSynonym = (idx) => {
      if (idx >= SYNONYMS.length) {
        setDisplayed(SYNONYMS[SYNONYMS.length - 1]);
        typeSuffix();
        return;
      }
      const w = SYNONYMS[idx];
      typeWord(w, () => {
        if (idx === SYNONYMS.length - 1) {
          runSynonym(idx + 1);
        } else {
          eraseWord(w, () => runSynonym(idx + 1));
        }
      });
    };

    runSynonym(0);
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <span className={classes.Wordmark}>
      <style>{`
        @keyframes wmpop {
          0%   { transform: translateY(-0.18em) scale(0.9); opacity: 0; }
          60%  { transform: translateY(0.02em) scale(1.04); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      {displayed.split('').map((ch, i) => (
        <span
          key={`w-${i}-${displayed.length}`}
          style={{
            display: 'inline-block',
            animation:
              i === displayed.length - 1
                ? 'wmpop 380ms cubic-bezier(0.34,1.56,0.64,1) both'
                : undefined,
          }}
        >
          {ch}
        </span>
      ))}
      {suffix.split('').map((ch, i) => (
        <span
          key={`s-${i}-${suffix.length}`}
          style={{
            display: 'inline-block',
            color: 'var(--amber)',
            animation:
              i === suffix.length - 1
                ? 'wmpop 380ms cubic-bezier(0.34,1.56,0.64,1) both'
                : undefined,
          }}
        >
          {ch}
        </span>
      ))}
      <span
        className={classes.WordmarkCursor}
        style={{ opacity: cursorOn ? 1 : 0 }}
      />
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
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    .sort((a, b) => b.count - a.count);

  return (
    <div className={classes.HomeView}>
      {/* Hero */}
      <div className={classes.Hero}>
        <div className={classes.LogoBlock}>
          <div className={classes.LogoText}>
            <AnimatedWordmark />
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
              <span className={classes.CatDot} />
              <span className={classes.CatName}>{c.name}</span>
              <span className={classes.CatCount}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
