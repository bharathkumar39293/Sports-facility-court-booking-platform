import React, { useState, useEffect } from 'react';
import {
  adminGetCourts, adminCreateCourt, adminUpdateCourt, adminDeleteCourt,
  adminGetCoaches, adminCreateCoach, adminUpdateCoach, adminDeleteCoach,
  adminGetEquipment, adminCreateEquipment, adminUpdateEquipment, adminDeleteEquipment,
  adminGetPricingRules, adminCreatePricingRule, adminUpdatePricingRule, adminDeletePricingRule,
  adminGetBookings, cancelBooking
} from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courts');
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'courts') {
        const res = await adminGetCourts();
        setCourts(res.data.courts);
      } else if (activeTab === 'coaches') {
        const res = await adminGetCoaches();
        setCoaches(res.data.coaches);
      } else if (activeTab === 'equipment') {
        const res = await adminGetEquipment();
        setEquipment(res.data.equipment);
      } else if (activeTab === 'pricing') {
        const res = await adminGetPricingRules();
        setPricingRules(res.data.rules);
      } else if (activeTab === 'bookings') {
        const res = await adminGetBookings();
        setBookings(res.data.list);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'court') await adminDeleteCourt(id);
      else if (type === 'coach') await adminDeleteCoach(id);
      else if (type === 'equipment') await adminDeleteEquipment(id);
      else if (type === 'pricing') await adminDeletePricingRule(id);
      loadData();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['courts', 'coaches', 'equipment', 'pricing', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditing(null);
                setShowForm(false);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'courts' && (
        <CourtsManager
          courts={courts}
          onRefresh={loadData}
          onDelete={handleDelete}
        />
      )}
      {activeTab === 'coaches' && (
        <CoachesManager
          coaches={coaches}
          onRefresh={loadData}
          onDelete={handleDelete}
        />
      )}
      {activeTab === 'equipment' && (
        <EquipmentManager
          equipment={equipment}
          onRefresh={loadData}
          onDelete={handleDelete}
        />
      )}
      {activeTab === 'pricing' && (
        <PricingRulesManager
          rules={pricingRules}
          onRefresh={loadData}
          onDelete={handleDelete}
        />
      )}
      {activeTab === 'bookings' && (
        <BookingsManager bookings={bookings} onRefresh={loadData} />
      )}
    </div>
  );
}

// Courts Manager Component
function CourtsManager({ courts, onRefresh, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'indoor', basePrice: 200, isActive: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdateCourt(editing._id, formData);
      } else {
        await adminCreateCourt(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', type: 'indoor', basePrice: 200, isActive: true });
      onRefresh();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (court) => {
    setEditing(court);
    setFormData(court);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Courts</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', type: 'indoor', basePrice: 200, isActive: true });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Court'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
              <input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courts.map(court => (
              <tr key={court._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{court.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{court.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{court.basePrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${court.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {court.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(court)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => onDelete('court', court._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Coaches Manager Component
function CoachesManager({ coaches, onRefresh, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', hourlyRate: 250, availability: [], isActive: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdateCoach(editing._id, formData);
      } else {
        await adminCreateCoach(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', hourlyRate: 250, availability: [], isActive: true });
      onRefresh();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (coach) => {
    setEditing(coach);
    setFormData(coach);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coaches</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', hourlyRate: 250, availability: [], isActive: true });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Coach'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                required
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hourly Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coaches.map(coach => (
              <tr key={coach._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coach.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{coach.hourlyRate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${coach.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coach.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(coach)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => onDelete('coach', coach._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Equipment Manager Component
function EquipmentManager({ equipment, onRefresh, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'racket', totalStock: 10, pricePerItem: 50 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdateEquipment(editing._id, formData);
      } else {
        await adminCreateEquipment(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', type: 'racket', totalStock: 10, pricePerItem: 50 });
      onRefresh();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData(item);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Equipment</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: '', type: 'racket', totalStock: 10, pricePerItem: 50 });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Equipment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="racket">Racket</option>
                <option value="shoe">Shoe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
              <input
                type="number"
                required
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Item (₹)</label>
              <input
                type="number"
                required
                value={formData.pricePerItem}
                onChange={(e) => setFormData({ ...formData, pricePerItem: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.map(item => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.pricePerItem}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => onDelete('equipment', item._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Pricing Rules Manager Component
function PricingRulesManager({ rules, onRefresh, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ruleType: 'peak',
    isActive: true,
    config: { startHour: 18, endHour: 21, multiplier: 1.5 }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdatePricingRule(editing._id, formData);
      } else {
        await adminCreatePricingRule(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData({
        name: '',
        ruleType: 'peak',
        isActive: true,
        config: { startHour: 18, endHour: 21, multiplier: 1.5 }
      });
      onRefresh();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (rule) => {
    setEditing(rule);
    setFormData(rule);
    setShowForm(true);
  };

  const updateConfig = (key, value) => {
    setFormData({
      ...formData,
      config: { ...formData.config, [key]: value }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pricing Rules</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({
              name: '',
              ruleType: 'peak',
              isActive: true,
              config: { startHour: 18, endHour: 21, multiplier: 1.5 }
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Rule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
              <select
                value={formData.ruleType}
                onChange={(e) => {
                  const type = e.target.value;
                  let defaultConfig = {};
                  if (type === 'peak') defaultConfig = { startHour: 18, endHour: 21, multiplier: 1.5 };
                  else if (type === 'weekend') defaultConfig = { surcharge: 40 };
                  else if (type === 'courtType') defaultConfig = { type: 'indoor', surcharge: 80 };
                  else if (type === 'holiday') defaultConfig = { dates: [], surcharge: 50 };
                  setFormData({ ...formData, ruleType: type, config: defaultConfig });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="peak">Peak Hours</option>
                <option value="weekend">Weekend</option>
                <option value="courtType">Court Type</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            {formData.ruleType === 'peak' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Hour</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.config.startHour || 18}
                    onChange={(e) => updateConfig('startHour', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Hour</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.config.endHour || 21}
                    onChange={(e) => updateConfig('endHour', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.config.multiplier || 1.5}
                    onChange={(e) => updateConfig('multiplier', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
            {formData.ruleType === 'weekend' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surcharge (₹)</label>
                <input
                  type="number"
                  value={formData.config.surcharge || 40}
                  onChange={(e) => updateConfig('surcharge', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            {formData.ruleType === 'courtType' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Court Type</label>
                  <select
                    value={formData.config.type || 'indoor'}
                    onChange={(e) => updateConfig('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surcharge (₹)</label>
                  <input
                    type="number"
                    value={formData.config.surcharge || 80}
                    onChange={(e) => updateConfig('surcharge', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
            {formData.ruleType === 'holiday' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surcharge (₹)</label>
                  <input
                    type="number"
                    value={formData.config.surcharge || 50}
                    onChange={(e) => updateConfig('surcharge', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Dates (YYYY-MM-DD, comma-separated)</label>
                  <input
                    type="text"
                    placeholder="2025-12-25, 2025-01-01"
                    value={Array.isArray(formData.config.dates) ? formData.config.dates.join(', ') : ''}
                    onChange={(e) => updateConfig('dates', e.target.value.split(',').map(d => d.trim()).filter(d => d))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Config</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map(rule => (
              <tr key={rule._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rule.ruleType}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <pre className="text-xs">{JSON.stringify(rule.config, null, 2)}</pre>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(rule)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => onDelete('pricing', rule._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Bookings Manager Component (read-only)
function BookingsManager({ bookings, onRefresh }) {
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <p className="text-sm text-gray-500">Last 200 bookings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Court</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coach</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="font-medium">{b.courtId?.name || 'N/A'}</div>
                  <div className="text-gray-500 text-xs">{b.courtId?.type || ''}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {b.coachId?.name || 'No coach'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {new Date(b.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {new Date(b.endTime).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      b.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : b.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                  {b.status === 'cancelled' && <span className="text-gray-400">Cancelled</span>}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                  No bookings to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
