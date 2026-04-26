import React, { useState, useRef, useEffect } from 'react';
import classes from './SiteMap.module.css';

function SmTreeRow({ prefix, label, sub, onClick, isRoute }) {
  return (
    <div
      className={`${classes.TreeRow} ${onClick ? classes.TreeRowClickable : ''}`}
      onClick={onClick}
    >
      <span className={classes.TreePrefix}>{prefix}</span>
      {isRoute ? (
        <span className={classes.TreeRoute}>{label}</span>
      ) : (
        <span className={classes.TreeLabel}>{label}</span>
      )}
      {sub && <span className={classes.TreeSub}>{sub}</span>}
    </div>
  );
}

export default function SiteMap({ categories, subjectsArray, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Trending from localStorage cache
  const trending = (() => {
    try {
      const repoInfo = JSON.parse(localStorage.getItem('repoInfo')) || {};
      return subjectsArray
        .map((item) => ({ ...item, stars: repoInfo[item.repo]?.stars || 0 }))
        .filter((item) => item.stars > 0)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 6);
    } catch {
      return [];
    }
  })();

  const catRows = categories
    .map((c) => ({
      name: c,
      count: subjectsArray.filter((d) => d.cate === c).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className={classes.Wrap} ref={ref}>
      <button
        className={`${classes.Trigger} ${open ? classes.TriggerActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        title="Site map"
      >
        <span className={classes.TriggerIcon}>⊞</span>
        <span>sitemap</span>
      </button>

      {open && (
        <div className={classes.Panel}>
          <div className={classes.PanelScroll}>
            {/* Pages */}
            <div className={classes.Section}>
              <div className={classes.SectionTitle}>Pages</div>
              <SmTreeRow prefix="├─" label="/" sub="home" isRoute onClick={() => { onNavigate('/'); setOpen(false); }} />
              <SmTreeRow prefix="├─" label="/search" sub="fuzzy search" isRoute />
              <SmTreeRow prefix="└─" label="/:user/:repo" sub="readme viewer" isRoute />
            </div>

            <div className={classes.Divider} />

            {/* Categories */}
            <div className={classes.Section}>
              <div className={classes.SectionTitle}>Categories</div>
              <div className={classes.CatGrid}>
                {catRows.map((c, i) => {
                  const isLast = i === catRows.length - 1;
                  const prefix = isLast ? '└─' : '├─';
                  return (
                    <SmTreeRow
                      key={c.name}
                      prefix={prefix}
                      label={c.name}
                      sub={`${c.count}`}
                      onClick={() => { onNavigate('search', c.name.toLowerCase()); setOpen(false); }}
                    />
                  );
                })}
              </div>
            </div>

            {trending.length > 0 && (
              <>
                <div className={classes.Divider} />
                <div className={classes.Section}>
                  <div className={classes.SectionTitle}>Trending</div>
                  {trending.map((item, i) => {
                    const isLast = i === trending.length - 1;
                    const prefix = isLast ? '└─' : '├─';
                    const stars = item.stars >= 1000
                      ? `★ ${(item.stars / 1000).toFixed(1)}k`
                      : `★ ${item.stars}`;
                    return (
                      <SmTreeRow
                        key={item.repo}
                        prefix={prefix}
                        label={item.name}
                        sub={stars}
                        onClick={() => { onNavigate('repo', item.repo); setOpen(false); }}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className={classes.PanelFooter}>
            <span>{subjectsArray.length} lists</span>
            <span className={classes.PanelFooterSep}>·</span>
            <span>{categories.length} categories</span>
            <span className={classes.PanelFooterSep}>·</span>
            <span>3 routes</span>
          </div>
        </div>
      )}
    </div>
  );
}
