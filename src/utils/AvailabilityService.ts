import { breakHours, reservationDurationMinutes, workHours } from "./Constants";

export const getWeekDates = () => {
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    let days: Date[] = [];

    for (let i = 0; i < 7; i++) {
        let currentDate = new Date();
        currentDate.setDate(nextDay.getDate() + i);
        days.push(currentDate);
    }

    return days;
}

export const isWorkingHour = (date: Date, hour: number) => {
    if((date.getDay() === 6 && !isEvenDay(date)) || date.getDay() === 0)
      return false;

    return isEvenDay(date)
      ? hour >= workHours.morning.start && hour < workHours.morning.end
      : hour >= workHours.afternoon.start && hour < workHours.afternoon.end
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function getDateOverlapMinutes(firstDate: Date, secondDate: Date) {
    const dateDiff = Math.abs(firstDate.getTime() - secondDate.getTime());
    return dateDiff / 1000 / 60;
}

export const isOverlappingReservation = (reservations: Date[], reservation: Date) => {
    return reservations.some((date: Date) => {
        const differenceMinutes = getDateOverlapMinutes(date, reservation);
        return differenceMinutes < reservationDurationMinutes;
    });
}

export const isEvenDay = (date: Date) => !(date.getDate() % 2);

export const isReservationOverlappingBreakTime = (date: Date) => {
    const isDayEven = isEvenDay(date);

    const breakTimeStart = new Date(date);
    breakTimeStart.setHours(isDayEven ? breakHours.morning : breakHours.afternoon);
    breakTimeStart.setMinutes(0);

    const breakTimeEnd = new Date(date);
    breakTimeEnd.setHours(isDayEven ? breakHours.morning : breakHours.afternoon);
    breakTimeEnd.setMinutes(breakHours.durationMinutes);

    return (date <= breakTimeStart && (getDateOverlapMinutes(breakTimeStart, date) < reservationDurationMinutes)) 
        || (date > breakTimeStart && breakTimeEnd > date);
}

export const generateReservations = () => {
    let reservations: Date[] = [];
    while (reservations.length < 15) {
        const date = getWeekDates()[getRandomInt(7)];

        const hour = isEvenDay(date)
            ? getRandomInt(workHours.morning.end - workHours.morning.start) + workHours.morning.start
            : getRandomInt(workHours.afternoon.end - workHours.afternoon.start) + workHours.afternoon.start;

        if(isWorkingHour(date, hour)) {
            const reservation = new Date(date); 
            reservation.setHours(hour);
            const reservationMinutes = (isEvenDay(date) && hour === workHours.morning.end - 1) ||(!isEvenDay(date) && hour === workHours.afternoon.end - 1)
                ? getRandomInt(60 - reservationDurationMinutes)
                : getRandomInt(60);
            reservation.setMinutes(reservationMinutes);

            if (isOverlappingReservation(reservations, reservation) || isReservationOverlappingBreakTime(reservation))
                continue;

            reservations.push(reservation);
        }
    }
    return reservations;
}