import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const event = []
export const Calendar = props => (
  <div>
    <BigCalendar
      events = {event}
      startAccessor='startDate'
      endAccessor='endDate'
    />
  </div>
);