import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import './DocumentsScreen.css';

const DOCUMENTS = [
  {
    id: 'driver_front',
    group: 'Identity',
    title: 'Driver Licence Front',
    subtitle: 'Capture the front side of your licence',
    icon: 'Wallet',
    required: true,
    defaultStatus: 'not_started',
    stateKey: 'licence',
    extracted: ['Full name', 'Date of birth', 'Licence number'],
  },
  {
    id: 'driver_back',
    group: 'Identity',
    title: 'Driver Licence Back',
    subtitle: 'Capture the back side for address check',
    icon: 'Wallet',
    required: true,
    defaultStatus: 'not_started',
    stateKey: 'licence',
    extracted: ['Residential address', 'Card number', 'Expiry date'],
  },
  {
    id: 'passport',
    group: 'Identity',
    title: 'Passport',
    subtitle: 'Photo page or PDF copy accepted',
    icon: 'BookMarked',
    required: false,
    defaultStatus: 'not_started',
    stateKey: null,
    extracted: ['Passport number', 'Country', 'Expiry date'],
  },
  {
    id: 'medicare',
    group: 'Identity',
    title: 'Medicare Card',
    subtitle: 'Used as supporting identity verification',
    icon: 'Shield',
    required: true,
    defaultStatus: 'not_started',
    stateKey: 'medicare',
    extracted: ['Medicare number', 'Reference number', 'Expiry'],
  },
  {
    id: 'payslips',
    group: 'Income',
    title: 'Payslips',
    subtitle: 'Upload your latest 2 payslips',
    icon: 'Upload',
    required: true,
    defaultStatus: 'not_started',
    stateKey: 'payslips',
    extracted: ['Employer', 'Gross income', 'Pay cycle', 'YTD income'],
  },
  {
    id: 'rate_notice',
    group: 'Property / Address',
    title: 'Rate Notice',
    subtitle: 'For property owners or investment property',
    icon: 'Home',
    required: false,
    defaultStatus: 'not_started',
    stateKey: 'rates',
    extracted: ['Property address', 'Owner name', 'Council valuation'],
  },
  {
    id: 'rental_agreement',
    group: 'Property / Address',
    title: 'Rental Agreement',
    subtitle: 'For customers currently renting',
    icon: 'FileText',
    required: true,
    defaultStatus: 'not_started',
    stateKey: null,
    extracted: ['Lease address', 'Rent amount', 'Lease term'],
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

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
  return (
    <span className={`doc-status-badge ${cfg.cls}`}>
      <Icon name={cfg.icon} size={11} strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ completed, total }) {
  const pct = Math.round((completed / Math.max(total, 1)) * 100);
  return (
    <div className="doc-progress">
      <div className="doc-progress-row">
        <span className="doc-progress-label">Document progress</span>
        <span className="doc-progress-pct">{pct}%</span>
      </div>
      <div className="doc-progress-track">
        <motion.div
          className="doc-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
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
          PDF, JPG, PNG and screenshots accepted. Anika checks quality, reads key details and flags issues automatically.
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
              <span className="doc-extract-check"><Icon name="Check" size={10} strokeWidth={2.5} /></span>
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

export function DocumentsScreen() {
  const { state, updateState, next, prev } = useApp();
  const [selectedId, setSelectedId] = useState(DOCUMENTS[0].id);
  const [sheetDoc, setSheetDoc] = useState(null);

  const markUpload = (docId) => {
    const doc = DOCUMENTS.find((d) => d.id === docId);
    if (doc?.stateKey) {
      updateState({ uploadedDocs: { ...state.uploadedDocs, [doc.stateKey]: true } });
    }
  };

  const computedDocs = useMemo(
    () =>
      DOCUMENTS.map((doc) => ({
        ...doc,
        status: doc.stateKey && state.uploadedDocs?.[doc.stateKey] ? 'uploaded' : doc.defaultStatus,
      })),
    [state.uploadedDocs]
  );

  const selectedDoc = computedDocs.find((d) => d.id === selectedId) || computedDocs[0];
  const completed = computedDocs.filter((d) => ['verified', 'uploaded'].includes(d.status)).length;

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
        sub="Upload your ID, income, address and residency documents using camera, screenshots, images or PDF files."
      />

      <div className="doc-hero">
        <div className="doc-hero-inner">
          <div className="doc-hero-copy">
            <div className="doc-hero-pill">
              <Icon name="Sparkles" size={11} />
              Anika AI document verification
            </div>
            <p className="doc-hero-desc">
              Required documents are reviewed first so your application can move faster.
            </p>
          </div>
          <div className="doc-hero-progress-box">
            <ProgressBar completed={completed} total={DOCUMENTS.length} />
          </div>
        </div>
      </div>

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
