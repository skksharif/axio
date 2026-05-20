import { useMemo, useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaPanel } from '../components/common/AnikaPanel';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { INCOME_DOC_MAP } from '../data/incomeDocMap';
import { INCOME_TYPES } from '../data/incomeTypes';
import './DocumentsUploadScreen.css';

// ─── Static document data ─────────────────────────────────────────────────────

const STATIC_DOCS = [
  {
    id: 'driver_front', groupLabel: 'Identity', groupIcon: 'Shield',
    title: 'Driver Licence Front', subtitle: 'Capture the front side of your licence',
    icon: 'Wallet', required: true, stateKey: 'licence',
    extracted: ['Full name', 'Date of birth', 'Licence number'],
  },
  {
    id: 'driver_back', groupLabel: 'Identity', groupIcon: 'Shield',
    title: 'Driver Licence Back', subtitle: 'Capture the back side for address check',
    icon: 'Wallet', required: true, stateKey: 'licence',
    extracted: ['Residential address', 'Card number', 'Expiry date'],
  },
  {
    id: 'passport', groupLabel: 'Identity', groupIcon: 'Shield',
    title: 'Passport', subtitle: 'Photo page or PDF copy accepted',
    icon: 'BookMarked', required: false, stateKey: null,
    extracted: ['Passport number', 'Country', 'Expiry date'],
  },
  {
    id: 'medicare', groupLabel: 'Identity', groupIcon: 'Shield',
    title: 'Medicare Card', subtitle: 'Used as supporting identity verification',
    icon: 'Shield', required: true, stateKey: 'medicare',
    extracted: ['Medicare number', 'Reference number', 'Expiry'],
  },
  {
    id: 'rate_notice', groupLabel: 'Property', groupIcon: 'Home',
    title: 'Rate Notice', subtitle: 'For property owners or investment property',
    icon: 'Home', required: false, stateKey: 'rates',
    extracted: ['Property address', 'Owner name', 'Council valuation'],
  },
];

const HOUSING_DOCS = [
  {
    id: 'renter_lease', groupLabel: 'Housing Documents', groupIcon: 'Key',
    title: 'Lease Agreement', subtitle: 'Signed lease or rental contract from your landlord or agent',
    icon: 'FileText', required: true, stateKey: 'lease',
    extracted: ['Lease address', 'Rent amount', 'Lease term'],
  },
  {
    id: 'rent_receipts', groupLabel: 'Housing Documents', groupIcon: 'Key',
    title: 'Rent Receipts', subtitle: 'Latest 3 months of rental payment receipts',
    icon: 'Receipt', required: false, stateKey: 'rent_receipts',
    extracted: ['Payment amount', 'Payment dates', 'Landlord or agent'],
  },
  {
    id: 'rental_ledger', groupLabel: 'Housing Documents', groupIcon: 'Key',
    title: 'Rental Ledger', subtitle: 'Agent-issued history of rental payments and arrears',
    icon: 'List', required: false, stateKey: 'rental_ledger',
    extracted: ['Payment history', 'Arrears status', 'Bond details'],
  },
  {
    id: 'tenancy_agreement', groupLabel: 'Housing Documents', groupIcon: 'Key',
    title: 'Tenancy Agreement', subtitle: 'Government-issued form — alternative to lease agreement',
    icon: 'ClipboardList', required: false, stateKey: null,
    extracted: ['Tenancy address', 'Bond amount', 'Start date'],
  },
];

const VISA_DOC = {
  id: 'visa_document',
  groupLabel: 'Visa Documentation',
  groupIcon: 'Plane',
  title: 'Visa Document',
  subtitle: 'Grant letter, eVisa confirmation or visa label in passport',
  icon: 'Plane',
  required: true,
  stateKey: 'visa_document',
  extracted: ['Visa subclass', 'Expiry date', 'Work entitlements'],
};

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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      layout
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

const getDocUploadKey = (doc) => doc.stateKey ?? doc.id;

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

// ─── Main screen ──────────────────────────────────────────────────────────────

export function DocumentsUploadScreen() {
  const { state, updateState, next, prev } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [sheetDoc, setSheetDoc] = useState(null);

  const requiresRentalDocs =
    state.livingStatus === 'rent---agent' ||
    state.livingStatus === 'rent---private';

  const isVisaHolder = state.residency === 'visa';
  const visaUploaded = !!state.uploadedDocs?.visa_document;

  const groups = useMemo(() => {
    const map = new Map();
    const seen = new Set();
    const incomeDocIds = new Set();

    const push = (groupLabel, groupIcon, doc) => {
      if (seen.has(doc.id)) return;
      seen.add(doc.id);
      if (!map.has(groupLabel)) map.set(groupLabel, { icon: groupIcon, docs: [] });
      map.get(groupLabel).docs.push({
        ...doc,
        status: state.uploadedDocs?.[getDocUploadKey(doc)] ? 'uploaded' : 'not_started',
      });
    };

    const withStatus = (doc) => ({
      ...doc,
      status: state.uploadedDocs?.[getDocUploadKey(doc)] ? 'uploaded' : 'not_started',
    });

    STATIC_DOCS.forEach((d) => push(d.groupLabel, d.groupIcon, d));

    const incomeSections = (state.incomeTypes ?? [])
      .map((typeId) => {
        const entry = INCOME_DOC_MAP[typeId];
        const type = INCOME_TYPES.find((item) => item.id === typeId);
        if (!entry || !type) return null;

        const docs = entry.docs
          .filter((doc) => {
            if (seen.has(doc.id) || incomeDocIds.has(doc.id)) return false;
            seen.add(doc.id);
            incomeDocIds.add(doc.id);
            return true;
          })
          .map(withStatus);

        if (docs.length === 0) return null;

        return {
          id: typeId,
          label: type.label,
          icon: type.icon,
          docs,
        };
      })
      .filter(Boolean);

    if (incomeSections.length > 0) {
      map.set('Income Documents', {
        icon: 'Briefcase',
        docs: incomeSections.flatMap((section) => section.docs),
        incomeSections,
      });
    }

    if (requiresRentalDocs) {
      HOUSING_DOCS.forEach((d) => push(d.groupLabel, d.groupIcon, d));
    }

    if (isVisaHolder) {
      push(VISA_DOC.groupLabel, VISA_DOC.groupIcon, VISA_DOC);
    }

    return map;
  }, [state.incomeTypes, state.uploadedDocs, requiresRentalDocs, isVisaHolder]);

  const allDocs = useMemo(() => [...groups.values()].flatMap((g) => g.docs), [groups]);

  const selectedDoc = allDocs.find((d) => d.id === selectedId) ?? allDocs[0];

  const progress = useMemo(() => {
    const required = allDocs.filter((d) => d.required);
    const done = required.filter((d) => d.status === 'uploaded' || d.status === 'verified');
    return {
      total: required.length,
      done: done.length,
      pct: required.length > 0 ? Math.round((done.length / required.length) * 100) : 0,
    };
  }, [allDocs]);

  const markUpload = (docId) => {
    const doc = allDocs.find((d) => d.id === docId);
    if (doc) {
      updateState({ uploadedDocs: { ...state.uploadedDocs, [getDocUploadKey(doc)]: true } });
    }
  };

  const handleDocClick = (doc) => {
    setSelectedId(doc.id);
    setSheetDoc(doc);
  };

  const hasIncomeTypes = (state.incomeTypes ?? []).length > 0;

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 13 · Document uploads"
        title="Upload your"
        titleGradient="documents"
        sub={
          <>
            <span className="sh-sub-row">
              <Upload size={13} style={{ color: 'var(--hover)' }} />
              <span>Take a photo, upload a screenshot, image or PDF.</span>
            </span>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
              <span>Anika AI checks quality and reads key details automatically.</span>
            </span>
          </>
        }
      />

      <AnikaPanel
        message="Upload your supporting documents and I'll check quality, extract key details, and flag anything that needs attention before submission."
        thinkingMs={400}
      />

      {/* ── Document progress tracker ── */}
      <div className="doc-progress-card">
        <div className="doc-progress-row">
          <span className="doc-progress-label">
            {progress.done} of {progress.total} required documents uploaded
          </span>
          <span className="doc-progress-pct">{progress.pct}%</span>
        </div>
        <div className="doc-progress-track">
          <motion.div
            className="doc-progress-fill"
            animate={{ width: `${progress.pct}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── No income types selected hint ── */}
      {!hasIncomeTypes && (
        <div className="doc-income-banner">
          <Icon name="Info" size={15} className="doc-income-banner-icon" />
          <div>
            <div className="doc-income-banner-title">Income documents will appear here</div>
            <div className="doc-income-banner-desc">
              Return to the Income step and select your income sources. Required upload documents
              will be generated automatically based on your selection.
            </div>
          </div>
        </div>
      )}

      {/* ── Visa docs contextual notice ── */}
      {isVisaHolder && (
        <div className={`rental-docs-notice${visaUploaded ? ' rental-docs-notice--done' : ''}`}>
          <Icon name="Plane" size={15} className="rental-docs-notice-icon" />
          <div>
            <div className="rental-docs-notice-title">
              Visa documentation required
            </div>
            <div className="rental-docs-notice-desc">
              {visaUploaded
                ? 'Visa document uploaded — you\'re good to continue.'
                : 'Lenders require proof of your current visa. Upload your grant letter, eVisa confirmation or visa label before submitting your application.'}
            </div>
          </div>
        </div>
      )}

      {/* ── Visa validation alert ── */}
      {isVisaHolder && !visaUploaded && (
        <div className="doc-income-banner">
          <Icon name="AlertTriangle" size={15} className="doc-income-banner-icon" />
          <div>
            <div className="doc-income-banner-title">Visa documentation is required</div>
            <div className="doc-income-banner-desc">
              Upload your visa document in the Visa Documentation section below before you can continue.
            </div>
          </div>
        </div>
      )}

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
          <AnimatePresence mode="popLayout" initial={false}>
            {[...groups.entries()].map(([label, group]) => (
              <motion.section
                key={label}
                className="doc-group-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                layout
              >
                <div className="doc-group-header">
                  <div className="doc-group-header-left">
                    <div className="doc-group-icon">
                      <Icon name={group.icon} size={13} />
                    </div>
                    <span className="doc-group-title">{label}</span>
                  </div>
                  <span className="doc-group-count">
                    {group.docs.length} item{group.docs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {label === 'Income Documents' && (
                  <p className="doc-group-helper">
                    Required documents are grouped automatically from your selected income sources.
                  </p>
                )}
                {group.incomeSections ? (
                  <div className="doc-income-sections">
                    <AnimatePresence initial={false}>
                      {group.incomeSections.map((section) => (
                        <motion.div
                          key={section.id}
                          className="doc-income-section"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          layout
                        >
                          <div className="doc-income-section-head">
                            <div className="doc-income-section-title">
                              <span className="doc-income-section-icon">
                                <Icon name={section.icon} size={12} />
                              </span>
                              <span>{section.label}</span>
                            </div>
                            <span className="doc-income-section-count">
                              {section.docs.length} document{section.docs.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="doc-group-cards">
                            <AnimatePresence initial={false}>
                              {section.docs.map((doc) => (
                                <DocumentCard
                                  key={doc.id}
                                  doc={doc}
                                  selected={doc.id === selectedDoc?.id}
                                  onClick={() => handleDocClick(doc)}
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="doc-group-cards">
                    <AnimatePresence initial={false}>
                      {group.docs.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          doc={doc}
                          selected={doc.id === selectedDoc?.id}
                          onClick={() => handleDocClick(doc)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        <PreviewPanel selectedDoc={selectedDoc} onUpload={markUpload} />
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary
          onClick={next}
          disabled={isVisaHolder && !visaUploaded}
          style={isVisaHolder && !visaUploaded ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
        >
          Continue to connect banks →
        </BtnPrimary>
      </BtnRow>

      <UploadSheet doc={sheetDoc} onClose={() => setSheetDoc(null)} onUpload={markUpload} />
    </div>
  );
}
