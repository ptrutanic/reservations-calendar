import React from 'react';

function CalendarLegend() {
  return (
    <div className="calendarLegend">
      <div className="calendarLegend-hours"></div>
      <div className="calendarLegend-item">
        <div className="calendarLegend-color break"></div>
        Break
      </div>
      <div className="calendarLegend-item">
        <div className="calendarLegend-color reserved"></div>
        Reserved
      </div>
      <div className="calendarLegend-item">
        <div className="calendarLegend-color nonWorking"></div>
        Non working hours
      </div>
  </div>
  );
}

export default CalendarLegend;
