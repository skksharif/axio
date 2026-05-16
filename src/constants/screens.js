export const SCREENS = [
  { id: "product",            label: "Product selection",  group: "Get started"   },  // 0
  { id: "loandetails",        label: "Loan details",       group: "Get started"   },  // 1
  { id: "profile",            label: "Your profile",       group: "Profile"       },  // 2
  { id: "income",             label: "Income",              group: "Profile"       },  // 3
  { id: "assets",             label: "Assets",              group: "Profile"       },  // 4
  { id: "liabilities",        label: "Liabilities",         group: "Profile"       },  // 5
  { id: "expenses",           label: "Living expenses",     group: "Profile"       },  // 6
  { id: "privacy",            label: "Privacy & consent",   group: "Application"   },  // 7
  { id: "summary",            label: "Final summary",       group: "Application"   },  // 8
  { id: "lenders",            label: "Your matches",        group: "Matching"      },  // 9
  { id: "signup",             label: "Create account",      group: "Account Setup" },  // 10
  { id: "documentsupload",    label: "Document uploads",    group: "Verification"  },  // 11
  { id: "connectbanks",       label: "Connect banks",       group: "Verification"  },  // 12
  { id: "verificationstatus", label: "Verification status", group: "Verification"  },  // 13
  { id: "dashboard",          label: "Dashboard",           group: "Portal"        },  // 14
];

export const TRUST_SIDEBAR = [
  { icon: "ShieldCheck", text: "Zero credit file impact during matching" },
  { icon: "Lock", text: "Bank-grade 256-bit encryption" },
  { icon: "Smartphone", text: "Electronic only — no pressure calls" },
];
