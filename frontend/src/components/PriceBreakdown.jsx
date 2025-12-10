import React from 'react';

export default function PriceBreakdown({ breakdown }) {
  if (!breakdown) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-yellow-800 text-sm">Calculating price...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3 text-gray-900">Price Breakdown</h3>
      <div className="space-y-2 text-gray-800">
        <div className="flex justify-between py-1">
          <span className="text-gray-700">Base Price:</span>
          <span className="font-medium">₹{breakdown.base || 0}</span>
        </div>
        {breakdown.rules && breakdown.rules.length > 0 && (
          <div className="pt-2">
            <div className="text-sm font-medium mb-2 text-gray-700">Rules Applied:</div>
            {breakdown.rules.map((rule, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-600 ml-4 py-1">
                <span>{rule.name}</span>
                <span className="font-medium">
                  {rule.amount ? `+₹${rule.amount}` : rule.multiplier ? `×${rule.multiplier}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}
        {breakdown.equipment > 0 && (
          <div className="flex justify-between py-1">
            <span className="text-gray-700">Equipment:</span>
            <span className="font-medium">₹{breakdown.equipment}</span>
          </div>
        )}
        {breakdown.coachFee > 0 && (
          <div className="flex justify-between py-1">
            <span className="text-gray-700">Coach Fee:</span>
            <span className="font-medium">₹{breakdown.coachFee}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-3 mt-2 border-t-2 border-gray-300">
          <span className="text-gray-900">Total:</span>
          <span className="text-blue-600">₹{breakdown.total || 0}</span>
        </div>
      </div>
    </div>
  );
}

