import React, { Component } from "react";
import Select from 'react-select';
import './Control.css';
import course from '../schedules/schedules_winter_2018_final.json';
import { store } from '../store';
import "./helpers/NewTree";


const options = [];
export default class Control extends Component {

  constructor() {
    super();
    this.state = {
      value: []
    }

  }

  componentDidMount() {

    course.courses.forEach(course => {
      options.push(
        {
          label: `${course.course_code} | ${course.course_title}`,
          value: course.course_code
        }
      )
    });

  }

  handleSelectChange(value) {
    store.dispatch({
      type: "Update",
      courses: value.split(",")
    });
    this.setState({ value });
  }


  render() {
    const value = this.state.value;
    return (
      <div className={this.props.className}>
        <h1> uOttawa Course Schedule Generator</h1>
        <Select
          multi
          onChange={(val) => this.handleSelectChange(val)}
          options={options}
          placeholder="Select Course(s)"
          simpleValue
          value={value}
        />
      </div>
    )
  }
}