import React from 'react';
import AwesomeSearch from './containers/AwesomeSearch/AwesomeSearch.jsx';
import { HashRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <HashRouter>
      <AwesomeSearch />
    </HashRouter>
  );
}

export default App;
