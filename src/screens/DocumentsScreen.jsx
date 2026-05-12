import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import './DocumentsScreen.css';

// ─── Document upload data ─────────────────────────────────────────────────────

const DOCUMENTS = [
  {
    id: 'driver_front', group: 'Identity',
    title: 'Driver Licence Front', subtitle: 'Capture the front side of your licence',
    icon: 'Wallet', required: true, defaultStatus: 'not_started', stateKey: 'licence',
    extracted: ['Full name', 'Date of birth', 'Licence number'],
  },
  {
    id: 'driver_back', group: 'Identity',
    title: 'Driver Licence Back', subtitle: 'Capture the back side for address check',
    icon: 'Wallet', required: true, defaultStatus: 'not_started', stateKey: 'licence',
    extracted: ['Residential address', 'Card number', 'Expiry date'],
  },
  {
    id: 'passport', group: 'Identity',
    title: 'Passport', subtitle: 'Photo page or PDF copy accepted',
    icon: 'BookMarked', required: false, defaultStatus: 'not_started', stateKey: null,
    extracted: ['Passport number', 'Country', 'Expiry date'],
  },
  {
    id: 'medicare', group: 'Identity',
    title: 'Medicare Card', subtitle: 'Used as supporting identity verification',
    icon: 'Shield', required: true, defaultStatus: 'not_started', stateKey: 'medicare',
    extracted: ['Medicare number', 'Reference number', 'Expiry'],
  },
  {
    id: 'payslips', group: 'Income',
    title: 'Payslips', subtitle: 'Upload your latest 2 payslips',
    icon: 'Upload', required: true, defaultStatus: 'not_started', stateKey: 'payslips',
    extracted: ['Employer', 'Gross income', 'Pay cycle', 'YTD income'],
  },
  {
    id: 'rate_notice', group: 'Property / Address',
    title: 'Rate Notice', subtitle: 'For property owners or investment property',
    icon: 'Home', required: false, defaultStatus: 'not_started', stateKey: 'rates',
    extracted: ['Property address', 'Owner name', 'Council valuation'],
  },
  {
    id: 'lease_agreement', group: 'Rental Documents',
    title: 'Lease Agreement', subtitle: 'Signed lease or rental contract from your landlord or agent',
    icon: 'FileText', required: true, defaultStatus: 'not_started', stateKey: 'lease',
    extracted: ['Lease address', 'Rent amount', 'Lease term'],
    rentalOnly: true,
  },
  {
    id: 'rent_receipts', group: 'Rental Documents',
    title: 'Rent Receipts', subtitle: 'Latest 3 months of rental payment receipts',
    icon: 'Receipt', required: false, defaultStatus: 'not_started', stateKey: 'rent_receipts',
    extracted: ['Payment amount', 'Payment dates', 'Landlord or agent'],
    rentalOnly: true,
  },
  {
    id: 'rental_ledger', group: 'Rental Documents',
    title: 'Rental Ledger', subtitle: 'Agent-issued history of rental payments and arrears',
    icon: 'List', required: false, defaultStatus: 'not_started', stateKey: 'rental_ledger',
    extracted: ['Payment history', 'Arrears status', 'Bond details'],
    rentalOnly: true,
  },
  {
    id: 'tenancy_agreement', group: 'Rental Documents',
    title: 'Tenancy Agreement', subtitle: 'Government-issued form — alternative to lease agreement',
    icon: 'ClipboardList', required: false, defaultStatus: 'not_started', stateKey: null,
    extracted: ['Tenancy address', 'Bond amount', 'Start date'],
    rentalOnly: true,
  },
];

const STATUS_CONFIG = {
  verified:    { label: 'Verified',     icon: 'CheckCircle2', cls: 'verified'    },
  uploaded:    { label: 'Uploaded',     icon: 'Clock',        cls: 'uploaded'    },
  partial:     { label: 'In progress',  icon: 'Clock',        cls: 'partial'     },
  review:      { label: 'Needs review', icon: 'AlertCircle',  cls: 'review'      },
  not_started: { label: 'Not started',  icon: 'Upload',       cls: 'not-started' },
};

const UPLOAD_METHODS = [
  { title: 'Take Photo',        desc: 'Use guided camera capture',      icon: 'Camera'     },
  { title: 'Upload Image',      desc: 'JPG or PNG from gallery',        icon: 'Image'      },
  { title: 'Upload PDF',        desc: 'Upload a PDF document',          icon: 'FileText'   },
  { title: 'Choose Screenshot', desc: 'Select a screenshot from phone', icon: 'Smartphone' },
];

// ─── Bank statement flow data ─────────────────────────────────────────────────

const BANK_ITEMS = [
  { id: 'cba',   icon: 'Landmark',  name: 'Commonwealth', type: 'Major'    },
  { id: 'anz',   icon: 'Building2', name: 'ANZ',          type: 'Major'    },
  { id: 'nab',   icon: 'Banknote',  name: 'NAB',          type: 'Major'    },
  { id: 'wbc',   icon: 'Store',     name: 'Westpac',      type: 'Major'    },
  { id: 'ing',   icon: 'Sparkles',  name: 'ING',          type: 'Digital'  },
  { id: 'mac',   icon: 'BarChart2', name: 'Macquarie',    type: 'Digital'  },
  { id: 'ben',   icon: 'Home',      name: 'Bendigo',      type: 'Regional' },
  { id: 'other', icon: 'Plus',      name: 'Other',        type: 'Regional' },
];

const FLOW_STEPS = [
  { id: 'intro',   title: 'Connect banks',    short: 'Why we need this',  stepIcon: 'Sparkles'     },
  { id: 'banks',   title: 'Choose banks',     short: 'Multiple banks',    stepIcon: 'Building2'    },
  { id: 'period',  title: 'Statement period', short: '3, 6 or 12 months', stepIcon: 'CalendarDays' },
  { id: 'connect', title: 'Secure connect',   short: 'Bank redirect',     stepIcon: 'Lock'         },
  { id: 'review',  title: 'Review',           short: 'Anika summary',     stepIcon: 'BarChart2'    },
];

const INTRO_BENEFITS = [
  { icon: 'CheckCircle2', label: 'Verify income'   },
  { icon: 'CreditCard',   label: 'Review expenses' },
  { icon: 'AlertCircle',  label: 'Find risk flags' },
  { icon: 'Target',       label: 'Match lenders'   },
];

const ANIKA_CHECKS = [
  'Income deposits', 'Pay cycle',
  'Living expenses', 'BNPL and loans',
  'Dishonours',      'Spending behaviour',
];

// ─── Document upload sub-components ──────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
  return (
    <span className={`doc-status-badge ${cfg.cls}`}>
      <Icon name={cfg.icon} size={11} strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function DocumentCard({ doc, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.987 }}
      className={`doc-upload-card status-${doc.status.replace('_', '-')}${selected ? ' selected' : ''}`}
    >
      <div className="doc-card-inner">
        <div className="doc-card-icon-wrap">
          <Icon name={doc.icon} size={19} />
        </div>
        <div className="doc-card-body">
          <div className="doc-card-head">
            <div className="doc-card-text">
              <div className="doc-card-title">{doc.title}</div>
              <div className="doc-card-sub">{doc.subtitle}</div>
            </div>
            <Icon name="ChevronRight" size={15} className="doc-card-chevron" />
          </div>
          <div className="doc-card-badges">
            <StatusBadge status={doc.status} />
            <span className={`doc-req-badge${doc.required ? ' required' : ''}`}>
              {doc.required ? 'Required' : 'Optional'}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function UploadSheet({ doc, onClose, onUpload }) {
  if (!doc) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="sheet-overlay"
        className="doc-sheet-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="doc-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="doc-sheet-handle" />
          <div className="doc-sheet-header">
            <div>
              <div className="doc-sheet-eyebrow">Upload document</div>
              <div className="doc-sheet-title">{doc.title}</div>
              <div className="doc-sheet-hint">PDF, JPG, PNG or screenshot accepted.</div>
            </div>
            <button type="button" className="doc-sheet-close" onClick={onClose} aria-label="Close">
              <Icon name="X" size={15} />
            </button>
          </div>
          <div className="doc-sheet-methods">
            {UPLOAD_METHODS.map((m) => (
              <button
                key={m.title}
                type="button"
                className="doc-sheet-method"
                onClick={() => { onUpload(doc.id); onClose(); }}
              >
                <div className="doc-sheet-method-icon">
                  <Icon name={m.icon} size={17} />
                </div>
                <div className="doc-sheet-method-body">
                  <div className="doc-sheet-method-title">{m.title}</div>
                  <div className="doc-sheet-method-desc">{m.desc}</div>
                </div>
                <Icon name="ChevronRight" size={14} className="doc-sheet-chevron" />
              </button>
            ))}
          </div>
          <div className="doc-sheet-anika">
            <Icon name="Sparkles" size={15} className="doc-sheet-anika-icon" />
            <div>
              <div className="doc-sheet-anika-title">Anika AI will check quality instantly</div>
              <div className="doc-sheet-anika-desc">
                Blurry, cropped, expired or mismatched documents will be flagged before submission.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PreviewPanel({ selectedDoc, onUpload }) {
  return (
    <div className="doc-preview-panel">
      <div className="doc-preview-head">
        <div className="doc-preview-head-text">
          <div className="doc-preview-eyebrow">Selected document</div>
          <div className="doc-preview-title">{selectedDoc.title}</div>
          <div className="doc-preview-sub">{selectedDoc.subtitle}</div>
        </div>
        <div className="doc-preview-icon-wrap">
          <Icon name={selectedDoc.icon} size={22} />
        </div>
      </div>
      <div className="doc-preview-dropzone">
        <div className="doc-preview-scan-icon">
          <Icon name="ScanLine" size={34} />
        </div>
        <div className="doc-preview-drop-title">Drop files here or use camera capture</div>
        <div className="doc-preview-drop-desc">
          PDF, JPG, PNG and screenshots accepted. Anika checks quality, reads key details and flags
          issues automatically.
        </div>
        <div className="doc-preview-actions">
          <button type="button" className="doc-preview-btn-primary" onClick={() => onUpload(selectedDoc.id)}>
            <Icon name="Camera" size={13} /> Take Photo
          </button>
          <button type="button" className="doc-preview-btn-ghost" onClick={() => onUpload(selectedDoc.id)}>
            <Icon name="Upload" size={13} /> Upload File
          </button>
        </div>
      </div>
      <div className="doc-preview-extracts">
        <div className="doc-preview-extracts-title">Anika AI extracts</div>
        <div className="doc-preview-extracts-grid">
          {selectedDoc.extracted.map((item) => (
            <div key={item} className="doc-extract-item">
              <span className="doc-extract-check">
                <Icon name="Check" size={10} strokeWidth={2.5} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="doc-preview-security">
        <Icon name="Lock" size={14} className="doc-security-icon" />
        <div>
          <div className="doc-security-title">Secure document storage</div>
          <div className="doc-security-desc">
            Files are encrypted and linked to the customer application audit trail.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Secure Connect Modal ─────────────────────────────────────────────────────

function SecureConnectModal({ bank, onClose, onConnect, onUpload }) {
  const [crn, setCrn] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [consented, setConsented] = useState(false);

  const canSubmit = crn.trim().length > 0 && password.trim().length > 0 && consented;

  const handleConnect = () => {
    if (canSubmit) onConnect();
  };

  // Lock body scroll while modal is open
  useEffect(() => {
    if (bank) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [bank]);

  return createPortal(
    <AnimatePresence>
      {bank && (
        <motion.div
          className="sc-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="sc-modal"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button type="button" className="sc-modal-close" onClick={onClose} aria-label="Close">
              <Icon name="X" size={14} />
            </button>

            {/* Header */}
            <div className="sc-modal-header">
              <div className="sc-modal-lock-icon">
                <Icon name="Lock" size={20} />
              </div>
              <div>
                <div className="sc-modal-title">Secure Authentication</div>
                <div className="sc-modal-sub">
                  Enter your Customer Reference Number (CRN) and password to securely connect your account.
                </div>
              </div>
            </div>

            {/* Bank badge */}
            <div className="sc-modal-bank-row">
              <div className="sc-modal-bank-icon">
                <Icon name={bank.icon} size={14} />
              </div>
              <span className="sc-modal-bank-name">{bank.name}</span>
              <span className="sc-modal-bank-type">{bank.type} Bank</span>
            </div>

            {/* CRN */}
            <div className="sc-modal-field">
              <label className="sc-modal-label">Customer Reference Number (CRN)</label>
              <input
                className="sc-modal-input"
                type="text"
                placeholder="Enter your CRN"
                value={crn}
                onChange={(e) => setCrn(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="sc-modal-field">
              <label className="sc-modal-label">Password</label>
              <div className="sc-modal-input-wrap">
                <input
                  className="sc-modal-input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                />
                <button
                  type="button"
                  className="sc-modal-pwd-toggle"
                  onClick={() => setShowPwd((p) => !p)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPwd ? 'EyeOff' : 'Eye'} size={14} />
                </button>
              </div>
            </div>

            {/* Encrypted notice */}
            <div className="sc-modal-notice">
              <Icon name="Lock" size={13} className="sc-modal-notice-icon" />
              <div>
                <div className="sc-modal-notice-title">Encrypted &amp; Read-Only Access</div>
                <div className="sc-modal-notice-desc">
                  Your banking credentials are encrypted during transmission. Stoik and Axio Finance
                  do not store your login details.
                </div>
              </div>
            </div>

            {/* Consent */}
            <label className="sc-modal-consent">
              <input
                type="checkbox"
                className="sc-modal-checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
              />
              <span className="sc-modal-consent-text">
                Consent to access financial data
                <span className="sc-modal-consent-desc">
                  By continuing, you authorise Stoik and Axio Finance to securely access your
                  banking transaction history for assessment, verification, behavioural analysis,
                  and lender matching.
                </span>
              </span>
            </label>

            {/* CTA */}
            <div className="sc-modal-cta">
              <button
                type="button"
                className="sc-modal-connect-btn"
                onClick={handleConnect}
                disabled={!canSubmit}
              >
                Connect Bank Securely
              </button>
              <button type="button" className="sc-modal-upload-btn" onClick={onUpload}>
                Upload Bank Statements Instead
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── Bank statement sub-components ───────────────────────────────────────────

function BankSummaryPanel({ selectedBanks, months }) {
  return (
    <div className="bank-summary-panel">
      <div className="bank-summary-header">
        <div className="bank-summary-icon">
          <Icon name="Zap" size={19} />
        </div>
        <div>
          <div className="bank-summary-eyebrow">Application check</div>
          <div className="bank-summary-title">Bank data setup</div>
        </div>
      </div>
      <div className="bank-summary-stats">
        <div className="bank-summary-stat accent">
          <div className="bank-summary-stat-label">Selected banks</div>
          <div className="bank-summary-stat-value">{selectedBanks.length}</div>
        </div>
        <div className="bank-summary-stat muted">
          <div className="bank-summary-stat-label">Statement period</div>
          <div className="bank-summary-stat-value">{months} months</div>
        </div>
      </div>
      <div className="bank-summary-anika">
        <div className="bank-summary-anika-title">Anika AI will review:</div>
        <div className="bank-summary-anika-desc">
          Income, expenses, cashflow, liabilities, dishonours, BNPL, gambling indicators, recurring
          repayments and lender readiness.
        </div>
      </div>
    </div>
  );
}

function BankFlowSection({ state, updateState }) {
  const [bankStep, setBankStep] = useState(0);
  const [selectedBankIds, setSelectedBankIds] = useState(['cba', 'nab']);
  const [months, setMonths] = useState(6);
  const [bankSearch, setBankSearch] = useState('');
  const [connectedIds, setConnectedIds] = useState([]);
  const [modalBank, setModalBank] = useState(null);

  const selectedBanks = BANK_ITEMS.filter((b) => selectedBankIds.includes(b.id));
  const filteredBanks = useMemo(
    () => BANK_ITEMS.filter((b) => b.name.toLowerCase().includes(bankSearch.toLowerCase())),
    [bankSearch]
  );

  const canContinue = bankStep !== 1 || selectedBankIds.length > 0;

  const toggleBank = (id) =>
    setSelectedBankIds((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );

  const connectBank = (id) => setConnectedIds((prev) => [...new Set([...prev, id])]);

  const handleNext = () => { if (canContinue) setBankStep((p) => Math.min(FLOW_STEPS.length - 1, p + 1)); };
  const handleBack = () => setBankStep((p) => Math.max(0, p - 1));

  const buildSummary = () =>
    `${selectedBankIds.length} bank${selectedBankIds.length !== 1 ? 's' : ''} · ${months} months · CDR accredited`;

  const handleComplete = () => {
    updateState({
      bankConnected: true,
      selectedBank: selectedBankIds[0] || null,
      uploadedDocs: { ...state.uploadedDocs, bankstatements: true },
      bankConnectionSummary: buildSummary(),
    });
  };

  const handlePdfUpload = () => {
    updateState({
      bankConnected: true,
      selectedBank: null,
      uploadedDocs: { ...state.uploadedDocs, bankstatements: true },
      bankConnectionSummary: 'PDF statements uploaded · CDR accredited',
    });
  };

  const handleDisconnect = () =>
    updateState({ bankConnected: false, selectedBank: null, bankConnectionSummary: null });

  const pct = Math.round(((bankStep + 1) / FLOW_STEPS.length) * 100);

  // ── Connected state ───────────────────────────────────────────────────────
  if (state.bankConnected) {
    return (
      <div className="bank-connected-card">
        <div className="bank-connected-icon">
          <Icon name="CheckCircle2" size={20} />
        </div>
        <div className="bank-connected-body">
          <div className="bank-connected-title">Bank statements connected</div>
          <div className="bank-connected-sub">
            {state.bankConnectionSummary || 'Connected · CDR accredited'}
          </div>
        </div>
        <button type="button" className="bank-connected-disconnect" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  // ── Active flow ───────────────────────────────────────────────────────────
  return (
    <div className="bank-section">
      {/* Hero */}
      <div className="bank-hero">
        <div className="bank-hero-inner">
          <div className="bank-hero-copy">
            <div className="bank-hero-eyebrow">
              <Icon name="Building2" size={11} />
              Axio × Stoik
            </div>
            <h2 className="bank-hero-title">Connect your bank statements</h2>
            <p className="bank-hero-desc">
              Select your banks, give consent, and let Anika AI securely review your banking
              conduct for faster lender matching.
            </p>
            <div className="bank-hero-chips">
              <span className="bank-hero-chip">No PDFs</span>
              <span className="bank-hero-chip">Multi-bank</span>
              <span className="bank-hero-chip">CDR consent</span>
            </div>
          </div>
          <div className="bank-hero-icon-wrap">
            <Icon name="Building2" size={26} />
          </div>
        </div>
      </div>

      {/* Flow grid: content + desktop summary panel */}
      <div className="bank-flow-grid">
        <div className="bank-flow-main">

          {/* Step progress */}
          <div className="bank-progress-card">
            <div className="bank-progress-row">
              <span className="bank-progress-label">Step {bankStep + 1} of {FLOW_STEPS.length}</span>
              <span className="bank-progress-pct">{pct}%</span>
            </div>
            <div className="bank-progress-track">
              <motion.div
                className="bank-progress-fill"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
            <div className="bank-step-pills">
              {FLOW_STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`bank-step-pill${i === bankStep ? ' active' : i < bankStep ? ' done' : ''}`}
                >
                  {s.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step content card */}
          <div className="bank-content-card">
            <div className="bank-content-head">
              <div>
                <div className="bank-content-eyebrow">{FLOW_STEPS[bankStep].short}</div>
                <h3 className="bank-content-title">{FLOW_STEPS[bankStep].title}</h3>
              </div>
              <div className="bank-content-step-icon">
                <Icon name={FLOW_STEPS[bankStep].stepIcon} size={18} />
              </div>
            </div>

            {/* Step 0 — Intro */}
            {bankStep === 0 && (
              <div className="bank-step-body">
                <div className="bank-intro-box">
                  <div className="bank-intro-box-title">Fast, simple and secure</div>
                  <p className="bank-intro-box-desc">
                    Instead of uploading bank statement PDFs, you can securely connect your bank
                    accounts. Anika AI reads the data and prepares a finance assessment summary.
                  </p>
                </div>
                <div className="bank-benefits-grid">
                  {INTRO_BENEFITS.map((b) => (
                    <div key={b.label} className="bank-benefit-item">
                      <Icon name={b.icon} size={15} className="bank-benefit-icon" />
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Banks */}
            {bankStep === 1 && (
              <div className="bank-step-body">
                <div className="bank-search-wrap">
                  <Icon name="Search" size={14} className="bank-search-icon" />
                  <input
                    className="bank-search-input"
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search your bank…"
                  />
                </div>
                <div className="bank-grid">
                  {filteredBanks.map((bank) => {
                    const active = selectedBankIds.includes(bank.id);
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        className={`bank-btn${active ? ' active' : ''}`}
                        onClick={() => toggleBank(bank.id)}
                      >
                        <div className="bank-btn-left">
                          <div className="bank-btn-icon">
                            <Icon name={bank.icon} size={16} />
                          </div>
                          <div>
                            <div className="bank-btn-name">{bank.name}</div>
                            <div className="bank-btn-type">{bank.type}</div>
                          </div>
                        </div>
                        <Icon
                          name={active ? 'CheckCircle2' : 'Plus'}
                          size={15}
                          className={`bank-btn-check${active ? ' active' : ''}`}
                        />
                      </button>
                    );
                  })}
                </div>
                {selectedBankIds.length === 0 && (
                  <div className="bank-warn">Select at least one bank to continue.</div>
                )}
              </div>
            )}

            {/* Step 2 — Period */}
            {bankStep === 2 && (
              <div className="bank-step-body">
                <p className="bank-period-desc">
                  Choose how many months of banking activity Anika AI should analyse.
                </p>
                <div className="bank-period-grid">
                  {[3, 6, 12].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`bank-period-option${months === p ? ' active' : ''}`}
                      onClick={() => setMonths(p)}
                    >
                      <span className="bank-period-num">{p}</span>
                      <span className="bank-period-unit">months</span>
                    </button>
                  ))}
                </div>
                <div className="bank-period-note">
                  <div className="bank-period-note-title">Recommended: 6 months</div>
                  <p className="bank-period-note-desc">
                    Good for most personal loans and car loans. Use 12 months for complex income,
                    self-employed applicants or specific lender requests.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 — Connect */}
            {bankStep === 3 && (
              <div className="bank-step-body">
                <div className="bank-connect-info">
                  <div className="bank-connect-info-title">Secure bank redirect</div>
                  <p className="bank-connect-info-desc">
                    Axio does not collect internet banking passwords. You will be redirected to your
                    bank or approved Open Banking provider to authenticate securely.
                  </p>
                </div>
                <div className="bank-connect-list">
                  {selectedBanks.map((bank) => {
                    const isConnected = connectedIds.includes(bank.id);
                    return (
                      <div key={bank.id} className="bank-connect-item">
                        <div className="bank-connect-item-left">
                          <div className="bank-connect-item-icon">
                            <Icon name={bank.icon} size={16} />
                          </div>
                          <div>
                            <div className="bank-connect-item-name">{bank.name}</div>
                            <div className="bank-connect-item-sub">
                              {isConnected ? 'Connected · read-only' : 'Ready to connect'}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`bank-connect-btn${isConnected ? ' done' : ''}`}
                          onClick={() => !isConnected && setModalBank(bank)}
                        >
                          {isConnected ? (
                            <><Icon name="Check" size={12} /> Connected</>
                          ) : (
                            'Connect'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="bank-connect-divider">
                  <div className="bank-connect-line" />
                  <span>or upload PDF manually</span>
                  <div className="bank-connect-line" />
                </div>
                <div
                  className={`bank-pdf-zone${state.uploadedDocs?.bankstatements ? ' done' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={handlePdfUpload}
                  onKeyDown={(e) => e.key === 'Enter' && handlePdfUpload()}
                >
                  <Icon name="FileText" size={18} className="bank-pdf-zone-icon" />
                  <div className="bank-pdf-zone-title">Upload PDF statements</div>
                  <div className="bank-pdf-zone-sub">
                    3 months · all accounts used for income or expenses
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Review */}
            {bankStep === 4 && (
              <div className="bank-step-body">
                <div className="bank-review-hero">
                  <Icon name="CheckCircle2" size={18} className="bank-review-hero-icon" />
                  <div>
                    <div className="bank-review-hero-title">Bank statement review ready</div>
                    <p className="bank-review-hero-desc">
                      Anika AI has prepared a conduct summary for the customer and analyst.
                    </p>
                  </div>
                </div>
                <div className="bank-review-metrics">
                  <div className="bank-review-metric green">
                    <div className="bank-review-metric-label">Income confidence</div>
                    <div className="bank-review-metric-value">92%</div>
                  </div>
                  <div className="bank-review-metric yellow">
                    <div className="bank-review-metric-label">Expenses</div>
                    <div className="bank-review-metric-value">Review</div>
                  </div>
                  <div className="bank-review-metric accent">
                    <div className="bank-review-metric-label">Risk flags</div>
                    <div className="bank-review-metric-value">3</div>
                  </div>
                </div>
                <div className="bank-review-checks">
                  <div className="bank-review-checks-title">Anika AI checks</div>
                  <div className="bank-review-checks-grid">
                    {ANIKA_CHECKS.map((check) => (
                      <div key={check} className="bank-review-check-item">
                        <Icon name="Check" size={11} className="bank-review-check-icon" />
                        {check}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Internal step navigation */}
            <div className="bank-step-nav">
              <button
                type="button"
                className="bank-nav-back"
                onClick={handleBack}
                disabled={bankStep === 0}
              >
                ← Back
              </button>
              {bankStep < FLOW_STEPS.length - 1 ? (
                <button
                  type="button"
                  className="bank-nav-next"
                  onClick={handleNext}
                  disabled={!canContinue}
                >
                  Continue →
                </button>
              ) : (
                <button type="button" className="bank-nav-next" onClick={handleComplete}>
                  Complete setup →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop summary panel */}
        <BankSummaryPanel
          selectedBanks={selectedBanks}
          months={months}
        />
      </div>

      {/* Secure connect modal */}
      <SecureConnectModal
        bank={modalBank}
        onClose={() => setModalBank(null)}
        onConnect={() => {
          if (modalBank) connectBank(modalBank.id);
          setModalBank(null);
        }}
        onUpload={() => {
          setModalBank(null);
          handlePdfUpload();
        }}
      />
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function DocumentsScreen() {
  const { state, updateState, next, prev } = useApp();
  const [selectedId, setSelectedId] = useState(DOCUMENTS[0].id);
  const [sheetDoc, setSheetDoc] = useState(null);

  const requiresRentalDocs =
    state.livingStatus === 'rent---agent' ||
    state.livingStatus === 'rent---private';

  const markUpload = (docId) => {
    const doc = DOCUMENTS.find((d) => d.id === docId);
    if (doc?.stateKey) {
      updateState({ uploadedDocs: { ...state.uploadedDocs, [doc.stateKey]: true } });
    }
  };

  const computedDocs = useMemo(
    () =>
      DOCUMENTS
        .filter((doc) => !doc.rentalOnly || requiresRentalDocs)
        .map((doc) => ({
          ...doc,
          status: doc.stateKey && state.uploadedDocs?.[doc.stateKey] ? 'uploaded' : doc.defaultStatus,
        })),
    [state.uploadedDocs, requiresRentalDocs]
  );

  const selectedDoc = computedDocs.find((d) => d.id === selectedId) || computedDocs[0];

  const groups = useMemo(
    () =>
      computedDocs.reduce((acc, doc) => {
        if (!acc[doc.group]) acc[doc.group] = [];
        acc[doc.group].push(doc);
        return acc;
      }, {}),
    [computedDocs]
  );

  const handleDocClick = (doc) => {
    setSelectedId(doc.id);
    setSheetDoc(doc);
  };

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 8 · Documents"
        title="My"
        titleGradient="Documents"
        sub="Connect your bank accounts and upload supporting documents for your application."
      />

      {/* ── Bank Statement Connection Flow ── */}
      <BankFlowSection state={state} updateState={updateState} />

      {/* ── Section divider ── */}
      <div className="section-divider">
        <div className="section-divider-line" />
        <span className="section-divider-label">
          <Icon name="FileText" size={12} />
          Documents to upload
        </span>
        <div className="section-divider-line" />
      </div>

      {/* ── Anika info banner ── */}
      <div className="doc-anika-banner">
        <Icon name="Lock" size={15} className="doc-anika-icon" />
        <div>
          <div className="doc-anika-title">Simple, secure and AI-assisted</div>
          <div className="doc-anika-desc">
            Take a photo, upload a screenshot, image or PDF. Anika checks quality, reads key details
            and tells you if anything needs fixing.
          </div>
        </div>
      </div>

      {/* ── Rental docs contextual notice ── */}
      {requiresRentalDocs && (
        <div className="rental-docs-notice">
          <Icon name="Home" size={15} className="rental-docs-notice-icon" />
          <div>
            <div className="rental-docs-notice-title">Rental documents required</div>
            <div className="rental-docs-notice-desc">
              Based on your living situation, lenders require proof of rental. Upload at least your
              lease agreement. Accepted: lease agreement, rent receipts, rental ledger, or tenancy
              agreement.
            </div>
          </div>
        </div>
      )}

      {/* ── Document list + preview panel ── */}
      <div className="doc-main-grid">
        <div className="doc-list-col">
          {Object.entries(groups).map(([group, docs]) => (
            <section key={group} className="doc-group-section">
              <div className="doc-group-header">
                <span className="doc-group-title">{group}</span>
                <span className="doc-group-count">{docs.length} items</span>
              </div>
              <div className="doc-group-cards">
                {docs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    selected={doc.id === selectedId}
                    onClick={() => handleDocClick(doc)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <PreviewPanel selectedDoc={selectedDoc} onUpload={markUpload} />
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to privacy →</BtnPrimary>
      </BtnRow>

      <UploadSheet doc={sheetDoc} onClose={() => setSheetDoc(null)} onUpload={markUpload} />
    </div>
  );
}
