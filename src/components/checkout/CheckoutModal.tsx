import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { CartItem, Coupon, OrderDossier, ShippingAddress, PaymentGatewayConfig } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  paymentConfig?: PaymentGatewayConfig;
  onOrderSuccess: (order: OrderDossier) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  paymentConfig,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'COD'>('RAZORPAY_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  // Shipping form state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Lady Noor Jahan',
    email: 'noor.jahan@heritage.org',
    phone: '+91 98765 43210',
    streetLine1: 'Boulvard Road, Dal Lake View Estates',
    streetLine2: 'Pavilion Suite 4B',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    postalCode: '190001',
    country: 'India',
  });

  // Card details state
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState('NOOR JAHAN');

  // UPI test state
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [upiQrSimulated, setUpiQrSimulated] = useState(false);

  if (!isOpen) return null;

  const subTotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon && subTotal >= appliedCoupon.minSpend) {
    discountAmount = Math.round((subTotal * appliedCoupon.discountPercent) / 100);
  }

  const shippingCost = subTotal >= 25000 ? 0 : 1500;
  const totalAmount = Math.max(0, subTotal - discountAmount + shippingCost);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!address.fullName.trim() || !address.email.trim() || !address.phone.trim() || !address.streetLine1.trim() || !address.postalCode.trim()) {
      setFormError('Please complete all mandatory delivery address fields.');
      return;
    }
    setStep(2);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNum = `KASH-${Date.now().toString().slice(-6)}`;
      const trackingCode = `DHL-IN-${Math.floor(100000000 + Math.random() * 900000000)}`;

      const completedOrder: OrderDossier = {
        orderNumber: orderNum,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'CONFIRMED',
        items: [...items],
        shippingAddress: address,
        paymentMethod: paymentMethod,
        paymentStatus: 'PAID',
        razorpayOrderId: `order_rzp_${Math.random().toString(36).substring(2, 10)}`,
        razorpayPaymentId: `pay_rzp_${Math.random().toString(36).substring(2, 12)}`,
        subTotal,
        discountAmount,
        couponCode: appliedCoupon?.code,
        shippingCost,
        totalAmount,
        trackingNumber: trackingCode,
        estimatedDelivery: '3–5 Business Days via Insured DHL Air',
      };

      setIsProcessing(false);
      onOrderSuccess(completedOrder);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl overflow-hidden rounded-xs my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#F2EDE4] bg-[#162B21] text-[#FAF8F5] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#DFC289] font-medium block">
              Bespoke Atelier Checkout
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#FAF8F5]">
              Kāshida Couture Dispatch Dossier
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#FAF8F5]/80 hover:text-[#FAF8F5] cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Step Progress Bar */}
        <div className="bg-[#F2EDE4]/60 px-6 py-3 border-b border-[#EBE4D8] flex items-center justify-center gap-8 text-xs uppercase tracking-wider">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer font-medium ${
              step >= 1 ? 'text-[#162B21]' : 'text-[#525B56]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 1 ? 'bg-[#162B21] text-[#FAF8F5]' : 'bg-[#EBE4D8] text-[#525B56]'
            }`}>
              1
            </span>
            <span>Delivery Address</span>
          </button>

          <span className="text-[#C5A059]/40">——</span>

          <button
            onClick={() => step === 2 && setStep(2)}
            className={`flex items-center gap-2 font-medium ${
              step === 2 ? 'text-[#162B21]' : 'text-[#525B56]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? 'bg-[#162B21] text-[#FAF8F5]' : 'bg-[#EBE4D8] text-[#525B56]'
            }`}>
              2
            </span>
            <span>Razorpay Verification</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          {step === 1 ? (
            /* STEP 1: Delivery Address Form */
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#162B21]">
                  Shipping & Recipient Details
                </h3>
                <span className="text-[11px] text-[#525B56]">
                  Step 1 of 2
                </span>
              </div>

              {formError && (
                <div className="p-3 bg-[#681A24]/10 border border-[#681A24]/30 text-[#681A24] text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    required
                    placeholder="e.g. Lady Noor Jahan"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    Email Address (for Dispatch Dossier) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={address.email}
                    onChange={handleAddressChange}
                    required
                    placeholder="patron@domain.com"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    Mobile Phone (for Courier OTP) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    required
                    placeholder="190001"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    Street Address & Residence / Estate *
                  </label>
                  <input
                    type="text"
                    name="streetLine1"
                    value={address.streetLine1}
                    onChange={handleAddressChange}
                    required
                    placeholder="Boulevard Road, Estate No. 12"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                    placeholder="Srinagar"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                    placeholder="Jammu & Kashmir"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Order Quick Summary */}
              <div className="p-4 bg-[#F2EDE4]/50 border border-[#EBE4D8] rounded-xs flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#525B56]">Total Allocation ({items.length} items):</span>
                  <span className="font-mono text-base font-semibold text-[#162B21] ml-2 tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-[#C5A059] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Insured DHL Transit
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer transition-colors shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-[#DFC289]" />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Interactive Razorpay Test Payment Gateway */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs text-[#C5A059]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {paymentConfig?.environment === 'live'
                      ? 'Razorpay Live Production Protocol'
                      : `Razorpay Test Sandbox (${paymentConfig?.razorpayKeyId || 'rzp_test_...'})`}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(paymentConfig?.cardEnabled !== false) && (
                  <button
                    onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                    className={`p-3.5 border text-center transition-all cursor-pointer rounded-xs flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'RAZORPAY_CARD'
                        ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5] shadow-xs'
                        : 'border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] hover:border-[#C5A059]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#DFC289]" />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      Credit / Debit Card
                    </span>
                  </button>
                )}

                {(paymentConfig?.upiEnabled !== false) && (
                  <button
                    onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                    className={`p-3.5 border text-center transition-all cursor-pointer rounded-xs flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'RAZORPAY_UPI'
                        ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5] shadow-xs'
                        : 'border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] hover:border-[#C5A059]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#DFC289]" />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      Instant UPI / QR
                    </span>
                  </button>
                )}

                {(paymentConfig?.codEnabled !== false) && (
                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 border text-center transition-all cursor-pointer rounded-xs flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'COD'
                        ? 'border-[#162B21] bg-[#162B21] text-[#FAF8F5] shadow-xs'
                        : 'border-[#EBE4D8] bg-[#FAF8F5] text-[#1C1F1E] hover:border-[#C5A059]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#DFC289]" />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      Cash on Delivery
                    </span>
                  </button>
                )}
              </div>

              {/* Dynamic Payment Details Area */}
              {paymentMethod === 'RAZORPAY_CARD' && (
                <div className="p-5 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#162B21] uppercase tracking-wider">
                      Simulated Test Card Gateway
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4000 1234 5678 9010');
                        setCardExpiry('12/28');
                        setCardCvv('888');
                        setCardHolder('NOOR JAHAN');
                      }}
                      className="text-[11px] text-[#C5A059] underline cursor-pointer"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#525B56] block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4000 0000 0000 0000"
                        className="w-full p-2.5 font-mono text-sm border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#525B56] block mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full p-2.5 font-mono text-sm border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#525B56] block mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full p-2.5 font-mono text-sm border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#525B56] block mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'RAZORPAY_UPI' && (
                <div className="p-5 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#162B21] uppercase tracking-wider">
                      UPI QR & VPA Payment
                    </span>
                    <span className="text-[11px] text-[#525B56]">Zero Surcharge</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#FAF8F5] border border-[#EBE4D8]">
                    <div className="w-32 h-32 bg-[#162B21] p-2 flex flex-col items-center justify-center text-[#DFC289] rounded-xs shadow-inner shrink-0">
                      <QrCode className="w-20 h-20" />
                      <span className="text-[9px] uppercase tracking-widest text-[#FAF8F5] mt-1">
                        Scan to Pay
                      </span>
                    </div>

                    <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
                      <p className="font-serif text-sm text-[#162B21] font-semibold">
                        Scan with any UPI App
                      </p>
                      <p className="text-[#525B56] text-[11px]">
                        Google Pay, PhonePe, Paytm, BHIM, or any international UPI client.
                      </p>
                      <div className="pt-1">
                        <label className="text-[10px] uppercase text-[#525B56] block mb-1">Or enter VPA:</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="p-1.5 border border-[#EBE4D8] bg-[#FAF8F5] text-xs font-mono w-full max-w-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-5 bg-[#F2EDE4]/40 border border-[#EBE4D8] rounded-xs space-y-2 text-xs">
                  <h4 className="font-serif text-sm font-semibold text-[#162B21]">
                    Cash on Hand Delivery (India Only)
                  </h4>
                  <p className="text-[#525B56]">
                    Our concierge courier delivers in tamper-proof cedar boxes. Payment can be settled via Cash, UPI, or Card on delivery at your doorstep.
                  </p>
                </div>
              )}

              {/* Authorize & Complete Order Button */}
              <div className="pt-4 border-t border-[#F2EDE4] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#525B56]">Final Payable Amount:</span>
                  <p className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className={`w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isProcessing
                      ? 'bg-[#234233] text-[#DFC289] cursor-wait'
                      : 'bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5]'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#DFC289]" />
                  <span>
                    {isProcessing ? 'Verifying with Razorpay...' : `Authorize ₹${totalAmount.toLocaleString('en-IN')}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
