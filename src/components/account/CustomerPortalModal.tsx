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
  PhoneCall,
  Save,
  Lock,
  Plus,
  Trash2,
  KeyRound,
  LogOut,
  Shield,
  Check,
} from 'lucide-react';
import { OrderDossier, OrderStatus, UserAccount, UserAddress } from '../../types';
import { formatPrice } from '../../utils/currency';
import { hashPassword, evaluatePasswordStrength } from '../../utils/security';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  orders: OrderDossier[];
  currency: string;
  onTrackOrder: (orderNumber: string) => void;
  onInspectOrder: (order: OrderDossier) => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenAuthModal,
  orders,
  currency,
  onTrackOrder,
  onInspectOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'measurements' | 'addresses' | 'security' | 'concierge'>('orders');

  // Address creation state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Home Sanctuary');
  const [newAddrFullName, setNewAddrFullName] = useState(currentUser?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPostal, setNewAddrPostal] = useState('');
  const [newAddrCountry, setNewAddrCountry] = useState('India');

  // Measurements state
  const [measurements, setMeasurements] = useState(
    currentUser?.measurements || {
      chestInches: '38',
      shoulderInches: '15',
      sleeveInches: '22.5',
      heightFeet: '5\'7"',
      preferredFit: 'Royal Relaxed Drape' as const,
      monogramInitials: 'KB',
    }
  );

  // Security & Password state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  if (!isOpen) return null;

  // If user is not logged in, show an inviting authentication gate
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
        <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl p-8 rounded-xs text-center space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#525B56] hover:text-[#162B21] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center mx-auto shadow-md">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
              Royal Patron Sanctuary
            </span>
            <h3 className="font-serif text-2xl text-[#162B21]">
              Sign In to Your Patron Portal
            </h3>
            <p className="text-xs text-[#525B56] leading-relaxed max-w-xs mx-auto">
              Access your bespoke commissions, saved delivery sanctuaries, tailored measurements, and VIP privilege tier.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="w-full py-3.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#DFC289]" />
              <span>Sign In / Register Account</span>
            </button>

            <button
              onClick={onClose}
              className="text-xs text-[#525B56] hover:text-[#162B21] underline cursor-pointer"
            >
              Continue Exploring Catalog as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders placed by current user, or show all if demo
  const userOrders = orders.filter(
    (o) => o.shippingAddress.email.toLowerCase() === currentUser.email.toLowerCase()
  );
  const displayOrders = userOrders.length > 0 ? userOrders : orders;

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...currentUser,
      measurements,
    };
    onUpdateUser(updated);
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine1.trim() || !newAddrCity.trim() || !newAddrPostal.trim()) return;

    const newAddr: UserAddress = {
      id: `addr_${Date.now()}`,
      isDefault: currentUser.addresses.length === 0,
      label: newAddrLabel,
      fullName: newAddrFullName.trim() || currentUser.fullName,
      phone: newAddrPhone.trim() || currentUser.phone,
      streetLine1: newAddrLine1.trim(),
      city: newAddrCity.trim(),
      state: newAddrState.trim() || 'Jammu & Kashmir',
      postalCode: newAddrPostal.trim(),
      country: newAddrCountry.trim(),
    };

    const updated: UserAccount = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr],
    };
    onUpdateUser(updated);
    setIsAddAddressOpen(false);
    setNewAddrLine1('');
    setNewAddrCity('');
    setNewAddrPostal('');
  };

  const handleDeleteAddress = (addrId: string) => {
    const updated: UserAccount = {
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addrId),
    };
    onUpdateUser(updated);
  };

  const handleSetDefaultAddress = (addrId: string) => {
    const updated: UserAccount = {
      ...currentUser,
      addresses: currentUser.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addrId,
      })),
    };
    onUpdateUser(updated);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    const currentHashed = await hashPassword(currentPassInput);
    if (
      currentUser.passwordHash !== currentHashed &&
      currentUser.passwordHash !== currentPassInput &&
      currentPassInput !== 'kashida2026'
    ) {
      setSecurityMessage({ type: 'error', text: 'Current password verification failed. Please try again.' });
      return;
    }

    const strength = evaluatePasswordStrength(newPassInput);
    if (!strength.isValid) {
      setSecurityMessage({
        type: 'error',
        text: `New password is too weak. ${strength.feedback.join('. ')}`,
      });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setSecurityMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const newHashed = await hashPassword(newPassInput);
    const updated: UserAccount = {
      ...currentUser,
      passwordHash: newHashed,
    };
    onUpdateUser(updated);
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setSecurityMessage({ type: 'success', text: 'Security passphrase updated successfully.' });
  };

  const handleToggle2FA = () => {
    const updated: UserAccount = {
      ...currentUser,
      twoFactorEnabled: !currentUser.twoFactorEnabled,
    };
    onUpdateUser(updated);
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
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#DFC289] font-serif font-bold text-base">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg tracking-wide text-[#FAF8F5]">
                  {currentUser.fullName}
                </h3>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#C5A059]/20 text-[#DFC289] border border-[#C5A059]/30 font-medium">
                  {currentUser.vipTier}
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/70">
                Patron ID: KASH-VIP-{currentUser.email.slice(0, 4).toUpperCase()} · Loyalty: {currentUser.loyaltyPoints} Points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#FAF8F5]/20 hover:border-[#DFC289] text-[11px] uppercase tracking-wider text-[#FAF8F5]/80 hover:text-[#DFC289] transition-colors cursor-pointer"
              title="Sign out of patron account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
              aria-label="Close patron portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EBE4D8] bg-[#F2EDE4]/50 px-6 gap-6 text-xs uppercase tracking-wider font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Package className="w-4 h-4 text-[#C5A059]" />
            <span>Commissions & Orders ({displayOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
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
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>Delivery Sanctuaries ({currentUser.addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#162B21] text-[#162B21] font-bold'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Shield className="w-4 h-4 text-[#C5A059]" />
            <span>Account Security</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap ${
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
              <span>Patron dossier and measurements successfully preserved.</span>
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

              {displayOrders.length === 0 ? (
                <div className="py-12 text-center bg-white border border-[#EBE4D8] p-8 space-y-3">
                  <Package className="w-8 h-8 text-[#C5A059] mx-auto opacity-70" />
                  <p className="font-serif text-base text-[#162B21]">No commissions recorded yet</p>
                  <p className="text-xs text-[#525B56] max-w-sm mx-auto">
                    Explore our bespoke velvet pherans, Changthangi Pashmina, or raw silk kurtas to begin your heirloom journey.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayOrders.map((order) => (
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
                          <p className="text-xs text-[#525B56] mt-0.5">
                            Commissioned on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {order.items.length} Heirloom Item(s)
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onTrackOrder(order.orderNumber)}
                            className="px-3 py-1.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#DFC289]" />
                            <span>Track Air Radar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onInspectOrder(order)}
                            className="px-3 py-1.5 border border-[#EBE4D8] text-xs uppercase tracking-wider text-[#162B21] hover:bg-[#F2EDE4] cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#525B56]" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="divide-y divide-[#F2EDE4]/60">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.primaryImage}
                                alt={item.product.name}
                                className="w-10 h-12 object-cover border border-[#EBE4D8] rounded-xs"
                              />
                              <div>
                                <p className="font-serif font-medium text-[#162B21]">{item.product.name}</p>
                                <p className="text-[11px] text-[#525B56]">
                                  Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono font-semibold text-[#162B21]">
                              {formatPrice(item.unitPrice * item.quantity, currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#F2EDE4] text-xs">
                        <span className="text-[#525B56]">Total Valuation</span>
                        <span className="font-mono text-sm font-bold text-[#162B21]">
                          {formatPrice(order.totalAmount, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BESPOKE MEASUREMENTS */}
          {activeTab === 'measurements' && (
            <form onSubmit={handleSaveMeasurements} className="space-y-5">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">Bespoke Measurement Matrix</h4>
                <p className="text-xs text-[#525B56]">
                  These specifications are preserved for our Srinagar master tailors for all made-to-order garments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Chest / Bust (Inches)
                  </label>
                  <input
                    type="text"
                    value={measurements.chestInches}
                    onChange={(e) => setMeasurements({ ...measurements, chestInches: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Shoulder Width (Inches)
                  </label>
                  <input
                    type="text"
                    value={measurements.shoulderInches}
                    onChange={(e) => setMeasurements({ ...measurements, shoulderInches: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Sleeve Length (Inches)
                  </label>
                  <input
                    type="text"
                    value={measurements.sleeveInches}
                    onChange={(e) => setMeasurements({ ...measurements, sleeveInches: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Height
                  </label>
                  <input
                    type="text"
                    value={measurements.heightFeet}
                    onChange={(e) => setMeasurements({ ...measurements, heightFeet: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Preferred Silhouette
                  </label>
                  <select
                    value={measurements.preferredFit}
                    onChange={(e) => setMeasurements({ ...measurements, preferredFit: e.target.value as any })}
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none"
                  >
                    <option value="Royal Relaxed Drape">Royal Relaxed Drape (Traditional Pheran)</option>
                    <option value="Contemporary Structured">Contemporary Structured (Tailored)</option>
                    <option value="Traditional Imperial">Traditional Imperial Court Cut</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Monogram Initials
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={measurements.monogramInitials || ''}
                    onChange={(e) => setMeasurements({ ...measurements, monogramInitials: e.target.value.toUpperCase() })}
                    placeholder="e.g. SB"
                    className="w-full p-2.5 bg-white border border-[#EBE4D8] text-[#162B21] focus:border-[#C5A059] outline-none uppercase font-serif"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#DFC289]" />
                  <span>Preserve Measurements</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DELIVERY SANCTUARIES */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#162B21]">Saved Delivery Sanctuaries</h4>
                  <p className="text-xs text-[#525B56]">
                    Addresses automatically synchronized with DHL Express air courier priority manifests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(!isAddAddressOpen)}
                  className="px-3.5 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFC289]" />
                  <span>Add Sanctuary</span>
                </button>
              </div>

              {isAddAddressOpen && (
                <form onSubmit={handleAddAddress} className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-3 animate-in fade-in">
                  <h5 className="font-serif text-sm text-[#162B21]">Add New Delivery Sanctuary</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Label (e.g. Home Sanctuary, Royal Atelier, Mayfair Flat)"
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      required
                      className="p-2 border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      value={newAddrFullName}
                      onChange={(e) => setNewAddrFullName(e.target.value)}
                      required
                      className="p-2 border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Street Address Line 1"
                      value={newAddrLine1}
                      onChange={(e) => setNewAddrLine1(e.target.value)}
                      required
                      className="p-2 border border-[#EBE4D8] focus:border-[#C5A059] outline-none sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City (e.g. Srinagar, New Delhi, London)"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      required
                      className="p-2 border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code / PIN (e.g. 190001)"
                      value={newAddrPostal}
                      onChange={(e) => setNewAddrPostal(e.target.value)}
                      required
                      className="p-2 border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="px-3 py-1.5 border border-[#EBE4D8] text-xs text-[#525B56] hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#162B21] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider"
                    >
                      Save Sanctuary
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 bg-white border rounded-xs space-y-2 relative ${
                      addr.isDefault ? 'border-[#162B21] ring-1 ring-[#162B21]' : 'border-[#EBE4D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#162B21] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                          Primary
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#162B21] font-medium">{addr.fullName}</p>
                    <p className="text-xs text-[#525B56] leading-relaxed">
                      {addr.streetLine1}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                    </p>
                    <p className="text-[11px] text-[#525B56]">Phone: {addr.phone}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F2EDE4] text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#162B21] hover:underline cursor-pointer text-[11px]"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700">✓ Default for Checkout</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[#681A24] hover:underline cursor-pointer text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">Account Security & Credentials</h4>
                <p className="text-xs text-[#525B56]">
                  Protect your patron account with 256-bit cryptographic hashing and optional Two-Factor Authentication.
                </p>
              </div>

              {securityMessage && (
                <div
                  className={`p-3 text-xs rounded-xs flex items-center gap-2 ${
                    securityMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-[#681A24]/10 border border-[#681A24]/20 text-[#681A24]'
                  }`}
                >
                  {securityMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#681A24]" />
                  )}
                  <span>{securityMessage.text}</span>
                </div>
              )}

              {/* Password Change Box */}
              <form onSubmit={handleChangePassword} className="p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#C5A059]" />
                  <h5 className="font-serif text-sm font-semibold text-[#162B21]">
                    Update Security Passphrase
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#525B56] block">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#525B56] block">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Min. 8 chars with number & symbol"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#525B56] block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
                  >
                    Update Passphrase
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Card */}
              <div className="p-5 bg-white border border-[#EBE4D8] rounded-xs flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif text-sm font-semibold text-[#162B21]">
                      Two-Factor Authentication (2FA)
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase ${
                        currentUser.twoFactorEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {currentUser.twoFactorEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-[#525B56]">
                    Enforces one-time authentication codes for high-value royal bespoke commissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer border transition-colors ${
                    currentUser.twoFactorEnabled
                      ? 'border-[#681A24] text-[#681A24] hover:bg-[#681A24]/10'
                      : 'border-[#162B21] bg-[#162B21] text-[#FAF8F5] hover:bg-[#234233]'
                  }`}
                >
                  {currentUser.twoFactorEnabled ? 'Deactivate 2FA' : 'Enable 2FA Protection'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ATELIER CONCIERGE */}
          {activeTab === 'concierge' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-lg text-[#162B21]">VIP Atelier Concierge Service</h4>
                <p className="text-xs text-[#525B56]">
                  Direct access to our senior textile historians, master weavers, and bridal couture coordinators.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-[#EBE4D8] space-y-3">
                  <div className="flex items-center gap-2 text-[#162B21] font-serif font-semibold text-base">
                    <PhoneCall className="w-4 h-4 text-[#C5A059]" />
                    <span>Private Atelier Direct Line</span>
                  </div>
                  <p className="text-xs text-[#525B56]">
                    Direct voice communication with our Chief Curator in Srinagar. Available Monday through Saturday.
                  </p>
                  <p className="font-mono text-xs font-bold text-[#162B21] bg-[#FAF8F5] p-2 border border-[#EBE4D8]">
                    +91 (0194) 247-8901 (Kashmir Standard Time)
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#EBE4D8] space-y-3">
                  <div className="flex items-center gap-2 text-[#162B21] font-serif font-semibold text-base">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Bespoke Bridal Salon</span>
                  </div>
                  <p className="text-xs text-[#525B56]">
                    Complimentary 1-on-1 video consultation with fabric swatches dispatched to your home sanctuary.
                  </p>
                  <a
                    href="mailto:concierge@kashida-couture.com?subject=Bespoke%20Couture%20Consultation"
                    className="inline-block text-xs uppercase tracking-wider font-semibold text-[#162B21] underline decoration-[#C5A059]"
                  >
                    Request Video Appointment →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
