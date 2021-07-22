import { reservationDurationMinutes, workHours } from "./Constants";

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
    const isEvenDay = !(date.getDate() % 2)

    if((date.getDay() === 6 && !isEvenDay) || date.getDay() === 0)
      return false;

    return isEvenDay
      ? hour >= workHours.morning.start && hour < workHours.morning.end
      : hour >= workHours.afternoon.start && hour < workHours.afternoon.end
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export const isValidReservation = (reservations: Date[], reservation: Date) => {
    return !reservations.some((date: Date) => {
        const dateDiff = Math.abs(date.getTime() - reservation.getTime());
        const differenceMinutes = dateDiff / 1000 / 60;
        return differenceMinutes < reservationDurationMinutes;
    });
}

export const generateReservations = () => {
    let reservations: Date[] = [];
    while (reservations.length < 15) {
        const date = getWeekDates()[getRandomInt(7)];
        const isEvenDay = !(date.getDate() % 2);

        const hour = isEvenDay
            ? getRandomInt(workHours.morning.end - workHours.morning.start) + workHours.morning.start
            : getRandomInt(workHours.afternoon.end - workHours.afternoon.start) + workHours.afternoon.start;
    

        if(isWorkingHour(date, hour)) {
            const reservation = new Date(date); 
            reservation.setHours(hour);
            const reservationMinutes = (isEvenDay && hour === workHours.morning.end - 1) ||(!isEvenDay && hour === workHours.afternoon.end - 1)
                ? getRandomInt(60 - reservationDurationMinutes)
                : getRandomInt(60);
            reservation.setMinutes(reservationMinutes);

            if (!isValidReservation(reservations, reservation))
                continue;

            reservations.push(reservation);
        }
    }
    return reservations;
}