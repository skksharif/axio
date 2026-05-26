/**
 * Type documentation for key onboarding domain objects.
 * JSDoc-only — no TypeScript required.
 */

/**
 * @typedef {'personal' | 'car'} LoanType
 * @typedef {'new' | 'used' | 'demo'} VehicleCondition
 * @typedef {'dealer' | 'private' | 'refinance'} PurchaseType
 * @typedef {'secured' | 'unsecured'} SecurityType
 * @typedef {'vehicle' | 'property' | 'other'} SecurityAssetType
 * @typedef {'citizen' | 'permanent' | 'visa' | 'other'} ResidencyStatus
 * @typedef {'single' | 'married' | 'defacto' | 'separated' | 'divorced'} RelationshipStatus
 * @typedef {'full-time' | 'part-time' | 'casual' | 'self-employed' | 'contractor' | 'not-employed'} EmploymentType
 * @typedef {'mortgage' | 'renting' | 'living-with-family' | 'own-outright'} LivingStatus
 * @typedef {'green' | 'yellow' | 'red'} ServiceabilityBand
 */

/**
 * @typedef {Object} OnboardingState
 * @property {number}            currentScreen
 * @property {number[]}          completedScreens
 * @property {LoanType}          loanType
 * @property {VehicleCondition}  vehicleCondition
 * @property {SecurityType}      securityType
 * @property {number}            loanAmount
 * @property {number|null}       loanTerm
 * @property {number}            deposit
 * @property {number}            balloonPct
 * @property {string}            firstName
 * @property {string}            lastName
 * @property {RelationshipStatus} relationshipStatus
 * @property {number}            dependants
 * @property {EmploymentType[]}  employmentTypes
 * @property {LivingStatus}      livingStatus
 * @property {string[]}          incomeTypes
 * @property {string[]}          checkedConsents
 */

/**
 * @typedef {Object} AssetItem
 * @property {string} [value]
 * @property {string} [lender]
 * @property {boolean} [consolidate]
 */

/**
 * @typedef {Object} AssetTypeData
 * @property {number} nextId
 * @property {Record<number, AssetItem>} items
 */
