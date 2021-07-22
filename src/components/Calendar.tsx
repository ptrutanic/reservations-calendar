import { useEffect, useState } from 'react';
import { generateReservations, getWeekDates, isEvenDay, isWorkingHour } from '../utils/AvailabilityService';
import { breakHours, daysOfWeek, workHours } from '../utils/Constants';
import CalendarLegend from './CalendarLegend';

function Calendar() {
  const [reservations, setReservations] = useState<Date[]>([]);

  useEffect(() => {
    if (!reservations.length)
      setReservations(generateReservations());
  }, [reservations.length])

  const getWorkHours = () => {
    let hours: number[] = [];
    for (let hour = workHours.morning.start; hour <= workHours.afternoon.end; hour++) {
      hours.push(hour);
    }
    return hours;
  }

  const getReservationsForCell = (date: Date, hour: number) => {
    return reservations.filter((reservation: Date) =>
      reservation.getDate() === date.getDate() && reservation.getHours() === hour)
  }

  const getOffset = (minutes: number) => {
    const cellHeight = 33;
    return (minutes / 60) * cellHeight;
  }

  const isBreakHour = (date: Date, hour: number) => {
    if (!isWorkingHour(date, hour))
      return;

    return isEvenDay(date)
      ? breakHours.morning === hour
      : breakHours.afternoon === hour;
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
                    {getReservationsForCell(day, hour).map((reservation, index: number) =>
                      <div key={index} className="calendar-entry reservation" style={{top: getOffset(reservation.getMinutes())}}>
                      </div>
                    )}
                    { isBreakHour(day, hour) &&
                      <div key={index} className="calendar-entry break" style={{height: getOffset(breakHours.durationMinutes)}}>
                      </div>
                    }
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
