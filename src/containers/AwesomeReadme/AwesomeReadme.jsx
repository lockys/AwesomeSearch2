import React, { Component } from 'react';
import classes from './AwesomeReadme.module.css';
import TimeAgo from 'timeago-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faClock,
  faLongArrowAltUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const SKELETON_ROWS = [
  ['SkeletonTitle'],
  ['SkeletonLine', 'SkeletonLineFull'],
  ['SkeletonLine', 'SkeletonLineLong'],
  ['SkeletonLine', 'SkeletonLineMed'],
  ['SkeletonSpacer'],
  ['SkeletonSubtitle'],
  ['SkeletonLine', 'SkeletonLineFull'],
  ['SkeletonLine', 'SkeletonLineLong'],
  ['SkeletonLine', 'SkeletonLineShort'],
  ['SkeletonSpacer'],
  ['SkeletonSubtitle'],
  ['SkeletonLine', 'SkeletonLineMed'],
  ['SkeletonLine', 'SkeletonLineFull'],
  ['SkeletonLine', 'SkeletonLineLong'],
  ['SkeletonLine', 'SkeletonLineMed'],
];

class AwesomeReadme extends Component {
  state = {
    _html: '',
    isLoading: true,
    headers: [],
    stars: 0,
    updateAt: null,
    user: '',
    repo: '',
    showTOC: false,
    showReadmeInfo: true,
    isScrolled: false,
  };

  shouldComponentUpdate(_, nextState) {
    return (
      (this.state.user !== this.props.match.params.user &&
        this.state.repo !== this.props.match.params.repo) ||
      this.state._html !== nextState._html ||
      this.state.isLoading !== nextState.isLoading ||
      this.state.headers.length !== nextState.headers.length ||
      this.state.showTOC !== nextState.showTOC ||
      this.state.isScrolled !== nextState.isScrolled
    );
  }

  handleScroll = () => {
    this.setState({ isScrolled: window.scrollY > 10 });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    const user = this.props.match.params.user;
    const repo = this.props.match.params.repo;
    const infoLastMod = JSON.parse(localStorage.getItem('infoLastMod'));

    this.fetchReadme(user, repo);

    axios
      .get(`https://api.github.com/repos/${user}/${repo}`, {
        headers: {
          'If-Modified-Since': infoLastMod
            ? infoLastMod[`${user}/${repo}`]
            : null,
          Authorization: 'fakeString',
        },
      })
      .then((res) => {
        localStorage.setItem(
          'infoLastMod',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('infoLastMod')),
            [`${user}/${repo}`]: res.headers['last-modified'],
          })
        );

        this.setState({
          stars: res.data.stargazers_count,
          updateAt: res.data.pushed_at,
        });

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
        if (err.response.status === 304) {
          this.setState(
            JSON.parse(localStorage.getItem('repoInfo'))[`${user}/${repo}`]
          );
        }
      });
  }

  componentDidUpdate(_, prevState) {
    if (prevState._html !== this.state._html) {
      this.makeAnchor();
      this.attachImageFallbacks();
    }
  }

  attachImageFallbacks = () => {
    const content = document.querySelector('[data-testid="readme-content"]');
    if (!content) return;
    content.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackAttached) return;
      img.dataset.fallbackAttached = 'true';
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback';
        fallback.textContent = 'Image unavailable';
        if (img.parentNode) img.parentNode.replaceChild(fallback, img);
      });
    });
  };

  fetchReadme = (user, repo) => {
    axios
      .get(`https://api-awesomelists.calvinjeng.io/readme/${user}/${repo}`)
      .then((res) => {
        this.handleReadmeSuccess(user, repo, res);
      })
      .catch(() => {
        this.fetchReadmeFromGithub(user, repo);
      });
  };

  fetchReadmeFromGithub = (user, repo) => {
    axios
      .get(`https://api.github.com/repos/${user}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.html' },
      })
      .then((res) => {
        this.handleReadmeSuccess(user, repo, res);
      })
      .catch((err) => {
        const status = err.response && err.response.status;
        if (status === 403) {
          this.setState({
            _html: `<br/><b># Github API rate limit exceeded.</b>
                    <ol>
                      <li>The GitHub API rate limit is 60 requests/hr per IP for unauthenticated requests.</li>
                      <li>Please try again later.</li>
                    </ol>`,
            isLoading: false,
            showReadmeInfo: false,
          });
        } else {
          this.setState({
            _html: `<br/><b># Failed to load readme file.</b><br/><br/>
                    <ol>
                      <li>The repo may not exist. Click the home icon to go back.</li>
                      <li>Please re-search this repo and try again.</li>
                    </ol>`,
            isLoading: false,
            showReadmeInfo: false,
          });
        }
      });
  };

  parseReadme = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract TOC headers
    const headers = [];
    doc.querySelectorAll('div.markdown-heading').forEach((div) => {
      const hEl = div.querySelector('h1,h2,h3,h4,h5,h6');
      const anchor = div.querySelector('a.anchor');
      if (hEl && anchor) {
        const id = anchor.getAttribute('id') || anchor.getAttribute('href')?.replace('#', '');
        const title = hEl.textContent.trim();
        if (id && title) {
          headers.push({
            id,
            level: parseInt(hEl.tagName.replace('H', '')),
            title,
          });
        }
      }
    });

    // Remove inline TOC section (heading + following ul)
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

  handleReadmeSuccess = (user, repo, res) => {
    let rawHtml = this.fixImage({ user, repo, res });
    const { headers, html: _html } = this.parseReadme(rawHtml);
    this.setState({
      _html,
      isLoading: false,
      user,
      repo,
      showReadmeInfo: true,
      headers,
    });
  };

  fixImage = ({ user, repo, res }) => {
    let githubImageUrl = `https://raw.githubusercontent.com/${user}/${repo}/master`;
    const _html = res.data
      .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        if (!capture.includes('https')) {
          githubImageUrl =
            capture[0] === '/' ? githubImageUrl : githubImageUrl + '/';
          return match.replace(capture, `${githubImageUrl}${capture}`);
        } else {
          return match;
        }
      })
      .replace(/user-content-/g, '');
    return _html;
  };

  makeAnchor = () => {
    const links = document.querySelectorAll('a:not(.menu-item)[href^="#"]');

    if (links.length > 0) {
      for (let link of links) {
        let id = link.href.replace(`${document.location.origin}/#`, '');
        link.href = `/#/${this.props.match.params.user}/${this.props.match.params.repo}`;
        link.addEventListener('click', () => {
          this.headersOnClick(id);
        });
      }
    }
  };

  showTocHandler = () => {
    this.setState({
      showTOC: !this.state.showTOC,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  scrollToTop = () => {
    document.getElementById('anchor-top').scrollIntoView({ behavior: 'instant' });
  };

  headersOnClick = (id) => {
    document.getElementById(id).scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });

    const heading = document.getElementById(id).parentNode;
    const next = heading.nextElementSibling;
    const isDark = document.body.classList.contains('dark');
    const bg = isDark ? '#f1f5f9' : '#000000';
    const fg = isDark ? '#0f172a' : '#ffffff';

    const header = this.state.headers.find((h) => h.id === id);
    const title = header ? header.title : '';

    const label = document.createElement('span');
    label.textContent = title;
    label.style.cssText = `
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      background: ${bg};
      color: ${fg};
      letter-spacing: 0.5px;
      pointer-events: none;
    `;

    const applyHighlight = (el) => {
      if (!el) return;
      el.style.backgroundColor = bg;
      el.style.color = fg;
    };

    const clearHighlight = (el) => {
      if (!el) return;
      el.style.backgroundColor = '';
      el.style.color = '';
    };

    heading.insertAdjacentElement('beforebegin', label);
    applyHighlight(heading);
    applyHighlight(next);

    setTimeout(() => {
      if (document.getElementById(id)) {
        label.remove();
        clearHighlight(heading);
        clearHighlight(next);
      }
    }, 2000);

    this.setState({
      showTOC: false,
    });
  };

  buildBullet = (pattern, level) => {
    return Array(level).fill(pattern).join('');
  };

  getFontSize = (level) => {
    let size = '1.2rem';
    let color = 'black';
    switch (level) {
      case 1:
        size = '1.2rem';
        color = 'black';
        break;
      case 2:
        size = '1rem';
        color = 'grey';
        break;
      case 3:
        size = '0.8rem';
        color = 'red';
        break;
      case 4:
        size = '0.8rem';
        color = 'red';
        break;
      case 5:
        size = '0.8rem';
        color = 'red';
        break;
      case 6:
        size = '0.8rem';
        color = 'red';
        break;
      default:
        size = '0.8rem';
        color = 'red';
        break;
    }

    return {
      size,
      color,
    };
  };

  render() {
    return (
      <div className={classes.AwesomeReadme} data-testid="awesome-readme">
        <div id='anchor-top'></div>
        {this.state.showReadmeInfo && (
          <div className={`${classes.ReadmeInfo} ${this.state.isScrolled ? classes.ReadmeInfoScrolled : ''}`} data-testid="readme-info">
            <div className={classes.ReadmeInfoTop}>
              <span className={classes.RepoName}>
                {this.props.match.params.repo}
              </span>
              <div className={classes.ReadmeInfoActions}>
                <a
                  className={classes.ViewOnGithubBtn}
                  href={`https://github.com/${this.props.match.params.user}/${this.props.match.params.repo}`}
                  target='_blank'
                  rel='noreferrer'
                  data-testid="view-on-github"
                >
                  GitHub
                </a>
                <span className={classes.TOCButton} onClick={this.showTocHandler} data-testid="toc-button">
                  Contents
                </span>
              </div>
            </div>
            <div className={classes.RepoStats} data-testid="repo-stats">
              <span className={classes.StatItem}>
                <FontAwesomeIcon icon={faStar} /> {this.state.stars}
              </span>
              <span className={classes.StatItem}>
                <FontAwesomeIcon icon={faClock} />{' '}
                <TimeAgo datetime={this.state.updateAt} />
              </span>
            </div>
          </div>
        )}

        {this.state.showTOC && (
          <div className={classes.ReadmeCategory}>
            <div className={classes.ReadmeCategoryHeader}>
              <span className={classes.ReadmeCategoryTitle}>Contents</span>
              <span
                onClick={this.showTocHandler}
                className={classes.ReadmeCategoryCloseButton}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
            <div className={classes.ReadmeCategoryList}>
              {this.state.headers.map((header, idx) => {
                return (
                  <div
                    key={idx}
                    className={classes[`TocLevel${Math.min(header.level, 3)}`] || classes.TocLevel3}
                    onClick={() => {
                      this.headersOnClick(header.id);
                    }}
                  >
                    {header.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {this.state.isLoading ? (
          <div className={classes.Skeleton} data-testid="readme-skeleton">
            {SKELETON_ROWS.map((variants, idx) => (
              <div key={idx} className={[classes.SkeletonBar, ...variants.map(v => classes[v])].join(' ')} />
            ))}
          </div>
        ) : (
          <div className={classes.ReadmeContent} dangerouslySetInnerHTML={{ __html: this.state._html }} data-testid="readme-content"></div>
        )}
        <div className={classes.scrollToTop} onClick={this.scrollToTop} data-testid="scroll-to-top">
          <FontAwesomeIcon icon={faLongArrowAltUp} /> Top
        </div>
      </div>
    );
  }
}

export default AwesomeReadme;
