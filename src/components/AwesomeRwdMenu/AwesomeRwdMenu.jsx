import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AwesomeRwdMenu.module.css';

const AwesomeRwdMenu = ({ topics, topicOnClickHandler }) => {
  return (
    <div className={`menu ${classes.AwesomeRwdMenu}`}>
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
    </div>
  );
};

export default AwesomeRwdMenu;
