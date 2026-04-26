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

  render() {
    const { search, searchResult, subjects, subjectsArray } = this.state;
    const { location } = this.props;
    const isHome = location.pathname === '/';
    const isSearchActive = isHome && search.trim().length >= 2;
    const categories = subjects ? Object.keys(subjects) : [];

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

      </div>
    );
  }
}

export default withRouter(AwesomeSearch);
