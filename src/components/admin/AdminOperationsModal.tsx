import React, { useState } from 'react';
import {
  X,
  Shield,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Printer,
  Tag,
  Star,
  Check,
  Megaphone,
  Eye,
  Lock,
  Unlock,
  Filter,
} from 'lucide-react';
import {
  OrderDossier,
  OrderStatus,
  Product,
  Coupon,
  Review,
  ProductCategory,
} from '../../types';

interface AdminOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderDossier[];
  products: Product[];
  coupons: Coupon[];
  announcementText: string;
  onUpdateAnnouncement: (text: string) => void;
  onUpdateOrderStatus: (orderNumber: string, newStatus: OrderStatus) => void;
  onUpdateStock: (productId: string, variantId: string, newStock: number) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCoupon: (newCoupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  onModerateReview: (productId: string, reviewId: string, action: 'delete' | 'toggle-verify') => void;
}

export const AdminOperationsModal: React.FC<AdminOperationsModalProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  coupons,
  announcementText,
  onUpdateAnnouncement,
  onUpdateOrderStatus,
  onUpdateStock,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCoupon,
  onDeleteCoupon,
  onModerateReview,
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'orders' | 'products' | 'inventory' | 'patrons' | 'coupons' | 'reviews'
  >('analytics');

  // Security Lock / Pin state for testing admin gate
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Orders Filter & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderDossier | null>(null);
  const [isPrintingInvoice, setIsPrintingInvoice] = useState<OrderDossier | null>(null);

  // Product Filter & Edit Form state
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('pherans');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdCraftsmanship, setNewProdCraftsmanship] = useState('');
  const [newProdCareGuide, setNewProdCareGuide] = useState('');
  const [newProdBasePrice, setNewProdBasePrice] = useState(32000);
  const [newProdDiscount, setNewProdDiscount] = useState(0);
  const [newProdFabric, setNewProdFabric] = useState('Pure Mulberry Silk Velvet');
  const [newProdEmbroidery, setNewProdEmbroidery] = useState('Tilla Metallic Zari');
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/product_velvet_pheran_1794059618066.jpg');

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(25000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Announcement Banner form
  const [bannerInput, setBannerInput] = useState(announcementText);
  const [bannerSavedToast, setBannerSavedToast] = useState(false);

  if (!isOpen) return null;

  // Handle PIN unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1500' || pinInput.toLowerCase() === 'admin') {
      setIsLocked(false);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // CSV Export for Orders
  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'City', 'Total Amount', 'Status', 'Payment Method'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.createdAt}"`,
      `"${o.shippingAddress.fullName}"`,
      `"${o.shippingAddress.email}"`,
      `"${o.shippingAddress.city}"`,
      o.totalAmount,
      o.status,
      o.paymentMethod,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kashida_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export for Inventory
  const exportInventoryCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Variant Size', 'Variant Color', 'Stock Count', 'Base Price'];
    const rows: string[][] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        rows.push([p.id, `"${p.name}"`, p.category, v.size, v.color, String(v.stockCount), String(p.basePrice)]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kashida_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Product Form Submission
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const slug = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      id: `kash-${Date.now().toString().slice(-4)}`,
      slug,
      name: newProdName.trim(),
      subtitle: newProdSubtitle.trim() || 'Handcrafted Kashmiri Couture',
      category: newProdCategory,
      description: newProdDescription.trim() || 'Handcrafted bespoke piece made by Srinagar master artisans.',
      craftsmanship: newProdCraftsmanship.trim() || 'Needlepoint craft using heirloom techniques.',
      careGuide: newProdCareGuide.trim() || 'Dry clean only by luxury textile specialists.',
      basePrice: Number(newProdBasePrice) || 30000,
      discountPercent: Number(newProdDiscount) || 0,
      rating: 5.0,
      reviewsCount: 0,
      isFeatured: true,
      isNewArrival: true,
      fabric: newProdFabric,
      embroidery: newProdEmbroidery,
      occasions: ['Formal Festive', 'Royal Gala'],
      primaryImage: newProdImage,
      galleryImages: [newProdImage],
      variants: [
        { id: `v-${Date.now()}-s`, sku: `${slug.slice(0, 3).toUpperCase()}-S`, color: 'Artisan Original', colorHex: '#162B21', size: 'S', stockCount: 3, priceDelta: 0 },
        { id: `v-${Date.now()}-m`, sku: `${slug.slice(0, 3).toUpperCase()}-M`, color: 'Artisan Original', colorHex: '#162B21', size: 'M', stockCount: 4, priceDelta: 0 },
        { id: `v-${Date.now()}-l`, sku: `${slug.slice(0, 3).toUpperCase()}-L`, color: 'Artisan Original', colorHex: '#162B21', size: 'L', stockCount: 2, priceDelta: 0 },
      ],
      reviews: [],
    };

    onAddProduct(newProduct);
    setIsAddProductOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdDescription('');
  };

  // Save Edit Product
  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Add Coupon Submission
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const code = newCouponCode.trim().toUpperCase();
    onAddCoupon({
      code,
      discountPercent: Number(newCouponDiscount),
      minSpend: Number(newCouponMinSpend),
      description: newCouponDesc.trim() || `${newCouponDiscount}% Privilege on Curations above ₹${newCouponMinSpend}`,
    });

    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Save Announcement Bar
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncement(bannerInput);
    setBannerSavedToast(true);
    setTimeout(() => setBannerSavedToast(false), 2500);
  };

  // Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  
  // Unique Patrons
  const uniquePatronsMap = new Map<string, { name: string; email: string; phone: string; city: string; totalSpent: number; orderCount: number }>();
  orders.forEach((o) => {
    const key = o.shippingAddress.email.toLowerCase();
    const existing = uniquePatronsMap.get(key);
    if (existing) {
      existing.totalSpent += o.totalAmount;
      existing.orderCount += 1;
    } else {
      uniquePatronsMap.set(key, {
        name: o.shippingAddress.fullName,
        email: o.shippingAddress.email,
        phone: o.shippingAddress.phone,
        city: o.shippingAddress.city,
        totalSpent: o.totalAmount,
        orderCount: 1,
      });
    }
  });
  const patronsList = Array.from(uniquePatronsMap.values());

  // Low stock calculation
  const lowStockVariants: { product: Product; variantId: string; size: string; color: string; stock: number }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stockCount <= 2) {
        lowStockVariants.push({
          product: p,
          variantId: v.id,
          size: v.size,
          color: v.color,
          stock: v.stockCount,
        });
      }
    });
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.shippingAddress.fullName.toLowerCase().includes(q) ||
        o.shippingAddress.email.toLowerCase().includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered products in catalog
  const filteredProducts = products.filter((p) => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.embroidery.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // All reviews across all products
  const allReviewsList: { product: Product; review: Review }[] = [];
  products.forEach((p) => {
    p.reviews.forEach((r) => {
      allReviewsList.push({ product: p, review: r });
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        className="relative w-full max-w-6xl bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl rounded-xs overflow-hidden my-auto flex flex-col h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Operations Header */}
        <div className="p-4 sm:p-5 bg-[#162B21] text-[#FAF8F5] flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#DFC289]/15 border border-[#DFC289]/40 flex items-center justify-center text-[#DFC289] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl text-[#FAF8F5] leading-none">
                  Kāshida Atelier Operations & Governance
                </h2>
                <span className="hidden sm:inline-block text-[10px] bg-[#DFC289]/20 text-[#DFC289] px-2 py-0.5 rounded-xs font-mono">
                  v2.4 Couture Suite
                </span>
              </div>
              <p className="text-[11px] text-[#DFC289] uppercase tracking-wider mt-0.5">
                Master Curator Role (Admin) · Srinagar Atelier Headquarters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Session Lock Toggle */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-xs text-[#DFC289] border border-[#DFC289]/30 rounded-xs cursor-pointer transition-colors"
              title="Lock Admin Session"
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isLocked ? 'Locked' : 'Session Active'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#FAF8F5]/80 hover:text-[#FAF8F5] cursor-pointer"
              aria-label="Close admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Locked Screen Overlay if PIN locked */}
        {isLocked ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#FAF8F5]">
            <form onSubmit={handleUnlock} className="max-w-sm w-full p-8 bg-[#F2EDE4]/60 border border-[#EBE4D8] shadow-lg rounded-xs text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#162B21] text-[#DFC289] flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#162B21]">Atelier Console Locked</h3>
              <p className="text-xs text-[#525B56]">
                Enter master curator PIN (Default Demo PIN: <strong className="text-[#162B21] font-mono">1500</strong>)
              </p>

              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN..."
                className="w-full text-center text-lg tracking-widest font-mono p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
              />

              {pinError && <p className="text-xs text-[#681A24]">Invalid PIN. Use 1500.</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Primary Navigation Tabs */}
            <div className="bg-[#F2EDE4] px-4 sm:px-6 py-2 border-b border-[#EBE4D8] flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-wider font-semibold text-[#525B56] overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'analytics' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                Executive KPIs
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'orders' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                <span>Orders & Fulfillment</span>
                <span className="bg-[#162B21] text-[#FAF8F5] text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'products' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                Catalog & Products ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'inventory' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                <span>Inventory Control</span>
                {lowStockVariants.length > 0 && (
                  <span className="bg-[#681A24] text-[#FAF8F5] text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                    {lowStockVariants.length} Low
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('patrons')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'patrons' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                Patrons & Clients ({patronsList.length})
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'coupons' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                Coupons & Banners
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'reviews' ? 'text-[#162B21] border-b-2 border-[#162B21]' : 'hover:text-[#162B21]'
                }`}
              >
                Reviews Moderation ({allReviewsList.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* ===================== TAB 1: EXECUTIVE ANALYTICS ===================== */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* KPI Cards Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#525B56] flex items-center gap-1 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" /> Gross Revenue (YTD)
                      </span>
                      <p className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium">+24.8% vs last quarter</p>
                    </div>

                    <div className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#525B56] flex items-center gap-1 font-semibold">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" /> Total Commissions
                      </span>
                      <p className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                        {orders.length}
                      </p>
                      <p className="text-[11px] text-[#525B56]">100% Razorpay Authenticated</p>
                    </div>

                    <div className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#525B56] flex items-center gap-1 font-semibold">
                        <Package className="w-3.5 h-3.5 text-[#C5A059]" /> Average Order Value
                      </span>
                      <p className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                        ₹{averageOrderValue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-[#525B56]">Haute Luxury Basket</p>
                    </div>

                    <div className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#525B56] flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-[#C5A059]" /> Srinagar Guild Network
                      </span>
                      <p className="font-mono text-2xl font-semibold text-[#162B21] tabular-nums">
                        120+
                      </p>
                      <p className="text-[11px] text-[#525B56]">Generational Master Ustads</p>
                    </div>
                  </div>

                  {/* Revenue by Silhouette Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
                      <h4 className="font-serif text-base text-[#162B21] font-semibold">
                        Revenue Contribution by Craft Silhouette
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between text-[#162B21] mb-1">
                            <span>Velvet & Wool Pherans (Tilla & Aari)</span>
                            <span className="font-mono font-semibold">48%</span>
                          </div>
                          <div className="w-full bg-[#EBE4D8] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#162B21] h-full w-[48%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#162B21] mb-1">
                            <span>GI Changthangi Pashmina Shawls</span>
                            <span className="font-mono font-semibold">32%</span>
                          </div>
                          <div className="w-full bg-[#EBE4D8] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#C5A059] h-full w-[32%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#162B21] mb-1">
                            <span>Raw Silk Chanderi Kurtas</span>
                            <span className="font-mono font-semibold">14%</span>
                          </div>
                          <div className="w-full bg-[#EBE4D8] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#525B56] h-full w-[14%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#162B21] mb-1">
                            <span>Silk Stoles & Pampore Saffron Elixirs</span>
                            <span className="font-mono font-semibold">6%</span>
                          </div>
                          <div className="w-full bg-[#EBE4D8] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#681A24] h-full w-[6%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
                      <h4 className="font-serif text-base text-[#162B21] font-semibold">
                        Atelier Quick Operations & Export
                      </h4>
                      <p className="text-xs text-[#525B56] leading-relaxed">
                        Download official ledger reports for tax compliance, weaver guild disbursement, and logistics reconciliation.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={exportOrdersCSV}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#DFC289]" />
                          <span>Export Orders CSV</span>
                        </button>

                        <button
                          onClick={exportInventoryCSV}
                          className="flex items-center justify-center gap-2 px-4 py-3 border border-[#EBE4D8] hover:border-[#C5A059] bg-[#FAF8F5] text-[#162B21] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#C5A059]" />
                          <span>Export Inventory CSV</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== TAB 2: ORDERS MANAGEMENT ===================== */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Controls: Search, Filter, Export */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search Order #, Patron Name, City..."
                          className="w-full pl-9 pr-3 py-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#1C1F1E] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <button
                      onClick={exportOrdersCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#EBE4D8] hover:border-[#C5A059] text-xs uppercase tracking-wider text-[#162B21] bg-[#FAF8F5] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Download CSV</span>
                    </button>
                  </div>

                  {/* Orders Table */}
                  <div className="border border-[#EBE4D8] rounded-xs overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F2EDE4] text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                          <th className="py-3 px-4">Order ID & Date</th>
                          <th className="py-3 px-4">Patron & Destination</th>
                          <th className="py-3 px-4">Piece(s)</th>
                          <th className="py-3 px-4">Total Settled</th>
                          <th className="py-3 px-4">Status & Action</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBE4D8] bg-[#FAF8F5]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs text-[#525B56]">
                              No orders found matching your search.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.orderNumber} className="hover:bg-[#F2EDE4]/30">
                              <td className="py-3 px-4 font-mono font-semibold text-[#162B21]">
                                {ord.orderNumber}
                                <span className="block text-[10px] text-[#525B56] font-normal">
                                  {ord.createdAt}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-medium text-[#162B21] block">
                                  {ord.shippingAddress.fullName}
                                </span>
                                <span className="text-[11px] text-[#525B56]">
                                  {ord.shippingAddress.city}, {ord.shippingAddress.country}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-mono tabular-nums">{ord.items.length} item(s)</span>
                                <span className="block text-[10px] text-[#525B56] truncate max-w-[140px]">
                                  {ord.items.map((i) => i.product.name).join(', ')}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#162B21]">
                                ₹{ord.totalAmount.toLocaleString('en-IN')}
                                <span className="block text-[10px] text-[#525B56] font-normal uppercase">
                                  {ord.paymentMethod}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <select
                                  value={ord.status}
                                  onChange={(e) =>
                                    onUpdateOrderStatus(ord.orderNumber, e.target.value as OrderStatus)
                                  }
                                  className="p-1 border border-[#EBE4D8] bg-[#FAF8F5] text-xs font-medium text-[#1C1F1E] focus:outline-none focus:border-[#C5A059] cursor-pointer"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                  <option value="REFUNDED">REFUNDED</option>
                                </select>
                              </td>

                              <td className="py-3 px-4 flex items-center gap-2 pt-4">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="p-1.5 hover:bg-[#F2EDE4] text-[#162B21] rounded-xs cursor-pointer"
                                  title="View Full Dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setIsPrintingInvoice(ord)}
                                  className="p-1.5 hover:bg-[#F2EDE4] text-[#C5A059] rounded-xs cursor-pointer"
                                  title="Print Packing Slip"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== TAB 3: CATALOG & PRODUCT MANAGEMENT ===================== */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search Catalog by title, needlework, fabric..."
                        className="w-full pl-9 pr-3 py-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddProductOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-[#DFC289]" />
                      <span>Commission New Piece</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="border border-[#EBE4D8] rounded-xs overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F2EDE4] text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                          <th className="py-3 px-4">Preview</th>
                          <th className="py-3 px-4">Title & Subtitle</th>
                          <th className="py-3 px-4">Category & Needlework</th>
                          <th className="py-3 px-4">Base Price</th>
                          <th className="py-3 px-4">Discount</th>
                          <th className="py-3 px-4">Flags</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBE4D8] bg-[#FAF8F5]">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F2EDE4]/30">
                            <td className="py-3 px-4">
                              <img
                                src={p.primaryImage}
                                alt=""
                                className="w-12 h-16 object-cover border border-[#EBE4D8] rounded-xs"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-serif text-sm font-semibold text-[#162B21] block">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-[#525B56] line-clamp-1">
                                {p.subtitle}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#525B56]">
                              <span className="uppercase font-semibold text-[#162B21] block">{p.category}</span>
                              <span className="text-[11px]">{p.embroidery}</span>
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums font-semibold text-[#162B21]">
                              ₹{p.basePrice.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums">
                              {p.discountPercent > 0 ? (
                                <span className="text-[#681A24] font-semibold">{p.discountPercent}% Off</span>
                              ) : (
                                <span className="text-[#525B56]/50">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                {p.isFeatured && (
                                  <span className="text-[9px] bg-[#162B21] text-[#DFC289] px-1.5 py-0.5 rounded-xs">
                                    Featured
                                  </span>
                                )}
                                {p.isNewArrival && (
                                  <span className="text-[9px] bg-[#C5A059] text-[#FAF8F5] px-1.5 py-0.5 rounded-xs">
                                    New
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 flex items-center gap-2 pt-4">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 hover:bg-[#F2EDE4] text-[#162B21] rounded-xs cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove "${p.name}" from catalog?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-[#F2EDE4] text-[#681A24] rounded-xs cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== TAB 4: INVENTORY CONTROL ===================== */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  {lowStockVariants.length > 0 && (
                    <div className="p-4 bg-[#681A24]/10 border border-[#681A24]/30 rounded-xs flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#681A24] shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="font-semibold text-[#681A24] uppercase tracking-wider block">
                          Critical Atelier Allocation Alert
                        </strong>
                        <p className="text-[#525B56]">
                          {lowStockVariants.length} garment variant(s) have 2 or fewer pieces in stock. Restock below or authorize additional weaver allocation.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525B56]">
                      Manage variant allocations across all sizes and colorways.
                    </span>
                    <button
                      onClick={exportInventoryCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#EBE4D8] text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Export Stock CSV</span>
                    </button>
                  </div>

                  <div className="border border-[#EBE4D8] rounded-xs overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F2EDE4] text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                          <th className="py-3 px-4">Artisan Piece</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">SKU & Variant</th>
                          <th className="py-3 px-4">Current Stock</th>
                          <th className="py-3 px-4">Live Adjustment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBE4D8] bg-[#FAF8F5]">
                        {products.map((p) =>
                          p.variants.map((v) => (
                            <tr key={v.id} className="hover:bg-[#F2EDE4]/30">
                              <td className="py-2.5 px-4 font-serif text-sm font-semibold text-[#162B21]">
                                {p.name}
                              </td>
                              <td className="py-2.5 px-4 text-[#525B56] uppercase text-[11px]">
                                {p.category}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="font-mono text-[11px] text-[#525B56] block">{v.sku}</span>
                                <span className="font-semibold text-[#162B21]">{v.size}</span> · {v.color}
                              </td>
                              <td className="py-2.5 px-4">
                                <span className={`font-mono font-semibold tabular-nums ${
                                  v.stockCount <= 2 ? 'text-[#681A24]' : 'text-[#162B21]'
                                }`}>
                                  {v.stockCount} piece(s)
                                </span>
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => onUpdateStock(p.id, v.id, Math.max(0, v.stockCount - 1))}
                                    className="w-6 h-6 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-xs flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-mono tabular-nums text-xs">
                                    {v.stockCount}
                                  </span>
                                  <button
                                    onClick={() => onUpdateStock(p.id, v.id, v.stockCount + 1)}
                                    className="w-6 h-6 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-xs flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                  <button
                                    onClick={() => onUpdateStock(p.id, v.id, v.stockCount + 5)}
                                    className="px-2 py-0.5 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-[10px] uppercase tracking-wider text-[#525B56] cursor-pointer ml-1"
                                    title="Add batch allocation"
                                  >
                                    +5 Batch
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== TAB 5: PATRONS & CLIENTS ===================== */}
              {activeTab === 'patrons' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525B56]">
                      Private registry of authenticated couture collectors and patron profiles.
                    </span>
                    <span className="font-mono text-[#162B21] font-semibold">
                      {patronsList.length} Registered Patrons
                    </span>
                  </div>

                  <div className="border border-[#EBE4D8] rounded-xs overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F2EDE4] text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                          <th className="py-3 px-4">Patron Name</th>
                          <th className="py-3 px-4">Contact (Email & Mobile)</th>
                          <th className="py-3 px-4">Primary Destination</th>
                          <th className="py-3 px-4">Commissions</th>
                          <th className="py-3 px-4">Total Heirloom Investment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBE4D8] bg-[#FAF8F5]">
                        {patronsList.map((pt, idx) => (
                          <tr key={idx} className="hover:bg-[#F2EDE4]/30">
                            <td className="py-3 px-4 font-serif text-sm font-semibold text-[#162B21]">
                              {pt.name}
                            </td>
                            <td className="py-3 px-4">
                              <span className="block text-[#162B21]">{pt.email}</span>
                              <span className="text-[11px] text-[#525B56]">{pt.phone}</span>
                            </td>
                            <td className="py-3 px-4 text-[#525B56]">
                              {pt.city}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums">
                              {pt.orderCount} order(s)
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-[#162B21] tabular-nums">
                              ₹{pt.totalSpent.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===================== TAB 6: COUPONS & STOREFRONT BANNERS ===================== */}
              {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Announcement Bar Live Editor (5 cols) */}
                  <div className="lg:col-span-5 p-5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="font-serif text-base text-[#162B21] font-semibold">
                        Live Storefront Announcement Bar
                      </h4>
                    </div>

                    <p className="text-xs text-[#525B56] leading-relaxed">
                      Update the high-prominence top bar across the store. Changes propagate immediately to all active patrons.
                    </p>

                    <form onSubmit={handleSaveAnnouncement} className="space-y-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block mb-1">
                          Announcement Text & Promotion
                        </label>
                        <textarea
                          rows={3}
                          value={bannerInput}
                          onChange={(e) => setBannerInput(e.target.value)}
                          className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                      >
                        Publish to Storefront
                      </button>

                      {bannerSavedToast && (
                        <div className="p-2 bg-emerald-100 text-emerald-800 text-xs flex items-center gap-1.5 rounded-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>Announcement updated successfully!</span>
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Right: Coupon Management (7 cols) */}
                  <div className="lg:col-span-7 p-5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-base text-[#162B21] font-semibold">
                          Artisan Privilege Codes
                        </h4>
                      </div>
                    </div>

                    {/* Create New Coupon Form */}
                    <form onSubmit={handleCreateCoupon} className="p-4 bg-[#F2EDE4]/60 border border-[#EBE4D8] rounded-xs space-y-3">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#162B21] block">
                        Create New Privilege Code
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <input
                            type="text"
                            placeholder="CODE (e.g. DALSPRING)"
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value)}
                            required
                            className="w-full p-2 uppercase font-mono border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Discount %"
                            value={newCouponDiscount}
                            onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                            required
                            min={1}
                            max={50}
                            className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Min Spend (₹)"
                            value={newCouponMinSpend}
                            onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                            required
                            step={1000}
                            className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Optional Description (e.g. Spring Dal Lake Trousseau)"
                          value={newCouponDesc}
                          onChange={(e) => setNewCouponDesc(e.target.value)}
                          className="flex-1 p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          Add Code
                        </button>
                      </div>
                    </form>

                    {/* Coupons List */}
                    <div className="divide-y divide-[#EBE4D8] border border-[#EBE4D8] rounded-xs bg-[#FAF8F5]">
                      {coupons.map((c) => (
                        <div key={c.code} className="p-3.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-[#162B21] tracking-wider">
                                {c.code}
                              </span>
                              <span className="bg-[#162B21] text-[#DFC289] text-[10px] px-2 py-0.5 rounded-xs font-semibold">
                                {c.discountPercent}% OFF
                              </span>
                            </div>
                            <p className="text-[11px] text-[#525B56] mt-0.5">
                              {c.description} (Min Spend: ₹{c.minSpend.toLocaleString('en-IN')})
                            </p>
                          </div>

                          <button
                            onClick={() => onDeleteCoupon(c.code)}
                            className="text-[#681A24] hover:underline text-xs cursor-pointer p-1"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== TAB 7: REVIEWS MODERATION ===================== */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#525B56]">
                      Approve, verify, or remove customer impressions from the public product pages.
                    </span>
                    <span className="font-mono font-semibold text-[#162B21]">
                      {allReviewsList.length} Total Impressions
                    </span>
                  </div>

                  <div className="divide-y divide-[#EBE4D8] border border-[#EBE4D8] rounded-xs bg-[#FAF8F5]">
                    {allReviewsList.length === 0 ? (
                      <div className="p-10 text-center text-xs text-[#525B56]">
                        No reviews submitted yet.
                      </div>
                    ) : (
                      allReviewsList.map(({ product, review }) => (
                        <div key={review.id} className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <strong className="font-serif text-sm text-[#162B21]">{review.author}</strong>
                              <span className="text-[#525B56] text-[11px]">on "{product.name}"</span>
                              {review.verified && (
                                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-xs font-semibold">
                                  ✓ Verified Patron
                                </span>
                              )}
                            </div>

                            <div className="flex text-[#C5A059]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? 'fill-current stroke-none' : 'stroke-current fill-none'
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-xs text-[#1C1F1E] font-medium">{review.title}</p>
                            <p className="text-xs text-[#525B56] leading-relaxed max-w-2xl">{review.comment}</p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                            <button
                              onClick={() => onModerateReview(product.id, review.id, 'toggle-verify')}
                              className="px-3 py-1.5 border border-[#EBE4D8] hover:border-[#162B21] text-xs text-[#162B21] cursor-pointer"
                            >
                              {review.verified ? 'Revoke Verification' : 'Verify Patron'}
                            </button>
                            <button
                              onClick={() => onModerateReview(product.id, review.id, 'delete')}
                              className="p-1.5 text-[#681A24] hover:bg-[#681A24]/10 rounded-xs cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===================== MODAL: ORDER DETAILS DOSSIER ===================== */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3">
                <h3 className="font-serif text-lg text-[#162B21]">
                  Order Dossier: {selectedOrderDetails.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#525B56] uppercase">Patron Details</span>
                  <p className="font-semibold text-[#162B21]">{selectedOrderDetails.shippingAddress.fullName}</p>
                  <p>{selectedOrderDetails.shippingAddress.email}</p>
                  <p>{selectedOrderDetails.shippingAddress.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#525B56] uppercase">Shipping Address</span>
                  <p>{selectedOrderDetails.shippingAddress.streetLine1}</p>
                  <p>{selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state}</p>
                  <p>{selectedOrderDetails.shippingAddress.postalCode}, {selectedOrderDetails.shippingAddress.country}</p>
                </div>
              </div>

              <div className="border border-[#EBE4D8] p-3 text-xs space-y-2">
                <span className="text-[10px] text-[#525B56] uppercase block font-semibold">Commissioned Items</span>
                {selectedOrderDetails.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.product.name} ({it.size} / {it.color}) × {it.quantity}</span>
                    <span className="font-mono">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-[#EBE4D8] pt-2 flex justify-between font-semibold text-[#162B21]">
                  <span>Total Amount Paid ({selectedOrderDetails.paymentMethod}):</span>
                  <span className="font-mono">₹{selectedOrderDetails.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsPrintingInvoice(selectedOrderDetails);
                    setSelectedOrderDetails(null);
                  }}
                  className="px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Print Packing Manifest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== MODAL: PRINT PACKING SLIP ===================== */}
        {isPrintingInvoice && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white text-black p-8 shadow-2xl space-y-6 printable-manifest">
              <div className="flex justify-between items-start border-b border-black/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold uppercase tracking-widest text-[#162B21]">
                    KĀSHIDA COUTURE
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Srinagar Atelier Dispatch & Customs Manifest
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono font-bold text-sm">MANIFEST #{isPrintingInvoice.orderNumber}</p>
                  <p className="text-gray-500">{isPrintingInvoice.createdAt}</p>
                  <p className="font-mono text-gray-700">AWB: {isPrintingInvoice.trackingNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1 text-gray-600">Ship To / Consignee:</h4>
                  <p className="font-bold text-sm">{isPrintingInvoice.shippingAddress.fullName}</p>
                  <p>{isPrintingInvoice.shippingAddress.streetLine1}</p>
                  <p>{isPrintingInvoice.shippingAddress.city}, {isPrintingInvoice.shippingAddress.state} - {isPrintingInvoice.shippingAddress.postalCode}</p>
                  <p>{isPrintingInvoice.shippingAddress.country}</p>
                  <p>Contact: {isPrintingInvoice.shippingAddress.phone}</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1 text-gray-600">Carrier & Compliance:</h4>
                  <p>Carrier: DHL International Air Express</p>
                  <p>Insurance: Fully Covered (GI Provenance Guarantee)</p>
                  <p>Payment Status: {isPrintingInvoice.paymentStatus} ({isPrintingInvoice.paymentMethod})</p>
                  <p>Total Value: ₹{isPrintingInvoice.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-gray-300">
                <thead className="bg-gray-100 font-bold border-b border-gray-300">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Variant</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Value (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  {isPrintingInvoice.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-2 font-serif font-medium">{it.product.name}</td>
                      <td className="p-2 text-gray-600">{it.size} / {it.color}</td>
                      <td className="p-2 text-center">{it.quantity}</td>
                      <td className="p-2 text-right">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsPrintingInvoice(null)}
                  className="px-4 py-2 border border-gray-400 text-xs uppercase cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-black text-white text-xs uppercase font-bold tracking-widest cursor-pointer"
                >
                  Print Manifest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== MODAL: ADD NEW PRODUCT ===================== */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3">
                <h3 className="font-serif text-lg text-[#162B21]">
                  Commission New Atelier Creation
                </h3>
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1 text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shalimar Gold Zari Pheran"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Category *</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as Product['category'])}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="pherans">Pherans</option>
                      <option value="kurtas">Kurtas</option>
                      <option value="pashmina">Pashmina Shawls</option>
                      <option value="stoles">Silk Stoles</option>
                      <option value="cosmetics">Beauty Elixirs</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#162B21] block mb-1">Subtitle *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Silk Velvet with Handcrafted Antique Gold Tilla"
                      value={newProdSubtitle}
                      onChange={(e) => setNewProdSubtitle(e.target.value)}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      required
                      step={500}
                      value={newProdBasePrice}
                      onChange={(e) => setNewProdBasePrice(Number(e.target.value))}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Privilege Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={newProdDiscount}
                      onChange={(e) => setNewProdDiscount(Number(e.target.value))}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Fabric Specification *</label>
                    <input
                      type="text"
                      required
                      value={newProdFabric}
                      onChange={(e) => setNewProdFabric(e.target.value)}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Needlework Type *</label>
                    <input
                      type="text"
                      required
                      value={newProdEmbroidery}
                      onChange={(e) => setNewProdEmbroidery(e.target.value)}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#162B21] block mb-1">Primary Image Asset</label>
                    <select
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="/src/assets/images/product_velvet_pheran_1794059618066.jpg">Emerald Velvet Pheran</option>
                      <option value="/src/assets/images/product_pashmina_shawl_1794059618001.jpg">Ivory Pashmina Shawl</option>
                      <option value="/src/assets/images/product_silk_kurta_1794059619841.jpg">Silk Chanderi Kurta</option>
                      <option value="/src/assets/images/hero_kashida_couture_1794059616415.jpg">Autumn Velvet Pheran</option>
                      <option value="/src/assets/images/craft_artisan_embroidery_1794059619731.jpg">Atelier Handloom</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#162B21] block mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={newProdDescription}
                      onChange={(e) => setNewProdDescription(e.target.value)}
                      placeholder="Detailed provenance and drape notes..."
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#F2EDE4]">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 border border-[#EBE4D8] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Add to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================== MODAL: EDIT PRODUCT ===================== */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3">
                <h3 className="font-serif text-lg text-[#162B21]">
                  Edit Piece: {editingProduct.name}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.basePrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Discount %</label>
                    <input
                      type="number"
                      value={editingProduct.discountPercent}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#162B21] block mb-1">Needlework</label>
                    <input
                      type="text"
                      value={editingProduct.embroidery}
                      onChange={(e) => setEditingProduct({ ...editingProduct, embroidery: e.target.value })}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#162B21] block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFeatured || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      />
                      <span>Mark as Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isNewArrival || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                      />
                      <span>Mark as New Edit</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#F2EDE4]">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#EBE4D8] text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
