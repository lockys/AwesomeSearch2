import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classes from './AwesomeInput.module.css';

const AwesomeInput = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [props.searchResult]);

  const navigate = (item) => {
    props.history.push(`/${item.item.repo}`);
    props.searchInputOnClose(item.item.name);
  };

  const handleKeyDown = (e) => {
    const count = props.searchResult.length;
    if (e.key === 'Tab' && count > 0) {
      e.preventDefault();
      navigate(props.searchResult[0]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, count - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigate(props.searchResult[selectedIndex]);
    }
  };

  return (
    <div className={classes.AwesomeInput} data-testid="awesome-input">
      <div className={classes.SearchInputWrapper}>
        <input
          id='subject'
          type='text'
          placeholder='Search AwesomeList!'
          className={classes.SearchInput}
          onChange={props.searchOnchange}
          value={props.value}
          onFocus={props.searchInputOnFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Search awesome lists"
          data-testid="search-input"
        />
      </div>
      {props.showResult ? (
        <div className={classes.SearchResult} role="listbox" data-testid="search-results">
          {props.searchResult.length === 0 ? (
            <div className={classes.SearchResultItem} style={{ color: '#666', cursor: 'default' }}>
              Type something to search
            </div>
          ) : null}
          {props.searchResult.map((el, idx) => (
            <div
              key={el.item.name + idx}
              className={`${classes.SearchResultItem} ${idx === selectedIndex ? classes.SearchResultItemSelected : ''}`}
              role="option"
              aria-selected={idx === selectedIndex}
              data-testid="search-result-item"
            >
              <Link to={`/${el.item.repo}`} onClick={() => props.searchInputOnClose(el.item.name)} data-testid="search-result-link">
                <span style={{ color: '#888', fontSize: '12px' }}>{el.item.cate}/</span>
                <br />
                <span style={{ fontWeight: 500 }}>{el.item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(AwesomeInput);
