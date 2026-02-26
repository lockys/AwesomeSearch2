import React, {Component} from 'react';
import AwesomeListMenu from '../../components/AwesomeLists/AwesomeListMenu.jsx';
import AwesomeRwdMenu from '../../components/AwesomeRwdMenu/AwesomeRwdMenu.jsx';
import AwesomeLists from '../../components/AwesomeLists/AwesomeLists.jsx';
import AwesomeInput from '../../components/AwesomeInput/AwesomeInput.jsx';
import AwesomeReadme from '../AwesomeReadme/AwesomeReadme.jsx';
import Spinner from '../../components/UI/Spinner/Spinner.jsx';
import axios from 'axios';
import Fuse from 'fuse.js';
import {Route, withRouter} from 'react-router-dom';
import Backdrop from '../../components/UI/Backdrop/Backdrop.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeSearch.module.css';
import {MdDarkMode, MdLightMode} from 'react-icons/md';

class AwesomeSearch extends Component {
    state = {
        errorMessage: null,
        subjects: null,
        selectedSubject: '',
        subjectsArray: [],
        search: '',
        searchResult: [],
        showResult: false,
        showMenu: false,
    };

    getSubjectEntries = () => {
        axios
            .get(
                'https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json'
            )
            .then((subjects) => {
                this.setState({
                    subjects: subjects.data,
                    errorMessage: '',
                });

                let subjectsArray = Object.keys(subjects.data)
                    .map((subject) => {
                        return subjects.data[subject];
                    })
                    .reduce((arr, el) => {
                        return arr.concat(el);
                    }, []);

                this.setState({subjectsArray: subjectsArray});

                if (!this.state.subjects) {
                    this.setState({
                        errorMessage:
                            'There was an error. Unable to load the Awesome subjects.',
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    errorMessage: `There was an error. Unable to load the Awesome subjects: ${error}.`,
                });
            });
    };

    componentDidMount() {
        this.getSubjectEntries();
    }

    topicOnClickHandler = (topic) => {
        this.setState({selectedSubject: topic, showMenu: false});
    };

    searchInputOnChangeHandler = (event) => {
        this.setState({
            search: event.target.value,
        });

        const options = {
            keys: ['name'],
        };

        const fuse = new Fuse(this.state.subjectsArray, options);
        const result = fuse.search(event.target.value);

        this.setState({searchResult: result.slice(0, 20)});
    };

    searchInputOnFocusHandler = () => {
        this.setState({showResult: true});
    };

    searchInputOnCloseHandler = () => {
        this.setState({showResult: false});
    };

    setMdHandler = (md) => {
        this.setState({
            md: md,
        });
    };

    burgerButtonClickHandler = () => {
        this.setState((prevState) => {
            return {
                showMenu: !prevState.showMenu,
                showResult: false,
            };
        });
    };

    render() {
        return (
            <div className={`${classes.AwesomeSearch} ${classes[this.props.theme]}`}>
                <header className={classes.Header}>
                    <AwesomeInput
                        searchOnchange={this.searchInputOnChangeHandler}
                        value={this.state.search}
                        searchResult={this.state.searchResult}
                        searchInputOnFocus={this.searchInputOnFocusHandler}
                        showResult={this.state.showResult}
                        homeOnClick={this.topicOnClickHandler}
                    />

                    <div className={classes.HeaderActions}>
                        <div
                            className={classes.ThemeToggle}
                            role="button"
                            aria-label={this.props.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {!this.props.isDark ? <MdDarkMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'true');
                                    this.props.onThemeChange(true);
                                }}
                            /> : <MdLightMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'false');
                                    this.props.onThemeChange(false);
                                }}
                            />}
                        </div>

                        <div
                            className={classes.BurgerButton}
                            onClick={this.burgerButtonClickHandler}
                            role="button"
                            aria-label="Toggle menu"
                            aria-expanded={this.state.showMenu}
                        >
                            <FontAwesomeIcon icon={faBars}/>
                        </div>
                    </div>
                </header>

                {this.state.subjects ? (
                    <div className="grid">
                        <div
                            className="cell -2of12"
                            style={{
                                width: '100%',
                            }}
                        >
                            <AwesomeRwdMenu
                                topics={Object.keys(this.state.subjects)}
                                topicOnClickHandler={this.topicOnClickHandler}
                                isOpen={this.state.showMenu}
                                onClose={() => this.setState({showMenu: false})}
                            />
                            <AwesomeListMenu
                                topics={Object.keys(this.state.subjects)}
                                topicOnClickHandler={this.topicOnClickHandler}
                            />
                        </div>
                        <div
                            className="cell -10of12"
                            style={{
                                width: '100%',
                            }}
                        >
                            <Route
                                path="/"
                                exact
                                render={() => {
                                    return (
                                        <AwesomeLists
                                            topic={this.state.selectedSubject}
                                            subjects={this.state.subjects[this.state.selectedSubject]}
                                        />
                                    );
                                }}
                            />
                            <Route
                                path="/:user/:repo"
                                render={(props) => {
                                    return (
                                        <AwesomeReadme
                                            key={props.match.params.repo}
                                            setMdHandler={this.setMdHandler}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                        </div>

                        <Backdrop
                            show={this.state.showResult}
                            closeSearchModal={this.searchInputOnCloseHandler}
                        />
                    </div>
                ) : (
                    <Spinner/>
                )}
            </div>
        );
    }
}

export default withRouter(AwesomeSearch);
