import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from "react";
import { week } from "./constants";
import ScheduleTree from './helpers/Tree';
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
        };
        store.subscribe(() => this.update());
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
            scheduleCombinations: schedules,
            num: 0
        });
    }

    handleRangeChange(event) {
        console.log(this.state.scheduleCombinations, event.target.type);
        let val = event.target.value ;
        if(event.target.type === "number") val--;
        this.setState({ num: val});
    }

    showSlider() {
        if (this.state.scheduleCombinations && this.state.scheduleCombinations.length > 0) {
            return (
                <div className="space-bottom">
                    <input type="range" className="slider" min="0" defaultValue="0" value={this.state.num} max={this.state.scheduleCombinations.length-1} onChange={val => this.handleRangeChange(val)}></input>
                    <input type="number" className="slider-n" min="1" defaultValue="1" value={(parseInt(this.state.num,10) + 1)} max={this.state.scheduleCombinations.length} onChange={val=> this.handleRangeChange(val)}></input> / {this.state.scheduleCombinations.length}
                </div>
            )
        }
        else {
            return (
                <div className="space-bottom">
                    Please Select Courses 🙂 
                </div>
            )
        }
    }


    render() {
        return (
            <div className="calendar-container">
                {this.showSlider()}
                <div className="calendar">
                    <BigCalendar
                        events={this.state.scheduleCombinations.length > 0 ? this.state.scheduleCombinations[this.state.num] : []}
                        min={week.day("Monday").hour(8).minute(30).toDate()}
                        max={week.day("Monday").hour(22).minute(0).toDate()}
                        defaultDate={week.toDate()}
                        defaultView='work_week'
                        views={{ work_week: true }}
                        timeslots={3}
                        selectable='ignoreEvents'
                        toolbar={false}
                    />
                </div>
            </div>
        )
    }
}

