import React from 'react';
import { daysOfWeek, workHours } from '../utils/Constants';
import CalendarLegend from './CalendarLegend';

function Calendar() {
  const getWeekDates = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    var days: Date[] = [];

    for (var i = 0; i < 7; i++) {
        var currentDate = new Date();
        currentDate.setDate(nextDay.getDate() + i);
        days.push(currentDate);
    }

    return days;
  }

  const getWorkHours = () => {
    var hours: number[] = [];
    for (var hour = workHours.morning.start; hour <= workHours.afternoon.end; hour++) {
      hours.push(hour);
    }
    return hours;
  }

  const isWorkingHour = (date: Date, hour: number) => {
    const isEvenDay = !(date.getDate() % 2)
    return isEvenDay
      ? hour >= workHours.morning.start && hour < workHours.morning.end
      : hour >= workHours.afternoon.start && hour < workHours.afternoon.end
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <table className="calendar-body">
          <tr>
            <td className="calendar-hours"></td>
            {getWeekDates().map((day: Date, index: number) =>
              <th key={index} className={`calendar-cell ${index !== 0 ? "calendar-border-left" : ''}`}>
                {`${daysOfWeek[day.getDay()]} ${day.getDate()}.${day.getMonth() + 1}.`}
              </th>
            )}
          </tr>
          {getWorkHours().map((hour: number, index: number) =>
            <tr key={index}>
              <td className="calendar-hours">{hour}</td>
              {getWeekDates().map((day: Date, index: number) =>
                <td key={index} className={`calendar-cell calendar-border ${isWorkingHour(day, hour) ? '' : 'calendar-hours-nonWorking'}`}>
                </td>
              )}
            </tr>
          )}
        </table>
        <CalendarLegend/>
      </div>
    </div>
  );
}

export default Calendar;
