import React from 'react';
import {Link} from 'react-router-dom';
import classes from './AwesomeHome.module.css';

const Homepage = () => {
    return (
        <div className={classes.HomePage} data-testid="home-page">
            <div className={classes.NoticeBanner}>
                <strong>Notice:</strong> We are moving to a new domain.{' '}
                <a href='https://awesomelists.calvinjeng.io' target='_blank' rel='noreferrer'>
                    awesomelists.calvinjeng.io
                </a>
                {' '}will be the new home of Awesome Search.
            </div>

            <div className={classes.HeroSection}>
                <h1 className={classes.HeroTitle}>
                    <span className={classes.highlight}>Awesome</span> Search
                </h1>
                <p className={classes.HeroSubtitle}>
                    Find what you want in awesome lists more quickly
                </p>
                <div className={classes.BadgeGroup}>
                    <a
                        href='https://github.com/sindresorhus/awesome'
                        rel='noreferrer'
                        target='_blank'
                    >
                        <img src='https://awesome.re/badge-flat2.svg' alt='awesome badge'/>
                    </a>
                    <a
                        href='https://github.com/lockys/NewAwesomeSearch'
                        rel='noreferrer'
                        target='_blank'
                    >
                        <img
                            src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square'
                            alt='PR is welcome'
                        />
                    </a>
                </div>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Why We Built This</h2>
                <p className={classes.SectionContent}>
                    There are so many awesome lists in sindresorhus/awesome.
                    We built this web application to help you access and search them more quickly.
                </p>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Features</h2>
                <ul className={classes.FeatureList}>
                    <li className={classes.FeatureItem}>
                        Access and search every awesome list from{' '}
                        <a href='https://github.com/sindresorhus/awesome'>
                            sindresorhus/awesome
                        </a>{' '}
                        on a single page
                    </li>
                    <li className={classes.FeatureItem}>
                        Access any list directly via URL like{' '}
                        <a href='https://awesomelists.calvinjeng.io/#/sindresorhus/awesome-nodejs'>
                            awesomelists.calvinjeng.io/#/sindresorhus/awesome-nodejs
                        </a>
                        {' '}(bookmark your favorites!)
                    </li>
                    <li className={classes.FeatureItem}>
                        Navigate smoothly using the table of contents when available
                    </li>
                </ul>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Get Started</h2>
                <p className={classes.SectionContent}>
                    Check out{' '}
                    <a href='https://awesomelists.calvinjeng.io/#/sindresorhus/awesome-nodejs'>
                        Awesome Node.js
                    </a>
                    {' '}to see it in action, or use the search bar above to find any awesome list.
                    {' '}You can also browse the <Link to="/shortcuts">keyboard shortcuts</Link> to navigate faster.
                </p>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Legacy Version</h2>
                <p className={classes.SectionContent}>
                    Prefer the old design? Visit{' '}
                    <a href='http://legacy.awesomelists.calvinjeng.io/#/'>legacy.awesomelists.calvinjeng.io</a>
                </p>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Credits</h2>
                <p className={classes.SectionContent}>
                    <a href='https://github.com/sindresorhus/awesome'>sindresorhus/awesome</a>,{' '}
                    <a href='https://github.com/sindresorhus/awesome/graphs/contributors'>
                        all awesome list authors
                    </a>, and{' '}
                    <a href='https://github.com/egoist/hack' rel='noreferrer' target='_blank'>
                        egoist/hack
                    </a>{' '}(CSS framework)
                </p>
            </div>

            <hr className={classes.Divider}/>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>Built By</h2>

                <div className={classes.AuthorCard}>
                    <img
                        className={classes.AuthorAvatar}
                        src='https://avatars.githubusercontent.com/u/3911469?v=4'
                        alt='Calvin Jeng'
                    />
                    <div className={classes.AuthorInfo}>
                        <h3 className={classes.AuthorName}>
                            Calvin Jeng{' '}
                            <a href='https://github.com/lockys' target='_blank' rel='noreferrer'>
                                @lockys
                            </a>
                        </h3>
                        <p className={classes.AuthorBio}>
                            Front-end developer at DBS Bank, previously back-end developer at Garmin.
                        </p>
                    </div>
                </div>

                <div className={classes.AuthorCard}>
                    <img
                        className={classes.AuthorAvatar}
                        src='https://avatars.githubusercontent.com/u/4214069?v=4'
                        alt='Che-Wei Lin'
                    />
                    <div className={classes.AuthorInfo}>
                        <h3 className={classes.AuthorName}>
                            Che-Wei Lin{' '}
                            <a href='https://github.com/John-Lin' target='_blank' rel='noreferrer'>
                                @John-Lin
                            </a>
                        </h3>
                        <p className={classes.AuthorBio}>
                            Site reliability engineer at Line Corp, previously cloud architect at Tencent.
                        </p>
                    </div>
                </div>
            </div>

            <div className={classes.Footer}>
                <span className={classes.highlight}>Awesome Search</span> from 2015 to {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default Homepage;
