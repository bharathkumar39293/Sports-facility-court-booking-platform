import React, { useState, useEffect } from 'react';
import { previewPrice, createBooking } from '../services/api';
import PriceBreakdown from '../components/PriceBreakdown';
import ResourcePicker from '../components/ResourcePicker';

export default function BookingModal({ slot, courts, coaches, equipment, onClose, onBookingSuccess }) {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [equipmentSelection, setEquipmentSelection] = useState({ racketCount: 0, shoeCount: 0 });
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slot && courts.length > 0) {
      const court = courts.find(c => c._id === slot.courtId);
      setSelectedCourt(court);
    }
  }, [slot, courts]);

  useEffect(() => {
    if (selectedCourt && slot) {
      calculatePrice();
    }
  }, [selectedCourt, selectedCoach, equipmentSelection, slot]);

  const calculatePrice = async () => {
    if (!selectedCourt || !slot) {
      setPriceBreakdown(null);
      return;
    }

    try {
      const racketPrice = equipment.find(e => e.type === 'racket')?.pricePerItem || 0;
      const shoePrice = equipment.find(e => e.type === 'shoe')?.pricePerItem || 0;

      const res = await previewPrice({
        courtId: selectedCourt._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        equipment: {
          ...equipmentSelection,
          racketPrice,
          shoePrice
        },
        coachId: selectedCoach?._id
      });

      if (res.data && res.data.breakdown) {
        setPriceBreakdown(res.data.breakdown);
      } else {
        console.error('Invalid price breakdown response:', res.data);
        setPriceBreakdown(null);
      }
    } catch (err) {
      console.error('Price calculation failed:', err);
      setPriceBreakdown(null);
    }
  };

  const handleBooking = async () => {
    if (!selectedCourt) return;

    setLoading(true);
    setError(null);

    try {
      const racketPrice = equipment.find(e => e.type === 'racket')?.pricePerItem || 0;
      const shoePrice = equipment.find(e => e.type === 'shoe')?.pricePerItem || 0;

      const res = await createBooking({
        userId: 'temp-user-id', // TODO: replace with actual user ID
        courtId: selectedCourt._id,
        coachId: selectedCoach?._id,
        equipment: {
          ...equipmentSelection,
          racketPrice,
          shoePrice
        },
        startTime: slot.startTime,
        endTime: slot.endTime
      });

      if (res.data.ok) {
        onBookingSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!slot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Book Court</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
            <select
              value={selectedCourt?._id || ''}
              onChange={(e) => {
                const court = courts.find(c => c._id === e.target.value);
                setSelectedCourt(court);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a court</option>
              {courts.map(court => (
                <option key={court._id} value={court._id}>
                  {court.name} ({court.type}) - ₹{court.basePrice}
                </option>
              ))}
            </select>
          </div>

          <ResourcePicker
            coaches={coaches}
            equipment={equipment}
            selectedCoach={selectedCoach}
            equipmentSelection={equipmentSelection}
            onCoachChange={setSelectedCoach}
            onEquipmentChange={setEquipmentSelection}
          />

          <PriceBreakdown breakdown={priceBreakdown} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedCourt || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

