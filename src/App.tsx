import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  Coupon,
  OrderDossier,
  OrderStatus,
  PaymentGatewayConfig,
  SEOConfig,
  CategoryConfig,
  Review,
  UserAccount,
} from './types';
import { INITIAL_PRODUCTS, PROMO_COUPONS, INITIAL_CATEGORIES } from './data/products';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { TrustBadges } from './components/home/TrustBadges';
import { ArtisanHeritageSection } from './components/home/ArtisanHeritageSection';
import { ProductCard } from './components/catalog/ProductCard';
import { FilterBar, FilterOptions } from './components/catalog/FilterBar';
import { QuickViewModal } from './components/catalog/QuickViewModal';
import { LiveSearchModal } from './components/search/LiveSearchModal';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/checkout/OrderConfirmationModal';
import { AdminOperationsModal } from './components/admin/AdminOperationsModal';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { CustomerPortalModal } from './components/account/CustomerPortalModal';
import { AuthModal } from './components/account/AuthModal';
import { TrackOrderModal } from './components/checkout/TrackOrderModal';
import { GIVerificationModal } from './components/product/GIVerificationModal';
import { BespokeInquiryModal } from './components/product/BespokeInquiryModal';
import { ConciergeCareModal } from './components/layout/ConciergeCareModal';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Products and Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kashida_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('kashida_products', JSON.stringify(products));
  }, [products]);

  // Categories & Taxonomy State (Persisted & Editable by Admin)
  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    const saved = localStorage.getItem('kashida_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('kashida_categories', JSON.stringify(categories));
  }, [categories]);

  // Navigation and Active View State
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'pdp' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('admin') === 'true' ||
        params.get('view') === 'admin' ||
        window.location.hash === '#admin' ||
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin')
      ) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (currentView === 'admin') {
        url.searchParams.set('admin', 'true');
        window.history.replaceState({}, '', url.toString());
      } else {
        if (url.searchParams.has('admin') || url.searchParams.has('view')) {
          url.searchParams.delete('admin');
          url.searchParams.delete('view');
          window.history.replaceState({}, '', url.toString());
        }
      }
    }
  }, [currentView]);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('admin') === 'true' ||
        params.get('view') === 'admin' ||
        window.location.hash === '#admin' ||
        window.location.pathname.startsWith('/admin')
      ) {
        setCurrentView('admin');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Payment Gateway Configuration (Managed by Admin)
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(() => {
    const saved = localStorage.getItem('kashida_payment_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      environment: 'sandbox',
      razorpayKeyId: 'rzp_test_51KashidaKeyId',
      razorpayKeySecret: 'sec_kashida_hmac256_live_token',
      webhookSecret: 'whsec_kashida_webhook_secret',
      currency: 'INR',
      cardEnabled: true,
      upiEnabled: true,
      codEnabled: true,
      netbankingEnabled: true,
      autoCapture: true,
      lastTestedAt: 'Just now',
      paytmQrEnabled: true,
      paytmUpiId: 'humperszk@paytm',
      paytmMerchantName: 'Kāshida Couture & Heritage',
      paytmMerchantCode: 'KASHIDA001',
    };
  });

  useEffect(() => {
    localStorage.setItem('kashida_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  // SEO Configuration (Managed by Admin)
  const [seoConfig, setSeoConfig] = useState<SEOConfig>(() => {
    const saved = localStorage.getItem('kashida_seo_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      metaTitle: 'Kāshida Couture — Luxury Kashmiri Fashion & Pashmina',
      metaDescription: 'Discover authentic hand-embroidered velvet pherans, GI-certified Changthangi Pashmina shawls, and bespoke royal Kashmiri textiles commissioned to order in Srinagar.',
      keywords: 'Kashmiri fashion, velvet pheran, authentic pashmina shawl, tilla embroidery, sozni needlework',
      canonicalUrl: 'https://kashida-couture.com',
      ogImage: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
      twitterHandle: '@KashidaCouture',
    };
  });

  useEffect(() => {
    localStorage.setItem('kashida_seo_config', JSON.stringify(seoConfig));
    document.title = seoConfig.metaTitle;
  }, [seoConfig]);

  // Cart State (Persisted)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kashida_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kashida_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kashida_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kashida_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders History State (Persisted)
  const [orders, setOrders] = useState<OrderDossier[]>(() => {
    const saved = localStorage.getItem('kashida_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial seeded historic commission
    return [
      {
        orderNumber: 'KASH-849201',
        createdAt: 'November 4, 2026, 11:42 AM',
        status: 'DELIVERED',
        items: [
          {
            id: 'item-seed-1',
            productId: INITIAL_PRODUCTS[0].id,
            product: INITIAL_PRODUCTS[0],
            variantId: INITIAL_PRODUCTS[0].variants[1].id,
            size: 'S',
            color: 'Royal Emerald',
            quantity: 1,
            unitPrice: 38250,
          },
        ],
        shippingAddress: {
          fullName: 'Princess Soraya Bakhtiar',
          email: 'soraya.b@royalcollection.com',
          phone: '+91 98112 34567',
          streetLine1: 'Palace Road, Estate 4',
          city: 'Srinagar',
          state: 'Jammu & Kashmir',
          postalCode: '190001',
          country: 'India',
        },
        paymentMethod: 'RAZORPAY_CARD',
        paymentStatus: 'PAID',
        razorpayOrderId: 'order_rzp_seed849201',
        razorpayPaymentId: 'pay_rzp_seed993810',
        subTotal: 38250,
        discountAmount: 0,
        shippingCost: 0,
        totalAmount: 38250,
        trackingNumber: 'DHL-IN-982348192',
        estimatedDelivery: 'Delivered via White-Glove Courier',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('kashida_orders', JSON.stringify(orders));
  }, [orders]);

  // Announcement Text (Editable by Admin)
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return (
      localStorage.getItem('kashida_announcement') ||
      'Authentic GI-Certified Kashmiri Cashmere & Hand-Embroidered Tilla Couture'
    );
  });

  useEffect(() => {
    localStorage.setItem('kashida_announcement', announcementText);
  }, [announcementText]);

  // Coupons State (Persisted & Editable by Admin)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('kashida_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return PROMO_COUPONS;
  });

  useEffect(() => {
    localStorage.setItem('kashida_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Active Coupon for Cart
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(PROMO_COUPONS[0]);

  // Filter and Sorting State
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    embroidery: 'All Needlework',
    fabric: 'All Fabrics',
    maxPrice: 80000,
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Currency State (Persisted)
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('kashida_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('kashida_currency', currency);
  }, [currency]);

  // Modal Visibility States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<OrderDossier | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('KASH-849201');
  const [isGIModalOpen, setIsGIModalOpen] = useState(false);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  // User Accounts & Authentication State
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('kashida_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'patron_humperszk',
        email: 'humperszk@gmail.com',
        fullName: 'Humper S. (Founder & Chief Curator)',
        phone: '+91 98765 00001',
        passwordHash: '8e815e45a2faeb2ff5d564fa7e8d641d4c2b921fa940e4fe33ec27de86bfd895',
        vipTier: 'Mughal Court VIP Connoisseur',
        loyaltyPoints: 50000,
        createdAt: '2026-01-01T00:00:00Z',
        twoFactorEnabled: true,
        role: 'ADMIN',
        addresses: [
          {
            id: 'addr_humperszk_1',
            isDefault: true,
            label: 'Atelier Head Office & Sanctuary',
            fullName: 'Humper S.',
            phone: '+91 98765 00001',
            streetLine1: 'Kāshida Royal Atelier, Heritage Complex',
            streetLine2: 'Old Secretariat Boulevard',
            city: 'Srinagar',
            state: 'Jammu & Kashmir',
            postalCode: '190001',
            country: 'India',
          },
        ],
        measurements: {
          chestInches: '42',
          shoulderInches: '18.5',
          sleeveInches: '26',
          heightFeet: "5'11\"",
          preferredFit: 'Royal Relaxed Drape',
          monogramInitials: 'HS',
        },
      },
      {
        id: 'patron_soraya',
        email: 'soraya@kashida-patron.com',
        fullName: 'Lady Soraya Bakhtiar',
        phone: '+91 98112 34567',
        passwordHash: '8e815e45a2faeb2ff5d564fa7e8d641d4c2b921fa940e4fe33ec27de86bfd895',
        vipTier: 'Mughal Court VIP Connoisseur',
        loyaltyPoints: 1250,
        createdAt: '2026-01-15T00:00:00Z',
        twoFactorEnabled: false,
        addresses: [
          {
            id: 'addr_1',
            isDefault: true,
            label: 'Home Sanctuary',
            fullName: 'Lady Soraya Bakhtiar',
            phone: '+91 98112 34567',
            streetLine1: 'Boulevard Road, Dal Lake Sanctuary',
            city: 'Srinagar',
            state: 'Jammu & Kashmir',
            postalCode: '190001',
            country: 'India',
          },
        ],
        measurements: {
          chestInches: '38',
          shoulderInches: '15',
          sleeveInches: '22.5',
          heightFeet: '5\'7"',
          preferredFit: 'Royal Relaxed Drape',
          monogramInitials: 'SB',
        },
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('kashida_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('kashida_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kashida_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kashida_current_user');
    }
  }, [currentUser]);

  const handleRegisterUser = (newUser: UserAccount) => {
    const isFounder = newUser.email.toLowerCase() === 'humperszk@gmail.com';
    const enhanced: UserAccount = {
      ...newUser,
      role: isFounder ? 'ADMIN' : newUser.role || 'PATRON',
      vipTier: isFounder ? 'Mughal Court VIP Connoisseur' : newUser.vipTier,
      loyaltyPoints: isFounder ? Math.max(newUser.loyaltyPoints, 50000) : newUser.loyaltyPoints,
    };
    if (isFounder) {
      localStorage.setItem('kashida_admin_auth', 'true');
    }
    setRegisteredUsers((prev) => [enhanced, ...prev.filter((u) => u.email !== enhanced.email)]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleLoginUser = (user: UserAccount) => {
    const isFounder = user.email.toLowerCase() === 'humperszk@gmail.com';
    const enhanced: UserAccount = {
      ...user,
      role: isFounder ? 'ADMIN' : user.role || 'PATRON',
      vipTier: isFounder ? 'Mughal Court VIP Connoisseur' : user.vipTier,
      loyaltyPoints: isFounder ? Math.max(user.loyaltyPoints, 50000) : user.loyaltyPoints,
    };
    if (isFounder) {
      localStorage.setItem('kashida_admin_auth', 'true');
    }
    setCurrentUser(enhanced);
    setIsAuthModalOpen(false);
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
  ) => {
    const discountedPrice = Math.round(
      product.basePrice * (1 - product.discountPercent / 100)
    );
    const existingIndex = cartItems.findIndex(
      (i) => i.productId === product.id && i.size === size && i.color === color
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const variant = product.variants.find(
        (v) => v.size === size && v.color === color
      ) || product.variants[0];

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        variantId: variant?.id || 'default',
        size,
        color,
        quantity,
        unitPrice: discountedPrice,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleQuickAdd = (product: Product) => {
    const defaultVar = product.variants[0];
    handleAddToCart(product, defaultVar.size, defaultVar.color, 1);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((i) => i.id !== cartItemId));
  };

  const handleBuyNow = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    setIsCheckoutOpen(true);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // PDP View Navigation
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category change from navbar
  const handleSelectCategory = (cat: ProductCategory) => {
    setFilters({ ...filters, category: cat });
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCollection = (category: ProductCategory = 'all') => {
    setFilters({ ...filters, category });
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreHeritage = () => {
    setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById('heritage-story');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Order Placement & Stock Decrement
  const handleOrderSuccess = (newOrder: OrderDossier) => {
    // 1. Decrement inventory counts across matching products and variants
    const updatedProducts = products.map((prod) => {
      const orderedForProd = newOrder.items.filter((i) => i.productId === prod.id);
      if (orderedForProd.length === 0) return prod;

      const updatedVariants = prod.variants.map((v) => {
        const itemMatch = orderedForProd.find(
          (i) => i.size === v.size && i.color === v.color
        );
        if (itemMatch) {
          return {
            ...v,
            stockCount: Math.max(0, v.stockCount - itemMatch.quantity),
          };
        }
        return v;
      });

      return {
        ...prod,
        variants: updatedVariants,
      };
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setLastCompletedOrder(newOrder);
    setIsOrderConfirmationOpen(true);

    if (currentUser) {
      const pointsEarned = Math.round(newOrder.totalAmount * 0.05);
      const updatedUser: UserAccount = {
        ...currentUser,
        loyaltyPoints: (currentUser.loyaltyPoints || 0) + pointsEarned,
      };
      handleUpdateUser(updatedUser);
    }
  };

  // Admin status transition
  const handleUpdateOrderStatus = (orderNumber: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
    );
  };

  // Admin inventory adjustment
  const handleUpdateStock = (productId: string, variantId: string, newStock: number) => {
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, stockCount: newStock } : v
          ),
        };
      })
    );
  };

  // Admin Product CRUD handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProduct && selectedProduct.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
      setCurrentView('catalog');
    }
  };

  // Admin Category CRUD handlers
  const handleAddCategory = (newCat: CategoryConfig) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: CategoryConfig) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  // Admin Coupon CRUD handlers
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons([...coupons, newCoupon]);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code));
    if (appliedCoupon && appliedCoupon.code === code) {
      setAppliedCoupon(null);
    }
  };

  // Admin Review Moderation handler
  const handleModerateReview = (
    productId: string,
    reviewId: string,
    action: 'delete' | 'toggle-verify'
  ) => {
    setProducts(
      products.map((p) => {
        if (p.id !== productId) return p;
        if (action === 'delete') {
          return {
            ...p,
            reviews: p.reviews.filter((r) => r.id !== reviewId),
            reviewsCount: Math.max(0, p.reviewsCount - 1),
          };
        }
        if (action === 'toggle-verify') {
          return {
            ...p,
            reviews: p.reviews.map((r) =>
              r.id === reviewId ? { ...r, verified: !r.verified } : r
            ),
          };
        }
        return p;
      })
    );
  };

  // Patron review submission handler
  const handleAddProductReview = (productId: string, newReview: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [newReview, ...p.reviews];
        const avgRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        const updatedProduct = {
          ...p,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: Math.round(avgRating * 10) / 10,
        };
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(updatedProduct);
        }
        return updatedProduct;
      })
    );
  };

  // Filter products logic
  const filteredProducts = products.filter((p) => {
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (
      filters.embroidery !== 'All Needlework' &&
      !p.embroidery.toLowerCase().includes(filters.embroidery.toLowerCase())
    ) {
      return false;
    }
    const discountedPrice = Math.round(
      p.basePrice * (1 - p.discountPercent / 100)
    );
    if (discountedPrice > filters.maxPrice) return false;
    if (filters.inStockOnly) {
      const hasStock = p.variants.some((v) => v.stockCount > 0);
      if (!hasStock) return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.basePrice * (1 - a.discountPercent / 100);
    const priceB = b.basePrice * (1 - b.discountPercent / 100);

    if (filters.sortBy === 'price-asc') return priceA - priceB;
    if (filters.sortBy === 'price-desc') return priceB - priceA;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const featuredPicks = products.filter((p) => p.isFeatured);

  if (currentView === 'admin') {
    return (
      <AdminPortalView
        orders={orders}
        products={products}
        categories={categories}
        coupons={coupons}
        announcementText={announcementText}
        paymentConfig={paymentConfig}
        seoConfig={seoConfig}
        onUpdateAnnouncement={setAnnouncementText}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateStock={handleUpdateStock}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        onModerateReview={handleModerateReview}
        onUpdatePaymentConfig={setPaymentConfig}
        onUpdateSEOConfig={setSeoConfig}
        onReturnToStorefront={() => setCurrentView('home')}
        onReturnToStorefrontWithCategory={(catId) => {
          setFilters((prev) => ({ ...prev, category: catId }));
          setCurrentView('catalog');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1F1E]">
      {/* Founder & Super Admin Header Bar if logged in as humperszk@gmail.com */}
      {(currentUser?.email === 'humperszk@gmail.com' || currentUser?.role === 'ADMIN') && (
        <div className="bg-[#162B21] text-[#DFC289] border-b border-[#C5A059]/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-50">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">👑</span>
            <span className="font-semibold text-white tracking-wide">
              Atelier Founder & Master Admin: <span className="text-[#DFC289] font-mono">humperszk@gmail.com</span>
            </span>
            <span className="hidden sm:inline bg-[#234233] text-[#DFC289] px-2 py-0.5 text-[10px] rounded-xs font-mono uppercase border border-[#C5A059]/30">
              Super Admin Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('admin')}
              className="px-3 py-1 bg-[#C5A059] hover:bg-[#DFC289] text-[#162B21] font-bold text-[11px] uppercase tracking-wider rounded-xs cursor-pointer shadow-xs transition-colors"
            >
              Launch Admin Portal →
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
              }}
              className="text-[11px] text-[#DFC289] hover:underline cursor-pointer hidden md:inline"
            >
              Paytm QR & Gateways
            </button>
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar
        text={announcementText}
        currency={currency}
        onSelectCurrency={setCurrency}
        onOpenPromo={() => setIsCartOpen(true)}
        onOpenTrackOrder={() => {
          setTrackingOrderNumber('KASH-849201');
          setIsTrackOrderOpen(true);
        }}
      />

      {/* Main Luxury Navbar */}
      <Navbar
        categories={categories}
        activeCategory={filters.category}
        onSelectCategory={handleSelectCategory}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenTrackOrder={() => {
          setTrackingOrderNumber('KASH-849201');
          setIsTrackOrderOpen(true);
        }}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-16">
            {/* Grand Hero Campaign */}
            <HeroBanner
              onExplore={handleExploreCollection}
              onExploreHeritage={handleExploreHeritage}
            />

            {/* Trust and Authenticity Badges */}
            <TrustBadges />

            {/* Featured Seasonal Curations Section (3-column grid) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#F2EDE4]">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Masterpiece Edit</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#162B21] leading-tight">
                    Curated Kashmiri Haute Couture
                  </h2>
                </div>

                <button
                  onClick={() => handleExploreCollection('all')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#162B21] hover:text-[#C5A059] font-semibold cursor-pointer group"
                >
                  <span>Explore Complete Archive ({products.length} pieces)</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C5A059]" />
                </button>
              </div>

              {/* 3-Column Luxury Product Grid with zero-pill metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPicks.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlist.some((w) => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onSelectProduct={handleSelectProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            </section>

            {/* Artisan Heritage & Story Section */}
            <ArtisanHeritageSection
              onExploreCouture={() => handleExploreCollection('pherans')}
            />
          </div>
        )}

        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Catalog Header */}
            <div className="space-y-2 mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Haute Curations
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#162B21]">
                {filters.category === 'all'
                  ? 'The Complete Kashmiri Archive'
                  : categories.find((c) => c.id === filters.category)?.name || 'Curated Kashmiri Collection'}
              </h1>
              <p className="text-xs text-[#525B56] max-w-2xl leading-relaxed">
                {filters.category === 'all'
                  ? 'Hand-embroidered with authentic needlework techniques passed down through generations in the Kashmir Valley. Cut to order and delivered in insured keepsakes.'
                  : categories.find((c) => c.id === filters.category)?.description || 'Handcrafted using traditional needle embroidery techniques passed down through generations in the Kashmir Valley.'}
              </p>
            </div>

            {/* Filter and Sorting Bar */}
            <FilterBar
              categoryConfigs={categories}
              filters={filters}
              onChangeFilters={setFilters}
              totalCount={sortedProducts.length}
            />

            {/* Product Grid */}
            {sortedProducts.length === 0 ? (
              <div className="py-24 text-center space-y-3 bg-[#F2EDE4]/30 border border-[#EBE4D8]">
                <p className="font-serif text-lg text-[#162B21]">
                  No authenticated pieces match your current refinement.
                </p>
                <p className="text-xs text-[#525B56]">
                  Try clearing the needlework filter or adjusting the price threshold.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      category: 'all',
                      embroidery: 'All Needlework',
                      fabric: 'All Fabrics',
                      maxPrice: 80000,
                      inStockOnly: false,
                      sortBy: 'featured',
                    })
                  }
                  className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Reset Refinements
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlist.some((w) => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onSelectProduct={handleSelectProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'pdp' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            seoConfig={seoConfig}
            currency={currency}
            isWishlisted={wishlist.some((w) => w.id === selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={handleSelectProduct}
            onBackToCatalog={() => setCurrentView('catalog')}
            onOpenGIModal={() => setIsGIModalOpen(true)}
            onOpenBespokeModal={() => setIsBespokeModalOpen(true)}
            onAddReview={handleAddProductReview}
          />
        )}
      </main>

      {/* Luxury Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onExploreHeritage={handleExploreHeritage}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenTrackOrder={() => {
          setTrackingOrderNumber('KASH-849201');
          setIsTrackOrderOpen(true);
        }}
        onOpenGIModal={() => setIsGIModalOpen(true)}
        onOpenBespokeModal={() => setIsBespokeModalOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
      />

      {/* MODALS & DRAWERS */}
      {/* Live Predictive Search Modal */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        currency={currency}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, sz, col) => handleAddToCart(p, sz, col, 1)}
        onViewFullPDP={handleSelectProduct}
      />

      {/* Silk Bag (Cart Drawer) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onMoveToBag={(p, sz, col, qty) => handleAddToCart(p, sz, col, qty)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => setWishlist(wishlist.filter((w) => w.id !== id))}
        onMoveToCart={(p) => handleQuickAdd(p)}
      />

      {/* Frictionless 2-Step Checkout Wizard */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={appliedCoupon}
        paymentConfig={paymentConfig}
        currency={currency}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Dossier Modal */}
      <OrderConfirmationModal
        order={lastCompletedOrder}
        currency={currency}
        onClose={() => setIsOrderConfirmationOpen(false)}
        onContinueShopping={() => {
          setIsOrderConfirmationOpen(false);
          setCurrentView('catalog');
        }}
        onTrackOrder={(ordNum) => {
          setTrackingOrderNumber(ordNum);
          setIsTrackOrderOpen(true);
        }}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
      />

      {/* Patron VIP Account Portal */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogoutUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        orders={orders}
        currency={currency}
        onTrackOrder={(ordNum) => {
          setTrackingOrderNumber(ordNum);
          setIsTrackOrderOpen(true);
        }}
        onInspectOrder={(ord) => {
          setLastCompletedOrder(ord);
          setIsOrderConfirmationOpen(true);
        }}
      />

      {/* Patron Authentication Modal (Sign In, Create Account, Forgot Passphrase) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginUser}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />

      {/* Public Order Tracking Radar Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
        initialOrderNumber={trackingOrderNumber}
        currency={currency}
      />

      {/* Geographical Indication (GI) Verification Modal */}
      <GIVerificationModal
        isOpen={isGIModalOpen}
        onClose={() => setIsGIModalOpen(false)}
        productTitle={selectedProduct?.name}
      />

      {/* Bespoke Tailoring & Monogram Inquiry Modal */}
      <BespokeInquiryModal
        isOpen={isBespokeModalOpen}
        onClose={() => setIsBespokeModalOpen(false)}
        product={selectedProduct}
      />

      {/* Atelier Concierge & Care FAQ Modal */}
      <ConciergeCareModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onOpenBespoke={() => setIsBespokeModalOpen(true)}
      />

      {/* Admin Operations & Governance Console */}
      <AdminOperationsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        products={products}
        coupons={coupons}
        announcementText={announcementText}
        onUpdateAnnouncement={setAnnouncementText}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateStock={handleUpdateStock}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        onModerateReview={handleModerateReview}
      />
    </div>
  );
}
