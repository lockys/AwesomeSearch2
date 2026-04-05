import React, { useState, useEffect } from 'react';
import AwesomeSearch from './containers/AwesomeSearch/AwesomeSearch.jsx';
import { HashRouter } from 'react-router-dom';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(localStorage.getItem('__isDark') !== null ? localStorage.getItem('__isDark') === 'true' : true);
  const theme = isDark ? ' solarized-dark' : '';

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <HashRouter>
      <div className={`hack${theme}`} data-testid="app">
        <AwesomeSearch onThemeChange={setIsDark} isDark={isDark} theme={isDark ? 'dark-theme': 'normal-theme'} />
      </div>
    </HashRouter>
  );
}
export default App;
