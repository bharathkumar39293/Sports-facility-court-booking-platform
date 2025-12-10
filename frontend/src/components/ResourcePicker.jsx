import React from 'react';

export default function ResourcePicker({
  coaches,
  equipment,
  selectedCoach,
  equipmentSelection,
  onCoachChange,
  onEquipmentChange
}) {
  const racket = equipment.find(e => e.type === 'racket');
  const shoe = equipment.find(e => e.type === 'shoe');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Coach (Optional)</label>
        <select
          value={selectedCoach?._id || ''}
          onChange={(e) => {
            const coach = coaches.find(c => c._id === e.target.value);
            onCoachChange(coach || null);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">No coach</option>
          {coaches.map(coach => (
            <option key={coach._id} value={coach._id}>
              {coach.name} - ₹{coach.hourlyRate}/hr
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
        {racket && (
          <div className="mb-2">
            <label className="text-sm text-gray-600">
              Rackets (₹{racket.pricePerItem} each):
            </label>
            <input
              type="number"
              min="0"
              max={racket.totalStock}
              value={equipmentSelection.racketCount || 0}
              onChange={(e) => onEquipmentChange({
                ...equipmentSelection,
                racketCount: parseInt(e.target.value) || 0
              })}
              className="ml-2 px-2 py-1 border border-gray-300 rounded w-20"
            />
            <span className="ml-2 text-xs text-gray-500">
              ({racket.totalStock} available)
            </span>
          </div>
        )}
        {shoe && (
          <div>
            <label className="text-sm text-gray-600">
              Shoes (₹{shoe.pricePerItem} each):
            </label>
            <input
              type="number"
              min="0"
              max={shoe.totalStock}
              value={equipmentSelection.shoeCount || 0}
              onChange={(e) => onEquipmentChange({
                ...equipmentSelection,
                shoeCount: parseInt(e.target.value) || 0
              })}
              className="ml-2 px-2 py-1 border border-gray-300 rounded w-20"
            />
            <span className="ml-2 text-xs text-gray-500">
              ({shoe.totalStock} available)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

