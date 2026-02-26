import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AwesomeListMenu.module.css';

const awesomeListMenu = ({ topics, topicOnClickHandler }) => {
  return (
    <nav className={`menu ${classes.AwesomeListMenu}`} aria-label="Categories">
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
          >
            {topic}
          </Link>
        );
      })}
    </nav>
  );
};

export default awesomeListMenu;
