import React from 'react';
import classes from './Backdrop.module.css';

const Backdrop = (props) => {
  return (
    <div
      onClick={props.closeSearchModal}
      className={`${classes.Backdrop} ${props.show ? classes.active : ''}`}
      aria-hidden="true"
      data-testid="backdrop"
    />
  );
};

export default Backdrop;
