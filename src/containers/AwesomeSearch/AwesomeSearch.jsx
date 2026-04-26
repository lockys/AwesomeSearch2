import React, { Component } from 'react';
import AwesomeHome from '../../components/AwesomeHome/AwesomeHome.jsx';
import AwesomeInput from '../../components/AwesomeInput/AwesomeInput.jsx';
import AwesomeReadme from '../AwesomeReadme/AwesomeReadme.jsx';
import Spinner from '../../components/UI/Spinner/Spinner.jsx';
import SiteMap from './SiteMap.jsx';
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

  handleCategoryFilter = (categoryName) => {
    const results = this.state.subjectsArray
      .filter((item) => item.cate === categoryName)
      .map((item) => ({ item, score: 0, refIndex: 0 }));
    this.setState({ search: categoryName, searchResult: results });
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
    const parts = location.pathname.split('/').filter(Boolean);

    const crumbs = [{ text: '~', onClick: this.goHome }];

    if (parts.length === 0) {
      if (search.trim().length >= 2) {
        crumbs.push({ text: `search: "${search.trim()}"`, onClick: null });
      }
    } else if (parts.length >= 2) {
      crumbs.push({ text: parts[0], onClick: null });
      crumbs.push({ text: parts[1], onClick: null });
    }

    return crumbs;
  }

  handleSiteMapNavigate = (type, value) => {
    if (type === '/') {
      this.goHome();
    } else if (type === 'search') {
      // value is a lowercased category name; find the original casing
      const { subjects } = this.state;
      const original = subjects
        ? Object.keys(subjects).find((k) => k.toLowerCase() === value)
        : null;
      if (original) {
        this.handleCategoryFilter(original);
      } else {
        this.handleSearch(value);
      }
    } else if (type === 'repo') {
      this.handleOpen(value);
    }
  };

  render() {
    const { search, searchResult, subjects, subjectsArray } = this.state;
    const { location } = this.props;
    const isHome = location.pathname === '/';
    const isSearchActive = isHome && search.trim().length >= 2;
    const categories = subjects ? Object.keys(subjects) : [];
    const crumbs = this.getBreadcrumbs();

    return (
      <div className={classes.Shell} data-testid="awesome-search">
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
                      onCategoryFilter={this.handleCategoryFilter}
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

          {subjects && (
            <SiteMap
              categories={categories}
              subjectsArray={subjectsArray}
              onNavigate={this.handleSiteMapNavigate}
            />
          )}

          {/* Breadcrumbs */}
          <span className={classes.Crumbs}>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className={classes.CrumbSep}>/</span>}
                <span
                  className={c.onClick ? classes.CrumbLink : classes.CrumbText}
                  onClick={c.onClick || undefined}
                >
                  {c.text}
                </span>
              </React.Fragment>
            ))}
          </span>

          <span className={classes.FooterSep}>·</span>

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
