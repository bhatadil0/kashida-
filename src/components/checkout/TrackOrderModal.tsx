import React, { useState } from 'react';
import {
  X,
  Search,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { OrderDossier } from '../../types';
import { formatPrice } from '../../utils/currency';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderDossier[];
  initialOrderNumber?: string;
  currency: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderNumber = '',
  currency,
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'KASH-849201');
  const [matchedOrder, setMatchedOrder] = useState<OrderDossier | null>(() => {
    if (initialOrderNumber) {
      return orders.find((o) => o.orderNumber.toLowerCase() === initialOrderNumber.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleaned = searchInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === cleaned ||
        o.orderNumber.toLowerCase().includes(cleaned) ||
        o.shippingAddress.email.toLowerCase() === cleaned ||
        o.trackingNumber.toLowerCase() === cleaned
    );
    setMatchedOrder(found || null);
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    let currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex === -1) {
      if (currentStatus === 'DELIVERED') currentIndex = 4;
      else if (currentStatus === 'SHIPPED') currentIndex = 3;
      else currentIndex = 1;
    }
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#162B21] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#DFC289]" />
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                Real-Time Atelier Commission Tracking
              </h3>
              <p className="text-xs text-[#FAF8F5]/70">
                Srinagar Atelier to Global Consignee Transit Radar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-white border-b border-[#EBE4D8]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Commission Number (e.g. KASH-849201), AWB, or Email..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21] font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer transition-colors"
            >
              Locate Piece
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-[#EBE4D8] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">
                      Commission Manifest #{matchedOrder.orderNumber}
                    </span>
                    <h4 className="font-serif text-lg text-[#162B21]">
                      {matchedOrder.shippingAddress.fullName}
                    </h4>
                    <p className="text-xs text-[#525B56]">
                      Destination: {matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.country}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">
                      Courier & Air Waybill
                    </span>
                    <span className="font-mono font-bold text-xs text-[#162B21] block">
                      DHL International · {matchedOrder.trackingNumber}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Status: {matchedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Stepper */}
                <div className="py-4">
                  <div className="grid grid-cols-5 gap-2 relative text-center">
                    {[
                      { label: 'Commission Placed', desc: 'Srinagar Guild' },
                      { label: 'Loom & Embroidery', desc: 'Bashir Ahmad Guild' },
                      { label: 'GI Quality Audit', desc: 'CDI Certified' },
                      { label: 'White-Glove Transit', desc: 'Air Express' },
                      { label: 'Delivered', desc: 'Sanctuary Safe' },
                    ].map((step, idx) => {
                      const status = getStepStatus(idx, matchedOrder.status);
                      return (
                        <div key={idx} className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : status === 'current'
                                ? 'bg-[#C5A059] text-[#162B21] ring-4 ring-[#C5A059]/20 font-mono animate-pulse'
                                : 'bg-[#EBE4D8] text-[#525B56]'
                            }`}
                          >
                            {status === 'completed' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-[11px] font-semibold leading-tight ${
                                status === 'current' ? 'text-[#162B21]' : 'text-[#525B56]'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[9px] text-[#525B56]/80 hidden sm:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline History Log */}
                <div className="border-t border-[#F2EDE4] pt-4 space-y-3">
                  <h5 className="font-serif text-xs uppercase tracking-wider text-[#162B21] font-semibold">
                    Checkpoint Transit Log
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-3 p-2 bg-[#FAF8F5] border border-[#EBE4D8]">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#162B21]">White-Glove Courier Handover Complete</p>
                        <p className="text-[11px] text-[#525B56]">
                          Consignment arrived at recipient destination address. Signed and verified with GI Provenance Seal intact.
                        </p>
                        <span className="text-[10px] text-[#525B56]/70 font-mono">Today, 09:15 AM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2">
                      <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#162B21]">Dispatched via Sheikh ul-Alam Airport (SXR)</p>
                        <p className="text-[11px] text-[#525B56]">
                          Secured in climate-controlled Cedar Chest casing. Priority international air manifest cleared.
                        </p>
                        <span className="text-[10px] text-[#525B56]/70 font-mono">Yesterday, 04:30 PM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#162B21]">Master Ustad Final Quality Inspection Passed</p>
                        <p className="text-[11px] text-[#525B56]">
                          Microscopic inspection of Tilla metallic needlework and fiber count validation completed in Downtown Srinagar atelier.
                        </p>
                        <span className="text-[10px] text-[#525B56]/70 font-mono">November 5, 2026, 02:10 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in Consignment */}
              <div className="bg-white border border-[#EBE4D8] p-5 space-y-3">
                <h5 className="font-serif text-xs uppercase tracking-wider text-[#162B21] font-semibold">
                  Items in Consignment ({matchedOrder.items.length})
                </h5>
                <div className="divide-y divide-[#F2EDE4]">
                  {matchedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.primaryImage}
                          alt={it.product.name}
                          className="w-12 h-12 object-cover border border-[#EBE4D8]"
                        />
                        <div>
                          <p className="font-medium text-[#162B21]">{it.product.name}</p>
                          <p className="text-[11px] text-[#525B56]">
                            Variant: {it.size} / {it.color} · Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#162B21]">
                        {formatPrice(it.unitPrice * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="py-12 text-center bg-white border border-[#EBE4D8] p-8 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-serif text-base text-[#162B21]">No matching commission found</p>
              <p className="text-xs text-[#525B56] max-w-sm mx-auto">
                Please double check the commission number format (e.g. <strong>KASH-849201</strong>) or search with the email address used during commissioning.
              </p>
            </div>
          ) : (
            <div className="py-12 text-center bg-white border border-[#EBE4D8] p-8 space-y-3">
              <Package className="w-8 h-8 text-[#C5A059] mx-auto opacity-70" />
              <p className="font-serif text-base text-[#162B21]">Enter Commission ID Above</p>
              <p className="text-xs text-[#525B56] max-w-sm mx-auto">
                Try searching <strong>KASH-849201</strong> or your order email to view live white-glove courier status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
