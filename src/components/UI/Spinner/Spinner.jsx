import React from 'react';
import classes from './Spinner.module.css';

const SIDEBAR_ITEMS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const CARD_GROUPS = [
  { titleWidth: '25%', cards: 3 },
  { titleWidth: '20%', cards: 4 },
  { titleWidth: '30%', cards: 2 },
];

const Spinner = () => {
  return (
    <div className={classes.PageSkeleton} data-testid="spinner">
      <div className={classes.Sidebar}>
        <div className={`${classes.Bar} ${classes.SidebarLabel}`} />
        {SIDEBAR_ITEMS.map((n) => (
          <div key={n} className={`${classes.Bar} ${classes.SidebarItem}`} />
        ))}
      </div>
      <div className={classes.Content}>
        {CARD_GROUPS.map((group, i) => (
          <div key={i} className={classes.CardGroup}>
            <div className={`${classes.Bar} ${classes.CardTitle}`} style={{ width: group.titleWidth }} />
            {Array.from({ length: group.cards }).map((_, j) => (
              <div key={j} className={`${classes.Bar} ${classes.Card}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spinner;
