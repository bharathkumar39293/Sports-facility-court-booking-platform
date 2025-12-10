import React from 'react';

export default function SlotGrid({ slots, onSlotClick }) {
  const groupedByTime = {};
  
  slots.forEach(slot => {
    const timeKey = new Date(slot.startTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    if (!groupedByTime[timeKey]) {
      groupedByTime[timeKey] = [];
    }
    groupedByTime[timeKey].push(slot);
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Time</th>
            {Object.keys(groupedByTime).length > 0 && 
              groupedByTime[Object.keys(groupedByTime)[0]].map(slot => (
                <th key={slot.courtId} className="px-4 py-2 border-b text-center">
                  {slot.courtName}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByTime).map(([time, timeSlots]) => (
            <tr key={time}>
              <td className="px-4 py-2 border-b font-medium">{time}</td>
              {timeSlots.map(slot => (
                <td key={slot.courtId} className="px-4 py-2 border-b text-center">
                  <button
                    onClick={() => onSlotClick(slot)}
                    disabled={!slot.available}
                    className={`px-4 py-2 rounded ${
                      slot.available
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.available ? 'Available' : 'Booked'}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

