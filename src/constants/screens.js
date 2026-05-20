export const SCREENS = [
  { id: "eligibility",        label: "Eligibility check",    group: "Get started"   },  //  0
  { id: "product",            label: "Product selection",    group: "Get started"   },  //  1
  { id: "loandetails",        label: "Loan details",         group: "Get started"   },  //  2
  { id: "profile",            label: "Your profile",         group: "Profile"       },  //  3
  { id: "income",             label: "Income",               group: "Profile"       },  //  4
  { id: "assets",             label: "Assets",               group: "Profile"       },  //  5
  { id: "liabilities",        label: "Liabilities",          group: "Profile"       },  //  6
  { id: "expenses",           label: "Living expenses",      group: "Profile"       },  //  7
  { id: "connectbanks",       label: "Connect banks",        group: "Verification"  },  //  8
  { id: "documentsupload",    label: "Document uploads",     group: "Verification"  },  //  9
  { id: "privacy",            label: "Privacy & consent",    group: "Application"   },  // 10
  { id: "summary",            label: "Final summary",        group: "Application"   },  // 11
  { id: "lenders",            label: "Your matches",         group: "Matching"      },  // 12
  { id: "signup",             label: "Create account",       group: "Account Setup" },  // 13
  { id: "verificationstatus", label: "Verification status",  group: "Status"        },  // 14
  { id: "dashboard",          label: "Dashboard",            group: "Portal"        },  // 15
];

/** Returns the 1-based step number for any screen id. */
export function getStep(id) {
  const idx = SCREENS.findIndex(s => s.id === id);
  return idx === -1 ? 1 : idx + 1;
}

export const TRUST_SIDEBAR = [
  { icon: "ShieldCheck", text: "Zero credit file impact during matching" },
  { icon: "Lock", text: "Bank-grade 256-bit encryption" },
  { icon: "Smartphone", text: "Electronic only — no pressure calls" },
];
