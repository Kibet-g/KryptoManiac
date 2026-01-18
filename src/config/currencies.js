/**
 * World Currencies Database
 * Contains all major world currencies with symbols, names, and country info
 */

export const CURRENCIES = [
  // Major currencies first
  { code: "USD", symbol: "$", name: "United States Dollar", country: "United States", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan", flag: "🇯🇵" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China", flag: "🇨🇳" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India", flag: "🇮🇳" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia", flag: "🇦🇺" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada", flag: "🇨🇦" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", country: "Switzerland", flag: "🇨🇭" },
  
  // African currencies
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa", flag: "🇿🇦" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", country: "Egypt", flag: "🇪🇬" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", country: "Ghana", flag: "🇬🇭" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", country: "Tanzania", flag: "🇹🇿" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling", country: "Uganda", flag: "🇺🇬" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham", country: "Morocco", flag: "🇲🇦" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr", country: "Ethiopia", flag: "🇪🇹" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc", country: "West Africa", flag: "🌍" },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc", country: "Central Africa", flag: "🌍" },
  
  // Asian currencies
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea", flag: "🇰🇷" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore", flag: "🇸🇬" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong", flag: "🇭🇰" },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar", country: "Taiwan", flag: "🇹🇼" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand", flag: "🇹🇭" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia", flag: "🇲🇾" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia", flag: "🇮🇩" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines", flag: "🇵🇭" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", country: "Vietnam", flag: "🇻🇳" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan", flag: "🇵🇰" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh", flag: "🇧🇩" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "NPR", symbol: "रू", name: "Nepalese Rupee", country: "Nepal", flag: "🇳🇵" },
  
  // Middle Eastern currencies
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", country: "Qatar", flag: "🇶🇦" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", country: "Kuwait", flag: "🇰🇼" },
  { code: "BHD", symbol: "ب.د", name: "Bahraini Dinar", country: "Bahrain", flag: "🇧🇭" },
  { code: "OMR", symbol: "ر.ع.", name: "Omani Rial", country: "Oman", flag: "🇴🇲" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", country: "Israel", flag: "🇮🇱" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey", flag: "🇹🇷" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial", country: "Iran", flag: "🇮🇷" },
  
  // European currencies
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden", flag: "🇸🇪" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway", flag: "🇳🇴" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark", flag: "🇩🇰" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland", flag: "🇵🇱" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "Czech Republic", flag: "🇨🇿" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary", flag: "🇭🇺" },
  { code: "RON", symbol: "lei", name: "Romanian Leu", country: "Romania", flag: "🇷🇴" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev", country: "Bulgaria", flag: "🇧🇬" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna", country: "Croatia", flag: "🇭🇷" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "Russia", flag: "🇷🇺" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", country: "Ukraine", flag: "🇺🇦" },
  
  // Americas
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso", country: "Mexico", flag: "🇲🇽" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil", flag: "🇧🇷" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", country: "Argentina", flag: "🇦🇷" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", country: "Chile", flag: "🇨🇱" },
  { code: "COP", symbol: "$", name: "Colombian Peso", country: "Colombia", flag: "🇨🇴" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", country: "Peru", flag: "🇵🇪" },
  { code: "VES", symbol: "Bs", name: "Venezuelan Bolivar", country: "Venezuela", flag: "🇻🇪" },
  
  // Oceania
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand", flag: "🇳🇿" },
  { code: "FJD", symbol: "FJ$", name: "Fijian Dollar", country: "Fiji", flag: "🇫🇯" },
  
  // Crypto
  { code: "BTC", symbol: "₿", name: "Bitcoin", country: "Cryptocurrency", flag: "🪙" },
];

// Get currency by code
export const getCurrencyByCode = (code) => {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};

// Get symbol by code
export const getSymbolByCode = (code) => {
  const currency = getCurrencyByCode(code);
  return currency ? currency.symbol : "$";
};

// Search currencies
export const searchCurrencies = (query) => {
  const lowerQuery = query.toLowerCase();
  return CURRENCIES.filter(c => 
    c.code.toLowerCase().includes(lowerQuery) ||
    c.name.toLowerCase().includes(lowerQuery) ||
    c.country.toLowerCase().includes(lowerQuery) ||
    c.symbol.includes(query)
  );
};

// Country code to currency mapping for geolocation
export const COUNTRY_TO_CURRENCY = {
  US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
  JP: "JPY", CN: "CNY", IN: "INR", AU: "AUD", CA: "CAD", CH: "CHF",
  KE: "KES", NG: "NGN", ZA: "ZAR", EG: "EGP", GH: "GHS", TZ: "TZS",
  UG: "UGX", MA: "MAD", ET: "ETB",
  KR: "KRW", SG: "SGD", HK: "HKD", TW: "TWD", TH: "THB", MY: "MYR",
  ID: "IDR", PH: "PHP", VN: "VND", PK: "PKR", BD: "BDT", LK: "LKR",
  AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR",
  IL: "ILS", TR: "TRY",
  SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF",
  RO: "RON", BG: "BGN", HR: "HRK", RU: "RUB", UA: "UAH",
  MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN",
  NZ: "NZD", FJ: "FJD",
};

export default CURRENCIES;
