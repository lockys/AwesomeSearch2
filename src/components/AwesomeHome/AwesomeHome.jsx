import React from 'react';

const hideBadgeOnError = (e) => { e.currentTarget.style.display = 'none'; };
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
                <h1 className={classes.HeroTitle}>Awesome Search</h1>
                <p className={classes.HeroSubtitle}>
                    Search across all{' '}
                    <a href='https://github.com/sindresorhus/awesome'>sindresorhus/awesome</a>{' '}
                    lists in one place.
                </p>
                <div className={classes.BadgeGroup}>
                    <a
                        href='https://github.com/sindresorhus/awesome'
                        rel='noreferrer'
                        target='_blank'
                    >
                        <img src='https://awesome.re/badge-flat2.svg' alt='awesome badge' onError={hideBadgeOnError}/>
                    </a>
                    <a
                        href='https://github.com/lockys/NewAwesomeSearch'
                        rel='noreferrer'
                        target='_blank'
                    >
                        <img
                            src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square'
                            alt='PR is welcome'
                            onError={hideBadgeOnError}
                        />
                    </a>
                </div>
            </div>

            <div className={classes.Section}>
                <h2 className={classes.SectionTitle}>About</h2>
                <p className={classes.SectionContent}>
                    There are thousands of awesome lists curated by the community. This tool
                    lets you search and browse them all from a single page. You can also access
                    any list directly via URL, e.g.{' '}
                    <a href='https://awesomelists.calvinjeng.io/#/sindresorhus/awesome-nodejs'>
                        awesome-nodejs
                    </a>.
                    {' '}See <Link to="/shortcuts">keyboard shortcuts</Link> for faster navigation.
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

            <div className={classes.Footer}>
                Built by{' '}
                <a href='https://github.com/lockys' target='_blank' rel='noreferrer'>@lockys</a>
                {' '}and{' '}
                <a href='https://github.com/John-Lin' target='_blank' rel='noreferrer'>@John-Lin</a>
                {' '}&middot; 2015&ndash;{new Date().getFullYear()}
            </div>
        </div>
    );
};

export default Homepage;
