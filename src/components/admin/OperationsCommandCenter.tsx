import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  Printer,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit3,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Scissors,
  Layers,
  ArrowUpRight,
  Eye,
  Check,
  X,
  FileText,
  Boxes,
  MapPin,
  Calendar,
  Send,
  Zap
} from 'lucide-react';
import {
  OrderDossier,
  OrderStatus,
  Product,
  CategoryConfig,
  Coupon,
  HomepageCMSConfig,
  PaymentGatewayConfig,
  SEOConfig,
  InventoryLogItem,
  OrderTrackingCheckpoint
} from '../../types';
import { ShippingLabelModal } from './ShippingLabelModal';

interface OperationsCommandCenterProps {
  orders: OrderDossier[];
  products: Product[];
  categories: CategoryConfig[];
  coupons: Coupon[];
  paymentConfig: PaymentGatewayConfig;
  homepageConfig?: HomepageCMSConfig;
  seoConfig?: SEOConfig;
  onUpdateOrderStatus: (orderNumber: string, newStatus: OrderStatus) => void;
  onUpdateStock: (productId: string, variantId: string, newStock: number) => void;
  onUpdateOrderDossier?: (updatedOrder: OrderDossier) => void;
  onRestoreDatabaseSnapshot?: (snapshotData: any) => void;
}

export const OperationsCommandCenter: React.FC<OperationsCommandCenterProps> = ({
  orders,
  products,
  categories,
  coupons,
  paymentConfig,
  homepageConfig,
  seoConfig,
  onUpdateOrderStatus,
  onUpdateStock,
  onUpdateOrderDossier,
  onRestoreDatabaseSnapshot,
}) => {
  // Operations sub-tab
  const [subTab, setSubTab] = useState<'fulfillment' | 'paytm_reconciliation' | 'artisan_production' | 'inventory_logistics' | 'rma_returns' | 'backup_tools'>('fulfillment');

  // Search & Filter state for fulfillment
  const [orderQuery, setOrderQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  // Selected order for label printing
  const [printingOrder, setPrintingOrder] = useState<OrderDossier | null>(null);

  // Selected order for detailed checkpoint / dispatch modal
  const [editingDispatchOrder, setEditingDispatchOrder] = useState<OrderDossier | null>(null);
  const [newCheckpointLocation, setNewCheckpointLocation] = useState('');
  const [newCheckpointStatus, setNewCheckpointStatus] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('DHL Express Worldwide');
  const [customAwb, setCustomAwb] = useState('');

  // Inventory adjustment modal
  const [adjustingVariant, setAdjustingVariant] = useState<{ product: Product; variantId: string; currentStock: number } | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(5);
  const [stockReason, setStockReason] = useState('Srinagar Loom Batch Received');

  // Inventory logs state (stored in localStorage)
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogItem[]>(() => {
    const saved = localStorage.getItem('kashida_inventory_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'log-001',
        timestamp: 'Today, 09:15 AM',
        productId: 'kash-001',
        productName: 'Royal Velvet Tilla Pheran',
        variantId: 'v-001-m-emerald',
        variantLabel: 'M / Deep Emerald',
        delta: 4,
        newStock: 5,
        reason: 'Srinagar Old City Loom Batch Received',
        operator: 'Ustad Bashir Ahmad (Operations)'
      },
      {
        id: 'log-002',
        timestamp: 'Yesterday, 03:40 PM',
        productId: 'kash-003',
        productName: 'Changthangi Pashmina Shawl',
        variantId: 'v-003-natural',
        variantLabel: 'Standard / Natural Ivory Cashmere',
        delta: -1,
        newStock: 2,
        reason: 'Order KASH-849201 Dispatch Allocation',
        operator: 'Automated Checkout Allocation'
      }
    ];
  });

  const recordStockLog = (item: InventoryLogItem) => {
    const updated = [item, ...inventoryLogs.slice(0, 39)];
    setInventoryLogs(updated);
    localStorage.setItem('kashida_inventory_logs', JSON.stringify(updated));
  };

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (paymentFilter === 'PAYTM_QR' && o.paymentMethod !== 'PAYTM_QR') return false;
    if (paymentFilter === 'RAZORPAY' && !o.paymentMethod.startsWith('RAZORPAY')) return false;
    if (paymentFilter === 'COD' && o.paymentMethod !== 'COD') return false;

    if (!orderQuery.trim()) return true;
    const q = orderQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.email.toLowerCase().includes(q) ||
      o.shippingAddress.phone.includes(q) ||
      o.shippingAddress.city.toLowerCase().includes(q) ||
      (o.paytmUtr && o.paytmUtr.toLowerCase().includes(q)) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  });

  // Paytm orders specific filter
  const paytmOrders = orders.filter((o) => o.paymentMethod === 'PAYTM_QR');
  const pendingPaytmCount = paytmOrders.filter((o) => !o.paytmVerified || o.paymentStatus !== 'PAID').length;

  // Key operations statistics
  const pendingFulfillmentCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
  const dispatchedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalOperationsRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);

  // Status progression map
  const statusHierarchy: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
  ];

  // Fast forward order status
  const handleAdvanceStatus = (order: OrderDossier) => {
    const currentIdx = statusHierarchy.indexOf(order.status);
    if (currentIdx > -1 && currentIdx < statusHierarchy.length - 1) {
      const nextStatus = statusHierarchy[currentIdx + 1];
      onUpdateOrderStatus(order.orderNumber, nextStatus);
      showToast(`Order ${order.orderNumber} advanced to ${nextStatus}`);
    }
  };

  // Paytm UTR 1-Click Verification Handler
  const handleVerifyPaytmUtr = (order: OrderDossier) => {
    if (onUpdateOrderDossier) {
      const updated: OrderDossier = {
        ...order,
        paymentStatus: 'PAID',
        paytmVerified: true,
        status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
      };
      onUpdateOrderDossier(updated);
    } else {
      onUpdateOrderStatus(order.orderNumber, 'CONFIRMED');
    }
    showToast(`Paytm UTR for Order ${order.orderNumber} successfully reconciled & verified.`);
  };

  // Flag UTR discrepancy
  const handleFlagPaytmDiscrepancy = (order: OrderDossier) => {
    if (onUpdateOrderDossier) {
      const updated: OrderDossier = {
        ...order,
        paytmVerified: false,
        internalNotes: (order.internalNotes || '') + `\n[${new Date().toLocaleTimeString()}]: Discrepancy flagged on UTR ${order.paytmUtr || 'N/A'}. Awaiting patron proof.`
      };
      onUpdateOrderDossier(updated);
    }
    showToast(`Flagged UTR discrepancy on Order ${order.orderNumber}. Patron notified.`);
  };

  // Save Dispatch & Checkpoint modal
  const handleSaveDispatchInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDispatchOrder) return;

    const newCheckpoints = [...(editingDispatchOrder.trackingCheckpoints || [])];
    if (newCheckpointLocation.trim()) {
      newCheckpoints.push({
        id: `chk-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        location: newCheckpointLocation.trim(),
        status: newCheckpointStatus.trim() || 'In Transit via Air Cargo',
        note: `Carrier: ${selectedCarrier}`
      });
    }

    const updated: OrderDossier = {
      ...editingDispatchOrder,
      carrier: selectedCarrier,
      trackingNumber: customAwb.trim() || editingDispatchOrder.trackingNumber,
      trackingCheckpoints: newCheckpoints,
      status: editingDispatchOrder.status === 'PROCESSING' || editingDispatchOrder.status === 'CONFIRMED' ? 'SHIPPED' : editingDispatchOrder.status,
    };

    if (onUpdateOrderDossier) {
      onUpdateOrderDossier(updated);
    }
    if (updated.status !== editingDispatchOrder.status) {
      onUpdateOrderStatus(updated.orderNumber, updated.status);
    }

    setEditingDispatchOrder(null);
    setNewCheckpointLocation('');
    setNewCheckpointStatus('');
    showToast(`Logistics & Checkpoint updated for ${updated.orderNumber}`);
  };

  // Inventory Stock Adjustment Confirmation
  const handleConfirmStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingVariant) return;

    const newStock = Math.max(0, adjustingVariant.currentStock + stockDelta);
    onUpdateStock(adjustingVariant.product.id, adjustingVariant.variantId, newStock);

    const logItem: InventoryLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      productId: adjustingVariant.product.id,
      productName: adjustingVariant.product.name,
      variantId: adjustingVariant.variantId,
      variantLabel: `Variant ID: ${adjustingVariant.variantId}`,
      delta: stockDelta,
      newStock,
      reason: stockReason,
      operator: 'Founder & Master Admin (humperszk@gmail.com)'
    };
    recordStockLog(logItem);

    setAdjustingVariant(null);
    showToast(`Inventory updated: ${adjustingVariant.product.name} set to ${newStock} units`);
  };

  // Master Artisan Assignment
  const masterArtisans = [
    { name: 'Ustad Ghulam Nabi', specialty: '24k Gold Wash Tilla Zari', atelier: 'Old Srinagar River Atelier' },
    { name: 'Master Bashir Ahmad', specialty: 'Heirloom Sozni Needlework', atelier: 'Dal Lake Crafts Guild' },
    { name: 'Mirza Tariq Hussain', specialty: 'GI Changthangi Pashmina Spinning', atelier: 'Himalayan Highloom Guild' },
    { name: 'Begum Zareena', specialty: 'Pure Aari Chain-Stitch', atelier: 'Badamwari Silk Studio' },
  ];

  const handleAssignArtisan = (order: OrderDossier, artisanName: string) => {
    if (onUpdateOrderDossier) {
      const updated: OrderDossier = {
        ...order,
        artisanAssigned: artisanName,
        needleworkProgress: order.needleworkProgress || 20,
        status: order.status === 'CONFIRMED' ? 'PROCESSING' : order.status
      };
      onUpdateOrderDossier(updated);
      showToast(`Assigned Order ${order.orderNumber} to ${artisanName}`);
    }
  };

  const handleUpdateNeedleworkProgress = (order: OrderDossier, progress: number) => {
    if (onUpdateOrderDossier) {
      const updated: OrderDossier = {
        ...order,
        needleworkProgress: progress,
        status: progress >= 100 ? 'PROCESSING' : order.status
      };
      onUpdateOrderDossier(updated);
    }
  };

  // Export Daily Shipping Manifest CSV for Couriers
  const handleExportShippingManifest = () => {
    const headers = [
      'AWB Number',
      'Carrier',
      'Order Number',
      'Recipient Name',
      'Phone',
      'Address',
      'City',
      'PIN',
      'Declared Value (INR)',
      'Payment Type',
      'HSN Code',
      'Pieces Qty'
    ];

    const rows = orders
      .filter((o) => o.status === 'SHIPPED' || o.status === 'PROCESSING' || o.status === 'CONFIRMED')
      .map((o) => [
        `"${o.trackingNumber || `AWB-${o.orderNumber.replace('KASH-', '')}`}"`,
        `"${o.carrier || 'DHL Express'}"`,
        o.orderNumber,
        `"${o.shippingAddress.fullName}"`,
        `"${o.shippingAddress.phone}"`,
        `"${o.shippingAddress.streetLine1} ${o.shippingAddress.streetLine2 || ''}"`,
        `"${o.shippingAddress.city}"`,
        o.shippingAddress.postalCode,
        o.totalAmount,
        o.paymentMethod,
        '6204/6214',
        o.items.reduce((sum, i) => sum + i.quantity, 0)
      ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kashida_Daily_Shipping_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Shipping Manifest CSV generated and downloaded.');
  };

  // Export Full JSON Database Snapshot
  const handleExportDatabaseSnapshot = () => {
    const snapshot = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      storefront: 'Kāshida Couture Srinagar',
      founderAdmin: 'humperszk@gmail.com',
      orders,
      products,
      categories,
      coupons,
      paymentConfig,
      homepageConfig,
      seoConfig,
      inventoryLogs,
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Kashida_Operations_Snapshot_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Complete Store Database Snapshot downloaded securely.');
  };

  // Restore Database Snapshot from JSON file
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.orders && parsed.products) {
          if (onRestoreDatabaseSnapshot) {
            onRestoreDatabaseSnapshot(parsed);
          } else {
            localStorage.setItem('kashida_orders', JSON.stringify(parsed.orders));
            localStorage.setItem('kashida_products', JSON.stringify(parsed.products));
            if (parsed.categories) localStorage.setItem('kashida_categories', JSON.stringify(parsed.categories));
            if (parsed.homepageConfig) localStorage.setItem('kashida_homepage_config', JSON.stringify(parsed.homepageConfig));
            window.location.reload();
          }
          showToast('Database snapshot restored successfully!');
        } else {
          alert('Invalid backup file structure. Ensure this is a valid Kāshida Couture JSON snapshot.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162B21] text-[#DFC289] border border-[#C5A059] px-4 py-3 rounded-xs shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Operations Command Header Strip */}
      <div className="bg-[#162B21] text-white p-6 rounded-xs border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#DFC289] font-bold mb-1">
            <Boxes className="w-4 h-4" />
            <span>Central Operations Desk</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] tracking-tight">
            Order Fulfillment & Logistics Command
          </h2>
          <p className="text-xs text-[#FAF8F5]/80 font-light mt-1 max-w-xl">
            Real-time pipeline dispatch, Paytm QR reconciliations, Srinagar atelier production tracking, and commercial shipping label management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportShippingManifest}
            className="px-3.5 py-2 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#DFC289] border border-[#DFC289]/40 text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer flex items-center gap-2 transition-colors"
            title="Download Daily Courier Manifest for DHL & BlueDart pickup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Courier Manifest</span>
          </button>

          <button
            onClick={handleExportDatabaseSnapshot}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer flex items-center gap-2 shadow-xs transition-colors"
            title="Export complete JSON backup of all orders, inventory, and settings"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Backup Snapshot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Fulfillment SLA */}
        <div className="bg-[#FAF8F5] border border-[#EBE4D8] p-4 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-[#525B56] mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold">Pending Fulfillment</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#162B21]">
            {pendingFulfillmentCount}
          </div>
          <span className="text-[10px] text-[#525B56]">Orders awaiting packaging or courier</span>
        </div>

        {/* Paytm QR Payments to Verify */}
        <div className={`border p-4 rounded-xs shadow-xs ${pendingPaytmCount > 0 ? 'bg-[#FFF9EE] border-amber-300' : 'bg-[#FAF8F5] border-[#EBE4D8]'}`}>
          <div className="flex items-center justify-between text-[#525B56] mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6226]">Paytm QR Reconciliations</span>
            <QrCode className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#8C6226]">
            {pendingPaytmCount}
          </div>
          <span className="text-[10px] text-[#8C6226]">
            {pendingPaytmCount > 0 ? 'Requires immediate UTR verification' : 'All Paytm receipts reconciled'}
          </span>
        </div>

        {/* Dispatched & In Transit */}
        <div className="bg-[#FAF8F5] border border-[#EBE4D8] p-4 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-[#525B56] mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold">In Transit (Air Cargo)</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#162B21]">
            {dispatchedCount}
          </div>
          <span className="text-[10px] text-[#525B56]">En route via DHL & BlueDart</span>
        </div>

        {/* Total Settled Revenue */}
        <div className="bg-[#FAF8F5] border border-[#EBE4D8] p-4 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-[#525B56] mb-2">
            <span className="text-[10px] uppercase tracking-wider font-bold">Total Settled Value</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-900 font-mono">
            ₹{totalOperationsRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700">Verified collections in atelier ledger</span>
        </div>
      </div>

      {/* Sub-Navigation Ribbon */}
      <div className="flex items-center gap-2 border-b border-[#EBE4D8] pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSubTab('fulfillment')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[3px] ${
            subTab === 'fulfillment'
              ? 'border-[#C5A059] text-[#162B21] font-bold'
              : 'border-transparent text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Fulfillment Pipeline ({filteredOrders.length})</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab('paytm_reconciliation')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[3px] ${
            subTab === 'paytm_reconciliation'
              ? 'border-[#C5A059] text-[#162B21] font-bold'
              : 'border-transparent text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            <span>Paytm QR Ledger ({pendingPaytmCount} Pending)</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab('artisan_production')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[3px] ${
            subTab === 'artisan_production'
              ? 'border-[#C5A059] text-[#162B21] font-bold'
              : 'border-transparent text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span>Atelier Production Work Orders</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab('inventory_logistics')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[3px] ${
            subTab === 'inventory_logistics'
              ? 'border-[#C5A059] text-[#162B21] font-bold'
              : 'border-transparent text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            <span>Warehouse Stock & Audit Log</span>
          </div>
        </button>

        <button
          onClick={() => setSubTab('backup_tools')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[3px] ${
            subTab === 'backup_tools'
              ? 'border-[#C5A059] text-[#162B21] font-bold'
              : 'border-transparent text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Data Continuity & Snapshots</span>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: FULFILLMENT & SHIPPING PIPELINE */}
      {/* ========================================================= */}
      {subTab === 'fulfillment' && (
        <div className="space-y-6">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4 border border-[#EBE4D8] rounded-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search by Order #, Patron Name, Phone, City, Tracking AWB, or Paytm UTR..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#EBE4D8] text-xs focus:outline-none focus:border-[#C5A059] rounded-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-[#EBE4D8] text-xs uppercase font-medium focus:outline-none focus:border-[#C5A059] rounded-xs cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending (New)</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">In Atelier Processing</option>
                <option value="SHIPPED">Shipped (In Transit)</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-[#EBE4D8] text-xs uppercase font-medium focus:outline-none focus:border-[#C5A059] rounded-xs cursor-pointer"
              >
                <option value="ALL">All Payment Types</option>
                <option value="PAYTM_QR">Paytm UPI / QR</option>
                <option value="RAZORPAY">Razorpay Card / NetBanking</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] border border-dashed border-[#EBE4D8] rounded-xs space-y-3">
              <Package className="w-10 h-10 text-[#C5A059] mx-auto opacity-50" />
              <p className="font-serif text-lg text-[#162B21]">No matching orders found in operations queue</p>
              <p className="text-xs text-[#525B56]">Try clearing filters or search criteria.</p>
            </div>
          ) : (
            <div className="border border-[#EBE4D8] bg-white rounded-xs overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EBE4D8] text-[10px] uppercase tracking-wider text-[#525B56] font-bold">
                      <th className="p-3.5">Order Dossier</th>
                      <th className="p-3.5">Consignee Patron</th>
                      <th className="p-3.5">Items & Needlework</th>
                      <th className="p-3.5">Payment & UTR</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5">Logistics & AWB</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EDE4]">
                    {filteredOrders.map((order) => {
                      const isPaytm = order.paymentMethod === 'PAYTM_QR';
                      const isPaid = order.paymentStatus === 'PAID';

                      return (
                        <tr key={order.orderNumber} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          {/* Order Number & Timestamp */}
                          <td className="p-3.5 align-top">
                            <span className="font-mono font-bold text-sm text-[#162B21] block">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] text-[#525B56] block">
                              {order.createdAt}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-black mt-1 block">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Patron & Destination */}
                          <td className="p-3.5 align-top max-w-xs">
                            <span className="font-bold text-[#162B21] block">
                              {order.shippingAddress.fullName}
                            </span>
                            <span className="text-[11px] text-[#525B56] block">
                              {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono block">
                              📞 {order.shippingAddress.phone}
                            </span>
                          </td>

                          {/* Items Preview */}
                          <td className="p-3.5 align-top">
                            <div className="space-y-1">
                              {order.items.map((i, idx) => (
                                <div key={idx} className="text-[11px] leading-tight">
                                  <span className="font-semibold text-[#162B21]">{i.product.name}</span>
                                  <span className="text-[10px] text-neutral-500 block">
                                    Size: {i.size} · Color: {i.color} · Qty: {i.quantity}
                                  </span>
                                </div>
                              ))}
                              {order.artisanAssigned && (
                                <span className="inline-flex items-center gap-1 text-[9px] text-[#8C6226] bg-[#FFF9EE] border border-amber-200 px-1.5 py-0.5 rounded-xs mt-1">
                                  <Scissors className="w-3 h-3" />
                                  <span>{order.artisanAssigned}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Payment & UTR */}
                          <td className="p-3.5 align-top">
                            {isPaytm ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#002E6E] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-xs">
                                  <QrCode className="w-3 h-3" />
                                  <span>Paytm QR</span>
                                </span>
                                {order.paytmUtr ? (
                                  <div className="text-[10px] font-mono text-[#162B21] bg-neutral-100 p-1 border border-neutral-300 rounded-xs">
                                    UTR: <strong className="select-all">{order.paytmUtr}</strong>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-red-700 italic block">No UTR Provided</span>
                                )}
                                {order.paytmVerified ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 font-bold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>UTR Verified</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleVerifyPaytmUtr(order)}
                                    className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 border border-amber-300 rounded-xs cursor-pointer block mt-1"
                                  >
                                    Verify UTR Now →
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-800 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded-xs">
                                  {order.paymentMethod}
                                </span>
                                <span className={`text-[10px] font-bold block mt-1 ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  {isPaid ? '● PAID' : '○ PENDING'}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Fulfillment Status */}
                          <td className="p-3.5 align-top">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.orderNumber, e.target.value as OrderStatus)}
                              className={`p-1 text-[11px] font-bold uppercase rounded-xs border cursor-pointer focus:outline-none ${
                                order.status === 'DELIVERED'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : order.status === 'SHIPPED'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : order.status === 'PROCESSING'
                                  ? 'bg-purple-50 text-purple-900 border-purple-300'
                                  : order.status === 'CONFIRMED'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PROCESSING">PROCESSING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>

                            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleAdvanceStatus(order)}
                                className="text-[10px] text-[#C5A059] hover:text-[#162B21] font-semibold flex items-center gap-0.5 mt-1 cursor-pointer"
                                title="Advance to next step in fulfillment pipeline"
                              >
                                <span>Advance Step</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </td>

                          {/* Logistics & AWB */}
                          <td className="p-3.5 align-top">
                            <span className="text-[11px] font-semibold text-[#162B21] block">
                              {order.carrier || 'DHL Express Air'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-600 block">
                              {order.trackingNumber || 'Awaiting Dispatch'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingDispatchOrder(order);
                                setSelectedCarrier(order.carrier || 'DHL Express Worldwide');
                                setCustomAwb(order.trackingNumber || '');
                              }}
                              className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Update Tracking</span>
                            </button>
                          </td>

                          {/* Quick Action Tools */}
                          <td className="p-3.5 align-top text-right space-y-1">
                            <button
                              onClick={() => setPrintingOrder(order)}
                              className="px-2.5 py-1 bg-[#162B21] hover:bg-[#234233] text-[#DFC289] text-[10px] uppercase font-bold rounded-xs cursor-pointer flex items-center gap-1.5 ml-auto transition-colors"
                              title="Generate Printable Commercial Invoice & Shipping Label"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Label / Slip</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PAYTM QR PAYMENT RECONCILIATION LEDGER */}
      {/* ========================================================= */}
      {subTab === 'paytm_reconciliation' && (
        <div className="space-y-6">
          <div className="bg-[#FFF9EE] border border-amber-300 p-5 rounded-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>Dedicated Paytm QR & UPI Reconciliation Ledger</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Patrons who checkout via Paytm QR transfer directly into merchant VPA <strong className="font-mono">{paymentConfig.paytmUpiId || 'humperszk@paytm'}</strong> and submit their 12-digit bank UTR reference. Verify the receipt in your merchant bank app and 1-click verify below to release the order to the Srinagar atelier.
            </p>
          </div>

          <div className="border border-[#EBE4D8] bg-white rounded-xs overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE4D8] text-[10px] uppercase font-bold text-[#525B56]">
                  <th className="p-3.5">Order Number</th>
                  <th className="p-3.5">Patron Consignee</th>
                  <th className="p-3.5">Amount (INR)</th>
                  <th className="p-3.5">Submitted Bank UTR / Ref</th>
                  <th className="p-3.5">Reconciliation Status</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4]">
                {paytmOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-500">
                      No Paytm QR orders have been placed yet.
                    </td>
                  </tr>
                ) : (
                  paytmOrders.map((order) => (
                    <tr key={order.orderNumber} className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-mono font-bold text-[#162B21]">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#162B21] block">{order.shippingAddress.fullName}</span>
                        <span className="text-[10px] text-neutral-500">{order.shippingAddress.phone}</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-base text-[#162B21]">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-mono">
                        {order.paytmUtr ? (
                          <span className="p-1.5 bg-neutral-100 border border-neutral-300 text-xs font-bold block select-all">
                            {order.paytmUtr}
                          </span>
                        ) : (
                          <span className="text-red-700 italic text-[11px]">Pending submission</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {order.paytmVerified ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified & Settled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Needs Merchant Check</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {!order.paytmVerified ? (
                          <>
                            <button
                              onClick={() => handleVerifyPaytmUtr(order)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xs cursor-pointer shadow-xs"
                            >
                              ✓ Verify & Approve
                            </button>
                            <button
                              onClick={() => handleFlagPaytmDiscrepancy(order)}
                              className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 text-xs font-medium rounded-xs cursor-pointer"
                            >
                              Flag Error
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-neutral-500 italic">Settled to Atelier Ledger</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ATELIER PRODUCTION WORK ORDERS */}
      {/* ========================================================= */}
      {subTab === 'artisan_production' && (
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] border border-[#EBE4D8] p-5 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#162B21]">
                Srinagar Atelier Guild Production Tracking
              </h3>
              <p className="text-xs text-[#525B56]">
                Assign orders to master weavers and monitor manual needlework completion progress.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#8C6226]">Active Guild Masters: 4</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {masterArtisans.map((artisan, idx) => (
              <div key={idx} className="bg-white border border-[#EBE4D8] p-4 rounded-xs shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center font-bold text-xs">
                  {artisan.name.slice(0, 2)}
                </div>
                <h4 className="font-serif text-sm font-bold text-[#162B21]">{artisan.name}</h4>
                <p className="text-[11px] text-[#C5A059] font-medium">{artisan.specialty}</p>
                <p className="text-[10px] text-[#525B56]">{artisan.atelier}</p>
              </div>
            ))}
          </div>

          {/* Work Orders List */}
          <div className="border border-[#EBE4D8] bg-white rounded-xs overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE4D8] text-[10px] uppercase font-bold text-[#525B56]">
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Piece & Fabric</th>
                  <th className="p-3.5">Assigned Master Artisan</th>
                  <th className="p-3.5">Needlework Progress</th>
                  <th className="p-3.5 text-right">Production Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4]">
                {orders.map((order) => {
                  const currentProgress = order.needleworkProgress || 20;

                  return (
                    <tr key={order.orderNumber} className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-mono font-bold text-[#162B21]">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-[#162B21]">
                          {order.items.map((i) => i.product.name).join(', ')}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          Patron: {order.shippingAddress.fullName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={order.artisanAssigned || ''}
                          onChange={(e) => handleAssignArtisan(order, e.target.value)}
                          className="p-1 border border-[#EBE4D8] text-xs bg-white rounded-xs cursor-pointer focus:outline-none focus:border-[#C5A059]"
                        >
                          <option value="">Select Master Artisan...</option>
                          {masterArtisans.map((a, i) => (
                            <option key={i} value={a.name}>
                              {a.name} ({a.specialty.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>Crafting Completion:</span>
                            <span className="font-bold">{currentProgress}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={currentProgress}
                            onChange={(e) => handleUpdateNeedleworkProgress(order, Number(e.target.value))}
                            className="w-36 accent-[#162B21] cursor-pointer"
                          />
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            handleUpdateNeedleworkProgress(order, 100);
                            onUpdateOrderStatus(order.orderNumber, 'PROCESSING');
                            showToast(`Needlework for Order ${order.orderNumber} completed by master artisan!`);
                          }}
                          className="px-2.5 py-1 bg-[#162B21] text-[#DFC289] text-[10px] uppercase font-bold rounded-xs hover:bg-[#234233] cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: WAREHOUSE STOCK & AUDIT LOG */}
      {/* ========================================================= */}
      {subTab === 'inventory_logistics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF8F5] p-4 border border-[#EBE4D8] rounded-xs">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#162B21]">
                Real-Time Warehouse Stock & Audit Ledger
              </h3>
              <p className="text-xs text-[#525B56]">
                Adjust live warehouse inventory with verified audit logging and operator attribution.
              </p>
            </div>
            <button
              onClick={() => {
                const p = products[0];
                const v = p?.variants[0];
                if (p && v) {
                  setAdjustingVariant({ product: p, variantId: v.id, currentStock: v.stockCount });
                }
              }}
              className="px-4 py-2 bg-[#162B21] text-[#DFC289] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer hover:bg-[#234233] flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Stock Replenishment</span>
            </button>
          </div>

          {/* Catalog Stock Matrix */}
          <div className="border border-[#EBE4D8] bg-white rounded-xs overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE4D8] text-[10px] uppercase font-bold text-[#525B56]">
                  <th className="p-3.5">Product Heirloom</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Variant & SKU</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Stock Status</th>
                  <th className="p-3.5 text-right">Instant Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4]">
                {products.map((prod) =>
                  prod.variants.map((v) => (
                    <tr key={`${prod.id}-${v.id}`} className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3.5 font-semibold text-[#162B21]">
                        {prod.name}
                      </td>
                      <td className="p-3.5 uppercase text-[10px] text-[#525B56]">
                        {prod.category}
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        {v.size} / {v.color} ({v.sku})
                      </td>
                      <td className="p-3.5 font-mono font-bold text-sm">
                        {v.stockCount} units
                      </td>
                      <td className="p-3.5">
                        {v.stockCount <= 0 ? (
                          <span className="text-red-700 font-bold text-[10px] uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded-xs">
                            Out of Stock
                          </span>
                        ) : v.stockCount <= 2 ? (
                          <span className="text-amber-800 font-bold text-[10px] uppercase bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs">
                            Low Stock Warning
                          </span>
                        ) : (
                          <span className="text-emerald-800 font-bold text-[10px] uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs">
                            In Atelier Ready
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setAdjustingVariant({ product: prod, variantId: v.id, currentStock: v.stockCount })}
                          className="px-2.5 py-1 border border-[#EBE4D8] hover:border-[#C5A059] bg-[#FAF8F5] text-xs font-semibold rounded-xs cursor-pointer"
                        >
                          Adjust Stock →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Audit Logs */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#162B21] font-bold">
              Inventory Movement Audit Trail
            </h4>
            <div className="border border-[#EBE4D8] bg-white rounded-xs overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE4D8] text-[10px] uppercase font-bold text-[#525B56]">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Product & Variant</th>
                    <th className="p-3">Delta</th>
                    <th className="p-3">New Balance</th>
                    <th className="p-3">Operational Reason</th>
                    <th className="p-3 text-right">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4] font-mono text-[11px]">
                  {inventoryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF8F5]/80">
                      <td className="p-3 text-neutral-500">{log.timestamp}</td>
                      <td className="p-3 font-sans font-semibold text-[#162B21]">
                        {log.productName} ({log.variantLabel})
                      </td>
                      <td className={`p-3 font-bold ${log.delta > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {log.delta > 0 ? `+${log.delta}` : log.delta}
                      </td>
                      <td className="p-3 font-bold">{log.newStock}</td>
                      <td className="p-3 font-sans text-neutral-700">{log.reason}</td>
                      <td className="p-3 text-right font-sans text-neutral-500">{log.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: BACKUP & DATA CONTINUITY TOOLS */}
      {/* ========================================================= */}
      {subTab === 'backup_tools' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Snapshot Card */}
            <div className="bg-white border border-[#EBE4D8] p-6 rounded-xs shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xs bg-[#162B21] text-[#DFC289] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#162B21]">
                Export Storefront & Operations Snapshot
              </h3>
              <p className="text-xs text-[#525B56] leading-relaxed">
                Download a clean, structured JSON file containing all orders, products, variants, categories, homepage CMS configurations, audit logs, and gateway settings.
              </p>
              <button
                onClick={handleExportDatabaseSnapshot}
                className="w-full py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#DFC289] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Database JSON Snapshot</span>
              </button>
            </div>

            {/* Restore Snapshot Card */}
            <div className="bg-white border border-[#EBE4D8] p-6 rounded-xs shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xs bg-amber-100 text-amber-900 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#162B21]">
                Restore Snapshot from JSON File
              </h3>
              <p className="text-xs text-[#525B56] leading-relaxed">
                Restore previous store states, orders, and catalog items instantly by uploading an exported Kāshida Couture JSON snapshot file.
              </p>
              <label className="w-full py-2.5 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>Select Snapshot File to Restore</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DISPATCH & LIVE CHECKPOINTS UPDATER */}
      {/* ========================================================= */}
      {editingDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 rounded-xs shadow-2xl border border-[#EBE4D8] space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#162B21]">
                  Update Logistics & Air Waybill
                </h3>
                <span className="text-xs text-[#525B56]">
                  Order Ref: <strong className="font-mono text-black">{editingDispatchOrder.orderNumber}</strong>
                </span>
              </div>
              <button
                onClick={() => setEditingDispatchOrder(null)}
                className="text-neutral-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatchInfo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#162B21] block">
                  Designated Courier Partner
                </label>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="DHL Express Worldwide">DHL Express Worldwide (Air Priority)</option>
                  <option value="Blue Dart Apex Express">Blue Dart Apex Express (Domestic Air)</option>
                  <option value="Delhivery Express Air">Delhivery Express Air</option>
                  <option value="FedEx International Priority">FedEx International Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#162B21] block">
                  Carrier Air Waybill (AWB) Tracking Number
                </label>
                <input
                  type="text"
                  value={customAwb}
                  onChange={(e) => setCustomAwb(e.target.value)}
                  placeholder="e.g. DHL-849201992-IN"
                  className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="border-t border-[#EBE4D8] pt-3 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C6226] block">
                  Add Live In-Transit Checkpoint:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-600 block">Hub / Airport Location</label>
                    <input
                      type="text"
                      value={newCheckpointLocation}
                      onChange={(e) => setNewCheckpointLocation(e.target.value)}
                      placeholder="e.g. Srinagar Airport Cargo Terminal"
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-600 block">Checkpoint Status</label>
                    <input
                      type="text"
                      value={newCheckpointStatus}
                      onChange={(e) => setNewCheckpointStatus(e.target.value)}
                      placeholder="e.g. Cleared Custom Air Security"
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setEditingDispatchOrder(null)}
                  className="px-4 py-2 border border-[#EBE4D8] text-xs uppercase font-medium hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#162B21] text-[#DFC289] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer hover:bg-[#234233]"
                >
                  Save Dispatch & Notify Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: STOCK REPLENISHMENT ADJUSTER */}
      {/* ========================================================= */}
      {adjustingVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-xs shadow-2xl border border-[#EBE4D8] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#162B21]">
                Adjust Warehouse Inventory
              </h3>
              <button
                onClick={() => setAdjustingVariant(null)}
                className="text-neutral-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmStockAdjustment} className="space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-1">
                <span className="font-bold text-[#162B21] block">{adjustingVariant.product.name}</span>
                <span className="text-[11px] text-neutral-600 block">
                  Current Balance: <strong className="font-mono text-black">{adjustingVariant.currentStock} units</strong>
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#162B21] block">
                  Stock Units Adjustment (Delta)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={stockDelta}
                    onChange={(e) => setStockDelta(Number(e.target.value))}
                    className="w-28 p-2 border border-[#EBE4D8] bg-[#FAF8F5] font-mono text-sm font-bold text-center focus:outline-none focus:border-[#C5A059]"
                  />
                  <span className="text-xs text-neutral-600">
                    New Balance: <strong className="font-mono text-emerald-800 text-sm">{Math.max(0, adjustingVariant.currentStock + stockDelta)} units</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#162B21] block">
                  Operational Reason for Audit
                </label>
                <select
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Srinagar Loom Batch Received">Srinagar Loom Batch Received</option>
                  <option value="Returned Item Inspected & Restocked">Returned Item Inspected & Restocked</option>
                  <option value="Damaged during Quality Control">Damaged during Quality Control</option>
                  <option value="Allocated to Bridal Trousseau Commission">Allocated to Bridal Trousseau Commission</option>
                  <option value="Physical Inventory Count Reconciled">Physical Inventory Count Reconciled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EBE4D8]">
                <button
                  type="button"
                  onClick={() => setAdjustingVariant(null)}
                  className="px-4 py-2 border border-[#EBE4D8] text-xs uppercase font-medium hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#162B21] text-[#DFC289] text-xs uppercase tracking-wider font-bold rounded-xs cursor-pointer hover:bg-[#234233]"
                >
                  Update & Inscribe to Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRINTABLE LABEL & INVOICE MODAL */}
      {/* ========================================================= */}
      {printingOrder && (
        <ShippingLabelModal
          order={printingOrder}
          onClose={() => setPrintingOrder(null)}
        />
      )}
    </div>
  );
};
