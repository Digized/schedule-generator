import React, { Component } from 'react';
import Calendar from "./components/Calendar";
import './App.css';
import Control from './components/Control';


class App extends Component {
  render() {
    return (
      <div>
        <Control className="control"/>
        <Calendar className="calendar" />
      </div>
    );
  }
}

export default App;
