import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode } from 'lucide-react';
import { OrderDossier } from '../../types';

interface ShippingLabelModalProps {
  order: OrderDossier;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const carrier = order.carrier || 'DHL Express Worldwide (Air Priority)';
  const awb = order.trackingNumber || `AWB-${order.orderNumber.replace('KASH-', '')}-992`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-black max-w-3xl w-full rounded-xs shadow-2xl border border-neutral-300 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="print:hidden bg-[#162B21] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-wider uppercase text-white font-semibold">
              Commercial Shipping Label & Packing Slip
            </span>
            <span className="text-[10px] bg-[#C5A059] text-[#162B21] font-bold px-2 py-0.5 rounded-xs font-mono uppercase">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label (A4 / 4x6)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 space-y-6 text-xs text-neutral-800 font-sans print:p-0 print:m-0">
          {/* Header & Carrier Dispatch Strip */}
          <div className="border-2 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-[0.2em] uppercase text-black block">
                KĀSHIDA COUTURE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-600 block">
                Haute Artisanat Du Kashmir · Srinagar Atelier Dispatch
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                GSTIN: 01AAAFK0912K1Z9 · HSN: 6204 / 6214 (Pure Pashmina & Silk)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                {carrier}
              </span>
              <span className="font-mono text-sm font-bold tracking-widest block bg-neutral-100 px-2 py-1 border border-black mt-1">
                AWB: {awb}
              </span>
            </div>
          </div>

          {/* Barcode & Routing Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-black p-4">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 block">
                SHIP TO (CONSIGNEE PATRON):
              </span>
              <p className="font-bold text-sm text-black uppercase">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-xs text-neutral-700">
                {order.shippingAddress.streetLine1}
                {order.shippingAddress.streetLine2 ? `, ${order.shippingAddress.streetLine2}` : ''}
              </p>
              <p className="text-xs text-neutral-700 font-semibold">
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}
              </p>
              <p className="text-[11px] text-neutral-600 font-mono">
                Phone: {order.shippingAddress.phone} · Country: {order.shippingAddress.country}
              </p>
            </div>

            <div className="border-l sm:border-black sm:pl-4 flex flex-col justify-between items-center text-center">
              {/* Simulated QR & Barcode */}
              <div className="w-20 h-20 border-2 border-black p-1 flex items-center justify-center bg-white">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <span className="text-[9px] font-mono text-neutral-600 tracking-wider mt-1">
                SCAN FOR ATELIER VERIFICATION
              </span>
            </div>
          </div>

          {/* Shipment Order Metadata */}
          <div className="grid grid-cols-4 gap-2 text-[10px] uppercase font-mono border-b border-black pb-3">
            <div>
              <span className="text-neutral-500 block">Order Ref:</span>
              <strong className="text-black text-xs">{order.orderNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Order Date:</span>
              <strong className="text-black text-xs">{order.createdAt}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Payment Mode:</span>
              <strong className="text-black text-xs">
                {order.paymentMethod === 'PAYTM_QR' ? 'PAYTM UPI (VERIFIED)' : order.paymentMethod}
              </strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Value Declared:</span>
              <strong className="text-black text-xs font-bold">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Itemized Packing Checklist */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-black block mb-2">
              Itemized Commercial Contents & Quality Inspection:
            </span>
            <table className="w-full text-left border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-neutral-100 border-b border-black text-[10px] uppercase font-mono">
                  <th className="p-2 border-r border-black">Item Description</th>
                  <th className="p-2 border-r border-black">Variant / Craft</th>
                  <th className="p-2 border-r border-black text-center">Qty</th>
                  <th className="p-2 border-r border-black text-right">Unit Price</th>
                  <th className="p-2 text-center">QC Stamp</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-neutral-300">
                    <td className="p-2 border-r border-neutral-300 font-semibold text-black">
                      {item.product.name}
                      <span className="block text-[10px] text-neutral-500 font-normal">
                        HSN: 620419 · GI Certified Changthangi Origin
                      </span>
                    </td>
                    <td className="p-2 border-r border-neutral-300 font-mono text-[11px]">
                      Size: {item.size} · Color: {item.color}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-center text-[10px] font-bold text-emerald-800">
                      ✓ PASSED
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insured Security & Heritage Guarantee Seal */}
          <div className="border border-black p-4 flex items-center justify-between gap-4 bg-neutral-50">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-black shrink-0" />
              <div className="text-[10px] leading-tight text-neutral-700">
                <strong className="text-black uppercase block">Geographical Indication (GI) Registered Guarantee</strong>
                This consignment contains authentic Kashmiri couture crafted by guild artisans in Srinagar. Insured transit under Master Policy #KASH-INSR-2026.
              </div>
            </div>

            <div className="text-right shrink-0 border-l border-neutral-300 pl-4">
              <span className="text-[9px] uppercase font-mono text-neutral-500 block">Lead Quality Inspector:</span>
              <span className="font-serif italic font-bold text-xs text-black block">Ustad Ghulam Nabi</span>
              <span className="text-[9px] text-neutral-500">Srinagar Atelier</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="print:hidden bg-neutral-100 p-4 border-t border-neutral-300 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 text-xs uppercase font-medium hover:bg-neutral-200 cursor-pointer"
          >
            Close Window
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#162B21] text-[#DFC289] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer hover:bg-[#234233] flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Commercial Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
