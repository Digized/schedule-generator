import React from "react";
import ScheduleTree from './helpers/Tree';
import "./Calendar.css"
import Courses from './helpers/CourseMapper'
import { store } from '../store';


export default class ScheduleCalendar extends React.Component {

    constructor() {
        super();
        this.state = {
            scheduleCombinations: [],
            num: 0,
            courses: [],
            mode: 0
        };
        store.subscribe(() => this.update());
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const gState = store.getState();
        console.log(gState);
        const selectedCourses = [];
        gState.courses.forEach(course => {
            const c = Courses[gState.mode].courses.find((obj) => obj.course_code === course);
            c && selectedCourses.push(c);
        });

        console.log(selectedCourses);
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
                    <Calendar schedules={this.state.scheduleCombinations[this.state.num]} />
                </div>
            </div>
        )
    }
}

class Calendar extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th className="time" ></th>
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
            const columns = [<td className="time" key={time}>{time}</td>];
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => {

                columns.push(
                    <td key={"" + time + day}>
                        <CalendarItem elem={(this.props.schedules && this.props.schedules[time][day]) || ""} />
                    </td>
                );
            })

            rows.push(<tr key={time}>{columns}</tr>)
        });

        return rows;
    }
}


class CalendarItem extends React.Component {
    render() {
        if(this.props.elem)
        return (
            <div className="calendar-item" style={{ backgroundColor: this.props.elem.color || "" }}>
                {this.props.elem.courseCode || ""}
                {this.props.elem && <div className="hover-field">{this.props.elem.title}</div>}
            </div>
        );
        else {
            return (
                <div>
                </div>
            );
        }
    }
}
