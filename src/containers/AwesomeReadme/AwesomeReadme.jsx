import React, { Component } from 'react';
import classes from './AwesomeReadme.module.css';
import TimeAgo from 'timeago-react';
import axios from 'axios';

class AwesomeReadme extends Component {
  state = {
    _html: '',
    isLoading: true,
    headers: [],
    stars: 0,
    updateAt: null,
    showReadmeInfo: true,
    activeSection: null,
    previewSrc: null,
    sidebarWidth: 240,
  };

  contentRef = React.createRef();
  _dragStartX = null;
  _dragStartWidth = null;

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    const { user, repo } = this.props.match.params;
    this.fetchReadme(user, repo);
    this.fetchRepoInfo(user, repo);
  }

  componentDidUpdate(_, prevState) {
    if (prevState._html !== this.state._html) {
      this.makeAnchor();
      this.attachImageHandlers();
      if (this.state.headers.length > 0) {
        this.setState({ activeSection: this.state.headers[0].id });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this._stopDrag();
  }

  _onResizeMouseDown = (e) => {
    e.preventDefault();
    this._dragStartX = e.clientX;
    this._dragStartWidth = this.state.sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', this._onResizeMouseMove);
    window.addEventListener('mouseup', this._onResizeMouseUp);
  };

  _onResizeMouseMove = (e) => {
    const delta = e.clientX - this._dragStartX;
    const next = Math.min(480, Math.max(140, this._dragStartWidth + delta));
    this.setState({ sidebarWidth: next });
  };

  _onResizeMouseUp = () => {
    this._stopDrag();
  };

  _stopDrag = () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', this._onResizeMouseMove);
    window.removeEventListener('mouseup', this._onResizeMouseUp);
  };

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (this.state.previewSrc) {
        this.setState({ previewSrc: null });
      } else {
        this.props.onBack?.();
      }
    }
  };

  fetchRepoInfo = (user, repo) => {
    const infoLastMod = JSON.parse(localStorage.getItem('infoLastMod')) || {};
    axios
      .get(`https://api.github.com/repos/${user}/${repo}`, {
        headers: { 'If-Modified-Since': infoLastMod[`${user}/${repo}`] || null },
      })
      .then((res) => {
        localStorage.setItem(
          'infoLastMod',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('infoLastMod')),
            [`${user}/${repo}`]: res.headers['last-modified'],
          })
        );
        this.setState({ stars: res.data.stargazers_count, updateAt: res.data.pushed_at });
        localStorage.setItem(
          'repoInfo',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('repoInfo')),
            [`${user}/${repo}`]: {
              stars: res.data.stargazers_count,
              updateAt: res.data.pushed_at,
            },
          })
        );
      })
      .catch((err) => {
        if (err.response?.status === 304) {
          const cached = JSON.parse(localStorage.getItem('repoInfo'))?.[`${user}/${repo}`];
          if (cached) this.setState(cached);
        }
      });
  };

  fetchReadme = (user, repo) => {
    axios
      .get(`https://api-awesomelists.calvinjeng.io/readme/${user}/${repo}`)
      .then((res) => this.handleReadmeSuccess(user, repo, res))
      .catch(() => this.fetchReadmeFromGithub(user, repo));
  };

  fetchReadmeFromGithub = (user, repo) => {
    axios
      .get(`https://api.github.com/repos/${user}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.html' },
      })
      .then((res) => this.handleReadmeSuccess(user, repo, res))
      .catch((err) => {
        const status = err.response?.status;
        const msg =
          status === 403
            ? '<b># GitHub API rate limit exceeded.</b><br/>Please try again later.'
            : '<b># Failed to load README.</b><br/>The repo may not exist.';
        this.setState({ _html: msg, isLoading: false, showReadmeInfo: false });
      });
  };

  handleReadmeSuccess = (user, repo, res) => {
    const rawHtml = this.fixImage({ user, repo, res });
    const { headers, html: _html } = this.parseReadme(rawHtml);
    this.setState({ _html, isLoading: false, showReadmeInfo: true, headers });
  };

  parseReadme = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const headers = [];
    doc.querySelectorAll('div.markdown-heading').forEach((div) => {
      const hEl = div.querySelector('h1,h2,h3,h4,h5,h6');
      const anchor = div.querySelector('a.anchor');
      if (hEl && anchor) {
        const id =
          anchor.getAttribute('id') ||
          anchor.getAttribute('href')?.replace('#', '');
        const title = hEl.textContent.trim();
        if (id && title) {
          headers.push({ id, level: parseInt(hEl.tagName.replace('H', '')), title });
        }
      }
    });

    // Remove inline TOC
    doc.querySelectorAll('div.markdown-heading').forEach((div) => {
      const hEl = div.querySelector('h1,h2,h3,h4,h5,h6');
      if (hEl && /^(table of )?contents?$/i.test(hEl.textContent.trim())) {
        let next = div.nextElementSibling;
        while (next && next.tagName === 'UL') {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        }
        div.remove();
      }
    });

    return { headers, html: doc.body.innerHTML };
  };

  fixImage = ({ user, repo, res }) => {
    let base = `https://raw.githubusercontent.com/${user}/${repo}/master`;
    return res.data
      .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, src) => {
        if (!src.includes('https')) {
          const prefix = src[0] === '/' ? base : base + '/';
          return match.replace(src, `${prefix}${src}`);
        }
        return match;
      })
      .replace(/user-content-/g, '');
  };

  makeAnchor = () => {
    const links = document.querySelectorAll('a:not(.menu-item)[href^="#"]');
    for (const link of links) {
      const id = link.href.replace(`${document.location.origin}/#`, '');
      link.href = `/#/${this.props.match.params.user}/${this.props.match.params.repo}`;
      link.addEventListener('click', () => this.scrollToSection(id));
    }
  };

  attachImageHandlers = () => {
    const content = document.querySelector('[data-testid="readme-content"]');
    if (!content) return;
    content.querySelectorAll('img').forEach((img) => {
      if (img.dataset.handlersAttached) return;
      img.dataset.handlersAttached = 'true';
      img.style.cursor = 'zoom-in';
      const anchor = img.closest('a');
      if (anchor) {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          this.setState({ previewSrc: img.src });
        });
      } else {
        img.addEventListener('click', () => this.setState({ previewSrc: img.src }));
      }
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback';
        fallback.textContent = 'Image unavailable';
        img.parentNode?.replaceChild(fallback, img);
      });
    });
  };

  scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      this.setState({ activeSection: id });
    }
  };

  handleContentScroll = () => {
    if (!this.contentRef.current) return;
    const headers = this.contentRef.current.querySelectorAll('[data-testid="readme-content"] [id]');
    const containerTop = this.contentRef.current.getBoundingClientRect().top;
    let cur = this.state.headers[0]?.id;
    for (const h of headers) {
      if (h.getBoundingClientRect().top - containerTop < 100) cur = h.id;
    }
    if (cur && cur !== this.state.activeSection) this.setState({ activeSection: cur });
  };

  render() {
    const { user, repo } = this.props.match.params;
    const { _html, isLoading, headers, stars, updateAt, activeSection, previewSrc, sidebarWidth } = this.state;

    const fmtStars = stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : `${stars || '—'}`;

    return (
      <div className={classes.ReadmeShell} data-testid="awesome-readme">
        {/* TOC sidebar */}
        <aside className={classes.Sidebar} style={{ width: sidebarWidth, flex: `0 0 ${sidebarWidth}px` }}>
          <div className={classes.SidebarTop}>
            <button
              onClick={this.props.onBack}
              className={classes.BackBtn}
              data-testid="readme-back-button"
              aria-label="Back to search"
            >
              ← back to search
            </button>
          </div>

          <div className={classes.OutlineLabel}>Outline</div>

          {headers.length === 0 && isLoading && (
            <div className={classes.SidebarHint}>Loading…</div>
          )}

          {headers.map((h) => {
            const active = h.id === activeSection;
            return (
              <div
                key={h.id}
                onClick={() => this.scrollToSection(h.id)}
                className={`${classes.TocItem} ${active ? classes.TocItemActive : ''}`}
                style={{ paddingLeft: (h.level - 1) * 12 + 16 }}
              >
                {h.title}
              </div>
            );
          })}
        </aside>

        {/* Resize handle */}
        <div
          className={classes.ResizeHandle}
          onMouseDown={this._onResizeMouseDown}
          title="Drag to resize"
        />

        {/* Main content area */}
        <div
          ref={this.contentRef}
          onScroll={this.handleContentScroll}
          className={classes.ContentArea}
        >
          {/* Breadcrumb label */}
          <div className={classes.RepoLabel}>README.md · {user}/{repo}</div>
          <h1 className={classes.RepoTitle}>{repo}</h1>

          {/* Stats panel */}
          {this.state.showReadmeInfo && (
            <div className={classes.StatsPanel} data-testid="repo-stats">
              {[
                ['Stars', fmtStars, true],
                ['Updated', updateAt ? <TimeAgo datetime={updateAt} /> : '—', false],
                ['Owner', user, false],
                [
                  'GitHub',
                  <a
                    href={`https://github.com/${user}/${repo}`}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="view-on-github"
                  >
                    View ↗
                  </a>,
                  false,
                ],
              ].map(([k, v, accent], i) => (
                <div
                  key={i}
                  className={classes.StatCell}
                  style={{ borderLeft: i === 0 ? 'none' : undefined }}
                >
                  <div className={classes.StatKey}>{k}</div>
                  <div className={`${classes.StatVal} ${accent ? classes.StatValAccent : ''}`}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skeleton */}
          {isLoading ? (
            <div className={classes.Skeleton} data-testid="readme-skeleton">
              {[100, 80, 90, 60, 100, 75, 85, 55].map((w, i) => (
                <div
                  key={i}
                  className={classes.SkeletonLine}
                  style={{ width: `${w}%`, height: i % 4 === 0 ? 18 : 12, marginTop: i % 4 === 0 ? 20 : 8 }}
                />
              ))}
            </div>
          ) : (
            <div
              className={classes.ReadmeContent}
              dangerouslySetInnerHTML={{ __html: _html }}
              data-testid="readme-content"
            />
          )}
        </div>

        {/* Lightbox */}
        {previewSrc && (
          <div
            className={classes.Lightbox}
            onClick={() => this.setState({ previewSrc: null })}
            data-testid="lightbox-overlay"
          >
            <div className={classes.LightboxContent} onClick={(e) => e.stopPropagation()}>
              <img src={previewSrc} alt="Preview" className={classes.LightboxImg} />
              <button
                className={classes.LightboxClose}
                onClick={() => this.setState({ previewSrc: null })}
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AwesomeReadme;
