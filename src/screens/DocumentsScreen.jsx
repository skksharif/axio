import { useState } from 'react';
import { CheckCircle2, FileText, CreditCard, Home, Check } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InfoBanner } from '../components/common/InfoBanner';
import { BANKS } from '../data/bankOptions';
import './DocumentsScreen.css';

export function DocumentsScreen() {
  const { state, updateState, next, prev } = useApp();
  const [connecting, setConnecting] = useState(false);

  const selectBank = (id) => updateState({ selectedBank: id, bankConnected: false });

  const connectBank = () => {
    if (!state.selectedBank || connecting) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      updateState({ bankConnected: true });
    }, 1800);
  };

  const disconnectBank = () => updateState({ bankConnected: false, selectedBank: null });

  const markUpload = (key) => updateState({ uploadedDocs: { ...state.uploadedDocs, [key]: true } });

  const selectedBankName = BANKS.find(b => b.id === state.selectedBank)?.name || '';

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 8 · Documents"
        title="Supporting"
        titleGradient="documents"
        sub="Anika has determined required documents based on your profile. All files encrypted at rest."
      />

      <Card>
        <CardTitle icon="Building2">Bank statement connection</CardTitle>
        <div className="ob-panel">
          <div className="flex-between" style={{ gap: 12, marginBottom: 14 }}>
            <div>
              <div className="text-strong" style={{ marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="Sparkles" size={12} /> Open Banking — instant connection
              </div>
              <div className="text-small text-border2">Read-only access · no login stored · CDR accredited</div>
            </div>
            <span className="badge badge-green">Recommended</span>
          </div>
          <div className="banks-grid">
            {BANKS.map(b => (
              <div
                key={b.id}
                className={`bank-btn ${state.selectedBank === b.id ? 'on' : ''}`}
                onClick={() => selectBank(b.id)}
              >
                <div className="bank-icon"><Icon name={b.icon} size={18} /></div>
                <div className="bank-name">{b.name}</div>
              </div>
            ))}
          </div>
          <button
            className="ob-connect-btn"
            disabled={!state.selectedBank || connecting}
            onClick={connectBank}
          >
            {connecting ? 'Connecting…' : state.selectedBank ? `Connect ${selectedBankName} via Open Banking` : 'Select your bank to connect'}
          </button>
          <div className="ob-divider">
            <div className="ob-line" /><span>or upload PDF manually</span><div className="ob-line" />
          </div>
          <div
            className={`upload-zone ${state.uploadedDocs?.bankstatements ? 'done' : ''}`}
            onClick={() => markUpload('bankstatements')}
          >
            {state.uploadedDocs?.bankstatements ? (
              <><div className="uz-icon"><CheckCircle2 size={22} style={{ color: 'var(--green)' }} /></div><div className="uz-title text-green">Statements uploaded</div></>
            ) : (
              <><div className="uz-icon"><FileText size={22} /></div><div className="uz-title">Upload PDF statements</div><div className="uz-sub">3 months · all accounts used for income or expenses</div></>
            )}
          </div>
        </div>
        {state.bankConnected && (
          <div className="ob-connected show">
            <CheckCircle2 size={20} style={{ color: 'var(--green)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="text-strong text-green">{selectedBankName} connected</div>
              <div className="text-small text-border2">Read-only · 3 months retrieved · CDR accredited</div>
            </div>
            <button className="btn-ghost" onClick={disconnectBank}>Disconnect</button>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle icon="Briefcase">Proof of income</CardTitle>
        <InfoBanner icon="Sparkles" variant="blue">
          Each income type you declared requires separate verification. Upload documents matching each source.
        </InfoBanner>
        <div className="doc-item">
          <div className="doc-icon"><FileText size={18} /></div>
          <div className="doc-info">
            <div className="doc-name">Last 2 payslips</div>
            <div className="doc-sub">Wage / Salary income · dated within 90 days</div>
          </div>
          <div className="doc-action">
            <button className={`btn-ghost ${state.uploadedDocs?.payslips ? 'text-green' : ''}`} onClick={() => markUpload('payslips')}>
              {state.uploadedDocs?.payslips ? <><Check size={11} /> Uploaded</> : 'Upload'}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle icon="CreditCard">Identity verification (AML / KYC)</CardTitle>
        <InfoBanner icon="Scale" variant="blue" style={{ marginBottom: 16 }}>
          Required by law under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 for all credit applications.
        </InfoBanner>
        <div className="doc-item">
          <div className="doc-icon"><CreditCard size={18} /></div>
          <div className="doc-info">
            <div className="doc-name">Australian driver licence — front & back</div>
            <div className="doc-sub">Primary photo ID · must match name and address</div>
          </div>
          <div className="doc-action">
            <button className={`btn-ghost ${state.uploadedDocs?.licence ? 'text-green' : ''}`} onClick={() => markUpload('licence')}>
              {state.uploadedDocs?.licence ? <><Check size={11} /> Uploaded</> : 'Upload both sides'}
            </button>
          </div>
        </div>
        <div className="doc-item">
          <div className="doc-icon"><CreditCard size={18} /></div>
          <div className="doc-info">
            <div className="doc-name">Medicare card</div>
            <div className="doc-sub">Secondary ID · front of card · name must match</div>
          </div>
          <div className="doc-action">
            <button className={`btn-ghost ${state.uploadedDocs?.medicare ? 'text-green' : ''}`} onClick={() => markUpload('medicare')}>
              {state.uploadedDocs?.medicare ? <><Check size={11} /> Uploaded</> : 'Upload'}
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle icon="Home">Property documents</CardTitle>
        <div className="doc-item">
          <div className="doc-icon"><Home size={18} /></div>
          <div className="doc-info">
            <div className="doc-name">Council rates notice</div>
            <div className="doc-sub">Confirms property ownership · must show your name and address</div>
          </div>
          <div className="doc-action">
            <button className={`btn-ghost ${state.uploadedDocs?.rates ? 'text-green' : ''}`} onClick={() => markUpload('rates')}>
              {state.uploadedDocs?.rates ? <><Check size={11} /> Uploaded</> : 'Upload'}
            </button>
          </div>
        </div>
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to privacy →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
