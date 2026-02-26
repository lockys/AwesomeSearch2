import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import classes from './AwesomeInput.module.css';

const awesomeInput = (props) => {
  return (
    <div className={classes.AwesomeInput}>
      <div className={classes.SearchInputWrapper}>
        <FontAwesomeIcon
          icon={faHome}
          className={classes.HomeIcon}
          onClick={(e) => {
            e.preventDefault();
            props.history.push('/');
            props.homeOnClick('');
          }}
          role="button"
          aria-label="Go to home"
        />
        <input
          id='subject'
          type='text'
          placeholder='Search awesome lists...'
          className={classes.SearchInput}
          onChange={props.searchOnchange}
          value={props.value}
          onFocus={props.searchInputOnFocus}
          autoComplete="off"
          aria-label="Search awesome lists"
        />
      </div>
      {props.showResult ? (
        <div className={classes.SearchResult} role="listbox">
          {props.searchResult.length === 0 ? (
            <div className={classes.SearchResultItem} style={{ color: '#666', cursor: 'default' }}>
              Start typing to search...
            </div>
          ) : null}
          {props.searchResult.map((el, idx) => {
            return (
              <div key={el.item.name + idx} className={classes.SearchResultItem} role="option" aria-selected="false">
                <Link to={`/${el.item.repo}`}>
                  <span style={{ color: '#888', fontSize: '12px' }}>{el.item.cate}/</span>
                  <br />
                  <span style={{ fontWeight: 500 }}>{el.item.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(awesomeInput);
