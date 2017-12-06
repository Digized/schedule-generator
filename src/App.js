import React, { Component } from 'react';
import { Calendar } from "./Calendar";
import SearchInput, {createFilter} from 'react-search-input'
import './App.css';
import AdilApp from "./AdilApp"
import SearchCourses from "./SearchCourses"



class App extends Component {
  render() {
    return (
      <div>
        <AdilApp text="HEYYY" />
        <AdilApp text="Adil" />
        <SearchCourses/>
      </div>
    );
  }
}

export default App;
