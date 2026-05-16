/**
 * Maps each income type ID (matching AppContext state.incomeTypes values) to
 * a document group and its required/optional documents.
 *
 * Multiple income types that share the same groupLabel (e.g. family + pension + child)
 * are merged into one group in DocumentsScreen, with their docs deduplicated by ID.
 */
export const INCOME_DOC_MAP = {
  wage: {
    groupLabel: 'Income Documents',
    groupIcon: 'Briefcase',
    docs: [
      {
        id: 'payslips',
        title: 'Payslips',
        subtitle: 'Upload your two most recent payslips',
        icon: 'FileText',
        required: true,
        stateKey: 'payslips',
        extracted: ['Employer', 'Gross income', 'Pay cycle', 'YTD income'],
      },
      {
        id: 'emp_letter',
        title: 'Employment letter',
        subtitle: 'Employer letter confirming your role, salary and start date',
        icon: 'FileCheck',
        required: false,
        stateKey: null,
        extracted: ['Employer', 'Role title', 'Annual salary', 'Start date'],
      },
      {
        id: 'bank_salary',
        title: 'Bank statement — salary credits',
        subtitle: 'Statement showing regular salary deposits into your account',
        icon: 'CreditCard',
        required: false,
        stateKey: null,
        extracted: ['Account name', 'Salary deposits', 'Pay frequency'],
      },
    ],
  },

  rental: {
    groupLabel: 'Rental Income Documents',
    groupIcon: 'Home',
    docs: [
      {
        id: 'landlord_lease',
        title: 'Lease agreement',
        subtitle: 'Signed lease between you (owner) and your tenant',
        icon: 'FileText',
        required: true,
        stateKey: 'landlord_lease',
        extracted: ['Property address', 'Rent amount', 'Lease term'],
      },
      {
        id: 'landlord_receipts',
        title: 'Rent receipts',
        subtitle: 'Payment receipts or rent statements from your tenant',
        icon: 'Receipt',
        required: false,
        stateKey: null,
        extracted: ['Payment amount', 'Payment dates', 'Tenant name'],
      },
      {
        id: 'property_mgr_stmt',
        title: 'Property manager statement',
        subtitle: 'Statement from your property manager showing rental income',
        icon: 'Building2',
        required: false,
        stateKey: null,
        extracted: ['Property address', 'Net rental income', 'Management fees'],
      },
    ],
  },

  investment: {
    groupLabel: 'Investment Documents',
    groupIcon: 'TrendingUp',
    docs: [
      {
        id: 'investment_stmt',
        title: 'Investment statements',
        subtitle: 'Portfolio or broker statements showing returns and distributions',
        icon: 'BarChart2',
        required: true,
        stateKey: null,
        extracted: ['Portfolio value', 'Income distributions', 'Asset breakdown'],
      },
      {
        id: 'dividend_stmt',
        title: 'Dividend statements',
        subtitle: 'Annual or quarterly dividend distribution notices',
        icon: 'TrendingUp',
        required: false,
        stateKey: null,
        extracted: ['Share holdings', 'Dividend amount', 'Franking credits'],
      },
    ],
  },

  family: {
    groupLabel: 'Government Benefits',
    groupIcon: 'Users',
    docs: [
      {
        id: 'centrelink_family',
        title: 'Centrelink statement — Family Benefits',
        subtitle: 'Statement of Family Tax Benefit or related Centrelink payments',
        icon: 'FileText',
        required: true,
        stateKey: null,
        extracted: ['Payment type', 'Amount', 'Frequency', 'Review date'],
      },
    ],
  },

  pension: {
    groupLabel: 'Government Benefits',
    groupIcon: 'Users',
    docs: [
      {
        id: 'pension_stmt',
        title: 'Pension / allowance statement',
        subtitle: 'Statement of age pension, disability, or other Centrelink allowance',
        icon: 'FileText',
        required: true,
        stateKey: null,
        extracted: ['Payment type', 'Amount', 'Frequency'],
      },
    ],
  },

  child: {
    groupLabel: 'Government Benefits',
    groupIcon: 'Users',
    docs: [
      {
        id: 'child_support_agreement',
        title: 'Child support agreement',
        subtitle: 'Court order or formal child support agreement showing the payment amount',
        icon: 'FileCheck',
        required: true,
        stateKey: null,
        extracted: ['Parties', 'Payment amount', 'Frequency', 'Valid until'],
      },
    ],
  },

  super: {
    groupLabel: 'Superannuation Documents',
    groupIcon: 'Landmark',
    docs: [
      {
        id: 'super_stmt',
        title: 'Superannuation statement',
        subtitle: 'Statement from your super fund showing balance and drawdown details',
        icon: 'Landmark',
        required: true,
        stateKey: null,
        extracted: ['Fund name', 'Member balance', 'Drawdown amount', 'Frequency'],
      },
    ],
  },

  selfemployed: {
    groupLabel: 'Business Documents',
    groupIcon: 'Receipt',
    docs: [
      {
        id: 'bas_stmts',
        title: 'BAS statements',
        subtitle: 'Business Activity Statements — last 4 quarters',
        icon: 'FileText',
        required: true,
        stateKey: null,
        extracted: ['ABN', 'GST registered', 'Reported income', 'Period covered'],
      },
      {
        id: 'business_bank',
        title: 'Business bank statements',
        subtitle: '6 months of your primary business account statements',
        icon: 'Building2',
        required: true,
        stateKey: null,
        extracted: ['Business name', 'Monthly turnover', 'Recurring expenses'],
      },
      {
        id: 'tax_returns',
        title: 'Tax returns',
        subtitle: 'Last 2 years of individual or company ATO tax returns',
        icon: 'BookMarked',
        required: false,
        stateKey: null,
        extracted: ['Taxable income', 'Tax paid', 'ABN income', 'Deductions'],
      },
    ],
  },

  other: {
    groupLabel: 'Income Documents',
    groupIcon: 'Briefcase',
    docs: [
      {
        id: 'other_income_evidence',
        title: 'Supporting income evidence',
        subtitle: 'Any document confirming the nature and amount of your other income',
        icon: 'FileSearch',
        required: true,
        stateKey: null,
        extracted: ['Income type', 'Amount', 'Frequency', 'Source name'],
      },
    ],
  },
};

/** Icon and description for each possible group label */
export const GROUP_META = {
  'Identity':                  { icon: 'Shield'     },
  'Property':                  { icon: 'Home'       },
  'Housing Documents':         { icon: 'Key'        },
  'Income Documents':          { icon: 'Briefcase'  },
  'Rental Income Documents':   { icon: 'Home'       },
  'Investment Documents':      { icon: 'TrendingUp' },
  'Government Benefits':       { icon: 'Users'      },
  'Superannuation Documents':  { icon: 'Landmark'   },
  'Business Documents':        { icon: 'Receipt'    },
};
