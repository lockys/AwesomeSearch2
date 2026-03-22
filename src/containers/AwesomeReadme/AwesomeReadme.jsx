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
class AwesomeReadme extends Component {
  state = {
    _html: `<br/><b># Waiting for content loading...</b>`,
    headers: [],
    stars: 0,
    updateAt: null,
    user: '',
    repo: '',
    showTOC: false,
    showReadmeInfo: true,
  };

  shouldComponentUpdate(_, nextState) {
    return (
      (this.state.user !== this.props.match.params.user &&
        this.state.repo !== this.props.match.params.repo) ||
      this.state._html !== nextState._html ||
      this.state.headers.length !== nextState.headers.length ||
      this.state.showTOC !== nextState.showTOC
    );
  }

  componentDidMount() {
    const user = this.props.match.params.user;
    const repo = this.props.match.params.repo;
    const infoLastMod = JSON.parse(localStorage.getItem('infoLastMod'));

    axios
      .get(`https://api.awesomelists.top/readme/${user}/${repo}`)
      .then((res) => {
        let _html = this.fixImage({
          user,
          repo,
          res,
        });

        this.setState({
          _html: _html,
          user: user,
          repo: repo,
          showReadmeInfo: true,
        });
      })
      .catch((err) => {
        switch (err.response.status) {
          case 403:
            this.setState({
              _html: `<br/><b># Github API rate limit exceeds...</b>
                      <ol>
                        <li>Now, we are using github API whose rate limit is 60 requests/hr per IP to retrieve readme content.</li>
                        <li>We'll figure out a way to resolve this issue recently :)</li>
                      </ol> 
                      <div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/zyclIRxMwlY40" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fire-richard-ayoade-the-it-crowd-zyclIRxMwlY40">via GIPHY</a></p>
                      `,
              showReadmeInfo: false,
            });
            break;
          default:
            this.setState({
              _html: `<br/><b># Failed to load readme file with ${err.message}.</b><br/><br/>
                      # How to resolve?
                      <ol>
                        <li> The repo you are looking for does not exist. Please click the home icon on the top left to back to home page.</li>
                        <li> Sorry, you may access us from old Awesome Search...Please re-search this repo and bookmark it.</li>
                      </ol> 
                      <div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/zyclIRxMwlY40" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fire-richard-ayoade-the-it-crowd-zyclIRxMwlY40">via GIPHY</a></p>
                      `,
              showReadmeInfo: false,
            });
            break;
        }
      });

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

  componentDidUpdate() {
    this.makeAnchor();
    if (document.body.childNodes.length) {
      const headers = this.walk(document.body.childNodes, []);
      if (this.state.headers.length === 0 && headers.length !== 0) {
        this.setState({
          headers: headers,
        });
      }
    }
  }

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

  walk = (nodes, headers) => {
    nodes.forEach((node) => {
      let sub = Array.from(node.childNodes);
      if (sub.length) {
        headers = this.walk(sub, headers);
      }

      if (/h[1-6]/i.test(node.tagName) && node.innerText.trim() !== '') {
        headers.push({
          id: node.childNodes[0].getAttribute ? node.childNodes[0].getAttribute('id') : node.childNodes[0],
          level: parseInt(node.tagName.replace('H', '')),
          title: node.innerText.trim(),
        });
      }
    });

    return headers;
  };

  showTocHandler = () => {
    this.setState({
      showTOC: !this.state.showTOC,
    });
  };

  scrollToTop = () => {
    document.getElementById('anchor-top').scrollIntoView();
  };

  headersOnClick = (id) => {
    document.getElementById(id).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    document.getElementById(id).parentNode.style.backgroundColor = '#ff2e88';

    setTimeout(() => {
      if (document.getElementById(id)) {
        document.getElementById(id).parentNode.style.backgroundColor = 'white';
      }
    }, 5000);

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
      <div className={classes.AwesomeReadme}>
        <div id='anchor-top'></div>
        {this.state.showReadmeInfo && (
          <div className={classes.ReadmeInfo}>
            <a
              className={classes.ViewOnGithubBtn}
              href={`https://github.com/${this.props.match.params.user}/${this.props.match.params.repo}`}
              target='_blank'
              rel='noreferrer'
            >
              View On Github
            </a>
            <span className={classes.TOCButton} onClick={this.showTocHandler}>
              Content
            </span>
            <span>
              <strong>{this.props.match.params.repo}</strong>
            </span>
            <div>
              <FontAwesomeIcon icon={faStar} /> stars:{this.state.stars}
            </div>
            <div>
              <FontAwesomeIcon icon={faClock} /> Last update at{' '}
              <TimeAgo datetime={this.state.updateAt} />
            </div>

            {this.state.showTOC && (
              <div className={classes.ReadmeCategory}>
                <FontAwesomeIcon
                  onClick={this.showTocHandler}
                  className={classes.ReadmeCategoryCloseButton}
                  icon={faTimes}
                />
                {this.state.headers.map((header, idx) => {
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        this.headersOnClick(header.id);
                      }}
                      style={{
                        fontSize: this.getFontSize(header.level).size,
                        color: this.getFontSize(header.level).color,
                      }}
                    >
                      {this.buildBullet('-', header.level)} {header.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div dangerouslySetInnerHTML={{ __html: this.state._html }}></div>
        <div className={classes.scrollToTop} onClick={this.scrollToTop}>
          <FontAwesomeIcon icon={faLongArrowAltUp} /> Go To Top
        </div>
      </div>
    );
  }
}

export default AwesomeReadme;
