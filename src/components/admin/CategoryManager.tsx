import React, { useState } from 'react';
import {
  FolderPlus,
  Edit2,
  Trash2,
  Image,
  Upload,
  Sparkles,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CategoryConfig, Product } from '../../types';

interface CategoryManagerProps {
  categories: CategoryConfig[];
  products: Product[];
  onAddCategory: (category: CategoryConfig) => void;
  onUpdateCategory: (category: CategoryConfig) => void;
  onDeleteCategory: (categoryId: string) => void;
  onNavigateToCategory: (categoryId: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onNavigateToCategory,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('/src/assets/images/product_velvet_pheran_1794059618066.jpg');
  const [formImageAlt, setFormImageAlt] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formNeedlework, setFormNeedlework] = useState('');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [previewSnippet, setPreviewSnippet] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const presetImages = [
    { url: '/src/assets/images/product_velvet_pheran_1794059618066.jpg', label: 'Emerald Velvet Pheran' },
    { url: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg', label: 'Ivory Pashmina Shawl' },
    { url: '/src/assets/images/product_silk_kurta_1794059619841.jpg', label: 'Raw Silk Kurta' },
    { url: '/src/assets/images/hero_kashida_couture_1794059616415.jpg', label: 'Autumn Velvet Silhouette' },
    { url: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg', label: 'Atelier Artisan Weave' },
  ];

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormId(`cat-${Date.now().toString().slice(-4)}`);
    setFormName('');
    setFormSubtitle('');
    setFormDescription('');
    setFormImage('/src/assets/images/product_velvet_pheran_1794059618066.jpg');
    setFormImageAlt('');
    setFormSlug('');
    setFormNeedlework('Handcrafted Kashida Needlework');
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormIsFeatured(true);
    setCustomImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryConfig) => {
    setEditingCategory(cat);
    setFormId(cat.id);
    setFormName(cat.name);
    setFormSubtitle(cat.subtitle);
    setFormDescription(cat.description);
    setFormImage(cat.image);
    setFormImageAlt(cat.imageAlt || `${cat.name} Kashmiri Luxury Collection`);
    setFormSlug(cat.slug);
    setFormNeedlework(cat.needleworkFocus || 'Authentic Kashmiri Craft');
    setFormMetaTitle(cat.metaTitle || `${cat.name} — Luxury Kashmiri Couture`);
    setFormMetaDesc(cat.metaDescription || cat.description);
    setFormIsFeatured(cat.isFeatured ?? true);
    setCustomImageUrl('');
    setIsModalOpen(true);
  };

  // Auto-slugify on name change if new
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
      setFormId(generatedSlug || `cat-${Date.now()}`);
      setFormMetaTitle(`${val} — Luxury Kashmiri Couture`);
      setFormImageAlt(`Handcrafted Kashmiri ${val} Collection`);
    }
  };

  // Local file upload to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const finalImage = customImageUrl.trim() || formImage;
    const finalSlug = formSlug.trim() || formId;

    const payload: CategoryConfig = {
      id: formId.trim() || finalSlug,
      name: formName.trim(),
      subtitle: formSubtitle.trim() || 'Curated Kashmiri Haute Couture',
      description: formDescription.trim(),
      image: finalImage,
      imageAlt: formImageAlt.trim() || `${formName} Kashmiri Haute Couture`,
      slug: finalSlug,
      needleworkFocus: formNeedlework.trim(),
      metaTitle: formMetaTitle.trim() || `${formName} — Luxury Kashmiri Couture`,
      metaDescription: formMetaDesc.trim() || formDescription.trim(),
      isFeatured: formIsFeatured,
    };

    if (editingCategory) {
      onUpdateCategory(payload);
      setToastMessage(`Updated category "${payload.name}" successfully!`);
    } else {
      onAddCategory(payload);
      setToastMessage(`Created new category "${payload.name}"!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Controls */}
      <div className="p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              <Layers className="w-4 h-4" />
              <span>Taxonomy & Collection Architecture</span>
            </div>
            <h3 className="font-serif text-2xl text-[#162B21] mt-0.5">
              Category & Collection Manager
            </h3>
            <p className="text-xs text-[#525B56] max-w-2xl mt-1 leading-relaxed">
              Add custom categories, assign bespoke banner images, configure needlework specializations, and calibrate collection-level Google search metadata.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shadow-xs rounded-xs shrink-0"
          >
            <FolderPlus className="w-4 h-4 text-[#DFC289]" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-[#525B56]">
            Total Active Collections: <strong className="font-mono text-[#162B21]">{categories.length}</strong>
          </span>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections..."
              className="w-full pl-9 pr-3 py-1.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059] rounded-xs"
            />
          </div>
        </div>

        {toastMessage && (
          <div className="p-3 bg-emerald-100 text-emerald-900 text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id);
          return (
            <div
              key={cat.id}
              className="bg-white border border-[#EBE4D8] rounded-xs overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-sm group"
            >
              <div>
                {/* Banner Image Preview */}
                <div className="relative aspect-[16/9] bg-[#F2EDE4]/60 overflow-hidden border-b border-[#EBE4D8]">
                  <img
                    src={cat.image}
                    alt={cat.imageAlt || cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#162B21]/90 backdrop-blur-xs text-[#DFC289] text-[10px] font-mono px-2 py-0.5 rounded-xs font-semibold">
                    {catProducts.length} piece(s)
                  </div>
                  {cat.isFeatured && (
                    <div className="absolute top-2.5 right-2.5 bg-[#C5A059] text-[#162B21] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">
                    <span>ID: {cat.id}</span>
                    <span>·</span>
                    <span className="font-mono">/{cat.slug}</span>
                  </div>

                  <h4 className="font-serif text-lg font-semibold text-[#162B21] leading-snug">
                    {cat.name}
                  </h4>

                  <p className="text-xs text-[#525B56] line-clamp-1 italic">
                    {cat.subtitle}
                  </p>

                  <p className="text-xs text-[#525B56] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {cat.needleworkFocus && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-[#162B21]">
                      <span className="text-[#C5A059] font-semibold">Needlework:</span>
                      <span className="font-mono">{cat.needleworkFocus}</span>
                    </div>
                  )}

                  {/* SEO Status Tag */}
                  <div className="pt-2 flex items-center gap-2 border-t border-[#F2EDE4] text-[10px] text-[#525B56]">
                    <span className="px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs font-mono">
                      SEO: {cat.metaTitle ? 'Configured ✓' : 'Default'}
                    </span>
                    <span className="truncate">
                      ALT: "{cat.imageAlt || 'Default'}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-[#FAF8F5] border-t border-[#EBE4D8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigateToCategory(cat.id)}
                  className="text-xs text-[#162B21] hover:text-[#C5A059] flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>View in Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 hover:bg-[#F2EDE4] text-[#162B21] rounded-xs cursor-pointer"
                    title="Edit Category Details & SEO"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove category "${cat.name}"? ${catProducts.length} product(s) currently use it.`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 text-[#681A24] rounded-xs cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#EBE4D8] p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 rounded-xs">
            <div className="flex justify-between items-center border-b border-[#F2EDE4] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                  {editingCategory ? 'Update Collection' : 'Commission New Collection'}
                </span>
                <h3 className="font-serif text-xl text-[#162B21]">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category & Imagery'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#525B56] hover:text-[#162B21] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Bridal Trousseau"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Category ID (Internal Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. trousseau"
                    className="w-full p-2 font-mono border border-[#EBE4D8] bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162B21] block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. royal-trousseau"
                    className="w-full p-2 font-mono border border-[#EBE4D8] bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Subtitle / Heirloom Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavy Silk Velvet Embroidered with 24k Gold Wash Tilla"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Collection Narrative & Provenance *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the textile heritage, needlework technique, and occasion..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 border border-[#EBE4D8] bg-white text-xs text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#162B21] block mb-1">
                    Needlework & Craft Specialization
                  </label>
                  <input
                    type="text"
                    value={formNeedlework}
                    onChange={(e) => setFormNeedlework(e.target.value)}
                    placeholder="e.g. Tilla Metallic Zari, Sozni Needlework, Aari Stitch"
                    className="w-full p-2 border border-[#EBE4D8] bg-white text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Category Imagery & Banner Section */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
                <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                  Category Banner Imagery & ALT Tag (SEO)
                </span>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={customImageUrl.trim() || formImage}
                    alt={formImageAlt || formName}
                    className="w-32 h-20 object-cover border border-[#EBE4D8] rounded-xs shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <label className="block text-[11px] font-medium text-[#162B21]">
                      Choose from Atelier Preset Assets:
                    </label>
                    <select
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setCustomImageUrl('');
                      }}
                      className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none cursor-pointer"
                    >
                      {presetImages.map((p) => (
                        <option key={p.url} value={p.url}>
                          {p.label}
                        </option>
                      ))}
                    </select>

                    <div className="pt-1 space-y-1">
                      <label className="block text-[11px] font-medium text-[#162B21]">
                        Or Paste Custom High-Res Image URL:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or custom CDN"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="pt-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#EBE4D8] bg-[#FAF8F5] hover:bg-[#F2EDE4] text-xs font-medium cursor-pointer rounded-xs">
                        <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image ALT Tag for Google Image SEO */}
                <div className="space-y-1 pt-2 border-t border-[#F2EDE4]">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-[#162B21] text-[11px]">
                      Image ALT Text (Search Engine Image Discovery) *
                    </label>
                    <span className="text-[10px] text-[#525B56]">Accessible description for Googlebot</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handcrafted royal Kashmiri velvet pheran with gold tilla needlework"
                    value={formImageAlt}
                    onChange={(e) => setFormImageAlt(e.target.value)}
                    className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Collection SEO Configuration */}
              <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px]">
                    Collection Search Engine Metadata (SEO)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewSnippet(!previewSnippet)}
                    className="text-[11px] text-[#C5A059] underline cursor-pointer"
                  >
                    {previewSnippet ? 'Hide Google Preview' : 'Show Google Preview'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="font-medium text-[#162B21]">Page Meta Title</label>
                    <span className={`font-mono text-[10px] ${formMetaTitle.length >= 30 && formMetaTitle.length <= 60 ? 'text-emerald-700' : 'text-[#C5A059]'}`}>
                      {formMetaTitle.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formMetaTitle}
                    onChange={(e) => setFormMetaTitle(e.target.value)}
                    placeholder="e.g. Royal Kashmiri Pherans — Handcrafted Tilla Couture"
                    className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="font-medium text-[#162B21]">Meta Description Snippet</label>
                    <span className={`font-mono text-[10px] ${formMetaDesc.length >= 120 && formMetaDesc.length <= 160 ? 'text-emerald-700' : 'text-[#C5A059]'}`}>
                      {formMetaDesc.length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formMetaDesc}
                    onChange={(e) => setFormMetaDesc(e.target.value)}
                    placeholder="Provide a compelling 120-160 character summary for search results..."
                    className="w-full p-2 border border-[#EBE4D8] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {previewSnippet && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Google SERP Result Preview
                    </span>
                    <div className="text-[11px] text-[#202124]">
                      https://kashida-couture.com › collections › {formSlug || formId}
                    </div>
                    <h5 className="text-sm font-medium text-[#1a0dab] line-clamp-1">
                      {formMetaTitle || `${formName} — Kāshida Couture`}
                    </h5>
                    <p className="text-xs text-[#4d5156] line-clamp-2">
                      {formMetaDesc || formDescription || 'Explore authentic Kashmiri haute couture hand-embroidered in Srinagar.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#162B21]"
                  />
                  <span className="font-semibold text-[#162B21]">Feature on Public Storefront & Homepage Showcase</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#F2EDE4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#EBE4D8] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#F2EDE4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#234233] transition-colors shadow-sm"
                >
                  {editingCategory ? 'Save Collection Updates' : 'Publish Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
