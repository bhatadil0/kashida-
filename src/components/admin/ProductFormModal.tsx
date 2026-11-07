import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Globe,
  SlidersHorizontal,
  Layers,
  Tag,
  Check,
  Eye,
  Smartphone,
  Monitor,
  AlertCircle,
} from 'lucide-react';
import { Product, ProductVariant, CategoryConfig, SEOConfig } from '../../types';
import { calculateProductSEOScore, autoOptimizeProductSEO } from '../../utils/seoHealth';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: CategoryConfig[];
  seoConfig: SEOConfig;
  onSaveProduct: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  seoConfig,
  onSaveProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'imagery' | 'craft' | 'variants' | 'seo'>('general');
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');

  // Form Fields
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<string>(categories[0]?.id || 'pherans');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState(38000);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Imagery
  const [primaryImage, setPrimaryImage] = useState('/src/assets/images/product_velvet_pheran_1794059618066.jpg');
  const [imageAlt, setImageAlt] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Craft & Fabric
  const [fabric, setFabric] = useState('Pure Mulberry Silk Velvet');
  const [embroidery, setEmbroidery] = useState('Tilla Metallic Zari');
  const [craftsmanship, setCraftsmanship] = useState('');
  const [careGuide, setCareGuide] = useState('Dry clean only with organic solvents. Store in pure cotton muslin.');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [occasions, setOccasions] = useState<string[]>(['Royal Ceremonies', 'Festive Heirloom']);
  const [newOccasionTag, setNewOccasionTag] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Per-Product SEO
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState<string[]>(['kashmiri', 'pashmina', 'tilla']);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  // Initialize form when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSubtitle(productToEdit.subtitle);
      setCategory(productToEdit.category);
      setSku(productToEdit.sku || `KASH-${productToEdit.id.slice(-4).toUpperCase()}`);
      setBasePrice(productToEdit.basePrice);
      setDiscountPercent(productToEdit.discountPercent);
      setIsFeatured(productToEdit.isFeatured || false);
      setIsNewArrival(productToEdit.isNewArrival || false);
      setIsBestSeller(productToEdit.isBestSeller || false);
      setPrimaryImage(productToEdit.primaryImage);
      setImageAlt(productToEdit.imageAlt || `${productToEdit.name} Handcrafted in Kashmir`);
      setGalleryImages(productToEdit.galleryImages || [productToEdit.primaryImage]);
      setFabric(productToEdit.fabric);
      setEmbroidery(productToEdit.embroidery);
      setCraftsmanship(productToEdit.craftsmanship);
      setCareGuide(productToEdit.careGuide);
      setIngredients(productToEdit.ingredients || '');
      setDescription(productToEdit.description);
      setOccasions(productToEdit.occasions || ['Royal Heritage']);
      setVariants(productToEdit.variants || []);
      setSlug(productToEdit.slug);
      setSeoTitle(productToEdit.seoTitle || `${productToEdit.name} — Kāshida Couture`);
      setSeoDescription(productToEdit.seoDescription || productToEdit.description.slice(0, 155));
      setFocusKeywords(productToEdit.focusKeywords || ['kashmiri', productToEdit.embroidery.toLowerCase()]);
      setNoIndex(productToEdit.noIndex || false);
    } else {
      // New creation defaults
      const timestamp = Date.now().toString().slice(-4);
      setName('');
      setSubtitle('');
      setCategory(categories[0]?.id || 'pherans');
      setSku(`KASH-CREATION-${timestamp}`);
      setBasePrice(38500);
      setDiscountPercent(0);
      setIsFeatured(false);
      setIsNewArrival(true);
      setIsBestSeller(false);
      setPrimaryImage('/src/assets/images/product_velvet_pheran_1794059618066.jpg');
      setImageAlt('Handcrafted Kashmiri Couture Velvet Pheran');
      setGalleryImages([
        '/src/assets/images/product_velvet_pheran_1794059618066.jpg',
        '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
      ]);
      setFabric('Pure Mulberry Silk Velvet');
      setEmbroidery('Tilla Metallic Zari (Antique Gold)');
      setCraftsmanship('Hand-embroidered by master artisans in Downtown Srinagar using pure silver zari dipped in 24k gold wash.');
      setCareGuide('Dry clean only. Store wrapped in pure unbleached muslin with natural cedar sachet.');
      setIngredients('');
      setDescription('Cut to order from heavyweight pure mulberry silk velvet, embellished with authentic Kashmiri royal embroidery.');
      setOccasions(['Royal Ceremonies', 'Bridal Soirées', 'Winter Festive']);
      setVariants([
        { id: `v-${timestamp}-s`, sku: `KASH-S-${timestamp}`, color: 'Royal Emerald', colorHex: '#162B21', size: 'S', stockCount: 2, priceDelta: 0 },
        { id: `v-${timestamp}-m`, sku: `KASH-M-${timestamp}`, color: 'Royal Emerald', colorHex: '#162B21', size: 'M', stockCount: 3, priceDelta: 0 },
        { id: `v-${timestamp}-l`, sku: `KASH-L-${timestamp}`, color: 'Royal Emerald', colorHex: '#162B21', size: 'L', stockCount: 2, priceDelta: 0 },
      ]);
      setSlug('');
      setSeoTitle('');
      setSeoDescription('');
      setFocusKeywords(['kashmiri', 'tilla', 'velvet pheran', 'handcrafted']);
      setNoIndex(false);
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Auto-fill SEO metadata when title changes if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!productToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${val} — Luxury Kashmiri Couture`);
      setImageAlt(`Handcrafted Kashmiri ${val} with authentic needlework`);
    }
  };

  // Construct draft product object for real-time SEO scoring
  const draftProduct: Product = {
    id: productToEdit ? productToEdit.id : `kash-${Date.now().toString().slice(-4)}`,
    slug: slug || 'custom-piece',
    sku: sku || 'KASH-SKU',
    name: name || 'Untitled Creation',
    subtitle: subtitle || 'Kashmiri Haute Couture',
    category,
    description: description || 'Artisanal Kashmiri couture.',
    craftsmanship,
    careGuide,
    ingredients,
    basePrice,
    discountPercent,
    rating: productToEdit?.rating || 5.0,
    reviewsCount: productToEdit?.reviewsCount || 0,
    isFeatured,
    isNewArrival,
    isBestSeller,
    fabric,
    embroidery,
    occasions,
    primaryImage,
    imageAlt,
    galleryImages,
    variants,
    reviews: productToEdit?.reviews || [],
    seoTitle,
    seoDescription,
    focusKeywords,
    noIndex,
  };

  const currentScore = calculateProductSEOScore(draftProduct, seoConfig);

  // 1-Click Auto-Tune handler
  const handleAutoTune = () => {
    const tuned = autoOptimizeProductSEO(draftProduct, seoConfig);
    setName(tuned.name);
    setSubtitle(tuned.subtitle);
    setDescription(tuned.description);
    setCraftsmanship(tuned.craftsmanship);
    setSeoTitle(`${tuned.name} — Luxury Kashmiri Couture`);
    setSeoDescription(tuned.subtitle ? `${tuned.subtitle}. ${tuned.description.slice(0, 100)}` : tuned.description.slice(0, 155));
    if (!imageAlt) {
      setImageAlt(`${tuned.name} in ${tuned.fabric} with ${tuned.embroidery}`);
    }
  };

  // Add gallery image
  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    setGalleryImages([...galleryImages, url.trim()]);
    setNewGalleryUrl('');
  };

  // Upload image file to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isPrimary) {
            setPrimaryImage(reader.result);
            if (!galleryImages.includes(reader.result)) {
              setGalleryImages([reader.result, ...galleryImages]);
            }
          } else {
            setGalleryImages([...galleryImages, reader.result]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Variant operations
  const handleAddVariant = () => {
    const newV: ProductVariant = {
      id: `v-${Date.now().toString().slice(-4)}`,
      sku: `${sku || 'KASH'}-${variants.length + 1}`,
      color: 'Royal Emerald',
      colorHex: '#162B21',
      size: 'M',
      stockCount: 2,
      priceDelta: 0,
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalProduct: Product = {
      ...draftProduct,
      name: name.trim(),
      subtitle: subtitle.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      seoTitle: seoTitle.trim() || `${name} — Kāshida Couture`,
      seoDescription: seoDescription.trim() || description.slice(0, 155),
      imageAlt: imageAlt.trim() || `${name} Kashmiri Haute Couture`,
      galleryImages: galleryImages.length > 0 ? galleryImages : [primaryImage],
    };

    onSaveProduct(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs shadow-2xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#F2EDE4] bg-[#FAF8F5] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atelier Commission Suite</span>
            </div>
            <h3 className="font-serif text-2xl text-[#162B21] mt-0.5">
              {productToEdit ? `Edit: ${productToEdit.name}` : 'Commission New Kashmiri Creation'}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Score Pill */}
            <div className="hidden sm:flex items-center gap-2 p-1.5 px-3 bg-white border border-[#EBE4D8] rounded-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#525B56] font-semibold">
                Content Quality:
              </span>
              <span className="font-mono text-xs font-bold text-[#162B21]">
                {currentScore.totalScore}/100
              </span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-xs uppercase tracking-wider ${
                  currentScore.grade === 'EXEMPLARY'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentScore.grade === 'GOOD'
                    ? 'bg-[#162B21] text-[#DFC289]'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {currentScore.grade}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#525B56] hover:text-[#162B21] rounded-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-[#EBE4D8] bg-[#F2EDE4]/60 px-5 text-xs uppercase tracking-[0.15em] font-semibold overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'border-[#162B21] text-[#162B21]'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            1. Core Details & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('imagery')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'imagery'
                ? 'border-[#162B21] text-[#162B21]'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <span>2. Imagery & Gallery</span>
            <span className="font-mono text-[10px] text-[#C5A059]">({galleryImages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('craft')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'craft'
                ? 'border-[#162B21] text-[#162B21]'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            3. Textiles & Provenance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'variants'
                ? 'border-[#162B21] text-[#162B21]'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <span>4. Variants & Stock</span>
            <span className="font-mono text-[10px] text-[#C5A059]">({variants.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'border-[#162B21] text-[#162B21]'
                : 'border-transparent text-[#525B56] hover:text-[#162B21]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>5. SEO & SERP Schema</span>
            <span className="bg-[#162B21] text-[#DFC289] text-[9px] font-mono px-1 rounded-xs">
              {currentScore.totalScore}
            </span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: Core Details */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zuleikha Royal Silk Velvet Pheran"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">Collection / Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">SKU / Atelier Seal Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. ZUL-EMR-001"
                    className="w-full p-2.5 font-mono border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">Subtitle / Lineage *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Mulberry Silk Velvet with Handcrafted Antique Gold Tilla"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step={500}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">Privilege Discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">Editorial Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the drape, silhouette, historical inspiration, and occasion..."
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs flex flex-wrap gap-6 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#162B21]"
                  />
                  <span className="font-medium text-[#162B21]">Feature on Homepage Masterpiece Edit</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-[#162B21]"
                  />
                  <span className="font-medium text-[#162B21]">Mark as New Loom Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 accent-[#162B21]"
                  />
                  <span className="font-medium text-[#162B21]">Patron Favorite / Bestseller</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Imagery & Multi-Image Gallery */}
          {activeTab === 'imagery' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Primary Image */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                    Primary Catalog Image & Google Image Alt Tag
                  </span>
                  <span className="text-[10px] text-[#C5A059]">High-res vertical 3:4 portrait recommended</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={primaryImage}
                    alt={imageAlt || name}
                    className="w-24 h-32 object-cover border border-[#EBE4D8] rounded-xs shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <div>
                      <label className="block text-[11px] font-medium text-[#162B21] mb-1">
                        Primary Image URL:
                      </label>
                      <input
                        type="url"
                        value={primaryImage}
                        onChange={(e) => setPrimaryImage(e.target.value)}
                        placeholder="https://... or /src/assets/images/..."
                        className="w-full p-2 font-mono text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-xs font-medium cursor-pointer rounded-xs">
                        <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Upload Primary File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-[#162B21] mb-1">
                        Image ALT Tag (Crucial for Google Image Search discovery) *
                      </label>
                      <input
                        type="text"
                        required
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="e.g. Royal Kashmiri Emerald Velvet Pheran with Handcrafted Antique Gold Tilla"
                        className="w-full p-2 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                      Multi-Image Gallery & Alternate Angles ({galleryImages.length})
                    </span>
                    <span className="text-[10px] text-[#525B56]">
                      Patrons can inspect fabric textures, embroidery closeups, and drape in 175% zoom loupe.
                    </span>
                  </div>
                </div>

                {/* Gallery Thumbnails Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/4] border border-[#EBE4D8] rounded-xs overflow-hidden group bg-[#FAF8F5]"
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      {imgUrl === primaryImage && (
                        <span className="absolute top-1 left-1 bg-[#162B21] text-[#DFC289] text-[8px] uppercase tracking-wider px-1 py-0.2 rounded-xs font-bold">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {imgUrl !== primaryImage && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(imgUrl)}
                            className="text-[9px] bg-white text-[#162B21] px-1.5 py-0.5 rounded-xs font-medium cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                          className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-xs font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Gallery Image Form */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-[#F2EDE4]">
                  <input
                    type="url"
                    placeholder="Paste image URL to add to gallery..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 p-2 font-mono text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                    className="px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                  <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-xs font-medium cursor-pointer rounded-xs shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Textiles & Provenance */}
          {activeTab === 'craft' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">Fabric Specification *</label>
                  <input
                    type="text"
                    required
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. Pure Mulberry Silk Velvet"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">Needlework / Embroidery Craft *</label>
                  <input
                    type="text"
                    required
                    value={embroidery}
                    onChange={(e) => setEmbroidery(e.target.value)}
                    placeholder="e.g. Tilla Metallic Zari (Antique Gold)"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Occasions & Styling Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {occasions.map((occ) => (
                      <span
                        key={occ}
                        className="px-2 py-1 bg-white border border-[#EBE4D8] text-xs text-[#162B21] rounded-xs flex items-center gap-1 font-medium"
                      >
                        {occ}
                        <button
                          type="button"
                          onClick={() => setOccasions(occasions.filter((o) => o !== occ))}
                          className="text-[#681A24] cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add occasion (e.g. Royal Wedding, Trousseau)..."
                      value={newOccasionTag}
                      onChange={(e) => setNewOccasionTag(e.target.value)}
                      className="flex-1 p-2 border border-[#EBE4D8] bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newOccasionTag.trim()) {
                          setOccasions([...occasions, newOccasionTag.trim()]);
                          setNewOccasionTag('');
                        }
                      }}
                      className="px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">Craftsmanship & Guild Story *</label>
                  <textarea
                    rows={3}
                    required
                    value={craftsmanship}
                    onChange={(e) => setCraftsmanship(e.target.value)}
                    placeholder="Document the hours of handloom work, master artisan guild, and historical legacy..."
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">Care & Preservation Guide *</label>
                  <textarea
                    rows={2}
                    required
                    value={careGuide}
                    onChange={(e) => setCareGuide(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                  />
                </div>

                {category === 'cosmetics' && (
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-[#162B21] block mb-1">Botanical Ingredients (Cosmetics)</label>
                    <textarea
                      rows={2}
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="e.g. Cold-Pressed Saffron Oil, Wild Apricot Kernel, Damask Rose Extract..."
                      className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Variants & Inventory */}
          {activeTab === 'variants' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                    Size, Color & Stock Matrix ({variants.length} SKU variations)
                  </span>
                  <span className="text-[10px] text-[#525B56]">
                    Configure real-time atelier inventory counts and price adjustments.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#162B21] text-[#FAF8F5] text-xs font-semibold cursor-pointer rounded-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#DFC289]" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="border border-[#EBE4D8] rounded-xs overflow-x-auto bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F2EDE4] text-[#162B21] uppercase tracking-wider font-semibold border-b border-[#EBE4D8]">
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Colorway</th>
                      <th className="py-2.5 px-3">Swatch Hex</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Atelier Stock</th>
                      <th className="py-2.5 px-3">Price Delta</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE4D8]">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.size}
                            onChange={(e) => handleUpdateVariant(v.id, { size: e.target.value })}
                            className="w-16 p-1 border border-[#EBE4D8] text-center font-bold"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.color}
                            onChange={(e) => handleUpdateVariant(v.id, { color: e.target.value })}
                            className="w-28 p-1 border border-[#EBE4D8]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={v.colorHex || '#162B21'}
                              onChange={(e) => handleUpdateVariant(v.id, { colorHex: e.target.value })}
                              className="w-6 h-6 border-0 cursor-pointer"
                            />
                            <span className="font-mono text-[10px] text-[#525B56]">{v.colorHex}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                            className="w-28 p-1 font-mono text-[11px] border border-[#EBE4D8]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min={0}
                            value={v.stockCount}
                            onChange={(e) => handleUpdateVariant(v.id, { stockCount: Number(e.target.value) })}
                            className="w-16 p-1 font-mono font-bold text-center border border-[#EBE4D8]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={v.priceDelta}
                            onChange={(e) => handleUpdateVariant(v.id, { priceDelta: Number(e.target.value) })}
                            className="w-20 p-1 font-mono text-center border border-[#EBE4D8]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="p-1 text-[#681A24] hover:bg-red-50 rounded-xs cursor-pointer"
                            title="Remove Variant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SERP Optimization ("SEO from Basics") */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Content Quality Score & Auto-Tune Banner */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="font-mono text-2xl font-bold text-[#162B21]">
                      {currentScore.totalScore}
                      <span className="text-xs text-[#525B56] font-normal">/100</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider block">
                        Content Quality Score ({currentScore.grade})
                      </span>
                      <span className="text-[10px] text-[#525B56]">
                        Keywords ({currentScore.metrics.keywordsScore}/35) · Title ({currentScore.metrics.titleScore}/30) · Desc ({currentScore.metrics.descriptionScore}/35)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoTune}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#DFC289]" />
                    <span>Auto-Tune to 90+ Score</span>
                  </button>
                </div>

                <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentScore.totalScore >= 85 ? 'bg-emerald-700' : 'bg-[#C5A059]'
                    }`}
                    style={{ width: `${currentScore.totalScore}%` }}
                  />
                </div>
              </div>

              {/* SERP Preview */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Live Google Search Snippet Simulation
                  </span>
                  <div className="flex items-center gap-1 bg-[#F2EDE4] p-0.5 rounded-xs">
                    <button
                      type="button"
                      onClick={() => setSerpView('desktop')}
                      className={`p-1 px-2 text-[10px] rounded-xs font-medium cursor-pointer ${
                        serpView === 'desktop' ? 'bg-[#162B21] text-white' : 'text-[#525B56]'
                      }`}
                    >
                      <Monitor className="w-3 h-3 inline mr-1" /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpView('mobile')}
                      className={`p-1 px-2 text-[10px] rounded-xs font-medium cursor-pointer ${
                        serpView === 'mobile' ? 'bg-[#162B21] text-white' : 'text-[#525B56]'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 inline mr-1" /> Mobile
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-1">
                  <div className="text-[11px] text-[#202124]">
                    https://kashida-couture.com › {category} › {slug || 'custom-piece'}
                  </div>
                  <h4 className="text-base text-[#1a0dab] font-medium leading-snug line-clamp-1 hover:underline cursor-pointer">
                    {seoTitle || `${name || 'Product Title'} — Kāshida Couture`}
                  </h4>
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {seoDescription || subtitle || description || 'Handcrafted luxury Kashmiri couture.'}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-0.5">
                    <span className="text-amber-500 font-bold">★★★★★</span>
                    <span>Rating: 4.95 · In stock · ₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="font-semibold text-[#162B21]">Page Title Tag (&lt;title&gt;) *</label>
                    <span className={`font-mono text-[10px] ${seoTitle.length >= 32 && seoTitle.length <= 58 ? 'text-emerald-700' : 'text-[#C5A059]'}`}>
                      {seoTitle.length} / 60 characters (Optimal: 32-58)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Zuleikha Velvet Pheran — Handcrafted Tilla Couture"
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="font-semibold text-[#162B21]">Meta Description (&lt;meta name="description"&gt;) *</label>
                    <span className={`font-mono text-[10px] ${seoDescription.length >= 120 && seoDescription.length <= 160 ? 'text-emerald-700' : 'text-[#C5A059]'}`}>
                      {seoDescription.length} / 160 characters (Optimal: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Compelling search result snippet with product benefits and craft heritage..."
                    className="w-full p-2.5 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#162B21] block">Clean URL Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. zuleikha-velvet-pheran"
                      className="w-full p-2 font-mono border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#162B21] block">Search Engine Directives</label>
                    <label className="flex items-center gap-2 p-2 border border-[#EBE4D8] bg-[#FAF8F5] rounded-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noIndex}
                        onChange={(e) => setNoIndex(e.target.checked)}
                        className="w-4 h-4 accent-[#162B21]"
                      />
                      <span className="text-[11px] text-[#525B56]">
                        {noIndex ? 'noindex, nofollow (Hidden from search)' : 'index, follow (Public Search Index)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Focus Keywords Chips */}
                <div className="space-y-2 pt-2 border-t border-[#F2EDE4]">
                  <label className="font-semibold text-[#162B21] block">Target Focus Keywords</label>
                  <div className="flex flex-wrap gap-1.5">
                    {focusKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono rounded-xs flex items-center gap-1"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => setFocusKeywords(focusKeywords.filter((k) => k !== kw))}
                          className="text-red-700 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add target keyword..."
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      className="flex-1 p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newKeywordInput.trim()) {
                          setFocusKeywords([...focusKeywords, newKeywordInput.trim().toLowerCase()]);
                          setNewKeywordInput('');
                        }
                      }}
                      className="px-4 py-2 bg-[#162B21] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                    >
                      Add Keyword
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#F2EDE4] flex justify-between items-center">
            <button
              type="button"
              onClick={handleAutoTune}
              className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Enrich Product Copy & SEO</span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#EBE4D8] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#F2EDE4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shadow-sm"
              >
                {productToEdit ? 'Save Piece Updates' : 'Commission Piece to Catalog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
