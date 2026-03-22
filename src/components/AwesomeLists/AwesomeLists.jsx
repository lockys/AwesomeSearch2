import React from 'react';
import classes from './AwesomeLists.module.css';
import { Link } from 'react-router-dom';
import Homepage from '../AwesomeHome/AwesomeHome.jsx';

const awesomeLists = ({ topic, subjects }) => {
  if (topic === '') {
    return <Homepage />;
  }

  subjects.sort((a, b) => {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  return (
    <div className={classes.AwesomeLists} data-testid="awesome-lists">
      <div className={classes.ListHeader} data-testid="list-header">
        <h1 className={classes.ListTitle}>{topic}</h1>
        <p className={classes.ListSubtitle}>
          {subjects.length} awesome {subjects.length === 1 ? 'list' : 'lists'} sorted alphabetically
        </p>
      </div>

      <div className={classes.ListGrid} data-testid="list-grid">
        {subjects.map((subject, idx) => {
          return (
            <div key={subject.name + idx} className={classes.ListItem} data-testid="list-item">
              <Link to={`/${subject.repo}`} data-testid="list-item-link">
                {subject.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default awesomeLists;
