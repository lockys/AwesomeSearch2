import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeListMenu.module.css';

const awesomeListMenu = ({ topics, topicOnClickHandler }) => {
  return (
    <nav className={`menu ${classes.AwesomeListMenu}`} aria-label="Categories" data-testid="list-menu">
      <Link
        className={`menu-item ${classes.HomeLink}`}
        to="/"
        onClick={() => topicOnClickHandler('')}
        aria-label="Go to home"
        data-testid="home-link"
      >
        <FontAwesomeIcon icon={faHome} className={classes.HomeIcon} />
        Home
      </Link>
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
            data-testid="category-link"
          >
            {topic}
          </Link>
        );
      })}
    </nav>
  );
};

export default awesomeListMenu;
