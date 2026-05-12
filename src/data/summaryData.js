export const SERVICEABILITY = {
  pill: 'Serviceable',
  pillCls: 'green',
  narrative: 'Your application profile is <strong>strong</strong>. Stable full-time employment, consistent income, manageable liabilities and a healthy net asset position. Likely to meet most lender serviceability requirements.',
  dtiVal: '42%',
  dtiFill: '42%',
  dtiNote: '<strong>DTI of 42%</strong> is comfortably within acceptable ranges. Monthly debt obligations of <strong>$3,150</strong> against gross monthly income of <strong>$6,200</strong> leaves a surplus of <strong>$1,460</strong> after living expenses.',
  surplus: '$1,460',
  matches: '3 of 45+',
};

export const SNAP_CARDS = [
  {
    id: 'loan',
    icon: 'CreditCard',
    title: 'Product & loan',
    sub: 'Personal Loan · $25,000 · 5 years',
    fields: [
      ['Product', 'Personal Loan'],
      ['Amount', '$25,000'],
      ['Term', '5 years'],
      ['Purpose', 'Debt consolidation'],
      ['Security', 'Unsecured'],
      ['Est. repayment', '$516 / mo'],
      ['Indicative rate', 'From 8.49%'],
      ['Joint applicant', 'None'],
    ],
  },
  {
    id: 'profile',
    icon: 'User',
    title: 'Your profile',
    sub: 'Full-time · Mortgage · Citizen · Sydney',
    fields: [
      ['Name', 'Jane Smith'],
      ['Employment', 'Full-time'],
      ['Living situation', 'Mortgage'],
      ['Time at address', '6 yrs 4 mo', 'green'],
      ['Time in role', '4 yrs 2 mo', 'green'],
      ['Residency', 'Australian citizen'],
    ],
  },
  {
    id: 'income',
    icon: 'Briefcase',
    title: 'Income',
    sub: '$74,400 p.a. · PAYG wage',
    fields: [
      ['Gross income p.a.', '$74,400', 'green'],
      ['Monthly', '$6,200'],
      ['Sources', '1'],
      ['Verification', 'Payslips uploaded', 'green'],
    ],
  },
  {
    id: 'assets',
    icon: 'Scale',
    title: 'Assets & liabilities',
    sub: '$805,000 assets · $410,000 liabilities',
    fields: [
      ['Total assets', '$805,000', 'green'],
      ['Total liabilities', '$410,000'],
      ['Net position', '$395,000', 'green'],
      ['Monthly liab. payments', '$2,650'],
    ],
  },
  {
    id: 'expenses',
    icon: 'Home',
    title: 'Living expenses',
    sub: '$3,640 / mo declared · HEM $3,840',
    fields: [
      ['Monthly declared', '$3,640', 'yellow'],
      ['HEM benchmark', '$3,840'],
      ['Used in assessment', '$3,840'],
      ['Annual total', '$43,680'],
    ],
  },
];
