import React from 'react';
import classes from './AwesomeHome.module.css';

const Homepage = () => {
    return (
        <div className={classes.HomePage}>
            <p
                style={{
                    padding: '5px',
                    textAlign: 'center',
                }}
            >
                [<span style={{color: '#C7372F'}}>Awesome</span>
                <span style={{color: '#C7372F'}}>Search</span> makes you find what you
                want in awesome lists more quickly.]
            </p>

            <section>
                <a
                    href='https://github.com/sindresorhus/awesome'
                    rel='noreferrer'
                    target='_blank'
                >
                    <img src='https://awesome.re/badge-flat2.svg' alt='awesome badge.'/>
                </a>{' '}
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
            </section>

            <h1>Why We Did This</h1>
            <section>
                There are so many awesome lists in the 🕶 sindresorhus/awesome. <br/>
                We hope to build a web application to access them more quickly.
            </section>
            <h1>Features</h1>
            <ul>
                <li>
                    Access and search every awesome list listed in{' '}
                    <a href='https://github.com/sindresorhus/awesome'>
                        sindresorhus/awesome
                    </a>{' '}
                    inside of a single page without pain.
                </li>
                <li>
                    Access an awesome list by{' '}
                    <a href='https://awesomelists.top/#/sindresorhus/awesome-nodejs'>
                        https://awesomelists.top/#/sindresorhus/awesome-nodejs
                    </a>
                    .(you can bookmark your favorites!)
                </li>
                <li>
                    Navigate smoothly to what you want to see using "content" if that list
                    has table of content.
                </li>
            </ul>
            <h1>Get Started With a List</h1>
            <section>
                Check out -{' '}
                <a href='https://awesomelists.top/#/sindresorhus/awesome-nodejs'>
                    Awesome Node.js
                </a>
                !
            </section>
            <h1>Old Awesome Search</h1>
            <section>
                👉If you prefer old awesome search, please refer to{' '}
                <a href='https://legacy.awesomelists.top/#/'>old awesome search</a>
            </section>
            <h1>Credit To</h1>
            <section>
                <a href='https://github.com/sindresorhus/awesome'>
                    sindresorhus/awesome
                </a>
                ,{' '}
                <a href='https://github.com/sindresorhus/awesome/graphs/contributors'>
                    all authors of awesome lists
                </a>
                ,{' '}
                <a
                    href='https://github.com/egoist/hack'
                    rel='noreferrer'
                    target='_blank'
                >
                    egoist/hack
                </a>{' '}
                (theme, css framework)
            </section>
            <hr/>
            <section>
                <a href='https://github.com/lockys/NewAwesomeSearch'>Awesome Search</a>{' '}
                is built by:
                <br/>
                <br/>
                <div className='media'>
                    <div className='media-left'>
                        <div className='avatarholder'>
                            <img
                                style={{width: 'inherit'}}
                                src='https://avatars.githubusercontent.com/u/3911469?v=4'
                                alt='Calvin Jeng'
                            />
                        </div>
                    </div>
                    <div className='media-body'>
                        <div className='media-heading'>
                            Calvin Jeng{' '}
                            <a
                                href='https://github.com/lockys'
                                target='_blank'
                                rel='noreferrer'
                            >
                                @lockys
                            </a>
                        </div>
                        <div className='media-content'>
                            Calvin Jeng is a front-end developer working for DBS Bank(星展銀行),
                            previously a back-end developer at Garmin.
                        </div>
                    </div>
                </div>
                <div className='media'>
                    <div className='media-left'>
                        <div className='avatarholder'>
                            <img
                                style={{width: 'inherit'}}
                                src='https://avatars.githubusercontent.com/u/4214069?v=4'
                                alt='Che-Wei Lin'
                            />
                        </div>
                    </div>
                    <div className='media-body'>
                        <div className='media-heading'>
                            Che-Wei Lin{' '}
                            <a
                                href='https://github.com/John-Lin'
                                target='_blank'
                                rel='noreferrer'
                            >
                                @John-Lin
                            </a>
                        </div>
                        <div className='media-content'>
                            Che-Wei Lin is a site reliability engineer(SRE) at Line corp,
                            previously a cloud architect at Tencent.
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
            </section>
            <section
                style={{
                    float: 'right',
                }}
            >
                <span style={{color: '#C7372F'}}>Awesome</span>
                <span style={{color: '#C7372F'}}>Search</span> from 2015 to{' '}
                {new Date().getFullYear()}
            </section>
        </div>
    );
};

export default Homepage;
