import React, { Component } from "react";
import Select from 'react-select';
import './Control.css';
import course from '../components/helpers/CourseMapper';
import { store } from '../store';
import "./helpers/Tree";


let options = [];
export default class Control extends Component {

  constructor() {
    super();
    this.state = {
      value: [],
      mode: 0,
    }

  }

  componentWillMount() {
    this.updateCourses(0);
  }


  updateCourses(val) {
    const index = val;
    options = [];
    course[index].courses.forEach(course => {
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
      type: "UPDATE",
      courses: value.split(",")
    });
    this.setState({ value: value });
  }

  handleSwitchChange(val) {
    store.dispatch({
      type: "MODE",
      mode: val
    });
    this.updateCourses(val);

    this.setState({ mode: val, value: [] });
  }


  render() {
    return (
      <div className={this.props.className}>
        <h1> uOttawa Course Schedule Generator</h1>
        <div>
          <div>
            <h2>Select Term:</h2>
            <input type="radio" id="Fall"
              name="mode" value="0" defaultChecked onChange={() => this.handleSwitchChange(0)} />
            <label htmlFor="Fall">Fall 2019</label>
            <br />
            <input type="radio" id="Winter"
              name="mode" value="1" onChange={() => this.handleSwitchChange(1)} />
            <label htmlFor="Winter">Winter 2020</label>
          </div>
          <br />
          <Select
            multi
            onChange={(val) => this.handleSelectChange(val)}
            options={options}
            placeholder="Select Course(s)"
            simpleValue
            value={this.state.value}

          />
        </div>
      </div >
    )
  }
}