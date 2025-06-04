import React, {useState, useEffect} from 'react';
import AwesomeListMenu from '../../components/AwesomeLists/AwesomeListMenu';
import AwesomeRwdMenu from '../../components/AwesomeRwdMenu/AwesomeRwdMenu';
import AwesomeLists from '../../components/AwesomeLists/AwesomeLists';
import AwesomeInput from '../../components/AwesomeInput/AwesomeInput';
import AwesomeReadme from '../AwesomeReadme/AwesomeReadme';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from 'axios';
import Fuse from 'fuse.js';
import {Route, withRouter} from 'react-router-dom';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeSearch.module.css';
import {MdDarkMode, MdLightMode} from 'react-icons/md';

const AwesomeSearch = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [subjects, setSubjects] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjectsArray, setSubjectsArray] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [md, setMd] = useState();

    const getSubjectEntries = () => {
        axios
            .get(
                'https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json'
            )
            .then((subjectsRes) => {
                setSubjects(subjectsRes.data);
                setErrorMessage('');

                let subjectsArrayLocal = Object.keys(subjectsRes.data)
                    .map((subject) => {
                        return subjectsRes.data[subject];
                    })
                    .reduce((arr, el) => {
                        return arr.concat(el);
                    }, []);

                setSubjectsArray(subjectsArrayLocal);

                if (!subjectsRes.data) {
                    setErrorMessage(
                        'There was an error. Unable to load the Awesome subjects.'
                    );
                }
            })
            .catch((error) => {
                setErrorMessage(
                    `There was an error. Unable to load the Awesome subjects: ${error}.`
                );
            });
    };

    useEffect(() => {
        getSubjectEntries();
    }, []);

    const topicOnClickHandler = (topic) => {
        setSelectedSubject(topic);
        setShowMenu(false);
    };

    const searchInputOnChangeHandler = (event) => {
        setSearch(event.target.value);

        const options = {
            keys: ['name'],
        };

        const fuse = new Fuse(subjectsArray, options);
        const result = fuse.search(event.target.value);

        setSearchResult(result.slice(0, 20));
    };

    const searchInputOnFocusHandler = () => {
        setShowResult(true);
    };

    const searchInputOnCloseHandler = () => {
        setShowResult(false);
    };

    const setMdHandler = (markdown) => {
        setMd(markdown);
    };

    const burgerButtonClickHandler = () => {
        setShowMenu((prev) => !prev);
        setShowResult(false);
    };

    return (
            <div className={`${classes.AwesomeSearch} ${classes[props.theme]}`}>
                <div className="grid">
                    <div className="cell -12of12">
                        <AwesomeInput
                            searchOnchange={searchInputOnChangeHandler}
                            value={search}
                            searchResult={searchResult}
                            searchInputOnFocus={searchInputOnFocusHandler}
                            showResult={showResult}
                            homeOnClick={topicOnClickHandler}
                        />

                        <div
                            className={classes.BurgerButton}
                            onClick={burgerButtonClickHandler}
                        >
                            <FontAwesomeIcon icon={faBars}/>
                        </div>

                        <div
                            className="btn-group"
                            style={{float: 'right', fontSize: '2rem', cursor: 'pointer', verticalAlign: 'middle'}}
                        >
                            {!props.isDark ? <MdDarkMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'true');
                                    props.onThemeChange(true);
                                }}
                            /> : <MdLightMode
                                onClick={() => {
                                    localStorage.setItem('__isDark', 'false');
                                    props.onThemeChange(false);
                                }}
                            />}
                        </div>
                    </div>
                </div>

                {subjects ? (
                    <div className="grid">
                        <div
                            className="cell -2of12"
                            style={{
                                width: '100%',
                            }}
                        >
                            {showMenu ? (
                                <AwesomeRwdMenu
                                    topics={Object.keys(subjects)}
                                    topicOnClickHandler={topicOnClickHandler}
                                />
                            ) : null}
                            <AwesomeListMenu
                                topics={Object.keys(subjects)}
                                topicOnClickHandler={topicOnClickHandler}
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
                                            topic={selectedSubject}
                                            subjects={subjects[selectedSubject]}
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
                                            setMdHandler={setMdHandler}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                        </div>

                        <Backdrop
                            show={showResult}
                            closeSearchModal={searchInputOnCloseHandler}
                        />
                    </div>
                ) : (
                    <Spinner/>
                )}
            </div>
        );
};

export default withRouter(AwesomeSearch);
