import { isOverlappingReservation, isReservationOverlappingBreakTime, isWorkingHour } from "./AvailabilityService";

interface ValidationResult {
    isValid: boolean
    errorMessage: string
}

export const validateReservation = (date: Date, reservations: Date[], userCreatedReservations: Date[]): ValidationResult => {
    let validationResult: ValidationResult = {
        isValid: true,
        errorMessage: ''
    };

    if (!isWorkingHour(date, date.getHours())) {
        validationResult.errorMessage = 'The office is not working on selected date and time'
        validationResult.isValid = false;
      }
  
      if (isOverlappingReservation(reservations, date)) {
        validationResult.errorMessage = 'There is another reservation overlapping with your reservation'
        validationResult.isValid = false;
      }
  
      if (isReservationOverlappingBreakTime(date)) {
        validationResult.errorMessage = 'The office is having a break on selected time'
        validationResult.isValid = false;
      }
  
      if (userCreatedReservations.length >= 2) {
        validationResult.errorMessage = 'You can not make more than 2 reservations in a week'
        validationResult.isValid = false;
      }
  
      if (userCreatedReservations.some((reservation: Date) => reservation.getDate() === date.getDate())) {
        validationResult.errorMessage = 'You can not make more than 1 reservation in a day'
        validationResult.isValid = false;
      }

      return validationResult;
}