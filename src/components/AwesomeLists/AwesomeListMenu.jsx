import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AwesomeListMenu.module.css';

const awesomeListMenu = ({ topics, topicOnClickHandler }) => {
  return (
    <div className={`menu ${classes.AwesomeListMenu}`}>
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

export default awesomeListMenu;
