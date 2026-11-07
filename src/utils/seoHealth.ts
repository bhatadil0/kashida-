import { Product, SEOConfig, ProductSEOScore, CatalogSEOHealthSummary } from '../types';

/**
 * Parses and extracts target keyword tokens from global SEOConfig
 * merged with foundational Kashmiri couture high-intent search terms.
 */
export function extractTargetKeywords(seoConfig?: SEOConfig): string[] {
  const baseCraftKeywords = [
    'kashmiri',
    'pashmina',
    'pheran',
    'tilla',
    'sozni',
    'aari',
    'silk',
    'velvet',
    'handcrafted',
    'srinagar',
    'changthangi',
    'cashmere',
    'kurta',
    'stole',
  ];

  if (!seoConfig || !seoConfig.keywords) {
    return baseCraftKeywords;
  }

  const customKeywords = seoConfig.keywords
    .toLowerCase()
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 2);

  // Combine and deduplicate
  return Array.from(new Set([...customKeywords, ...baseCraftKeywords]));
}

/**
 * Calculates a comprehensive Content Quality Score (0-100) and diagnostics
 * for a single product based on target keywords, title length, and description richness.
 */
export function calculateProductSEOScore(
  product: Product,
  seoConfig?: SEOConfig
): ProductSEOScore {
  const targetKeywords = extractTargetKeywords(seoConfig);

  const titleText = (product.name || '').trim();
  const subtitleText = (product.subtitle || '').trim();
  const descText = (product.description || '').trim();
  const craftText = (product.craftsmanship || '').trim();
  const fabricText = (product.fabric || '').trim();
  const embroideryText = (product.embroidery || '').trim();

  const combinedSearchableContent = [
    titleText,
    subtitleText,
    descText,
    craftText,
    fabricText,
    embroideryText,
  ]
    .join(' ')
    .toLowerCase();

  const detectedKeywords: string[] = [];
  const missingTargetKeywords: string[] = [];

  targetKeywords.forEach((kw) => {
    if (combinedSearchableContent.includes(kw.toLowerCase())) {
      detectedKeywords.push(kw);
    } else {
      missingTargetKeywords.push(kw);
    }
  });

  const recommendations: ProductSEOScore['recommendations'] = [];

  // =========================================================================
  // 1. KEYWORDS CRITERIA (Weight: 35 points)
  // =========================================================================
  let keywordsScore = 0;

  // Title keyword presence (up to 15 pts)
  const titleLower = titleText.toLowerCase();
  const titleHasKeyword = targetKeywords.some((kw) => titleLower.includes(kw));
  if (titleHasKeyword) {
    keywordsScore += 15;
  } else {
    recommendations.push({
      type: 'KEYWORDS',
      severity: 'WARNING',
      message: 'Product title is missing a high-intent target keyword (e.g. "Pashmina", "Velvet", "Pheran", or "Tilla").',
      suggestedFix: `Incorporate "${targetKeywords[0] || 'Kashmiri'}" into the title.`,
    });
  }

  // Subtitle / snippet keyword presence (up to 10 pts)
  const subtitleLower = subtitleText.toLowerCase();
  const subtitleHasKeyword = targetKeywords.some((kw) => subtitleLower.includes(kw));
  if (subtitleHasKeyword) {
    keywordsScore += 10;
  } else if (subtitleText.length > 0) {
    recommendations.push({
      type: 'KEYWORDS',
      severity: 'TIP',
      message: 'Subtitle could mention authentic craft techniques to boost rich search snippet CTR.',
      suggestedFix: `Add craft details such as "${embroideryText || 'Handcrafted Kashida'}" to subtitle.`,
    });
  }

  // Overall keyword breadth in description and craft dossier (up to 10 pts)
  const breadthCount = detectedKeywords.length;
  if (breadthCount >= 5) {
    keywordsScore += 10;
  } else if (breadthCount >= 3) {
    keywordsScore += 7;
  } else if (breadthCount >= 1) {
    keywordsScore += 4;
  } else {
    recommendations.push({
      type: 'KEYWORDS',
      severity: 'CRITICAL',
      message: 'Product copy has negligible target keyword density. Search crawlers may categorize it as generic apparel.',
      suggestedFix: `Weave terms like "${missingTargetKeywords.slice(0, 3).join(', ')}" naturally into the narrative.`,
    });
  }

  keywordsScore = Math.min(35, keywordsScore);

  // =========================================================================
  // 2. TITLE LENGTH & SNIPPET FORMATTING (Weight: 30 points)
  // =========================================================================
  let titleScore = 0;
  const titleLength = titleText.length;

  if (titleLength >= 32 && titleLength <= 58) {
    // Optimal Google SERP display (no truncation, high clarity)
    titleScore = 30;
  } else if (titleLength >= 24 && titleLength < 32) {
    titleScore = 23;
    recommendations.push({
      type: 'TITLE',
      severity: 'TIP',
      message: `Title length (${titleLength} chars) is slightly brief. Ideal range is 32-58 chars for maximum SERP presence.`,
      suggestedFix: `Expand title with needlework or fabric specification (e.g., "${titleText} with ${embroideryText}").`,
    });
  } else if (titleLength > 58 && titleLength <= 68) {
    titleScore = 22;
    recommendations.push({
      type: 'TITLE',
      severity: 'TIP',
      message: `Title length (${titleLength} chars) risks truncation on smaller mobile screens.`,
      suggestedFix: 'Condense title to under 60 characters for crisp mobile display.',
    });
  } else if (titleLength > 0 && titleLength < 24) {
    titleScore = 12;
    recommendations.push({
      type: 'TITLE',
      severity: 'CRITICAL',
      message: `Title is critically short (${titleLength} chars). Search engines favor descriptive titles with craft context.`,
      suggestedFix: `Expand to include style, fabric, and craft (e.g. "${titleText} — Pure ${fabricText}").`,
    });
  } else if (titleLength > 68) {
    titleScore = 14;
    recommendations.push({
      type: 'TITLE',
      severity: 'WARNING',
      message: `Title is too long (${titleLength} chars) and will be truncated by Google with "..." dots.`,
      suggestedFix: 'Shorten title by placing accessory descriptions into the subtitle.',
    });
  } else {
    titleScore = 0;
    recommendations.push({
      type: 'TITLE',
      severity: 'CRITICAL',
      message: 'Product title is empty.',
      suggestedFix: 'Provide an evocative luxury title for this piece.',
    });
  }

  // =========================================================================
  // 3. DESCRIPTION RICHNESS & METADATA DEPTH (Weight: 35 points)
  // =========================================================================
  let descriptionScore = 0;
  const descLength = descText.length;
  const words = descText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Primary description depth (up to 15 pts)
  if (descLength >= 180) {
    descriptionScore += 15;
  } else if (descLength >= 120) {
    descriptionScore += 11;
    recommendations.push({
      type: 'DESCRIPTION',
      severity: 'TIP',
      message: `Description (${descLength} chars) is acceptable but expanding past 180 chars provides rich context for AI search summaries.`,
    });
  } else if (descLength >= 60) {
    descriptionScore += 6;
    recommendations.push({
      type: 'DESCRIPTION',
      severity: 'WARNING',
      message: `Description is thin (${descLength} chars). Search algorithms prioritize products with deep textile narratives.`,
      suggestedFix: 'Elaborate on the silhouette, drape, and origin of the embroidery motif.',
    });
  } else {
    descriptionScore += 2;
    recommendations.push({
      type: 'DESCRIPTION',
      severity: 'CRITICAL',
      message: 'Product description is critically insufficient for e-commerce SEO indexing.',
      suggestedFix: 'Write at least two sentences detailing the garment provenance and artisan weave.',
    });
  }

  // Subtitle presence and depth (up to 8 pts)
  if (subtitleText.length >= 25) {
    descriptionScore += 8;
  } else if (subtitleText.length > 0) {
    descriptionScore += 4;
  } else {
    recommendations.push({
      type: 'DESCRIPTION',
      severity: 'WARNING',
      message: 'Missing product subtitle. Subtitles provide the primary meta snippet for card shares.',
      suggestedFix: 'Add a rich subtitle highlighting fabric, palette, and needlework.',
    });
  }

  // Craftsmanship dossier documentation (up to 6 pts)
  if (craftText.length >= 40) {
    descriptionScore += 6;
  } else if (craftText.length > 0) {
    descriptionScore += 3;
  } else {
    recommendations.push({
      type: 'CRAFT',
      severity: 'TIP',
      message: 'Artisan craftsmanship notes are missing or sparse.',
      suggestedFix: 'Detail whether Sozni, Tilla, or Aari handcraft was used to boost niche provenance queries.',
    });
  }

  // Fabric specification & care guide (up to 6 pts)
  if (fabricText.length >= 5 && product.careGuide && product.careGuide.length >= 10) {
    descriptionScore += 6;
  } else if (fabricText.length >= 5) {
    descriptionScore += 3;
  }

  descriptionScore = Math.min(35, descriptionScore);

  // =========================================================================
  // COMPUTE TOTAL SCORE & GRADE
  // =========================================================================
  const totalScore = Math.max(0, Math.min(100, Math.round(keywordsScore + titleScore + descriptionScore)));

  let grade: ProductSEOScore['grade'] = 'NEEDS_IMPROVEMENT';
  if (totalScore >= 88) {
    grade = 'EXEMPLARY';
  } else if (totalScore >= 74) {
    grade = 'GOOD';
  } else if (totalScore >= 55) {
    grade = 'NEEDS_IMPROVEMENT';
  } else {
    grade = 'CRITICAL';
  }

  return {
    productId: product.id,
    totalScore,
    grade,
    metrics: {
      keywordsScore,
      titleScore,
      descriptionScore,
    },
    titleLength,
    descriptionLength: descLength,
    wordCount,
    detectedKeywords,
    missingTargetKeywords: missingTargetKeywords.slice(0, 6),
    recommendations,
  };
}

/**
 * Scans the entire product catalog and returns aggregate metrics,
 * distribution breakdowns, and prioritizes areas needing attention.
 */
export function auditCatalogSEO(
  products: Product[],
  seoConfig?: SEOConfig
): {
  summary: CatalogSEOHealthSummary;
  productScores: ProductSEOScore[];
} {
  const productScores = products.map((p) => calculateProductSEOScore(p, seoConfig));

  if (productScores.length === 0) {
    return {
      summary: {
        overallHealthIndex: 100,
        totalProductsScanned: 0,
        exemplaryCount: 0,
        goodCount: 0,
        needsImprovementCount: 0,
        criticalCount: 0,
        averageTitleLength: 0,
        averageDescriptionLength: 0,
        topMissingKeywords: [],
      },
      productScores: [],
    };
  }

  const totalScoreSum = productScores.reduce((acc, curr) => acc + curr.totalScore, 0);
  const overallHealthIndex = Math.round(totalScoreSum / productScores.length);

  const exemplaryCount = productScores.filter((s) => s.grade === 'EXEMPLARY').length;
  const goodCount = productScores.filter((s) => s.grade === 'GOOD').length;
  const needsImprovementCount = productScores.filter((s) => s.grade === 'NEEDS_IMPROVEMENT').length;
  const criticalCount = productScores.filter((s) => s.grade === 'CRITICAL').length;

  const totalTitleLen = productScores.reduce((acc, curr) => acc + curr.titleLength, 0);
  const totalDescLen = productScores.reduce((acc, curr) => acc + curr.descriptionLength, 0);

  // Missing keywords frequency analysis
  const missingFreqMap = new Map<string, number>();
  productScores.forEach((score) => {
    score.missingTargetKeywords.forEach((kw) => {
      missingFreqMap.set(kw, (missingFreqMap.get(kw) || 0) + 1);
    });
  });

  const topMissingKeywords = Array.from(missingFreqMap.entries())
    .map(([keyword, missingInCount]) => ({ keyword, missingInCount }))
    .sort((a, b) => b.missingInCount - a.missingInCount)
    .slice(0, 5);

  return {
    summary: {
      overallHealthIndex,
      totalProductsScanned: products.length,
      exemplaryCount,
      goodCount,
      needsImprovementCount,
      criticalCount,
      averageTitleLength: Math.round(totalTitleLen / products.length),
      averageDescriptionLength: Math.round(totalDescLen / products.length),
      topMissingKeywords,
    },
    productScores,
  };
}

/**
 * Intelligently auto-tunes a product's metadata to elevate its Content Quality Score
 * to 90+ by balancing title length, embedding missing target keywords, and enriching
 * description and craftsmanship text.
 */
export function autoOptimizeProductSEO(product: Product, seoConfig?: SEOConfig): Product {
  const currentScore = calculateProductSEOScore(product, seoConfig);
  let updatedName = product.name;
  let updatedSubtitle = product.subtitle;
  let updatedDescription = product.description;
  let updatedCraftsmanship = product.craftsmanship;

  // 1. Optimize Title if needed
  if (currentScore.titleLength < 32) {
    if (!updatedName.toLowerCase().includes(product.embroidery.toLowerCase()) && product.embroidery) {
      updatedName = `${updatedName} with ${product.embroidery}`;
    } else if (!updatedName.toLowerCase().includes('kashmiri')) {
      updatedName = `Kashmiri ${updatedName}`;
    }
  } else if (currentScore.titleLength > 65) {
    // Truncate cleanly at word boundary
    const words = updatedName.split(' ');
    let shortened = '';
    for (const w of words) {
      if ((shortened + ' ' + w).trim().length <= 55) {
        shortened = (shortened + ' ' + w).trim();
      } else {
        break;
      }
    }
    if (shortened.length >= 25) {
      updatedName = shortened;
    }
  }

  // 2. Optimize Subtitle if needed
  if (!updatedSubtitle || updatedSubtitle.length < 30) {
    updatedSubtitle = `Authentic Handcrafted ${product.fabric} featuring bespoke Kashmiri ${product.embroidery} needlework.`;
  }

  // 3. Optimize Description if under 150 chars
  if (updatedDescription.length < 160) {
    updatedDescription = `${updatedDescription} Handcrafted in our historic Srinagar atelier using time-honored artisanal looms, this piece embodies the royal heritage of Kashmiri couture with certified needlework and drape.`;
  }

  // 4. Enrich Craftsmanship
  if (!updatedCraftsmanship || updatedCraftsmanship.length < 40) {
    updatedCraftsmanship = `Masterfully executed by hereditary Kashmiri artisans utilizing fine ${product.embroidery} embroidery on genuine ${product.fabric}, cut to bespoke perfection.`;
  }

  return {
    ...product,
    name: updatedName,
    subtitle: updatedSubtitle,
    description: updatedDescription,
    craftsmanship: updatedCraftsmanship,
  };
}
