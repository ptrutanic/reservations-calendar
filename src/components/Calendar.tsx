import { Snackbar, Tooltip } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { generateReservations, getWeekDates, isEvenDay, isOverlappingReservation, isReservationOverlappingBreakTime, isWorkingHour } from '../utils/AvailabilityService';
import { breakHours, daysOfWeek, reservationDurationMinutes, workHours } from '../utils/Constants';
import MuiAlert from '@material-ui/lab/Alert';
import AddReservation from './AddReservation';
import CalendarLegend from './CalendarLegend';
import moment from 'moment';
import { validateReservation } from '../utils/Validator';

function Calendar() {
  const [reservations, setReservations] = useState<Date[]>([]);
  const [userCreatedReservations, setUserCreatedReservations] = useState<Date[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

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

  const triggerSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  const handleAddReservation = (date: Date) => {
    const { errorMessage, isValid } = validateReservation(date, reservations, userCreatedReservations);

    if (!isValid) {
      triggerSnackbar(errorMessage);
      return;
    }

    setReservations([...reservations, date]);
    setUserCreatedReservations([...userCreatedReservations, date]);
  }

  const Alert = (props: any) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleSnackbarClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarMessage('');
    setSnackbarOpen(false);
  };

  const getTimeTooltip = (reservation: Date, durationMinutes: number) => {
    const reservationStart = moment(reservation);
    const reservationEnd = moment(reservationStart).add(durationMinutes, 'minutes');
    return `${reservationStart.format('HH:mm')} - ${reservationEnd.format('HH:mm')}`;
  }

  const getBreakTooltip = (day: Date) => {
    const breakStart = isEvenDay(day) ? breakHours.morning : breakHours.afternoon ;
    return `${breakStart}:00 - ${breakStart}:${breakHours.durationMinutes}`;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <AddReservation handleAddReservation={handleAddReservation} />
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
                  <td
                    key={index}
                    className={`calendar-cell calendar-border ${isWorkingHour(day, hour) ? '' : 'calendar-hours-nonWorking'}`}>
                    {getReservationsForCell(day, hour).map((reservation, index: number) =>
                      <Tooltip title={getTimeTooltip(reservation, reservationDurationMinutes)}>
                        <div
                          key={index}
                          className="calendar-entry reservation"
                          style={{
                            top: getOffset(reservation.getMinutes()),
                            height: getOffset(reservationDurationMinutes)
                          }}
                        >
                        </div>
                      </Tooltip>
                    )}
                    {isBreakHour(day, hour) &&
                      <Tooltip title={getBreakTooltip(day)}>
                        <div
                          key={index}
                          className="calendar-entry break"
                          style={{height: getOffset(breakHours.durationMinutes)}}
                        >
                        </div>
                      </Tooltip>
                    }
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <CalendarLegend/>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Calendar;
