export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  rateAgainstINR: number;
  flagEmoji?: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)', rateAgainstINR: 1 },
  { code: 'USD', symbol: '$', label: 'USD ($)', rateAgainstINR: 0.0116 },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', rateAgainstINR: 0.0092 },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', rateAgainstINR: 0.0108 },
  { code: 'AED', symbol: 'AED ', label: 'AED (د.إ)', rateAgainstINR: 0.0427 },
];

export function formatPrice(amountINR: number, currencyCode: string = 'INR'): string {
  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  const converted = Math.round(amountINR * selected.rateAgainstINR);
  
  if (selected.code === 'INR') {
    return `₹${amountINR.toLocaleString('en-IN')}`;
  }
  
  if (selected.code === 'AED') {
    return `AED ${converted.toLocaleString('en-US')}`;
  }
  
  return `${selected.symbol}${converted.toLocaleString('en-US')}`;
}
