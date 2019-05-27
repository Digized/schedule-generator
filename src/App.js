import React, { Component } from 'react';
import Calendar from "./components/Calendar";
import './App.css';
import Control from './components/Control';


class App extends Component {
  render() {
    return (
      <div className="grid-container">
        <Control className="control"/>
        <Calendar className="calendar" />
        {console.log("%cHey, thanks for using the app. Want to make it better? https://github.com/digized/schedule-generator 😉", "background: linear-gradient(red,blue);display:block;color:white;font-size:20pt;")}
      </div>
    );
  }
}

export default App;
