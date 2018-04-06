import React from "react";
import ScheduleTree from './helpers/Tree';
import "./Calendar.css"
import Courses from '../schedules/schedules_winter_2018_final.json';
import { store } from '../store';


export default class ScheduleCalendar extends React.Component {

    constructor() {
        super();
        this.state = {
            scheduleCombinations: [],
            num: 0,
            courses: []
        };
        store.subscribe(() => this.update());
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
        let val = event.target.value;
        if (event.target.type === "number") val--;
        this.setState({ num: val });
    }

    showSlider() {
        if (this.state.scheduleCombinations && this.state.scheduleCombinations.length > 0) {
            return (
                <div className="space-bottom">
                    <input type="range" className="slider" min="0" value={this.state.num} max={this.state.scheduleCombinations.length - 1} onChange={val => this.handleRangeChange(val)}></input>
                    <input type="number" className="slider-n" min="1" value={(parseInt(this.state.num, 10) + 1)} max={this.state.scheduleCombinations.length} onChange={val => this.handleRangeChange(val)}></input> / {this.state.scheduleCombinations.length}
                </div>
            )
        }
        else {
            return (
                <div className="space-bottom">
                    Please Select Courses <span role="img" aria-label="smiley-face"> 🙂 </span> 
                </div>
            )
        }
    }


    render() {
        return (
            <div className="calendar-container">
                {this.showSlider()}
                <div className="calendar">
                    <CCalendar schedules={this.state.scheduleCombinations[this.state.num]} />
                </div>
            </div>
        )
    }
}

class CCalendar extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                    {this.createTables()}
                </tbody>
            </table>
        );
    }

    createTables() {
        const times = ["8:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"]
        const rows = [];
        times.forEach(time => {
            const columns = [<td key={time}>{time}</td>];
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => {
                columns.push(<td key={""+time+day}>{(this.props.schedules && this.props.schedules[time][day] && this.props.schedules[time][day].title) || ""}</td>);
            })

            rows.push( <tr key={time}>{columns}</tr>)
        });

        return rows;
    }
}

