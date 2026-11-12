import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Layers,
  Eye,
  Sliders,
  Compass,
  Tag,
  Plus,
  Trash2,
} from 'lucide-react';
import { HomepageCMSConfig } from '../../types';
import { DEFAULT_HOMEPAGE_CMS, CURATED_HERITAGE_PRESETS } from '../../utils/homepageDefaults';

interface HomepageCmsPanelProps {
  config: HomepageCMSConfig;
  onUpdateConfig: (newConfig: HomepageCMSConfig) => void;
  onPreviewStorefront: () => void;
}

export const HomepageCmsPanel: React.FC<HomepageCmsPanelProps> = ({
  config,
  onUpdateConfig,
  onPreviewStorefront,
}) => {
  const [form, setForm] = useState<HomepageCMSConfig>(config);
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'lookbook' | 'heritage' | 'promo'>('hero');
  const [savedToast, setSavedToast] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(form);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all homepage imagery and content back to authentic atelier default presets?')) {
      setForm(DEFAULT_HOMEPAGE_CMS);
      onUpdateConfig(DEFAULT_HOMEPAGE_CMS);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }
  };

  const handleSelectPreset = (url: string) => {
    if (!assetPickerTarget) return;

    if (assetPickerTarget === 'hero') {
      setForm({ ...form, hero: { ...form.hero, imageUrl: url } });
    } else if (assetPickerTarget.startsWith('lookbook-')) {
      const id = assetPickerTarget.replace('lookbook-', '');
      setForm({
        ...form,
        lookbook: form.lookbook.map((item) => (item.id === id ? { ...item, imageUrl: url } : item)),
      });
    } else if (assetPickerTarget === 'heritage') {
      setForm({ ...form, heritage: { ...form.heritage, artisanImageUrl: url } });
    } else if (assetPickerTarget === 'promo') {
      setForm({ ...form, promoBanner: { ...form.promoBanner, imageUrl: url } });
    }

    setAssetPickerTarget(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl">
      {/* Top Header */}
      <div className="bg-[#162B21] text-[#FAF8F5] p-6 border-b border-[#DFC289]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#DFC289]" />
            <h3 className="font-serif text-2xl text-[#FAF8F5]">
              Homepage Visual Assets & CMS Editor
            </h3>
          </div>
          <p className="text-xs text-[#FAF8F5]/80 max-w-xl">
            Directly customize hero background photography, curated lookbook collection cards, artisan workshop portraits, and seasonal promotional banners across the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPreviewStorefront}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#DFC289] text-[#DFC289] hover:bg-[#DFC289] hover:text-[#162B21] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Homepage visual configuration successfully updated and published to the live storefront!</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-[#EBE4D8] bg-[#F2EDE4]/60 p-1.5 gap-2 text-xs uppercase tracking-wider font-semibold overflow-x-auto rounded-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2 rounded-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'hero'
              ? 'bg-[#162B21] text-[#FAF8F5] shadow-xs'
              : 'text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#DFC289]" />
          <span>1. Grand Hero Campaign</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('lookbook')}
          className={`px-4 py-2 rounded-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'lookbook'
              ? 'bg-[#162B21] text-[#FAF8F5] shadow-xs'
              : 'text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#DFC289]" />
          <span>2. Lookbook & Category Cards ({form.lookbook.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('heritage')}
          className={`px-4 py-2 rounded-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'heritage'
              ? 'bg-[#162B21] text-[#FAF8F5] shadow-xs'
              : 'text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#DFC289]" />
          <span>3. Artisan Workshop Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('promo')}
          className={`px-4 py-2 rounded-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'promo'
              ? 'bg-[#162B21] text-[#FAF8F5] shadow-xs'
              : 'text-[#525B56] hover:text-[#162B21]'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-[#DFC289]" />
          <span>4. Seasonal Harvest Banner</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* =========================================================================
            SUB-TAB 1: HERO CAMPAIGN BANNER
            ========================================================================= */}
        {activeSubTab === 'hero' && (
          <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#162B21]">
                  Grand Hero Campaign Banner
                </h4>
                <p className="text-xs text-[#525B56]">
                  The prominent full-width background photo and headline that patrons see when first arriving at Kāshida Couture.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAssetPickerTarget('hero')}
                className="px-3 py-1.5 bg-[#FAF8F5] border border-[#C5A059] text-[#162B21] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#C5A059] hover:text-[#FAF8F5] transition-colors cursor-pointer self-start sm:self-auto"
              >
                Choose from Presets
              </button>
            </div>

            {/* Live Hero Preview Box */}
            <div className="relative aspect-[21/9] w-full rounded-xs overflow-hidden border border-[#EBE4D8] shadow-inner bg-[#162B21]">
              <img
                src={form.hero.imageUrl}
                alt="Live Hero Preview"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#0E1D16]/95 via-[#162B21]/75 to-transparent"
                style={{ opacity: form.hero.overlayOpacity / 100 }}
              />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white max-w-xl space-y-2 pointer-events-none">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#DFC289] font-medium bg-[#162B21]/60 px-2 py-0.5 rounded-xs inline-block w-fit">
                  {form.hero.badge}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {form.hero.headline}
                </h2>
                <p className="text-[11px] text-[#FAF8F5]/80 line-clamp-2">
                  {form.hero.subheadline}
                </p>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-[#C5A059] text-[#162B21] text-[10px] font-bold uppercase tracking-wider">
                    {form.hero.ctaText}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Hero Background Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.hero.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, hero: { ...form.hero, imageUrl: e.target.value } })
                    }
                    placeholder="/src/assets/images/... or https://..."
                    className="flex-1 p-2.5 font-mono text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setAssetPickerTarget('hero')}
                    className="px-3 py-2 bg-[#162B21] text-[#FAF8F5] uppercase tracking-wider font-semibold text-[10px] rounded-xs cursor-pointer"
                  >
                    Select Preset
                  </button>
                </div>
                <span className="text-[10px] text-[#525B56]">
                  Supports local assets (/src/assets/images/...) or any high-resolution web URL.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Crest Badge Label
                </label>
                <input
                  type="text"
                  value={form.hero.badge}
                  onChange={(e) =>
                    setForm({ ...form, hero: { ...form.hero, badge: e.target.value } })
                  }
                  className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  value={form.hero.ctaText}
                  onChange={(e) =>
                    setForm({ ...form, hero: { ...form.hero, ctaText: e.target.value } })
                  }
                  className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Main Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.hero.headline}
                  onChange={(e) =>
                    setForm({ ...form, hero: { ...form.hero, headline: e.target.value } })
                  }
                  className="w-full p-2.5 font-serif text-sm font-semibold border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Subtitle Narrative *
                </label>
                <textarea
                  rows={3}
                  value={form.hero.subheadline}
                  onChange={(e) =>
                    setForm({ ...form, hero: { ...form.hero, subheadline: e.target.value } })
                  }
                  className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Dark Scrim Overlay Contrast: {form.hero.overlayOpacity}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={form.hero.overlayOpacity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hero: { ...form.hero, overlayOpacity: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-[#162B21] cursor-pointer"
                />
                <span className="text-[10px] text-[#525B56]">
                  Ensures white text remains easily legible over brighter photography.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 2: LOOKBOOK & CATEGORY SHOWCASE CARDS
            ========================================================================= */}
        {activeSubTab === 'lookbook' && (
          <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-6 shadow-xs">
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#162B21]">
                Curated Collection Cards & Lookbook Gallery
              </h4>
              <p className="text-xs text-[#525B56]">
                Customize the high-fidelity imagery and editorial copy for featured Kashmiri archives on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.lookbook.map((card, index) => (
                <div
                  key={card.id}
                  className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-2">
                    <span className="font-serif text-xs font-bold text-[#162B21] uppercase tracking-wider">
                      Card #{index + 1}: {card.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAssetPickerTarget(`lookbook-${card.id}`)}
                      className="text-[10px] text-[#C5A059] hover:underline font-semibold cursor-pointer"
                    >
                      Swap Image Preset
                    </button>
                  </div>

                  <div className="relative aspect-[16/9] bg-[#EBE4D8] rounded-xs overflow-hidden border border-[#EBE4D8]">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#162B21]/90 text-[#DFC289] text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs">
                      {card.categoryTag}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#162B21] block">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={card.imageUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            lookbook: form.lookbook.map((c) =>
                              c.id === card.id ? { ...c, imageUrl: val } : c
                            ),
                          });
                        }}
                        className="w-full p-2 font-mono text-xs border border-[#EBE4D8] bg-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-semibold text-[#162B21] block">Card Title</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm({
                              ...form,
                              lookbook: form.lookbook.map((c) =>
                                c.id === card.id ? { ...c, title: val } : c
                              ),
                            });
                          }}
                          className="w-full p-2 text-xs border border-[#EBE4D8] bg-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[#162B21] block">Tag Badge</label>
                        <input
                          type="text"
                          value={card.categoryTag}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm({
                              ...form,
                              lookbook: form.lookbook.map((c) =>
                                c.id === card.id ? { ...c, categoryTag: val } : c
                              ),
                            });
                          }}
                          className="w-full p-2 text-xs border border-[#EBE4D8] bg-white focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#162B21] block">Subtitle Narrative</label>
                      <input
                        type="text"
                        value={card.subtitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            lookbook: form.lookbook.map((c) =>
                              c.id === card.id ? { ...c, subtitle: val } : c
                            ),
                          });
                        }}
                        className="w-full p-2 text-xs border border-[#EBE4D8] bg-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 3: ARTISAN HERITAGE & ATELIER STORY MEDIA
            ========================================================================= */}
        {activeSubTab === 'heritage' && (
          <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#162B21]">
                  Master Artisan & Workshop Heritage Story
                </h4>
                <p className="text-xs text-[#525B56]">
                  The atmospheric documentary photograph and historical dossier honoring Srinagar's multi-generational needlework Ustads.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAssetPickerTarget('heritage')}
                className="px-3 py-1.5 bg-[#FAF8F5] border border-[#C5A059] text-[#162B21] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#C5A059] hover:text-[#FAF8F5] transition-colors cursor-pointer self-start sm:self-auto"
              >
                Choose Artisan Photo Preset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Image Preview & Dossier */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-[#EBE4D8] shadow-md bg-[#162B21]">
                  <img
                    src={form.heritage.artisanImageUrl}
                    alt={form.heritage.artisanImageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162B21]/70 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#EBE4D8] text-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold block">
                    Atelier Dossier Caption
                  </span>
                  <p className="font-serif font-semibold text-[#162B21]">
                    {form.heritage.dossierTitle}
                  </p>
                  <p className="text-[11px] text-[#525B56]">
                    {form.heritage.dossierDescription}
                  </p>
                </div>
              </div>

              {/* Edit Fields */}
              <div className="md:col-span-7 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#162B21] block">
                    Artisan Workshop Photograph URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.heritage.artisanImageUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heritage: { ...form.heritage, artisanImageUrl: e.target.value },
                      })
                    }
                    className="w-full p-2.5 font-mono text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#162B21] block">
                      Section Supertitle Tag
                    </label>
                    <input
                      type="text"
                      value={form.heritage.subheadline}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          heritage: { ...form.heritage, subheadline: e.target.value },
                        })
                      }
                      className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#162B21] block">
                      Dossier Inscription Title
                    </label>
                    <input
                      type="text"
                      value={form.heritage.dossierTitle}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          heritage: { ...form.heritage, dossierTitle: e.target.value },
                        })
                      }
                      className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#162B21] block">
                    Heritage Main Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.heritage.headline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heritage: { ...form.heritage, headline: e.target.value },
                      })
                    }
                    className="w-full p-2.5 font-serif text-sm font-semibold border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#162B21] block">
                    Dossier Technique & Stitch Density Note
                  </label>
                  <input
                    type="text"
                    value={form.heritage.dossierDescription}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heritage: { ...form.heritage, dossierDescription: e.target.value },
                      })
                    }
                    className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#162B21] block">
                    Narrative Paragraph 1 *
                  </label>
                  <textarea
                    rows={3}
                    value={form.heritage.narrativeParagraph1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heritage: { ...form.heritage, narrativeParagraph1: e.target.value },
                      })
                    }
                    className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#162B21] block">
                    Narrative Paragraph 2
                  </label>
                  <textarea
                    rows={2}
                    value={form.heritage.narrativeParagraph2}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heritage: { ...form.heritage, narrativeParagraph2: e.target.value },
                      })
                    }
                    className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB 4: SEASONAL PROMOTIONAL BANNER
            ========================================================================= */}
        {activeSubTab === 'promo' && (
          <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EDE4] pb-4">
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#162B21]">
                  Seasonal Harvest & Campaign Promotion Banner
                </h4>
                <p className="text-xs text-[#525B56]">
                  A high-impact banner highlighting seasonal commissions, couture prive discounts, or bespoke gift sets.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#F2EDE4]/60 px-3 py-1.5 rounded-xs border border-[#EBE4D8]">
                <input
                  type="checkbox"
                  checked={form.promoBanner.enabled}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      promoBanner: { ...form.promoBanner, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#162B21]"
                />
                <span className="text-xs font-semibold text-[#162B21]">Enable Banner on Homepage</span>
              </label>
            </div>

            {/* Live Preview */}
            <div className="relative aspect-[21/7] rounded-xs overflow-hidden border border-[#EBE4D8] shadow-inner bg-[#162B21]">
              <img
                src={form.promoBanner.imageUrl}
                alt="Promo Banner Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1D16]/95 via-[#162B21]/80 to-transparent flex items-center p-6 text-white max-w-lg space-y-1">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#DFC289] font-bold">
                    {form.promoBanner.badge}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                    {form.promoBanner.title}
                  </h3>
                  <p className="text-[10px] text-white/80 line-clamp-2">
                    {form.promoBanner.subtitle}
                  </p>
                  <span className="inline-block mt-2 font-mono text-[10px] bg-[#C5A059] text-[#162B21] px-2 py-0.5 font-bold uppercase rounded-xs">
                    Code: {form.promoBanner.couponCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">
                  Promotional Background Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.promoBanner.imageUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        promoBanner: { ...form.promoBanner, imageUrl: e.target.value },
                      })
                    }
                    className="flex-1 p-2.5 font-mono text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setAssetPickerTarget('promo')}
                    className="px-3 py-2 bg-[#162B21] text-[#FAF8F5] uppercase tracking-wider font-semibold text-[10px] rounded-xs cursor-pointer"
                  >
                    Select Preset
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] block">Campaign Badge</label>
                <input
                  type="text"
                  value={form.promoBanner.badge}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      promoBanner: { ...form.promoBanner, badge: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] block">Promo Code</label>
                <input
                  type="text"
                  value={form.promoBanner.couponCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      promoBanner: { ...form.promoBanner, couponCode: e.target.value.toUpperCase() },
                    })
                  }
                  className="w-full p-2.5 font-mono text-xs uppercase border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">Banner Headline</label>
                <input
                  type="text"
                  value={form.promoBanner.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      promoBanner: { ...form.promoBanner, title: e.target.value },
                    })
                  }
                  className="w-full p-2.5 font-serif text-sm font-semibold border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#162B21] block">Subtitle Offer Terms</label>
                <input
                  type="text"
                  value={form.promoBanner.subtitle}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      promoBanner: { ...form.promoBanner, subtitle: e.target.value },
                    })
                  }
                  className="w-full p-2.5 text-xs border border-[#EBE4D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons: Save & Reset */}
        <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#EBE4D8] hover:border-[#681A24] text-[#525B56] hover:text-[#681A24] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Royal Presets</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs cursor-pointer shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#DFC289]" />
            <span>Save & Publish to Storefront</span>
          </button>
        </div>
      </form>

      {/* Asset Picker Modal */}
      {assetPickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl rounded-xs max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-semibold text-[#162B21]">
                  Kashmiri Royal Fashion Asset Presets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssetPickerTarget(null)}
                className="text-xs text-[#525B56] hover:text-[#162B21] cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <p className="text-xs text-[#525B56]">
              Select any authenticated high-resolution photograph to instantly apply it to your selected homepage section.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CURATED_HERITAGE_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className="group p-2.5 bg-white border border-[#EBE4D8] hover:border-[#C5A059] rounded-xs cursor-pointer transition-all space-y-2 shadow-xs"
                >
                  <div className="aspect-[16/10] bg-[#EBE4D8] rounded-xs overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold block">
                      {preset.category}
                    </span>
                    <h5 className="font-serif text-xs font-semibold text-[#162B21] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                      {preset.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
