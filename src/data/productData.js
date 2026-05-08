export const TRUST_STRIP_ITEMS = [
  { icon: 'ShieldCheck', val: 'Zero',      lbl: 'Credit file impact during matching' },
  { icon: 'Building2',   val: '45+',       lbl: 'Lenders compared automatically' },
  { icon: 'Sparkles',    val: '100%',      lbl: 'Transparent — no hidden fees' },
  { icon: 'Smartphone',  val: 'Paperless', lbl: 'Electronic only via your portal' },
  { icon: 'PhoneOff',    val: 'No calls',  lbl: 'No pressure sales ever' },
];

export const PROMISE_CARDS = [
  { icon: 'Lock',        title: 'No credit file impact',  text: 'Soft enquiry only during matching. Hard check only after you choose a lender — with your full consent.' },
  { icon: 'Scale',       title: 'Full transparency',       text: 'Every rate, fee and charge shown upfront. Monthly repayments include all fees. No surprises at settlement.' },
  { icon: 'Smartphone',  title: 'Your portal, your pace',  text: 'All communication is electronic through your personal Axio portal. No pressure calls ever.' },
  { icon: 'FileText',    title: '100% paperless',           text: 'Application, verification, approval and settlement — all digital. Documents signed electronically.' },
  { icon: 'Building2',   title: '45+ lenders compared',    text: 'Our algorithm matches your profile against Australia\'s largest panel simultaneously.' },
  { icon: 'Handshake',   title: 'No broker bias',           text: 'We don\'t push lenders who pay us more. Pure algorithm ranking on fit and approval probability.' },
];

export const PRODUCTS = [
  {
    id: 'personal',
    icon: 'CreditCard',
    title: 'Personal Loan',
    desc: 'Debt consolidation, travel, medical, renovations, education and more. Funds direct to your account.',
    rate: 'From 7.99%',
    rateNote: 'p.a. comparison rate',
    features: ['Unsecured — no asset required', '$5,000 – $80,000', '1 – 7 year terms', 'Option to secure against vehicle'],
    footerNote: '20+ lenders matched',
    badge: { cls: 'badge-blue', text: 'Most popular' },
  },
  {
    id: 'car',
    icon: 'Car',
    title: 'Car Loan',
    desc: 'New or used vehicles, dealer or private sale. Secured against the vehicle for lower rates. Vehicle Marketplace included.',
    rate: 'From 5.99%',
    rateNote: 'p.a. comparison rate',
    features: ['New, used or demo vehicles', '$5,000 – $500,000', 'Balloon payment options', 'Access our Vehicle Marketplace'],
    footerNote: '25+ lenders matched',
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
