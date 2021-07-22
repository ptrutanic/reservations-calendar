import React, { useState } from 'react';
import { generateReservations, getWeekDates, isWorkingHour } from '../utils/AvailabilityService';
import { daysOfWeek, workHours } from '../utils/Constants';
import CalendarLegend from './CalendarLegend';

function Calendar() {
  const [reservations, setReservations] = useState(generateReservations())

  const getWorkHours = () => {
    let hours: number[] = [];
    for (let hour = workHours.morning.start; hour <= workHours.afternoon.end; hour++) {
      hours.push(hour);
    }
    return hours;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <table className="calendar-body">
          <tbody>
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
                    <div>
                      Pauza
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <CalendarLegend/>
      </div>
    </div>
  );
}

export default Calendar;
