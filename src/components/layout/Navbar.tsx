import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Shield, Menu, X, User, Truck, Sparkles } from 'lucide-react';
import { ProductCategory, CategoryConfig, UserAccount } from '../../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  categories?: CategoryConfig[];
  currentUser?: UserAccount | null;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerPortal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenTrackOrder?: () => void;
  onOpenConcierge?: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  categories,
  currentUser,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenCustomerPortal,
  onOpenAuthModal,
  onOpenTrackOrder,
  onOpenConcierge,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; category: ProductCategory }[] = categories
    ? [
        { label: 'All Curations', category: 'all' },
        ...categories.map((c) => ({
          label: c.name.split(' ')[0] + (c.name.split(' ')[1] ? ' ' + c.name.split(' ')[1] : ''),
          category: c.id,
        })),
      ]
    : [
        { label: 'All Curations', category: 'all' },
        { label: 'Pherans', category: 'pherans' },
        { label: 'Kurtas', category: 'kurtas' },
        { label: 'Pashmina', category: 'pashmina' },
        { label: 'Silk Stoles', category: 'stoles' },
        { label: 'Beauty Elixirs', category: 'cosmetics' },
      ];

  const handleNavClick = (cat: ProductCategory) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#F2EDE4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C1F1E] hover:text-[#C5A059] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onNavigateHome}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#162B21] group-hover:text-[#C5A059] transition-colors block leading-tight">
              Kāshida
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#C5A059] block font-medium">
              Couture du Kashmir
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed text) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#1C1F1E]">
          {navItems.map((item) => (
            <button
              key={item.category}
              onClick={() => handleNavClick(item.category)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-[#C5A059] ${
                activeCategory === item.category
                  ? 'text-[#162B21] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#C5A059]'
                  : 'text-[#525B56]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Functional Actions Cluster */}
        <div className="flex items-center gap-3 sm:gap-5 text-[#1C1F1E] shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-1.5 hover:text-[#C5A059] transition-colors cursor-pointer group flex items-center gap-1.5"
            aria-label="Search collection"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
            <span className="hidden xl:inline text-xs tracking-wider text-[#525B56] group-hover:text-[#C5A059]">
              Search
            </span>
          </button>

          <button
            onClick={onOpenWishlist}
            className="p-1.5 hover:text-[#C5A059] transition-colors cursor-pointer relative"
            aria-label="Saved heirlooms"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#FAF8F5] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Patron VIP Account Portal Button */}
          <button
            onClick={() => {
              if (currentUser) {
                onOpenCustomerPortal?.();
              } else {
                onOpenAuthModal?.();
              }
            }}
            className="p-1.5 hover:text-[#C5A059] transition-colors cursor-pointer group flex items-center gap-1.5"
            aria-label="Patron VIP Portal & Commissions"
            title={currentUser ? `Signed in as ${currentUser.fullName}` : 'Sign in to Patron Account'}
          >
            <div className="relative">
              <User className="w-5 h-5 stroke-[1.5]" />
              {currentUser && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-600 border border-white" />
              )}
            </div>
            <span className="hidden xl:inline text-xs tracking-wider text-[#525B56] group-hover:text-[#C5A059]">
              {currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 p-1.5 hover:text-[#C5A059] transition-colors cursor-pointer relative"
            aria-label="Silk bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#162B21] text-[#FAF8F5] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs tracking-widest uppercase font-medium">
              Bag
            </span>
          </button>

          {/* Admin Operations Quick Link — Strictly hidden from non-admin users */}
          {(currentUser?.email === 'humperszk@gmail.com' || currentUser?.role === 'ADMIN') && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 py-1 px-3 bg-[#162B21] border border-[#C5A059] text-[#DFC289] text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer rounded-xs shadow-xs hover:bg-[#234233]"
              title="Founder & Master Admin Dashboard (humperszk@gmail.com)"
            >
              <Shield className="w-3.5 h-3.5 text-[#DFC289]" />
              <span>👑 Founder Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2EDE4] bg-[#FAF8F5] px-6 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
              Collections
            </span>
            {navItems.map((item) => (
              <button
                key={item.category}
                onClick={() => handleNavClick(item.category)}
                className={`text-left text-sm uppercase tracking-wider py-1.5 transition-colors ${
                  activeCategory === item.category ? 'text-[#162B21] font-semibold pl-2 border-l-2 border-[#C5A059]' : 'text-[#525B56]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F2EDE4] space-y-3">
            <button
              onClick={() => {
                if (currentUser) {
                  onOpenCustomerPortal?.();
                } else {
                  onOpenAuthModal?.();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs uppercase tracking-wider text-[#162B21] flex items-center justify-between font-semibold p-2 bg-[#F2EDE4]/60 rounded-xs"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#C5A059]" />
                <span>{currentUser ? `Patron: ${currentUser.fullName}` : 'Sign In / Register Account'}</span>
              </div>
              <span className="text-[10px] text-[#C5A059] font-mono">
                {currentUser ? currentUser.vipTier.split(' ')[0] : 'VIP Welcome'}
              </span>
            </button>

            {onOpenTrackOrder && (
              <button
                onClick={() => {
                  onOpenTrackOrder();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs uppercase tracking-wider text-[#162B21] flex items-center gap-2 font-medium"
              >
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Track Commission Logistics</span>
              </button>
            )}

            {onOpenConcierge && (
              <button
                onClick={() => {
                  onOpenConcierge();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs uppercase tracking-wider text-[#162B21] flex items-center gap-2 font-medium"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Atelier Concierge & Care FAQ</span>
              </button>
            )}

            {(currentUser?.email === 'humperszk@gmail.com' || currentUser?.role === 'ADMIN') && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs uppercase tracking-wider text-[#DFC289] bg-[#162B21] flex items-center gap-2 font-medium p-2.5 rounded-xs border border-[#C5A059]/40 mt-2"
              >
                <Shield className="w-4 h-4 text-[#DFC289]" />
                <span>👑 Founder Admin Operations</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
