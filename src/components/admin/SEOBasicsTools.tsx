import React, { useState } from 'react';
import {
  BookOpen,
  FileCode,
  Download,
  Copy,
  Check,
  Sparkles,
  Zap,
  Image,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Product, CategoryConfig, SEOConfig } from '../../types';

interface SEOBasicsToolsProps {
  products: Product[];
  categories: CategoryConfig[];
  seoConfig: SEOConfig;
  onUpdateProduct: (product: Product) => void;
}

export const SEOBasicsTools: React.FC<SEOBasicsToolsProps> = ({
  products,
  categories,
  seoConfig,
  onUpdateProduct,
}) => {
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [altToast, setAltToast] = useState<string | null>(null);

  // Generate XML Sitemap
  const baseUrl = seoConfig.canonicalUrl || 'https://kashida-couture.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Curated Category Collections -->
${categories
  .map(
    (c) => `  <url>
    <loc>${baseUrl}/collections/${c.slug || c.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join('\n')}

  <!-- Individual Couture Creations -->
${products
  .map(
    (p) => `  <url>
    <loc>${baseUrl}/products/${p.slug || p.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  // Generate robots.txt
  const robotsTxt = `# Kāshida Couture Production Search Directives
User-agent: *
Allow: /
Allow: /collections/
Allow: /products/
Disallow: /admin/
Disallow: /checkout/

# High-Resolution Image Crawlers
User-agent: Googlebot-Image
Allow: /src/assets/images/

# Primary XML Sitemap Location
Sitemap: ${baseUrl}/sitemap.xml
`;

  // Check how many products miss Image ALT
  const productsMissingAlt = products.filter(
    (p) => !p.imageAlt || p.imageAlt.trim().length < 5
  );

  // 1-Click Auto-Generate Image ALT tags
  const handleAutoGenerateAlts = () => {
    let count = 0;
    products.forEach((p) => {
      if (!p.imageAlt || p.imageAlt.trim().length < 5) {
        const enrichedAlt = `Handcrafted ${p.name} in ${p.fabric} featuring authentic Kashmiri ${p.embroidery} needlework`;
        onUpdateProduct({ ...p, imageAlt: enrichedAlt });
        count++;
      }
    });

    setAltToast(`Successfully generated semantic ALT tags for ${count} catalog piece(s)!`);
    setTimeout(() => setAltToast(null), 3500);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Introduction Banner */}
      <div className="p-6 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A059] font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Search Engine Fundamentals & Production Tools</span>
        </div>
        <h3 className="font-serif text-2xl text-[#162B21]">
          E-Commerce SEO From the Ground Up
        </h3>
        <p className="text-xs text-[#525B56] max-w-3xl leading-relaxed">
          Search Engine Optimization (SEO) in today’s luxury apparel market bridges traditional artisanal storytelling with modern semantic web crawlers. Follow these core principles to maximize Google SERP visibility and click-through rates.
        </p>
      </div>

      {/* 6 Foundational SEO Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar 1 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              01
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              Page Titles (&lt;title&gt;)
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            Google snippets display approximately <strong>30 to 60 characters</strong> before truncating. Structure product titles with the garment name followed by fabric and craft:
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            Zuleikha Velvet Pheran — Handcrafted Tilla Couture
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              02
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              Meta Descriptions
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            Keep descriptions between <strong>120 and 160 characters</strong>. Summarize value, weave authentic needlework keywords, and include a clear call-to-action without keyword stuffing.
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            Discover royal Kashmiri velvet pherans cut to order in Srinagar with 24k gold wash Tilla. Insured global transit.
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              03
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              Image ALT Attributes
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            Over 22% of fashion searches occur on <strong>Google Image Search</strong>. Missing ALT tags blind crawlers. Use descriptive phrasing detailing color, fabric, and needlework.
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            alt="Emerald velvet Kashmiri pheran with antique gold Tilla needlework"
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              04
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              Schema.org JSON-LD
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            Microdata allows Google to display <strong>rich product snippets</strong> including star ratings, price currency, in-stock badges, and artisan brand provenance directly in search results.
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            @type: "Product", offers: { price: "42500", currency: "INR" }
          </div>
        </div>

        {/* Pillar 5 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              05
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              Clean URL Architecture
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            Use lowercase hyphens and semantic slugs. Avoid database IDs or special characters. Crawlers use URL hierarchies to understand catalog taxonomy.
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            /collections/pherans/zuleikha-emerald-pheran
          </div>
        </div>

        {/* Pillar 6 */}
        <div className="p-4 bg-white border border-[#EBE4D8] rounded-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs">
              06
            </span>
            <h4 className="font-serif text-base font-semibold text-[#162B21]">
              OpenGraph & Social Cards
            </h4>
          </div>
          <p className="text-xs text-[#525B56] leading-relaxed">
            When patrons share luxury pieces on WhatsApp, iMessage, Discord, or X, OpenGraph tags (<code className="font-mono">og:image</code>, <code className="font-mono">og:title</code>) render full-bleed hero cards.
          </p>
          <div className="p-2 bg-[#FAF8F5] font-mono text-[11px] text-[#162B21] border border-[#EBE4D8] rounded-xs">
            meta property="og:image" content="https://.../hero.jpg"
          </div>
        </div>
      </div>

      {/* Catalog Image ALT Audit & Auto-Enricher */}
      <div className="p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-lg font-semibold text-[#162B21]">
                Catalog Image ALT Tag Health Audit
              </h4>
            </div>
            <p className="text-xs text-[#525B56] mt-0.5">
              {productsMissingAlt.length === 0
                ? 'All catalog products possess verified descriptive Image ALT tags for Google Image Search discovery!'
                : `${productsMissingAlt.length} catalog piece(s) lack custom Image ALT text, harming visual search ranking.`}
            </p>
          </div>

          {productsMissingAlt.length > 0 && (
            <button
              type="button"
              onClick={handleAutoGenerateAlts}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold cursor-pointer rounded-xs transition-colors shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-[#DFC289]" />
              <span>Auto-Enrich All Missing ALTs</span>
            </button>
          )}
        </div>

        {altToast && (
          <div className="p-3 bg-emerald-100 text-emerald-900 text-xs flex items-center gap-2 rounded-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{altToast}</span>
          </div>
        )}
      </div>

      {/* Production Tools: XML Sitemap & Robots.txt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XML Sitemap Generator */}
        <div className="p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-base font-semibold text-[#162B21]">
                Live XML Sitemap (sitemap.xml)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(xmlSitemap);
                  setCopiedSitemap(true);
                  setTimeout(() => setCopiedSitemap(false), 2000);
                }}
                className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSitemap ? 'Copied XML!' : 'Copy XML'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadFile(xmlSitemap, 'sitemap.xml', 'application/xml')}
                className="text-xs text-[#162B21] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-[#525B56]">
            Automatically compiled with {1 + categories.length + products.length} search-indexed URLs (Homepage, Collections, Products).
          </p>
          <pre className="p-3 bg-[#162B21] text-[#DFC289] font-mono text-[10px] rounded-xs overflow-x-auto max-h-52 leading-relaxed">
            {xmlSitemap}
          </pre>
        </div>

        {/* Robots.txt Generator */}
        <div className="p-5 bg-white border border-[#EBE4D8] rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-base font-semibold text-[#162B21]">
                Search Directives (robots.txt)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(robotsTxt);
                  setCopiedRobots(true);
                  setTimeout(() => setCopiedRobots(false), 2000);
                }}
                className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedRobots ? 'Copied Robots!' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadFile(robotsTxt, 'robots.txt', 'text/plain')}
                className="text-xs text-[#162B21] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-[#525B56]">
            Instructs Googlebot and image indexers while safeguarding private backoffice and checkout routes.
          </p>
          <pre className="p-3 bg-[#162B21] text-[#DFC289] font-mono text-[10px] rounded-xs overflow-x-auto max-h-52 leading-relaxed">
            {robotsTxt}
          </pre>
        </div>
      </div>
    </div>
  );
};
