import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeInput.module.css';

const awesomeInput = (props) => {
  return (
    <div className={classes.AwesomeInput}>
      <fieldset className='form-group'>
        <label htmlFor='subject'>
          <FontAwesomeIcon
            icon={faHome}
            className={classes.HomeIcon}
            onClick={(e) => {
              e.preventDefault();
              props.history.push('/');
              props.homeOnClick('');
            }}
          />
          <span style={{ color: '#C7372F' }}>Awesome</span>
          <span style={{ color: '#C7372F' }}>Search</span>
        </label>
        <input
          id='subject'
          type='text'
          placeholder='Try To Search Node.js'
          className='form-control'
          onChange={props.searchOnchange}
          value={props.value}
          onFocus={props.searchInputOnFocus}
        ></input>
        {props.showResult ? (
          <div className={classes.SearchResult}>
            <ul>
              {props.searchResult.length === 0 ? (
                <span>Please input something :)</span>
              ) : null}
              {props.searchResult.map((el, idx) => {
                return (
                  <li key={el.item.name + idx}>
                    {el.item.cate}/
                    <Link to={`/${el.item.repo}`}>{el.item.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </fieldset>
    </div>
  );
};

export default withRouter(awesomeInput);
