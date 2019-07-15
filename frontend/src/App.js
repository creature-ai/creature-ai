import React from 'react';
// import logo from './logo.svg';
import './App.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { FullLayoutTemplate } from './template/full-layout/FullLayout';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'

/* <div className="App">
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
</div> */

function App() {
  return (
    <Router>
      <Route exact path="/" component={FullLayoutTemplate} />
    </Router>
  );
}

library.add(fas);

export default App;
