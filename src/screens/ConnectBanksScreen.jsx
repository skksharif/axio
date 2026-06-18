import { useEffect, useMemo, useState } from 'react';
import { Landmark, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { AnikaInsightCard } from '../components/common/AnikaInsightCard';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { getStep } from '../constants/screens';
import './ConnectBanksScreen.css';

// ─── Static data ─────────────────────────────────────────────────────────────

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

// ─── Bank summary panel (desktop sidebar) ────────────────────────────────────

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

// ─── Secure Connect Modal ─────────────────────────────────────────────────────

function SecureConnectModal({ bank, onClose, onSecureConnect, onStatementUpload }) {
  const [modalMode, setModalMode] = useState('connect'); // 'connect' | 'upload'
  const [crn, setCrn]             = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [consented, setConsented] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadError, setUploadError]     = useState('');

  useEffect(() => {
    if (bank) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [bank]);

  const canSubmit = crn.trim().length > 0 && password.trim().length > 0 && consented;

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files);
    setUploadedFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      return [...prev, ...incoming.filter((f) => !existingNames.has(f.name))];
    });
    setUploadError('');
    e.target.value = '';
  };

  const removeFile = (idx) => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleUploadSubmit = () => {
    if (uploadedFiles.length === 0) {
      setUploadError('Please upload at least one PDF bank statement.');
      return;
    }
    onStatementUpload(uploadedFiles.map((f) => f.name));
  };

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
            <button type="button" className="sc-modal-close" onClick={onClose} aria-label="Close">
              <Icon name="X" size={14} />
            </button>

            {/* ── Header ── */}
            <div className="sc-modal-header">
              <div className="sc-modal-lock-icon">
                <Icon name={modalMode === 'upload' ? 'FileText' : 'Lock'} size={20} />
              </div>
              <div>
                <div className="sc-modal-title">
                  {modalMode === 'upload' ? 'Upload Bank Statements' : 'Secure Authentication'}
                </div>
                <div className="sc-modal-sub">
                  {modalMode === 'upload'
                    ? 'Upload PDF statements for this bank account.'
                    : 'Enter your CRN and password to securely connect your account.'}
                </div>
              </div>
            </div>

            {/* ── Bank pill ── */}
            <div className="sc-modal-bank-row">
              <div className="sc-modal-bank-icon">
                <Icon name={bank.icon} size={14} />
              </div>
              <span className="sc-modal-bank-name">{bank.name}</span>
              <span className="sc-modal-bank-type">{bank.type} Bank</span>
            </div>

            {/* ── Connect mode ── */}
            {modalMode === 'connect' && (
              <>
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
                      onKeyDown={(e) => e.key === 'Enter' && canSubmit && onSecureConnect()}
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

                <div className="sc-modal-notice">
                  <Icon name="Lock" size={13} className="sc-modal-notice-icon" />
                  <div>
                    <div className="sc-modal-notice-title">Encrypted &amp; Read-Only Access</div>
                    <div className="sc-modal-notice-desc">
                      Your banking credentials are encrypted during transmission. Stoik and Lumio Finance
                      do not store your login details.
                    </div>
                  </div>
                </div>

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
                      By continuing, you authorise Stoik and Lumio Finance to securely access your
                      banking transaction history for assessment, verification, and lender matching.
                    </span>
                  </span>
                </label>

                <div className="sc-modal-cta">
                  <button
                    type="button"
                    className="sc-modal-connect-btn"
                    onClick={() => canSubmit && onSecureConnect()}
                    disabled={!canSubmit}
                  >
                    Connect Bank Securely
                  </button>
                  <button
                    type="button"
                    className="sc-modal-upload-btn"
                    onClick={() => setModalMode('upload')}
                  >
                    Upload Bank Statements Instead
                  </button>
                </div>
              </>
            )}

            {/* ── Upload mode ── */}
            {modalMode === 'upload' && (
              <>
                <AnikaInsightCard
                  variant="warning"
                  style={{ marginBottom: 12 }}
                  message="Bank statement analysis is a mandatory step for most lenders. A minimum of 3 months of statements is required to assess your transaction history, income regularity, and spending patterns. Fewer months of statements may significantly limit your available lender options."
                  summary="Minimum 3 months of bank statements required for lender assessment and matching."
                />

                <div className="sc-upload-drop">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    onChange={handleFileChange}
                    aria-label="Upload PDF bank statements"
                  />
                  <Icon name="Upload" size={18} className="sc-upload-drop-icon" />
                  <span className="sc-upload-drop-label">Click to upload PDF statements</span>
                  <span className="sc-upload-drop-sub">PDF files only · Multiple files allowed</span>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="sc-upload-file-list">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="sc-upload-file-item">
                        <Icon name="FileText" size={13} className="sc-upload-file-icon" />
                        <span className="sc-upload-file-name">{file.name}</span>
                        <button
                          type="button"
                          className="sc-upload-file-remove"
                          onClick={() => removeFile(idx)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadError && <div className="sc-upload-error">{uploadError}</div>}

                <div className="sc-modal-cta">
                  <button
                    type="button"
                    className="sc-modal-connect-btn"
                    onClick={handleUploadSubmit}
                    disabled={uploadedFiles.length === 0}
                  >
                    Upload Statements
                  </button>
                  <button
                    type="button"
                    className="sc-modal-upload-btn"
                    onClick={() => setModalMode('connect')}
                  >
                    ← Back to Secure Connect
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ConnectBanksScreen() {
  const { state, updateState, next, prev } = useApp();

  const [bankStep, setBankStep]             = useState(0);
  const [selectedBankIds, setSelectedBankIds] = useState([]);
  const [months, setMonths]                 = useState(6);
  const [bankSearch, setBankSearch]         = useState('');
  const [connectedBankData, setConnectedBankData] = useState({});
  // { [bankId]: { method: 'secure' | 'upload', files: string[] } }
  const [modalBank, setModalBank]           = useState(null);

  const selectedBanks = BANK_ITEMS.filter((b) => selectedBankIds.includes(b.id));
  const filteredBanks = useMemo(
    () => BANK_ITEMS.filter((b) => b.name.toLowerCase().includes(bankSearch.toLowerCase())),
    [bankSearch]
  );

  const allBanksConnected =
    selectedBankIds.length > 0 && selectedBankIds.every((id) => connectedBankData[id]);

  const canContinue =
    bankStep === 1 ? selectedBankIds.length > 0 :
    bankStep === 3 ? allBanksConnected :
    true;

  const pct = Math.round(((bankStep + 1) / FLOW_STEPS.length) * 100);

  const toggleBank = (id) =>
    setSelectedBankIds((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );

  const handleNext = () => { if (canContinue) setBankStep((p) => Math.min(FLOW_STEPS.length - 1, p + 1)); };
  const handleBack = () => setBankStep((p) => Math.max(0, p - 1));

  const buildSummary = () =>
    selectedBankIds
      .map((id) => {
        const b    = BANK_ITEMS.find((b) => b.id === id);
        const conn = connectedBankData[id];
        return `${b?.name ?? id} · ${conn?.method === 'secure' ? 'Secure Connect' : 'Statement Upload'}`;
      })
      .join('  ·  ');

  const handleComplete = () => {
    updateState({
      bankConnected: true,
      selectedBank: selectedBankIds[0] || null,
      uploadedDocs: { ...state.uploadedDocs, bankstatements: true },
      bankConnectionSummary: buildSummary(),
    });
  };

  const handleDisconnect = () => {
    setConnectedBankData({});
    updateState({ bankConnected: false, selectedBank: null, bankConnectionSummary: null });
  };

  const handleSecureConnect = () => {
    if (modalBank) {
      setConnectedBankData((prev) => ({ ...prev, [modalBank.id]: { method: 'secure', files: [] } }));
    }
    setModalBank(null);
  };

  const handleStatementUpload = (files) => {
    if (modalBank) {
      setConnectedBankData((prev) => ({ ...prev, [modalBank.id]: { method: 'upload', files } }));
    }
    setModalBank(null);
  };

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step ${getStep('connectbanks')} · Connect banks`}
        title="Secure bank"
        titleGradient="connection"
        sub={
          <>
            <span className="sh-sub-row">
              <Landmark size={13} style={{ color: 'var(--hover)' }} />
              <span>Connect your bank accounts securely.</span>
            </span>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
              <span>Anika AI verifies your income and prepares your lender assessment automatically.</span>
            </span>
          </>
        }
      />

      {/* ── Connected state ── */}
      {state.bankConnected ? (
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
      ) : (
        /* ── Active bank flow ── */
        <div className="bank-section">

          {/* Hero */}
          <div className="bank-hero">
            <div className="bank-hero-inner">
              <div className="bank-hero-copy">
                <div className="bank-hero-eyebrow">
                  <Icon name="Building2" size={11} />
                  Lumio × Stoik
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

          {/* Flow grid: step content + desktop summary */}
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
                        Lumio does not collect internet banking passwords. You will be redirected to
                        your bank or approved Open Banking provider to authenticate securely.
                      </p>
                    </div>
                    <div className="bank-connect-list">
                      {selectedBanks.map((bank) => {
                        const conn        = connectedBankData[bank.id];
                        const isConnected = !!conn;
                        return (
                          <div key={bank.id} className="bank-connect-item">
                            <div className="bank-connect-item-left">
                              <div className="bank-connect-item-icon">
                                <Icon name={bank.icon} size={16} />
                              </div>
                              <div className="bank-connect-item-info">
                                <div className="bank-connect-item-name">{bank.name}</div>
                                {isConnected ? (
                                  <>
                                    <div className="bank-connect-item-method">
                                      <Icon name="CheckCircle2" size={10} />
                                      {conn.method === 'secure' ? 'Secure Connect' : 'Statement Upload'}
                                    </div>
                                    {conn.files.length > 0 && (
                                      <div className="bank-connect-item-files">
                                        {conn.files.map((f, i) => (
                                          <span key={i} className="bank-connect-file-tag">
                                            <Icon name="FileText" size={10} /> {f}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="bank-connect-item-sub">Ready to connect</div>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`bank-connect-btn${isConnected ? ' done' : ''}`}
                              onClick={() => !isConnected && setModalBank(bank)}
                              disabled={isConnected}
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
                    {!allBanksConnected && selectedBankIds.length > 0 && (
                      <div className="bank-warn">
                        Connect all selected banks to continue.
                      </div>
                    )}
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
            <BankSummaryPanel selectedBanks={selectedBanks} months={months} />
          </div>
        </div>
      )}

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next} disabled={!state.bankConnected}>Continue →</BtnPrimary>
      </BtnRow>

      <SecureConnectModal
        key={modalBank?.id ?? ''}
        bank={modalBank}
        onClose={() => setModalBank(null)}
        onSecureConnect={handleSecureConnect}
        onStatementUpload={handleStatementUpload}
      />
    </div>
  );
}
