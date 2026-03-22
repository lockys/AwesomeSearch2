import React, { useState } from 'react';
import AwesomeSearch from './containers/AwesomeSearch/AwesomeSearch';
import { HashRouter } from 'react-router-dom';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(localStorage.getItem('__isDark') === 'true');
  const theme = isDark ? ' solarized-dark' : '';

  return (
    <HashRouter>
      <div className={`hack${theme}`}>
        <AwesomeSearch onThemeChange={setIsDark} isDark={isDark} theme={isDark ? 'dark-theme': 'normal-theme'} />
      </div>
    </HashRouter>
  );
}
export default App;
