export const TRUST_STRIP_ITEMS = [
  { icon: 'ShieldCheck', val: 'Zero',      lbl: 'Credit file impact during matching' },
  { icon: 'Building2',   val: '45+',       lbl: 'Car & personal lenders compared' },
  { icon: 'Sparkles',    val: '100%',      lbl: 'Transparent — no hidden fees' },
  { icon: 'Smartphone',  val: 'Paperless', lbl: 'Electronic only via your portal' },
  { icon: 'PhoneOff',    val: 'No calls',  lbl: 'No pressure sales ever' },
];

export const WHY_FEATURES = [
  { icon: 'Smartphone',    title: 'Simple digital process',     desc: 'Apply online, upload documents securely, and track your finance journey from one dashboard.' },
  { icon: 'ShieldCheck',   title: 'Safe & secure',              desc: 'Designed with secure verification, protected document uploads, and privacy-first data handling.' },
  { icon: 'Eye',           title: 'Full transparency',          desc: 'Every lender fee, repayment, comparison rate, and charge is clearly disclosed upfront.' },
  { icon: 'CreditCard',    title: 'Zero credit impact check',   desc: 'Explore lender options using soft checks only, without impacting your credit file.' },
  { icon: 'Bell',          title: 'Stay alert via dashboard',   desc: 'Get real-time updates, document requests, and application progress alerts in one place.' },
  { icon: 'MessageCircle', title: 'Less calls. Less pressure.', desc: 'No pushy sales tactics. Communication is digital, clear, and on your terms.' },
];


export const PRODUCTS = [
  {
    id: 'personal',
    icon: 'CreditCard',
    title: 'Personal Loan',
    desc: 'A personal loan allows you to borrow a fixed amount of money and repay it over time with regular repayments. Debt consolidation, travel, medical, renovations, education and more.',
    rate: 'From 6.25%',
    rateNote: 'p.a. comparison rate',
    features: ['Secured & Unsecured options', '$5,000 – $80,000', '12 – 84 month terms', 'Fixed or Variable rate'],
    footerNote: 'Over 25 lenders',
    badge: { cls: 'badge-blue', text: 'Most popular' },
  },
  {
    id: 'car',
    icon: 'Car',
    title: 'Car Loan',
    desc: 'A car loan finances a vehicle purchase by borrowing from a lender and repaying over time with regular instalments. The vehicle typically serves as security.',
    rate: 'From 5.99%',
    rateNote: 'p.a. comparison rate',
    features: ['New or Used vehicles', '$10,000 – $500,000', '12 – 84 month terms', 'Balloon repayment options', 'Dealer & Private sales', 'Vehicle Marketplace included'],
    footerNote: 'Over 45 lenders',
    badge: { cls: 'badge-yellow', text: 'Lowest rates' },
  },
];

export const MARKETPLACE_CARS = [
  { icon: 'Sparkles', name: '2024 Toyota Camry',  price: '$42,990', sub: 'Hybrid · Sydney' },
  { icon: 'Car',      name: '2022 Mazda CX-5',    price: '$38,500', sub: 'AWD · Melbourne' },
  { icon: 'Zap',      name: '2024 Tesla Model 3', price: '$59,900', sub: 'Electric · Brisbane' },
];

export const MARKETPLACE_STATS = [
  { val: '4,200+', lbl: 'Vehicles listed' },
  { val: '180+',   lbl: 'Dealerships' },
  { val: 'All',    lbl: 'Major brands' },
];
