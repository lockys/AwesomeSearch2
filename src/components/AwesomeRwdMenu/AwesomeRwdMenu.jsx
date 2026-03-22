import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import classes from './AwesomeRwdMenu.module.css';

const AwesomeRwdMenu = ({ topics, topicOnClickHandler, isOpen, onClose, isDark, onThemeChange }) => {
  return (
    <>
      <div
        className={`${classes.MenuOverlay} ${isOpen ? classes.active : ''}`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="rwd-menu-overlay"
      />
      <nav
        className={`menu ${classes.AwesomeRwdMenu} ${isOpen ? classes.open : ''}`}
        aria-label="Categories menu"
        data-testid="rwd-menu"
      >
        <div className={classes.MenuTop} data-testid="rwd-menu-top">
          <Link
            className={`menu-item ${classes.HomeLink}`}
            to="/"
            onClick={() => { topicOnClickHandler(''); onClose(); }}
            aria-label="Go to home"
            data-testid="rwd-home-link"
          >
            <FontAwesomeIcon icon={faHome} className={classes.HomeIcon} />
            Home
          </Link>
          <div
            className={classes.ThemeToggle}
            role="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            data-testid="rwd-theme-toggle"
            onClick={() => {
              const next = !isDark;
              localStorage.setItem('__isDark', String(next));
              onThemeChange(next);
            }}
          >
            {isDark ? <MdLightMode /> : <MdDarkMode />}
          </div>
        </div>
        <div className={classes.MenuHeader}>
          <h2 className={classes.MenuTitle}>Categories</h2>
        </div>
        {topics.map((topic) => {
          return (
            <Link
              key={topic}
              className="menu-item"
              to="/"
              onClick={() => {
                topicOnClickHandler(topic);
              }}
              data-testid="rwd-category-link"
            >
              {topic}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default AwesomeRwdMenu;
