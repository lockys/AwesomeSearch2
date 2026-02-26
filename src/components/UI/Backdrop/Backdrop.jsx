import React from 'react';
import classes from './Backdrop.module.css';

const Backdrop = (props) => {
  return (
    <div
      onClick={props.closeSearchModal}
      className={`${classes.Backdrop} ${props.show ? classes.active : ''}`}
      aria-hidden="true"
    />
  );
};

export default Backdrop;
