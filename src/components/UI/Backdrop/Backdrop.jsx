import React from 'react';
import classes from './Backdrop.module.css';
const backdrop = (props) => {
  const backdrop = props.show ? (
    <div onClick={props.closeSearchModal} className={classes.Backdrop}></div>
  ) : null;
  return backdrop;
};

export default backdrop;
