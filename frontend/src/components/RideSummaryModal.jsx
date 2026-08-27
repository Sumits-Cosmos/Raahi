import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RideSummaryModal = ({ ride, onClose }) => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const tags = ['Smooth Ride', 'Clean Vehicle', 'Polite Captain', 'Fast Route', 'Safe Driving'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePay = () => {
    setIsPaid(true);
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (onClose) onClose();
      navigate('/home');
    }, 600);
  };

  const captainName = ride?.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
    : 'Your Captain';

  const fareAmount = ride?.fare || 199;
  const distance = ride?.distance ? `${ride.distance} KM` : 'Trip Completed';
  const pickup = ride?.pickup || 'Pickup location';
  const destination = ride?.destination || 'Destination';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <i className="ri-checkbox-circle-fill text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Trip Completed!</h2>
          <p className="text-sm text-gray-500">We hope you had a pleasant journey</p>
        </div>

        {/* Fare Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Fare</span>
              <h3 className="text-3xl font-extrabold text-gray-900">₹{fareAmount}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
                {ride?.captain?.vehicle?.vehicleType?.toUpperCase() || 'RIDE'}
              </span>
              <p className="text-xs text-gray-500 mt-1">{distance}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="truncate font-medium">{pickup}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="truncate font-medium">{destination}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedPayment('cash')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedPayment === 'cash'
                  ? 'border-black bg-black text-white font-bold shadow-md'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-money-rupee-circle-line text-lg block mb-1"></i>
              <span className="text-xs">Cash</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPayment('upi')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedPayment === 'upi'
                  ? 'border-black bg-black text-white font-bold shadow-md'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-qr-code-line text-lg block mb-1"></i>
              <span className="text-xs">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPayment('wallet')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedPayment === 'wallet'
                  ? 'border-black bg-black text-white font-bold shadow-md'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className="ri-wallet-3-line text-lg block mb-1"></i>
              <span className="text-xs">Wallet</span>
            </button>
          </div>

          {selectedPayment === 'upi' && !isPaid && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <p className="text-xs text-blue-800 font-semibold mb-2">Scan & Pay via any UPI App</p>
              <button
                type="button"
                onClick={handlePay}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow"
              >
                Simulate UPI Payment Done
              </button>
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="border-t border-gray-100 pt-4 mb-5">
          <label className="block text-center text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Rate {captainName}
          </label>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-125 focus:outline-none"
              >
                <i
                  className={`${
                    (hoverRating || rating) >= star
                      ? 'ri-star-fill text-yellow-400'
                      : 'ri-star-line text-gray-300'
                  }`}
                ></i>
              </button>
            ))}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-400 border-yellow-500 font-bold text-gray-900 shadow-sm'
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleComplete}
          className="w-full bg-black hover:bg-gray-900 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-xl text-base transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Done & Return Home'}
        </button>
      </div>
    </div>
  );
};

export default RideSummaryModal;
