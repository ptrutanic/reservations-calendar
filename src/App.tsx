import React from 'react';
import './App.scss';
import Calendar from './components/Calendar';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">
        kalendar radnog vremena
      </h1>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
