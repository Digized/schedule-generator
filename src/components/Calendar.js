import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from "react";
import { week } from "./constants";
import ScheduleTree from './helpers/NewTree';
import "./Calendar.css"
import Courses from '../schedules/schedules_winter_2018_final.json';
import { store } from '../store';


BigCalendar.momentLocalizer(moment);
export default class ScheduleCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduleCombinations: [],
            num: 0,
            courses: []
        }
        store.subscribe(() => this.update())
        this.update();
    }

    update() {
        const courses = store.getState();
        const selectedCourses = [];
        courses.forEach(course => {
            const c = Courses.courses.find((obj) => obj.course_code === course);
            c && selectedCourses.push(c);
        });
        
        const schedules = selectedCourses.length > 0 && (new ScheduleTree(selectedCourses)).calendarify();
        this.setState({
            scheduleCombinations : schedules,
            num: 0
        });
    }

    handleRangeChange(event) {
        console.log(this.state.scheduleCombinations, event.target.value);
        this.setState({num: event.target.value});
    }

    render() {
        return (
            <div className={this.props.className}>
                <BigCalendar
                    events={this.state.scheduleCombinations.length > 0 ? this.state.scheduleCombinations[this.state.num] : [] }
                    min={week.day("Monday").hour(8).minute(30).toDate()}
                    max={week.day("Monday").hour(22).minute(0).toDate()}
                    defaultDate={week.toDate()}
                    defaultView='work_week' 
                    views={{ work_week: true }}
                    timeslots={3}
                    selectable='ignoreEvents'
                    toolbar={false}
                />
                <div>
                    <input type="range" min="0" max={this.state.scheduleCombinations.length-1} step="1" onChange={val => this.handleRangeChange(val)} />
                    {`${this.state.num} / ${this.state.scheduleCombinations.length}`}
                </div>
            </div>
        )
    } 
}

