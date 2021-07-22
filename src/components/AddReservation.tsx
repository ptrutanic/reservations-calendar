import React, { useState } from 'react';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { isWorkingDay } from '../utils/AvailabilityService';
import moment from 'moment';
import { Button } from '@material-ui/core';

interface AddReservationProps {
    handleAddReservation: (date: Date) => void;
}

function AddReservation(props: AddReservationProps) {
  const firstAvailableDate = moment().add(1,'days');
  firstAvailableDate.set({hour:0,minute:0,second:0,millisecond:0});
  
  const [selectedDate, setSelectedDate] = useState<Date>(firstAvailableDate.toDate());

  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (!date)
      return;

    setSelectedDate(date.toDate());
  }

  const isDateDisabled = (date: MaterialUiPickersDate) => {
    if (!date)
      return true;
    
    return date < firstAvailableDate || !isWorkingDay(date.toDate()) || date.diff(firstAvailableDate, 'days') > 6;
  }

  const handleSave = () => {
    if (selectedDate) {
        props.handleAddReservation(selectedDate);
    }
  }

  return (
    <div className="addReservation-container">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="DD/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Reservation date"
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={isDateDisabled}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Reservation time"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
          'aria-label': 'change time',
        }}
        />
      </MuiPickersUtilsProvider>
      <Button variant="contained" color="primary" onClick={handleSave}>
        save
      </Button>
    </div>
  );
}

export default AddReservation;
