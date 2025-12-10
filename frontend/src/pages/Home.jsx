import React, { useState, useEffect } from 'react';
import API, { previewPrice, createBooking, getCourts, getCoaches, getEquipment } from '../services/api';
import SlotGrid from '../components/SlotGrid';
import BookingModal from './BookingModal';
import ResourcePicker from '../components/ResourcePicker';

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSlots();
    fetchResources();
  }, [date]);

  async function fetchSlots() {
    try {
      const res = await API.get(`/courts/slots?date=${date}`);
      setSlots(res.data.slots);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  }

  async function fetchResources() {
    try {
      const [courtsRes, coachesRes, equipRes] = await Promise.all([
        getCourts(),
        getCoaches(),
        getEquipment()
      ]);
      setCourts(courtsRes.data.courts);
      setCoaches(coachesRes.data.coaches);
      setEquipment(equipRes.data.equipment);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  }

  const handleSlotClick = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Book a Court</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <SlotGrid slots={slots} onSlotClick={handleSlotClick} />
      {showModal && selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          courts={courts}
          coaches={coaches}
          equipment={equipment}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
          }}
          onBookingSuccess={() => {
            setShowModal(false);
            setSelectedSlot(null);
            fetchSlots();
          }}
        />
      )}
    </div>
  );
}

