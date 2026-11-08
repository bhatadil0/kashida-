import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Ruler,
  MapPin,
  Sparkles,
  ExternalLink,
  Printer,
  CheckCircle,
  Truck,
  Clock,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Save,
} from 'lucide-react';
import { OrderDossier, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/currency';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderDossier[];
  currency: string;
  onTrackOrder: (orderNumber: string) => void;
  onInspectOrder: (order: OrderDossier) => void;
}

export interface PatronProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  vipTier: string;
  loyaltyPoints: number;
  measurements: {
    chestInches: string;
    shoulderInches: string;
    sleeveInches: string;
    heightFeet: string;
    preferredFit: 'Royal Relaxed Drape' | 'Contemporary Structured';
  };
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  onTrackOrder,
  onInspectOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'measurements' | 'addresses' | 'concierge'>('orders');

  // Patron profile state persisted in localStorage
  const [profile, setProfile] = useState<PatronProfile>(() => {
    const saved = localStorage.getItem('kashida_patron_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      fullName: 'Soraya Bakhtiar',
      email: 'soraya.b@royalcollection.com',
      phone: '+91 98112 34567',
      city: 'Srinagar',
      country: 'India',
      vipTier: 'Mughal Court VIP Connoisseur',
      loyaltyPoints: 1250,
      measurements: {
        chestInches: '38',
        shoulderInches: '15',
        sleeveInches: '22.5',
        heightFeet: '5\'7"',
        preferredFit: 'Royal Relaxed Drape',
      },
    };
  });

  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kashida_patron_profile', JSON.stringify(profile));
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-blue-800 bg-blue-50 px-2 py-0.5 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" /> In Air Express Transit
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" /> Quality Audit & Loom
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-purple-800 bg-purple-50 px-2 py-0.5 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Commission Allocated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#162B21] bg-[#F2EDE4] px-2 py-0.5 border border-[#EBE4D8]">
            <Clock className="w-3 h-3" /> Commission Placed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#162B21] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#DFC289]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                  {profile.fullName}
                </h3>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#C5A059]/20 text-[#DFC289] border border-[#C5A059]/30 font-medium">
                  {profile.vipTier}
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/70">
                Patron Privilege ID: KASH-VIP-{profile.email.slice(0, 4).toUpperCase()} · {profile.city}, {profile.country}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
            aria-label="Close patron portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EBE4D8] bg-[#F2EDE4]/50 px-6 gap-6 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span>Commissions & Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'measurements'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Ruler className="w-4 h-4 text-[#C5A059]" />
            <span>Bespoke Measurements</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>Delivery Sanctuaries</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'concierge'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Atelier Concierge</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {savedSuccessToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Patron dossier and bespoke measurements successfully preserved.</span>
            </div>
          )}

          {/* TAB 1: COMMISSIONS & ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-serif text-lg text-[#162B21]">Your Commission Archive</h4>
                  <p className="text-xs text-[#525B56]">
                    Track real-time needlework progress, white-glove DHL dispatch, and packing certificates.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center bg-white border border-[#EBE4D8] p-8 space-y-3">
                  <Package className="w-8 h-8 text-[#C5A059] mx-auto opacity-70" />
                  <p className="font-serif text-base text-[#162B21]">No commissions recorded yet</p>
                  <p className="text-xs text-[#525B56] max-w-sm mx-auto">
                    Explore our bespoke velvet pherans, Changthangi Pashmina, or raw silk kurtas to begin your heirloom journey.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderNumber}
                      className="bg-white border border-[#EBE4D8] p-5 hover:border-[#C5A059] transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EDE4] pb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-[#162B21]">
                              #{order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-[11px] text-[#525B56] mt-0.5">
                            Commissioned on {order.createdAt} · {order.items.length} bespoke item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-base font-bold text-[#162B21]">
                            {formatPrice(order.totalAmount, currency)}
                          </span>
                          <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">
                            Paid via {order.paymentMethod.replace('RAZORPAY_', '')}
                          </p>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.primaryImage}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover border border-[#EBE4D8]"
                              />
                              <div>
                                <p className="font-medium text-[#162B21]">{item.product.name}</p>
                                <p className="text-[11px] text-[#525B56]">
                                  Size: {item.size} · Hue: {item.color} · Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs text-[#162B21]">
                              {formatPrice(item.unitPrice * item.quantity, currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking / Action Bar */}
                      <div className="pt-3 border-t border-[#F2EDE4] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[11px] text-[#525B56]">
                          <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>AWB: <strong className="font-mono text-[#162B21]">{order.trackingNumber}</strong></span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              onTrackOrder(order.orderNumber);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EBE4D8] hover:border-[#162B21] text-[#162B21] text-[11px] uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-[#C5A059]" />
                            <span>Live Transit Map</span>
                          </button>

                          <button
                            onClick={() => onInspectOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#162B21] text-[#FAF8F5] text-[11px] uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#234233] transition-colors"
                          >
                            <Printer className="w-3 h-3 text-[#DFC289]" />
                            <span>View Customs Manifest</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BESPOKE MEASUREMENTS PROFILE */}
          {activeTab === 'measurements' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">Your Atelier Couture Fit Profile</h4>
                <p className="text-xs text-[#525B56]">
                  Preserve your precise dimensions so Srinagar master tailors cut your pherans and kurtas with flawless posture and drape.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Bust / Chest Circumference (Inches)
                  </label>
                  <input
                    type="text"
                    value={profile.measurements.chestInches}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        measurements: { ...profile.measurements, chestInches: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                    placeholder="e.g. 38"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Shoulder Width (Inches)
                  </label>
                  <input
                    type="text"
                    value={profile.measurements.shoulderInches}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        measurements: { ...profile.measurements, shoulderInches: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                    placeholder="e.g. 15.0"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Sleeve Length (From Shoulder Tip) (Inches)
                  </label>
                  <input
                    type="text"
                    value={profile.measurements.sleeveInches}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        measurements: { ...profile.measurements, sleeveInches: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                    placeholder="e.g. 22.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Total Height
                  </label>
                  <input
                    type="text"
                    value={profile.measurements.heightFeet}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        measurements: { ...profile.measurements, heightFeet: e.target.value },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                    placeholder="e.g. 5'7&quot;"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#525B56] font-semibold mb-1">
                    Silhouette & Ease Preference
                  </label>
                  <select
                    value={profile.measurements.preferredFit}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        measurements: {
                          ...profile.measurements,
                          preferredFit: e.target.value as 'Royal Relaxed Drape' | 'Contemporary Structured',
                        },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none text-[#162B21]"
                  >
                    <option value="Royal Relaxed Drape">Royal Relaxed Drape (Authentic Kashmiri Court Cut with generous volume)</option>
                    <option value="Contemporary Structured">Contemporary Structured (Tailored waistline with modern taper)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] text-xs text-[#525B56] space-y-1">
                <span className="font-semibold text-[#162B21] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  Master Tailor Guarantee
                </span>
                <p>
                  Every garment crafted according to your profile includes a 3-inch interior silk inlay allowing future artisanal adjustment without disturbing delicate Tilla or Sozni borders.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#234233] transition-colors inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#DFC289]" />
                <span>Save Bespoke Measurements</span>
              </button>
            </form>
          )}

          {/* TAB 3: DELIVERY SANCTUARIES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">Saved Delivery Sanctuaries</h4>
                <p className="text-xs text-[#525B56]">
                  Designated destinations for white-glove insured diplomatic and air courier dispatches.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border-2 border-[#162B21] space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] bg-[#FAF8F5] px-2 py-0.5 border border-[#C5A059]/40">
                      Primary Sanctuary
                    </span>
                  </div>
                  <h5 className="font-serif text-sm font-semibold text-[#162B21]">Srinagar Family Estate</h5>
                  <p className="text-xs text-[#525B56] leading-relaxed">
                    Palace Road, Estate 4<br />
                    Downtown Heritage Enclave, Srinagar 190001<br />
                    Jammu & Kashmir, India
                  </p>
                  <p className="text-[11px] text-[#525B56] font-mono">Contact: +91 98112 34567</p>
                </div>

                <div className="p-4 bg-white border border-[#EBE4D8] space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-widest text-[#525B56]">
                      International Residence
                    </span>
                  </div>
                  <h5 className="font-serif text-sm font-semibold text-[#162B21]">Mayfair London Suite</h5>
                  <p className="text-xs text-[#525B56] leading-relaxed">
                    42 Berkeley Square<br />
                    Mayfair, London W1J 5AW<br />
                    United Kingdom
                  </p>
                  <p className="text-[11px] text-[#525B56] font-mono">Contact: +44 20 7946 0912</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATELIER CONCIERGE */}
          {activeTab === 'concierge' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">Private VIP Concierge & Swatch Request</h4>
                <p className="text-xs text-[#525B56]">
                  Connect directly with our Chief Curator Bashir Ahmad in Srinagar for bespoke bridal trousseau or heirloom pashmina commissioning.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-[#EBE4D8] space-y-3">
                  <div className="w-8 h-8 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif text-base text-[#162B21]">Private Virtual Trunk Show</h5>
                  <p className="text-xs text-[#525B56] leading-relaxed">
                    Book a 30-minute private video viewing with our Srinagar master artisans to examine silk velvet textures, gold zari samples, and custom necklines in high definition.
                  </p>
                  <a
                    href="https://wa.me/911942458899?text=Hello%20Kashida%20Couture%20Concierge,%20I%20would%20like%20to%20request%20a%20private%20virtual%20consultation."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
                  >
                    <span>Connect on WhatsApp VIP Desk</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#DFC289]" />
                  </a>
                </div>

                <div className="p-5 bg-white border border-[#EBE4D8] space-y-3">
                  <div className="w-8 h-8 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h5 className="font-serif text-base text-[#162B21]">Complimentary Swatch Chest</h5>
                  <p className="text-xs text-[#525B56] leading-relaxed">
                    Request an aromatic cedar box containing real hand-dyed mulberry silk velvet cuttings and pure Changthangi cashmere swatches before ordering bespoke couture.
                  </p>
                  <button
                    onClick={() => {
                      alert('A complimentary swatch chest has been scheduled for dispatch to your primary address!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#162B21] text-[#162B21] text-xs uppercase tracking-wider font-semibold hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    <span>Request Swatch Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
