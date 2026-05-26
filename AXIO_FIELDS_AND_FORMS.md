# Axio — Complete Forms & Fields Reference

All user-facing inputs, state variables, and option values collected across the 16-screen onboarding flow.

---

## Table of Contents

1. [Eligibility Check](#1-eligibility-check)
2. [Product Selection](#2-product-selection)
3. [Loan Details](#3-loan-details)
4. [Profile](#4-profile)
5. [Income](#5-income)
6. [Assets](#6-assets)
7. [Liabilities](#7-liabilities)
8. [Expenses](#8-expenses)
9. [Privacy & Consent](#9-privacy--consent)
10. [Summary](#10-summary-review)
11. [Lenders](#11-lenders)
12. [Create Account](#12-create-account)
13. [Documents Upload](#13-documents-upload)
14. [Connect Banks](#14-connect-banks)
15. [Verification Status](#15-verification-status)
16. [Dashboard](#16-dashboard)
17. [Supporting Data Files](#supporting-data-files)

---

## 1. Eligibility Check

**Screen:** `EligibilityScreen.jsx`  
**Purpose:** Confirms the applicant meets minimum lending criteria before proceeding.

### Checklist Items

| ID | Label | Helper Text |
|---|---|---|
| `age` | I am at least 18 years old | Must be 18+ to apply |
| `income-amount` | I earn at least $25,000 per year | Minimum income threshold |
| `regular-income` | I have regular income as my primary source | Stable income required |
| `no-defaults` | I have no bankruptcy or unpaid defaults | Credit history requirement |
| `id` | I have acceptable identification | ID documents required |

### State Variables

| Variable | Type | Description |
|---|---|---|
| `checkedEligibility` | `string[]` | Array of checked eligibility IDs |
| `openWhy` | `string \| null` | Currently expanded FAQ panel ID |

### Validation
All 5 items must be checked to proceed.

---

## 2. Product Selection

**Screen:** `ProductScreen.jsx`  
**Purpose:** User selects a loan product type.

### Products

| ID | Label | Rate | Range | Badge |
|---|---|---|---|---|
| `personal` | Personal Loan | From 6.25% p.a. | $5,000 – $80,000 | Most popular |
| `car` | Car Loan | From 5.99% p.a. | $10,000 – $500,000 | Lowest rates |

### State Variables

| Variable | Type | Description |
|---|---|---|
| `loanType` | `'personal' \| 'car'` | Selected product |

### Trust Strip (informational, no input)

- Zero credit file impact
- 45+ lenders compared
- 100% Transparent, no hidden fees
- Paperless electronic
- No calls

---

## 3. Loan Details

**Screen:** `LoanDetailsScreen.jsx`  
**Purpose:** Collects the specifics of what the user wants to borrow.

### Section A — Loan Purpose (Personal Loan only)

| ID | Icon | Label | Hint |
|---|---|---|---|
| `debt` | DollarSign | Debt consolidation | Roll existing debts into one |
| `travel` | Plane | Travel | Holidays and experiences |
| `medical` | Stethoscope | Medical | Health and dental costs |
| `furnishing` | Sofa | Furniture / whitegoods | Home setup |
| `education` | GraduationCap | Education | Courses and tuition |
| `renovation` | Wrench | Renovation | Home improvements |
| `vehicle` | Car | Vehicle (personal) | Non-financed vehicle purchase |
| `solar` | Zap | Solar / EV | Sustainable energy |
| `other` | Lightbulb | Other | General purpose |

**State:** `purpose` — selected purpose ID

---

### Section B — Loan Amount

| Field | Type | Range | Step |
|---|---|---|---|
| Loan Amount | Range slider + display | $5,000 – $80,000 (personal) / $5,000 – $500,000 (car) | $1,000 |
| Deposit | Range slider + display | $0 – $200,000 (car only) | $1,000 |
| Trade-in | Toggle boolean | Yes / No (car only) | — |
| Trade-in has finance | Toggle boolean | Yes / No (car only, if trade-in = true) | — |

**State variables:**

| Variable | Type |
|---|---|
| `loanAmount` | `number` |
| `deposit` | `number` |
| `tradeIn` | `boolean` |
| `tradeInFinance` | `boolean` |

---

### Section C — Loan Term

| Options | Display |
|---|---|
| 12 | 1 year |
| 24 | 2 years |
| 36 | 3 years |
| 48 | 4 years |
| 60 | 5 years |
| 72 | 6 years |
| 84 | 7 years |

**State:** `loanTerm` — selected term in months

---

### Section D — Security (Car Loan only)

**Security Type**

| ID | Label |
|---|---|
| `unsecured` | Unsecured |
| `secured` | Secured |

**Security Asset Type** (if secured)

| ID | Label |
|---|---|
| `vehicle` | Vehicle |
| `caravan` | Caravan |
| `marine` | Marine |
| `motorbike` | Motorbike |

**Vehicle Condition** (if secured + vehicle)

| ID | Label |
|---|---|
| `new` | New |
| `used` | Used |
| `demo` | Demo |

**Purchase Type** (if used/demo)

| ID | Label |
|---|---|
| `dealer` | From dealer |
| `private` | Private sale |

**State variables:**

| Variable | Type |
|---|---|
| `securityType` | `'unsecured' \| 'secured'` |
| `securityAssetType` | `'vehicle' \| 'caravan' \| 'marine' \| 'motorbike'` |
| `vehicleCondition` | `'new' \| 'used' \| 'demo'` |
| `purchaseType` | `'dealer' \| 'private'` |
| `vehicleFound` | `boolean` |

---

### Section E — Balloon Payment (Car Loan only)

| Field | Type | Range | Step |
|---|---|---|---|
| Balloon % | Range slider | 0% – 30% | 5% |

**State:** `balloonPct` — `number` (0–30)

---

## 4. Profile

**Screen:** `ProfileScreen.jsx`  
**Purpose:** Collects personal, residency, relationship, and employment details.

### Section A — Personal Details

| Field | Input Type | Notes |
|---|---|---|
| First Name | Text | Required |
| Last Name | Text | Required |
| Date of Birth | Select (day/month/year) | Range: 1940 – 2006 |
| Gender | Select | 5 options (see below) |
| Mobile | Tel input | Placeholder: 0400 000 000 |
| Email | Email input | Placeholder: you@example.com |

**Gender options:**

| Value | Label |
|---|---|
| `male` | Male |
| `female` | Female |
| `nonbinary` | Non-binary |
| `other` | Other |
| `prefer-not` | Prefer not to say |

---

### Section B — Residency

| ID | Label | Extra Fields |
|---|---|---|
| `citizen` | Australian Citizen | None |
| `pr` | Permanent Resident | None |
| `visa` | Visa Holder | Visa subclass (dropdown) + Visa expiry date (year range: current–+15 yrs) |

**State:** `residency` — selected residency ID

---

### Section C — Relationship Status

| ID | Label |
|---|---|
| `single` | Single |
| `married` | Married |
| `defacto` | De facto |
| `separated` | Separated |
| `divorced` | Divorced |
| `widowed` | Widowed |

**State:** `relationshipStatus`

For married/defacto — additional partner fields:
- Partner date of birth (day/month/year, range 1940–2006)

---

### Section D — Dependants

| Field | Input Type | Options |
|---|---|---|
| Number of dependants | Step selector | 0, 1, 2, 3, 4, 5+ |
| Dependant age ranges | Multi-select chips | 5 options (see below) |

**Dependant age range options:**

| ID | Label |
|---|---|
| `0-4` | 0–4 years |
| `5-11` | 5–11 years |
| `12-17` | 12–17 years |
| `18-24` | 18–24 years |
| `25+` | 25+ years |

**State variables:**

| Variable | Type |
|---|---|
| `dependants` | `number` (0–5) |
| `dependantAges` | `string[]` |

---

### Section E — Living Situation

| ID | Label |
|---|---|
| `mortgage` | Mortgage |
| `owner` | Owner (no mortgage) |
| `rent---agent` | Renting — agent managed |
| `rent---private` | Renting — private landlord |
| `family` | Living with family |
| `boarding` | Boarding |

**State:** `livingStatus`

**Address History:** If less than 3 years at current address:
- `addressHistoryUnder3` — `boolean`
- Previous address fields (street, suburb, state, postcode, duration)

---

### Section F — Employment

Multi-select chip selection:

| ID | Label |
|---|---|
| `full-time` | Full-time |
| `part-time` | Part-time |
| `casual` | Casual |
| `contract` | Contract |
| `self-employed` | Self-employed |
| `not-employed` | Not employed |
| `other` | Other |

**State:** `employmentTypes` — `string[]`

**Per-employment-type fields** (for each selected type except `not-employed`):

| Field | Type |
|---|---|
| Employer name | Text |
| Employer phone | Tel |
| Years at employer | Number |
| Months at employer | Number |
| Role / Position | Text |

**Employment History:** If less than 3 years at current employer:
- `employmentHistoryUnder3` — `boolean`
- Previous employer fields (same as above)

---

### Section G — Joint Application

| Variable | Type | Description |
|---|---|---|
| `sharedExpenses` | `boolean` | Is partner sharing expenses? |
| `sharedPct` | `number` | Shared expense % (10–90) |

---

## 5. Income

**Screen:** `IncomeScreen.jsx`  
**Purpose:** Collects income sources and amounts.

### Income Type Selection (Multi-select)

| ID | Icon | Label | Hint |
|---|---|---|---|
| `wage` | Briefcase | PAYG Wage | Salary or hourly wages |
| `rental` | Home | Rental Income | Income from rental properties |
| `investment` | TrendingUp | Investment Income | Dividends, interest |
| `family` | Users | Family Payments | Centrelink family payments |
| `pension` | Building2 | Pension / Allowance | Age/disability pension, Centrelink |
| `child` | Baby | Child Support | Child support payments received |
| `super` | Landmark | Superannuation | Drawdowns — retirement phase only |
| `selfemployed` | Receipt | Self-Employed | ABN, sole trader, company income |
| `other` | Lightbulb | Other Income | Any other income source |

**State:** `incomeTypes` — `string[]`

### Per-Income Entry Fields

For each selected income type:

| Field | Input Type | Options |
|---|---|---|
| Gross amount | Currency input | Numeric, $ formatted |
| Frequency | Select | Weekly / Fortnightly / Monthly / Annually |

---

## 6. Assets

**Screen:** `AssetsScreen.jsx`  
**Purpose:** Collects all assets held by the applicant.

### Asset Type Cards (Toggle on/off)

| ID | Icon | Title | Description | Has Finance |
|---|---|---|---|---|
| `savings` | PiggyBank | Savings & Cash | Bank accounts, term deposits, cash | No |
| `realestate` | Home | Real Estate | Properties you own | Yes |
| `investments` | TrendingUp | Investments | Shares, ETFs, managed funds | No |
| `super` | Building2 | Superannuation | Super fund balance | No |
| `vehicles` | Car | Vehicles | Cars, motorcycles, boats | Yes |
| `contents` | Sofa | Contents | Home contents, personal items | No |

**State:** `assets` — `Record<assetTypeId, boolean>`

### Per-Asset-Item Fields

Each asset type supports multiple items (add/remove):

**Savings:**

| Field | Type |
|---|---|
| Institution / Bank | Text |
| Balance | Currency |

**Real Estate:**

| Field | Type | Notes |
|---|---|---|
| Property address | Text | Full address |
| Property type | Select | owner-occupied, investment, holiday, other |
| Estimated value | Currency | |
| Lender | Text | If financed |
| Original loan amount | Currency | |
| Current balance | Currency | |
| Interest rate | Percentage | |
| Monthly repayment | Currency | |
| Loan type | Select | Principal & Interest / Interest Only |

> Real estate items auto-link to Liabilities screen (Home Loan section).

**Investments:**

| Field | Type |
|---|---|
| Platform / Institution | Text |
| Estimated value | Currency |

**Superannuation:**

| Field | Type |
|---|---|
| Fund name | Text |
| Balance | Currency |

**Vehicles:**

| Field | Type | Notes |
|---|---|---|
| Make & model | Text | |
| Year | Number | |
| Estimated value | Currency | |
| Has finance? | Toggle | |
| Lender | Text | If financed |
| Current balance | Currency | If financed |
| Monthly repayment | Currency | If financed |

**Contents:**

| Field | Type |
|---|---|
| Description | Text |
| Estimated value | Currency |

**State variables:**

| Variable | Type |
|---|---|
| `assets` | `Record<string, boolean>` |
| `assetsData` | `Record<string, { nextId: number, items: Record<number, object> }>` |
| `realEstateLinks` | `Record<number, object>` |

---

## 7. Liabilities

**Screen:** `LiabilitiesScreen.jsx`  
**Purpose:** Collects all debts and liabilities.

### Liability Type Cards

| ID | Icon | Title | Linked from Assets |
|---|---|---|---|
| `homeloan` | Building2 | Home Loan | Yes — from Real Estate |
| `vehicle` | Car | Vehicle Loan | No |
| `creditcard` | CreditCard | Credit Card | No |
| `personalloan` | DollarSign | Personal Loan | No |
| `bnpl` | Smartphone | Buy Now Pay Later | No |
| `other` | ClipboardList | Other Liabilities | No |

### Per-Liability-Item Fields

**Home Loan** (auto-populated from Real Estate assets):

| Field | Type |
|---|---|
| Property address | Text (pre-filled) |
| Lender | Text (pre-filled) |
| Original amount | Currency (pre-filled) |
| Current balance | Currency (pre-filled) |
| Monthly repayment | Currency (pre-filled) |
| Consolidate into new loan? | Toggle boolean |

**Vehicle Loan:**

| Field | Type |
|---|---|
| Vehicle description | Text |
| Lender | Text |
| Current balance | Currency |
| Monthly repayment | Currency |
| Consolidate? | Toggle boolean |

**Credit Card:**

| Field | Type |
|---|---|
| Card issuer | Text |
| Credit limit | Currency |
| Current balance | Currency |
| Monthly repayment | Currency |
| Consolidate? | Toggle boolean |

**Personal Loan:**

| Field | Type |
|---|---|
| Lender | Text |
| Current balance | Currency |
| Monthly repayment | Currency |
| Consolidate? | Toggle boolean |

**BNPL (Buy Now Pay Later):**

| Field | Type |
|---|---|
| Provider (Afterpay, Zip, Humm, etc.) | Text |
| Current balance | Currency |
| Fortnightly repayment | Currency |
| Consolidate? | Toggle boolean |

**Other:**

| Field | Type |
|---|---|
| Description | Text |
| Current balance | Currency |
| Monthly repayment | Currency |
| Consolidate? | Toggle boolean |

**State variables:**

| Variable | Type |
|---|---|
| `liabilities` | `Record<string, boolean>` |
| `liabilitiesData` | `Record<string, { nextId: number, items: Record<number, object> }>` |

---

## 8. Expenses

**Screen:** `ExpensesScreen.jsx`  
**Purpose:** Collects monthly living expenses with HEM benchmark comparison.

### Expense Categories

| ID | Icon | Name | Sub-label | Default ($/mo) | Step |
|---|---|---|---|---|---|
| `groceries` | ShoppingCart | Groceries & Food | Supermarket, takeaway, dining | $1,200 | $50 |
| `utilities` | Zap | Utilities | Electricity, gas, water, internet | $420 | $20 |
| `transport` | Car | Transport | Fuel, rego, public transport, Uber | $380 | $20 |
| `education` | GraduationCap | Education | School fees, tutoring, HECS | $600 | $50 |
| `health` | Heart | Health | Gym, health insurance, medical | $310 | $20 |
| `entertainment` | Film | Entertainment | Streaming, subscriptions, hobbies | $450 | $20 |
| `clothing` | Shirt | Clothing | Clothing and personal care | $180 | $20 |
| `other` | Lightbulb | Other | Any other regular expenses | $100 | $20 |

**Input type:** Stepper (– / value / +) per category  
**State:** `expenses` — `Record<categoryId, number>`

### HEM Benchmarks

| Benchmark | Value |
|---|---|
| Single applicant | $3,840 / month |
| Couple | $4,620 / month |

### Shared Expenses (Joint Applications)

| Field | Type | Options |
|---|---|---|
| Expenses shared with partner? | Toggle | Yes / No |
| Your share % | Range slider | 10% – 90%, step 5% |

**State variables:**

| Variable | Type |
|---|---|
| `sharedExpenses` | `boolean` |
| `sharedPct` | `number` (10–90) |

### Rent Declaration (if `livingStatus` is renting)

| Field | Type | Options |
|---|---|---|
| Are you the sole renter? | Yes / No | |
| **If sole renter:** Monthly rental amount | Currency | |
| **If sole renter:** Frequency | Select | Weekly / Fortnightly / Monthly |
| **If not sole renter:** Number of people on lease | Number | |
| **If not sole renter:** Full rental amount | Currency | |
| **If not sole renter:** Frequency | Select | Weekly / Fortnightly / Monthly |

**Local state variables:**

| Variable | Type |
|---|---|
| `soleRenter` | `boolean \| null` |
| `rentalAmount` | `string` |
| `rentalFreq` | `'Weekly' \| 'Fortnightly' \| 'Monthly'` |
| `leaseCount` | `number` |
| `fullRentalAmount` | `string` |

---

## 9. Privacy & Consent

**Screen:** `PrivacyScreen.jsx`  
**Purpose:** Obtains explicit consent before credit enquiry and submission.

### Declarations (must all be checked)

| # | Declaration |
|---|---|
| 0 | I confirm all information provided is true and correct to the best of my knowledge |
| 1 | I authorise Axio to conduct a soft credit enquiry on my behalf (no credit file impact) |
| 2 | I agree to the Credit Guide, Privacy Policy, and Responsible Lending Disclosure |

**State:** `checkedConsents` — `string[]` (indices of checked items)

### Expandable Privacy Sections (informational)

| # | Title |
|---|---|
| 0 | Credit Guide & Quote |
| 1 | Privacy Policy & Data Use |
| 2 | Responsible Lending Obligations |

**State:** `openPanel` — `number \| null`

---

## 10. Summary (Review)

**Screen:** `SummaryScreen.jsx`  
**Purpose:** Read-only review of all collected data before lender matching. No user input — displays computed summary.

### Snap Cards Displayed

| Card | Data Shown |
|---|---|
| **Loan** | Product type, loan amount, term, purpose, deposit |
| **Profile** | Name, employment type, living status, address duration |
| **Income** | Annual income, monthly income, income type |
| **Assets & Liabilities** | Total assets, total liabilities, consolidation amount |
| **Expenses** | Declared monthly expenses vs HEM benchmark |

### Serviceability Metrics (computed)

| Metric | Description |
|---|---|
| Serviceability pill | Green / Yellow / Red band |
| DTI % | Debt-to-income ratio |
| Monthly surplus | Income minus expenses minus repayments |
| Lender matches | Count of matched lenders |

---

## 11. Lenders

**Screen:** `LendersScreen.jsx`  
**Purpose:** Displays matched lenders with repayment breakdown. User selects repayment frequency.

### Repayment Frequency Selector

| Value | Label |
|---|---|
| `weekly` | Weekly |
| `fortnightly` | Fortnightly |
| `monthly` | Monthly |

**State:** `frequency` — local component state

### Lender Card Data (per lender)

| Field | Description |
|---|---|
| Interest rate | e.g. 8.49% |
| Comparison rate | e.g. 9.12% |
| Approval likelihood | e.g. 86% |
| Setup fee | Once-off |
| Early termination fee | Conditional |
| Base repayment | Per period |
| Monthly fee | Ongoing |
| Total repayment | Per period |
| Term options | Fixed / Variable |
| SLA | Approval timeframe |
| Capacity note | Serviceability comment |
| Conduct note | Credit conduct comment |
| Stability note | Employment stability comment |
| Tips | Lender-specific advice |

---

## 12. Create Account

**Screen:** `CreateAccount.jsx`  
**Purpose:** Creates the user's Axio account at point of lender selection.

### Form Fields

| Field | Input Type | Validation |
|---|---|---|
| Mobile number | `tel` | Australian format (0400 000 000) |
| Email address | `email` | Standard email format |
| Password | `password` | Show/hide toggle |
| OTP (6 digits) | 6 × single-digit inputs | Auto-focus, paste support, backspace navigation |

**Local state variables:**

| Variable | Type |
|---|---|
| `mobile` | `string` |
| `email` | `string` |
| `password` | `string` |
| `showPw` | `boolean` |
| `otp` | `string[]` (length 6) |

---

## 13. Documents Upload

**Screen:** `DocumentsUploadScreen.jsx`  
**Purpose:** Applicant uploads required identity, housing, and income documentation.

### Document Groups

#### Identity Documents (always required)

| ID | Document |
|---|---|
| `driver_front` | Driver's Licence — Front |
| `driver_back` | Driver's Licence — Back |
| `passport` | Passport |
| `medicare` | Medicare Card |
| `rate_notice` | Council Rate Notice |

#### Housing Documents (if renting)

Shown only if `livingStatus` is `rent---agent` or `rent---private`:

| ID | Document |
|---|---|
| `renter_lease` | Rental Lease Agreement |
| `rent_receipts` | Rent Receipts |
| `rental_ledger` | Rental Ledger |
| `tenancy_agreement` | Tenancy Agreement |

#### Visa Document (if visa holder)

Shown only if `residency` is `visa`:

| ID | Document |
|---|---|
| `visa_document` | Visa Grant Notice |

#### Income Documents (dynamic — based on selected income types)

| Income Type | Required Documents | Optional Documents |
|---|---|---|
| `wage` | Last 2 payslips | Employment letter, Bank statement |
| `rental` | Current lease agreement | Rent receipts, Property manager statement |
| `investment` | Investment account statements | Dividend statements |
| `family` | Centrelink Family Benefits statement | — |
| `pension` | Pension / allowance statement | — |
| `child` | Child support agreement or assessment | — |
| `super` | Superannuation statement (last 12 mo) | — |
| `selfemployed` | BAS statements (last 2 qtrs), Business bank statements (3 mo) | Tax returns (last 2 yrs) |
| `other` | Supporting evidence of income | — |

### Document Status Values

| Value | Label |
|---|---|
| `not_started` | Not started |
| `uploaded` | Uploaded |
| `partial` | Partially uploaded |
| `verified` | Verified |
| `review` | Under review |

### Upload Methods

- Take Photo (camera)
- Upload Image (gallery)
- Upload PDF
- Choose Screenshot

**State variables:**

| Variable | Type |
|---|---|
| `uploadedDocs` | `Record<docId, boolean \| File>` |
| `selectedId` | `string \| null` |
| `sheetDoc` | `object \| null` |

---

## 14. Connect Banks

**Screen:** `ConnectBanksScreen.jsx`  
**Purpose:** Open banking connection to retrieve bank statements for income/expense verification.

### Flow Steps

| Step | ID | Screen |
|---|---|---|
| 0 | `intro` | Introduction & benefits |
| 1 | `banks` | Select bank(s) |
| 2 | `period` | Select statement period |
| 3 | `connect` | Authenticate with each bank |
| 4 | `review` | Review connected data |

### Bank Options

| ID | Bank Name |
|---|---|
| `cba` | Commonwealth Bank |
| `anz` | ANZ |
| `nab` | NAB |
| `wbc` | Westpac |
| `ing` | ING |
| `mac` | Macquarie |
| `ben` | Bendigo Bank |
| `other` | Other |

### Statement Period Options

| Value | Label |
|---|---|
| `3` | 3 months |
| `6` | 6 months |
| `12` | 12 months |

### Authentication Modal Fields (per bank)

| Field | Input Type | Notes |
|---|---|---|
| Customer Reference Number (CRN) | Text | Bank-specific identifier |
| Password | Password | Show/hide toggle |
| I authorise Axio to retrieve statements | Checkbox | Must be checked |

### Local State Variables

| Variable | Type |
|---|---|
| `bankStep` | `number` (0–4) |
| `selectedBankIds` | `string[]` |
| `months` | `3 \| 6 \| 12` |
| `bankSearch` | `string` |
| `connectedIds` | `string[]` |
| `modalBank` | `object \| null` |

### Persisted State Variables

| Variable | Type |
|---|---|
| `bankConnected` | `boolean` |
| `selectedBank` | `string` (first selected bank ID) |
| `uploadedDocs.bankstatements` | `boolean` |
| `bankConnectionSummary` | `string` |

---

## 15. Verification Status

**Screen:** `VerificationStatusScreen.jsx`  
**Purpose:** Read-only status display. No user input.

### Information Displayed

- Application reference number
- Current verification status
- What you can do while waiting (4 items)
- Portal benefits (4 items)
- Feature cards (3 items)

---

## 16. Dashboard

**Screen:** `DashboardScreen.jsx`  
**Purpose:** Post-submission portal dashboard. Read-only display.

### Information Displayed

- Active application with status
- Application timeline (5 steps: submitted / documents / assessment / approved / settlement)
- Financial snapshot (5 metrics)
- Document checklist (3 items with status)
- Explore other products (3 product cards)

---

## Supporting Data Files

### Lender Panel — 131 Lenders (`lenderNames.js`)

Categories:

| Category | Count |
|---|---|
| Major banks (CBA, Westpac, NAB, ANZ, etc.) | 34 |
| Non-bank mortgage / specialist home lenders | 19 |
| Personal loan lenders | 16 |
| BNPL / consumer finance | 5 |
| Auto / asset finance | 13 |
| Business / SME lenders | 13 |
| Private / specialist lenders | 6 |
| Manufacturer captive finance | 9 |
| **Total** | **131** |

---

## Complete State Reference

### `onboardingStore.js`

| Variable | Type | Default | Screen |
|---|---|---|---|
| `currentScreen` | `number` | `0` | All |
| `completedScreens` | `number[]` | `[]` | All |
| `checkedEligibility` | `string[]` | `[]` | Eligibility |
| `loanType` | `'personal' \| 'car'` | `'personal'` | Product |
| `purpose` | `string` | `''` | Loan Details |
| `loanAmount` | `number` | `25000` | Loan Details |
| `loanTerm` | `number \| null` | `null` | Loan Details |
| `deposit` | `number` | `0` | Loan Details |
| `tradeIn` | `boolean` | `false` | Loan Details |
| `tradeInFinance` | `boolean` | `false` | Loan Details |
| `balloonPct` | `number` | `0` | Loan Details |
| `securityType` | `'unsecured' \| 'secured'` | `'unsecured'` | Loan Details |
| `securityAssetType` | `string` | `'vehicle'` | Loan Details |
| `vehicleCondition` | `'new' \| 'used' \| 'demo'` | `'new'` | Loan Details |
| `purchaseType` | `'dealer' \| 'private'` | `'dealer'` | Loan Details |
| `vehicleFound` | `boolean` | `false` | Loan Details |
| `firstName` | `string` | `''` | Profile |
| `lastName` | `string` | `''` | Profile |
| `residency` | `string` | `'citizen'` | Profile |
| `relationshipStatus` | `string` | `'single'` | Profile |
| `dependants` | `number` | `0` | Profile |
| `dependantAges` | `string[]` | `[]` | Profile |
| `livingStatus` | `string` | `'mortgage'` | Profile |
| `employmentTypes` | `string[]` | `[]` | Profile |
| `addressHistoryUnder3` | `boolean` | `false` | Profile |
| `employmentHistoryUnder3` | `boolean` | `false` | Profile |
| `incomeTypes` | `string[]` | `[]` | Income |
| `sharedExpenses` | `boolean` | `false` | Profile / Expenses |
| `sharedPct` | `number` | `50` | Profile / Expenses |
| `checkedConsents` | `string[]` | `[]` | Privacy |
| `selectedServiceability` | `string \| null` | `null` | Summary / Lenders |
| `bankConnected` | `boolean` | `false` | Connect Banks |
| `selectedBank` | `string` | `''` | Connect Banks |
| `bankConnectionSummary` | `string` | `''` | Connect Banks |
| `jointApplicant` | `boolean` | `false` | Profile |

### `assetsStore.js`

| Variable | Type | Description |
|---|---|---|
| `assets` | `Record<string, boolean>` | Which asset types are toggled on |
| `assetsData` | `Record<string, AssetTypeData>` | Per-type item collections |
| `liabilities` | `Record<string, boolean>` | Which liability types are toggled on |
| `liabilitiesData` | `Record<string, LiabilityTypeData>` | Per-type item collections |
| `realEstateLinks` | `Record<number, object>` | Auto-linked from real estate assets |

### `expensesStore.js`

| Variable | Type | Description |
|---|---|---|
| `expenses` | `Record<categoryId, number>` | Monthly amount per category |
| `sharedExpenses` | `boolean` | Expenses shared with partner |
| `sharedPct` | `number` | Partner's share % |

### `documentsStore.js`

| Variable | Type | Description |
|---|---|---|
| `uploadedDocs` | `Record<docId, any>` | Uploaded document store |
| `uploadProgress` | `Record<docId, number>` | Upload progress 0–100 |
| `verificationStatus` | `string` | Overall verification status |

### `lenderStore.js`

| Variable | Type | Description |
|---|---|---|
| `selectedServiceability` | `string \| null` | Selected serviceability band |
| `bankConnected` | `boolean` | Bank connection status |
| `selectedBank` | `string` | First connected bank |
| `matchedLenders` | `object[]` | Matched lender array |
| `selectedLender` | `object \| null` | Chosen lender |

---

## Field Count Summary

| Screen | Input Fields | Selects / Toggles | Conditional Fields |
|---|---|---|---|
| Eligibility | 5 checkboxes | — | — |
| Product | — | 1 card select | — |
| Loan Details | 3 sliders | 5 selects, 2 toggles | 6 (car-only, secured-only) |
| Profile | 6 text/tel | 6 selects, 7 multi-chips | 8 (visa, partner, address history) |
| Income | Per-type: 1 currency, 1 select | 9 type cards | Entire section per type |
| Assets | Per-item: 2–7 fields | 6 type toggles | 3 (finance fields) |
| Liabilities | Per-item: 3–7 fields | 6 type toggles | Auto-linked real estate |
| Expenses | 8 steppers | 2 toggles, 1 slider | 3 (rent declaration) |
| Privacy | 3 checkboxes | — | — |
| Summary | Read-only | — | — |
| Lenders | — | 1 frequency select | — |
| Create Account | 3 text + 6 OTP | 1 toggle | OTP after mobile submit |
| Documents | File uploads | Upload method select | Per income type, per residency |
| Connect Banks | 2 text + 1 checkbox | Bank cards, period select | Per-bank auth modal |
| Verification | Read-only | — | — |
| Dashboard | Read-only | — | — |

---

*Generated from source: `src/features/*/`, `src/shared/data/`, `src/app/store/`*
