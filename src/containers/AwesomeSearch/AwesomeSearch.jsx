import React, { Component } from 'react';
import AwesomeHome from '../../components/AwesomeHome/AwesomeHome.jsx';
import AwesomeInput from '../../components/AwesomeInput/AwesomeInput.jsx';
import AwesomeReadme from '../AwesomeReadme/AwesomeReadme.jsx';
import Spinner from '../../components/UI/Spinner/Spinner.jsx';
import axios from 'axios';
import Fuse from 'fuse.js';
import { Route, withRouter } from 'react-router-dom';
import classes from './AwesomeSearch.module.css';

class AwesomeSearch extends Component {
  state = {
    subjects: null,
    subjectsArray: [],
    search: '',
    searchResult: [],
    errorMessage: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios
      .get('https://lockys.github.io/Awesome.json/awesome/awesome.json')
      .then((response) => {
        const subjects = response.data;
        const subjectsArray = Object.keys(subjects).flatMap((cate) =>
          subjects[cate].map((item) => ({ ...item, cate }))
        );

        this.fuse = new Fuse(subjectsArray, {
          keys: ['name'],
          threshold: 0.3,
          minMatchCharLength: 2,
          includeScore: true,
        });

        this.setState({ subjects, subjectsArray });
      })
      .catch((err) => {
        this.setState({ errorMessage: `Failed to load data: ${err.message}` });
      });
  };

  handleSearch = (value) => {
    if (!this.fuse) return;
    const results = this.fuse.search(value).slice(0, 20);
    this.setState({ search: value, searchResult: results });
  };

  handleOpen = (repo) => {
    this.props.history.push(`/${repo}`);
    this.setState({ search: '' });
  };

  goHome = () => {
    this.setState({ search: '' });
    this.props.history.push('/');
  };

  getBreadcrumbs() {
    const { location } = this.props;
    const { search } = this.state;
    const isHome = location.pathname === '/';

    if (isHome && search.trim().length >= 2) {
      return [
        { text: 'home', onClick: this.goHome },
        { text: 'search', accent: true },
      ];
    }

    if (!isHome) {
      const parts = location.pathname.replace(/^\//, '').split('/');
      if (parts.length >= 2) {
        return [
          { text: 'home', onClick: this.goHome },
          { text: parts[0] },
          { text: parts[1], accent: true },
        ];
      }
    }

    return null;
  }

  render() {
    const { search, searchResult, subjects, subjectsArray } = this.state;
    const { location } = this.props;
    const isHome = location.pathname === '/';
    const isSearchActive = isHome && search.trim().length >= 2;
    const crumbs = this.getBreadcrumbs();
    const categories = subjects ? Object.keys(subjects) : [];

    return (
      <div className={classes.Shell} data-testid="awesome-search">
        {/* Titlebar */}
        <header className={classes.Titlebar}>
          <div className={classes.TitlebarDots}>
            <span className={classes.DotPink} />
            <span className={classes.DotAmber} />
            <span className={classes.DotGreen} />
          </div>
          <span className={classes.TitlebarLogo} onClick={this.goHome}>
            awesome.search
          </span>
          {crumbs && (
            <div className={classes.Crumbs}>
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <span className={classes.CrumbSep}>/</span>
                  <span
                    className={`${classes.Crumb} ${c.accent ? classes.CrumbAccent : ''}`}
                    onClick={c.onClick}
                    style={{ cursor: c.onClick ? 'pointer' : 'default' }}
                  >
                    {c.text}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
          <span className={classes.TitlebarRight}>
            <span className={classes.ConnectedDot}>●</span>connected
          </span>
        </header>

        {/* Main content */}
        <main className={classes.Main}>
          {!subjects ? (
            <Spinner />
          ) : (
            <>
              <Route
                exact
                path="/"
                render={() =>
                  isSearchActive ? (
                    <AwesomeInput
                      query={search}
                      setQuery={this.handleSearch}
                      results={searchResult}
                      onOpen={this.handleOpen}
                      onClear={() => this.setState({ search: '' })}
                    />
                  ) : (
                    <AwesomeHome
                      subjects={subjects}
                      categories={categories}
                      subjectsArray={subjectsArray}
                      onSearch={(q) => this.handleSearch(q)}
                      onOpen={this.handleOpen}
                    />
                  )
                }
              />
              <Route
                path="/:user/:repo"
                render={(props) => (
                  <AwesomeReadme
                    key={`${props.match.params.user}/${props.match.params.repo}`}
                    {...props}
                    onBack={this.goHome}
                  />
                )}
              />
            </>
          )}
        </main>

        {/* Footer status bar */}
        <footer className={classes.Footer}>
          <span className={classes.FooterDot}>●</span>
          <Route
            exact
            path="/"
            render={() =>
              isSearchActive ? (
                <>
                  <span>{searchResult.length} matches</span>
                  <span className={classes.FooterSep}>·</span>
                  <span>threshold 0.3</span>
                  <span className={classes.FooterSep}>·</span>
                  <span>min-chars 2</span>
                </>
              ) : (
                <>
                  <span>{subjectsArray.length} lists indexed</span>
                  <span className={classes.FooterSep}>·</span>
                  <span>{categories.length} categories</span>
                </>
              )
            }
          />
          <Route
            path="/:user/:repo"
            render={() => (
              <>
                <span>readme</span>
                <span className={classes.FooterSep}>·</span>
                <span>markdown</span>
              </>
            )}
          />
          <span className={classes.FooterRight}>
            <Route
              exact
              path="/"
              render={() =>
                isSearchActive ? (
                  <>
                    <Kbd>esc</Kbd>
                    <span>home</span>
                    <span className={classes.FooterSep}>·</span>
                    <Kbd>⌘K</Kbd>
                    <span>focus</span>
                  </>
                ) : (
                  <>
                    <Kbd>⌘K</Kbd>
                    <span>search</span>
                  </>
                )
              }
            />
            <Route
              path="/:user/:repo"
              render={() => (
                <>
                  <Kbd>esc</Kbd>
                  <span>back</span>
                </>
              )}
            />
          </span>
        </footer>
      </div>
    );
  }
}

function Kbd({ children }) {
  return (
    <span className="kbd-tag">
      {children}
    </span>
  );
}

export default withRouter(AwesomeSearch);
