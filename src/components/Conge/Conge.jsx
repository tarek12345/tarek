import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Conge() {
  const leaveData = [
    { person: 'Personne A', startDate: new Date(2023, 7, 10), endDate: new Date(2023, 7, 15) },
    { person: 'Personne B', startDate: new Date(2023, 7, 5), endDate: new Date(2023, 7, 8) }
    // ... ajoutez d'autres données de congé ici
  ];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const markedDates = leaveData.reduce((dates, leave) => {
    const current = new Date(leave.startDate);
    while (current <= leave.endDate) {
      dates[current.toDateString()] = true;
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, {});

  const handleDateChange = date => {
    setSelectedDate(date);
  };
  return (
    <div className='mx-auto'>
      <h1>Calendrier des congés</h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={({ date }) => !markedDates[date.toDateString()]}
      />
    </div>
  )
}

export default Conge