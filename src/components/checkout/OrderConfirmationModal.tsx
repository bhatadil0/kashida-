import React from 'react';
import {
  CheckCircle,
  Truck,
  Printer,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { OrderDossier } from '../../types';

interface OrderConfirmationModalProps {
  order: OrderDossier | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl rounded-xs overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editorial Success Banner */}
        <div className="p-8 bg-[#162B21] text-[#FAF8F5] text-center space-y-3 relative overflow-hidden">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5]/10 flex items-center justify-center border border-[#DFC289]/40 text-[#DFC289]">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFC289] font-medium block">
            Atelier Allocation Confirmed
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5]">
            Thank You, {order.shippingAddress.fullName}
          </h2>

          <p className="text-xs text-[#FAF8F5]/80 max-w-md mx-auto leading-relaxed">
            Your handcrafted couture commission has been received by our Srinagar master weaver guild. Dispatch dossier has been transmitted to <span className="text-[#DFC289] underline">{order.shippingAddress.email}</span>.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Reference Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">
                Order Reference
              </span>
              <strong className="font-mono text-sm text-[#162B21] font-semibold tabular-nums">
                {order.orderNumber}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">
                Razorpay ID
              </span>
              <strong className="font-mono text-xs text-[#162B21] font-medium truncate block">
                {order.razorpayPaymentId || 'Verified RZP'}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">
                Air Waybill / Tracking
              </span>
              <strong className="font-mono text-xs text-[#C5A059] font-medium truncate block">
                {order.trackingNumber}
              </strong>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] block">
                Status
              </span>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#162B21]">
                ● {order.status}
              </span>
            </div>
          </div>

          {/* Shipment Lifecycle Tracker */}
          <div className="p-4 border border-[#EBE4D8] bg-[#FAF8F5] space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#162B21]">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Dispatch & Delivery Timeline</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider">
              <div className="space-y-1">
                <div className="w-4 h-4 mx-auto rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center text-[8px]">✓</div>
                <span className="font-semibold text-[#162B21]">Commissioned</span>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 mx-auto rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center text-[8px]">✓</div>
                <span className="font-semibold text-[#162B21]">Atelier Inspected</span>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 mx-auto rounded-full bg-[#EBE4D8] text-[#525B56] flex items-center justify-center text-[8px]">3</div>
                <span className="text-[#525B56]">DHL Air Transit</span>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 mx-auto rounded-full bg-[#EBE4D8] text-[#525B56] flex items-center justify-center text-[8px]">4</div>
                <span className="text-[#525B56]">Delivery</span>
              </div>
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#162B21]">
              Commissioned Pieces
            </h4>
            <div className="divide-y divide-[#F2EDE4] border border-[#EBE4D8] bg-[#FAF8F5] p-4">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.primaryImage}
                      alt=""
                      className="w-12 h-16 object-cover rounded-xs border border-[#EBE4D8]"
                    />
                    <div>
                      <h5 className="font-serif text-sm text-[#162B21] font-medium">
                        {item.product.name}
                      </h5>
                      <p className="text-[11px] text-[#525B56]">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-semibold text-[#162B21] tabular-nums">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Billing Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F2EDE4]/30 border border-[#EBE4D8] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Destination Dossier
              </span>
              <p className="font-medium text-[#162B21]">{order.shippingAddress.fullName}</p>
              <p className="text-[#525B56]">{order.shippingAddress.streetLine1}</p>
              <p className="text-[#525B56]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-[#525B56]">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="p-4 bg-[#F2EDE4]/30 border border-[#EBE4D8] space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Settlement Summary
              </span>
              <div className="flex justify-between text-[#525B56]">
                <span>Subtotal:</span>
                <span className="font-mono">₹{order.subTotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#681A24]">
                  <span>Privilege ({order.couponCode}):</span>
                  <span className="font-mono">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#525B56]">
                <span>Shipping:</span>
                <span>{order.shippingCost === 0 ? 'Complimentary' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#162B21] pt-1 border-t border-[#EBE4D8]">
                <span>Total Paid:</span>
                <span className="font-mono">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#F2EDE4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#EBE4D8] hover:border-[#C5A059] text-xs uppercase tracking-wider text-[#525B56] hover:text-[#162B21] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C5A059]" />
              <span>Print Heirloom Receipt</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onContinueShopping();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
