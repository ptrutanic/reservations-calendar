import React from 'react';

function CalendarLegend() {
  return (
    <div className="calendar-legend">
      <div className="calendar-hours"></div>
      <div className="calendar-legend-item">
        <div className="calendar-legend-color break"></div>
        Break
      </div>
      <div className="calendar-legend-item">
        <div className="calendar-legend-color reserved"></div>
        Reserved
      </div>
      <div className="calendar-legend-item">
        <div className="calendar-legend-color nonWorking"></div>
        Non working hours
      </div>
  </div>
  );
}

export default CalendarLegend;
