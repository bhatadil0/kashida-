import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

interface DeliveryEstimatorProps {
  basePrice: number;
  currency?: string;
}

interface DeliveryEstimate {
  city: string;
  state: string;
  estimatedDate: string;
  days: number;
  isCodAvailable: boolean;
  courier: string;
  isExpressAir: boolean;
}

const PINCODE_MAP: Record<string, { city: string; state: string; days: number }> = {
  '110001': { city: 'New Delhi (Connaught Place)', state: 'Delhi NCR', days: 2 },
  '190001': { city: 'Srinagar (Lal Chowk Atelier Hub)', state: 'Jammu & Kashmir', days: 1 },
  '400001': { city: 'Mumbai (Fort / South Mumbai)', state: 'Maharashtra', days: 3 },
  '560001': { city: 'Bengaluru (MG Road / Central)', state: 'Karnataka', days: 3 },
  '500001': { city: 'Hyderabad (Charminar / Jubilee)', state: 'Telangana', days: 3 },
  '600001': { city: 'Chennai (George Town)', state: 'Tamil Nadu', days: 3 },
  '700001': { city: 'Kolkata (BBD Bagh)', state: 'West Bengal', days: 3 },
  '380001': { city: 'Ahmedabad (Ellisbridge)', state: 'Gujarat', days: 3 },
  '302001': { city: 'Jaipur (C-Scheme)', state: 'Rajasthan', days: 2 },
  '226001': { city: 'Lucknow (Hazratganj)', state: 'Uttar Pradesh', days: 2 },
  '160017': { city: 'Chandigarh (Sector 17)', state: 'Punjab/Haryana', days: 2 },
  '10001': { city: 'New York (Manhattan)', state: 'United States (DHL Air)', days: 4 },
  'SW1A1AA': { city: 'London (Mayfair)', state: 'United Kingdom (FedEx Priority)', days: 4 },
  '00000': { city: 'Dubai (Downtown)', state: 'United Arab Emirates (Air)', days: 3 },
};

export const DeliveryEstimator: React.FC<DeliveryEstimatorProps> = ({
  basePrice,
  currency = 'INR',
}) => {
  const [pincode, setPincode] = useState<string>(() => {
    return localStorage.getItem('kashida_user_pincode') || '110001';
  });
  const [inputVal, setInputVal] = useState<string>(pincode);
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 4, minutes: 32 });

  // Countdown timer for same-day dispatch cut-off
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return { hours: 6, minutes: 45 }; // Reset next dispatch cycle
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateEstimate = (pin: string) => {
    const cleanPin = pin.trim().toUpperCase();
    if (!cleanPin) return;

    setIsCalculating(true);
    setTimeout(() => {
      const match = PINCODE_MAP[cleanPin];
      const days = match ? match.days : cleanPin.length === 6 ? 3 : 5;
      const city = match ? match.city : 'Your Destination Hub';
      const state = match ? match.state : 'Domestic / Global Network';

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      };
      const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

      setEstimate({
        city,
        state,
        estimatedDate: formattedDate,
        days,
        isCodAvailable: cleanPin.length === 6, // Domestic 6-digit pins get COD
        courier: days <= 2 ? 'BlueDart Apex / DHL Express Air' : 'DHL Worldwide Air Courier',
        isExpressAir: true,
      });

      localStorage.setItem('kashida_user_pincode', cleanPin);
      setPincode(cleanPin);
      setIsCalculating(false);
    }, 250);
  };

  useEffect(() => {
    if (pincode) {
      calculateEstimate(pincode);
    }
  }, []);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    calculateEstimate(inputVal);
  };

  const handleQuickSelect = (pin: string) => {
    setInputVal(pin);
    calculateEstimate(pin);
  };

  const isFreeDelivery = basePrice >= 25000;

  return (
    <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-3.5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#162B21]">
            Delivery & Artisan Logistics
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-700" />
          <span>Srinagar Atelier Priority</span>
        </span>
      </div>

      {/* Input row */}
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="w-3.5 h-3.5 text-[#525B56] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter Pincode / Postal Code"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059] uppercase tracking-wider"
          />
        </div>
        <button
          type="submit"
          disabled={isCalculating}
          className="px-4 py-1.5 bg-[#162B21] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#234233] transition-colors cursor-pointer shrink-0"
        >
          {isCalculating ? 'Verifying...' : 'Check'}
        </button>
      </form>

      {/* Quick Pincode Pills for Quick Testing */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#525B56]">
        <span className="opacity-70">Popular Hubs:</span>
        <button
          type="button"
          onClick={() => handleQuickSelect('110001')}
          className="px-1.5 py-0.5 bg-white border border-[#EBE4D8] hover:border-[#162B21] cursor-pointer"
        >
          Delhi (110001)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('400001')}
          className="px-1.5 py-0.5 bg-white border border-[#EBE4D8] hover:border-[#162B21] cursor-pointer"
        >
          Mumbai (400001)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('190001')}
          className="px-1.5 py-0.5 bg-white border border-[#EBE4D8] hover:border-[#162B21] cursor-pointer"
        >
          Srinagar (190001)
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect('10001')}
          className="px-1.5 py-0.5 bg-white border border-[#EBE4D8] hover:border-[#162B21] cursor-pointer"
        >
          New York (10001)
        </button>
      </div>

      {/* Live Results Panel */}
      {estimate && (
        <div className="pt-2 border-t border-[#EBE4D8] space-y-2 text-xs">
          {/* Main Delivery Date Callout */}
          <div className="flex items-start gap-2 text-[#162B21]">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Get it by <span className="text-emerald-900 font-bold underline decoration-[#C5A059]">{estimate.estimatedDate}</span>
              </p>
              <p className="text-[11px] text-[#525B56] mt-0.5">
                Delivering to <strong>{estimate.city}</strong>, {estimate.state} via {estimate.courier}
              </p>
            </div>
          </div>

          {/* Same-day dispatch cutoff timer */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C6226] bg-[#FFF9EE] p-2 border border-[#EEDBBA] rounded-xs">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              Order in the next <strong>{timeRemaining.hours}h {timeRemaining.minutes}m</strong> for expedited morning flight dispatch.
            </span>
          </div>

          {/* Flipkart / Amazon Trust Badges Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#525B56]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>
                {isFreeDelivery ? '⚡ FREE Express Air Delivery' : `Standard Courier (${formatPrice(1500, currency)})`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>
                {estimate.isCodAvailable ? '💵 Cash on Delivery Available' : '💳 Prepaid Insured Transit Only'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>🔄 7-Day Doorstep Exchange</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>📦 Cedar Tamper-Proof Box</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
