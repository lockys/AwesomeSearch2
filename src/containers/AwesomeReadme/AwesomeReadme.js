import React, { useState, useEffect } from 'react';
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

const AwesomeReadme = (props) => {
  const [html, setHtml] = useState('<br/><b># Waiting for content loading...</b>');
  const [headers, setHeaders] = useState([]);
  const [stars, setStars] = useState(0);
  const [updateAt, setUpdateAt] = useState(null);
  const [user, setUser] = useState('');
  const [repo, setRepo] = useState('');
  const [showTOC, setShowTOC] = useState(false);
  const [showReadmeInfo, setShowReadmeInfo] = useState(true);

  const fixImage = ({ user, repo, res }) => {
    let githubImageUrl = `https://raw.githubusercontent.com/${user}/${repo}/master`;
    const _html = res.data
      .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        if (!capture.includes('https')) {
          githubImageUrl = capture[0] === '/' ? githubImageUrl : githubImageUrl + '/';
          return match.replace(capture, `${githubImageUrl}${capture}`);
        } else {
          return match;
        }
      })
      .replace(/user-content-/g, '');
    return _html;
  };

  const makeAnchor = () => {
    const links = document.querySelectorAll('a:not(.menu-item)[href^="#"]');

    if (links.length > 0) {
      for (let link of links) {
        let id = link.href.replace(`${document.location.origin}/#`, '');
        link.href = `/#/${props.match.params.user}/${props.match.params.repo}`;
        link.addEventListener('click', () => {
          headersOnClick(id);
        });
      }
    }
  };

  const walk = (nodes, headersArr) => {
    nodes.forEach((node) => {
      let sub = Array.from(node.childNodes);
      if (sub.length) {
        headersArr = walk(sub, headersArr);
      }

      if (/h[1-6]/i.test(node.tagName) && node.innerText.trim() !== '') {
        headersArr.push({
          id: node.childNodes[0].getAttribute ? node.childNodes[0].getAttribute('id') : node.childNodes[0],
          level: parseInt(node.tagName.replace('H', '')),
          title: node.innerText.trim(),
        });
      }
    });

    return headersArr;
  };

  const showTocHandler = () => {
    setShowTOC(!showTOC);
  };

  const scrollToTop = () => {
    document.getElementById('anchor-top').scrollIntoView();
  };

  const headersOnClick = (id) => {
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

    setShowTOC(false);
  };

  const buildBullet = (pattern, level) => {
    return Array(level).fill(pattern).join('');
  };

  const getFontSize = (level) => {
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

  useEffect(() => {
    const userParam = props.match.params.user;
    const repoParam = props.match.params.repo;
    const infoLastMod = JSON.parse(localStorage.getItem('infoLastMod'));

    axios
      .get(`https://api.awesomelists.top/readme/${userParam}/${repoParam}`)
      .then((res) => {
        let _html = fixImage({
          user: userParam,
          repo: repoParam,
          res,
        });

        setHtml(_html);
        setUser(userParam);
        setRepo(repoParam);
        setShowReadmeInfo(true);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 403:
            setHtml(`<br/><b># Github API rate limit exceeds...</b>
                      <ol>
                        <li>Now, we are using github API whose rate limit is 60 requests/hr per IP to retrieve readme content.</li>
                        <li>We'll figure out a way to resolve this issue recently :)</li>
                      </ol>
                      <div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/zyclIRxMwlY40" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fire-richard-ayoade-the-it-crowd-zyclIRxMwlY40">via GIPHY</a></p>
                      `);
            setShowReadmeInfo(false);
            break;
          default:
            setHtml(`<br/><b># Failed to load readme file with ${err.message}.</b><br/><br/>
                      # How to resolve?
                      <ol>
                        <li> The repo you are looking for does not exist. Please click the home icon on the top left to back to home page.</li>
                        <li> Sorry, you may access us from old Awesome Search... Please re-search this repo and bookmark it.</li>
                      </ol>
                      <div style="width:100%;height:0;padding-bottom:53%;position:relative;"><iframe src="https://giphy.com/embed/zyclIRxMwlY40" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/fire-richard-ayoade-the-it-crowd-zyclIRxMwlY40">via GIPHY</a></p>
                      `);
            setShowReadmeInfo(false);
            break;
        }
      });

    axios
      .get(`https://api.github.com/repos/${userParam}/${repoParam}`, {
        headers: {
          'If-Modified-Since': infoLastMod ? infoLastMod[`${userParam}/${repoParam}`] : null,
          Authorization: 'fakeString',
        },
      })
      .then((res) => {
        localStorage.setItem(
          'infoLastMod',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('infoLastMod')),
            [`${userParam}/${repoParam}`]: res.headers['last-modified'],
          })
        );

        setStars(res.data.stargazers_count);
        setUpdateAt(res.data.pushed_at);

        localStorage.setItem(
          'repoInfo',
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('repoInfo')),
            [`${userParam}/${repoParam}`]: {
              stars: res.data.stargazers_count,
              updateAt: res.data.pushed_at,
            },
          })
        );
      })
      .catch((err) => {
        if (err.response.status === 304) {
          const info = JSON.parse(localStorage.getItem('repoInfo'))[`${userParam}/${repoParam}`];
          if (info) {
            setStars(info.stars);
            setUpdateAt(info.updateAt);
          }
        }
      });
  }, [props.match.params.user, props.match.params.repo]);

  useEffect(() => {
    makeAnchor();
    if (document.body.childNodes.length) {
      const headersList = walk(document.body.childNodes, []);
      if (headers.length === 0 && headersList.length !== 0) {
        setHeaders(headersList);
      }
    }
  }, [html]);

  return (
    <div className={classes.AwesomeReadme}>
      <div id='anchor-top'></div>
      {showReadmeInfo && (
        <div className={classes.ReadmeInfo}>
          <a
            className={classes.ViewOnGithubBtn}
            href={`https://github.com/${props.match.params.user}/${props.match.params.repo}`}
            target='_blank'
            rel='noreferrer'
          >
            View On Github
          </a>
          <span className={classes.TOCButton} onClick={showTocHandler}>
            Content
          </span>
          <span>
            <strong>{props.match.params.repo}</strong>
          </span>
          <div>
            <FontAwesomeIcon icon={faStar} /> stars:{stars}
          </div>
          <div>
            <FontAwesomeIcon icon={faClock} /> Last update at{' '}
            <TimeAgo datetime={updateAt} />
          </div>

          {showTOC && (
            <div className={classes.ReadmeCategory}>
              <FontAwesomeIcon
                onClick={showTocHandler}
                className={classes.ReadmeCategoryCloseButton}
                icon={faTimes}
              />
              {headers.map((header, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      headersOnClick(header.id);
                    }}
                    style={{
                      fontSize: getFontSize(header.level).size,
                      color: getFontSize(header.level).color,
                    }}
                  >
                    {buildBullet('-', header.level)} {header.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: html }}></div>
      <div className={classes.scrollToTop} onClick={scrollToTop}>
        <FontAwesomeIcon icon={faLongArrowAltUp} /> Go To Top
      </div>
    </div>
  );
};

export default AwesomeReadme;
