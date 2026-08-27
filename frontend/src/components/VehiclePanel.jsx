import React, { useState } from 'react';

const VehiclePanel = ({ selectVehicle, fare = {}, setConfirmedRidePanel, setVehiclePanel }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdown = fare?.breakdown;
  const isSurge = breakdown?.isSurgeActive;
  const surgeMultiplier = breakdown?.surgeMultiplier || 1.0;
  const surgeReason = breakdown?.surgeReason || 'Standard Rates';

  const carFare = typeof fare.car === 'number' ? fare.car : fare?.car?.total || 199;
  const autoFare = typeof fare.auto === 'number' ? fare.auto : fare?.auto?.total || 129;
  const bikeFare = typeof fare.bike === 'number' ? fare.bike : fare?.bike?.total || 69;

  return (
    <div className="relative">
      <h5
        onClick={() => setVehiclePanel(false)}
        className="p-3 w-[93%] text-center absolute top-0 cursor-pointer"
      >
        <i className="text-2xl text-gray-500 ri-arrow-down-wide-fill"></i>
      </h5>

      <div className="flex items-center justify-between mb-3 mt-1">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Ride</h2>
        {isSurge && (
          <button
            type="button"
            onClick={() => setShowBreakdown(true)}
            className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-300 shadow-sm active:scale-95 transition-all"
          >
            <span>⚡ {surgeMultiplier}x Surge</span>
            <i className="ri-information-line text-sm"></i>
          </button>
        )}
      </div>

      {isSurge && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 mb-3 flex items-center justify-between text-xs text-yellow-800">
          <div className="flex items-center gap-1.5 font-semibold">
            <i className="ri-flashlight-fill text-yellow-600 text-sm"></i>
            <span>{surgeReason}: Fares are slightly higher due to demand.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowBreakdown(true)}
            className="underline font-bold text-yellow-900"
          >
            Details
          </button>
        </div>
      )}

      {/* Car / RaahiGo */}
      <div
        onClick={() => {
          setConfirmedRidePanel(true);
          selectVehicle('car');
        }}
        className="flex border-2 border-gray-200 hover:border-black active:scale-[0.99] bg-gray-50 mb-2.5 rounded-2xl p-3.5 w-full items-center justify-between cursor-pointer transition-all shadow-sm"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-800 shadow-inner">
          <i className="ri-car-fill text-2xl"></i>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-gray-900">RaahiGo</h4>
            <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
              <i className="ri-user-3-fill text-[10px]" />4
            </span>
          </div>
          <h5 className="font-semibold text-xs text-green-700 mt-0.5">3 mins away</h5>
          <p className="font-normal text-xs text-gray-500">Comfortable, AC compact rides</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-gray-900">₹{carFare}</h2>
          {isSurge && <span className="text-[10px] text-yellow-700 font-bold block">Surge applied</span>}
        </div>
      </div>

      {/* Auto / RaahiAuto */}
      <div
        onClick={() => {
          setConfirmedRidePanel(true);
          selectVehicle('auto');
        }}
        className="flex border-2 border-gray-200 hover:border-black active:scale-[0.99] bg-gray-50 mb-2.5 rounded-2xl p-3.5 w-full items-center justify-between cursor-pointer transition-all shadow-sm"
      >
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-700 shadow-inner">
          <i className="ri-taxi-fill text-2xl"></i>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-gray-900">RaahiAuto</h4>
            <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
              <i className="ri-user-3-fill text-[10px]" />3
            </span>
          </div>
          <h5 className="font-semibold text-xs text-green-700 mt-0.5">2 mins away</h5>
          <p className="font-normal text-xs text-gray-500">Fast & budget-friendly autos</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-gray-900">₹{autoFare}</h2>
          {isSurge && <span className="text-[10px] text-yellow-700 font-bold block">Surge applied</span>}
        </div>
      </div>

      {/* Bike / RaahiMoto */}
      <div
        onClick={() => {
          setConfirmedRidePanel(true);
          selectVehicle('bike');
        }}
        className="flex border-2 border-gray-200 hover:border-black active:scale-[0.99] bg-gray-50 mb-2.5 rounded-2xl p-3.5 w-full items-center justify-between cursor-pointer transition-all shadow-sm"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 shadow-inner">
          <i className="ri-motorbike-fill text-2xl"></i>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-gray-900">RaahiMoto</h4>
            <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
              <i className="ri-user-3-fill text-[10px]" />1
            </span>
          </div>
          <h5 className="font-semibold text-xs text-green-700 mt-0.5">1 min away</h5>
          <p className="font-normal text-xs text-gray-500">Fastest way through city traffic</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-gray-900">₹{bikeFare}</h2>
          {isSurge && <span className="text-[10px] text-yellow-700 font-bold block">Surge applied</span>}
        </div>
      </div>

      {/* Transparent Fare Breakdown Dialog */}
      {showBreakdown && breakdown && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Fare Breakdown</h3>
              <button
                type="button"
                onClick={() => setShowBreakdown(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="space-y-2.5 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Trip Distance</span>
                <span className="font-bold">{breakdown.distance}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Duration</span>
                <span className="font-bold">{breakdown.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Fare (Car)</span>
                <span>₹{breakdown.rates?.car?.baseFare || 50}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Rate</span>
                <span>₹{breakdown.rates?.car?.distanceFare || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Rate</span>
                <span>₹{breakdown.rates?.car?.timeFare || 0}</span>
              </div>

              {isSurge && (
                <div className="flex justify-between text-yellow-700 font-bold pt-2 border-t">
                  <span>Surge Multiplier ({breakdown.surgeReason})</span>
                  <span>{surgeMultiplier}x</span>
                </div>
              )}

              {breakdown.nightSurcharge > 0 && (
                <div className="flex justify-between text-indigo-700 font-bold">
                  <span>Late Night Surcharge</span>
                  <span>+₹{breakdown.nightSurcharge}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowBreakdown(false)}
              className="mt-6 w-full bg-black text-white font-bold py-3 rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclePanel;
