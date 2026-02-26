import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AwesomeRwdMenu.module.css';

const AwesomeRwdMenu = ({ topics, topicOnClickHandler, isOpen, onClose }) => {
  return (
    <>
      <div
        className={`${classes.MenuOverlay} ${isOpen ? classes.active : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`menu ${classes.AwesomeRwdMenu} ${isOpen ? classes.open : ''}`}
        aria-label="Categories menu"
      >
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
    </>
  );
};

export default AwesomeRwdMenu;
