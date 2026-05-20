import { useState, useRef } from 'react';
import { CheckCircle2, ShieldX, FileText } from 'lucide-react';
import { InfoBanner } from '../common/InfoBanner';
import { BtnPrimary, BtnGhost } from '../common/Button';
import './RegoLookup.css';

export function RegoLookup({ prefix }) {
  const [state, setSel] = useState('');
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'clean' | 'flagged'
  const timer = useRef(null);

  const ready = state && plate.trim().length >= 2;

  const runLookup = () => {
    setResult(null);
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (plate.includes('X') || plate.includes('9')) {
        setResult('flagged');
      } else {
        setResult('clean');
      }
    }, 2000);
  };

  const reset = () => { setPlate(''); setResult(null); setSel(''); };

  return (
    <div>
      <div className="rego-row" style={{ marginBottom: 10 }}>
        <div>
          <label className="fl">State</label>
          <select className="sel" value={state} onChange={e => setSel(e.target.value)}>
            <option value="">State</option>
            {['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="fl">Registration Number</label>
          <input
            className="inp"
            value={plate}
            placeholder="e.g. ABC123"
            onChange={e => setPlate(e.target.value.toUpperCase())}
          />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="rego-btn" disabled={!ready} onClick={runLookup}>Look up →</button>
        </div>
      </div>

      {loading && (
        <div className="rego-loading">
          <div className="rego-spinner" />
          <span>Checking national rego database…</span>
        </div>
      )}

      {result === 'clean' && (
        <div className="rego-result show">
          <div className="rego-head">
            <span style={{ fontSize: 13, fontWeight: 700 }}>Vehicle found · <span style={{ color: 'var(--green)' }}>rego active</span></span>
            <span className="rego-plate">{plate}</span>
          </div>
          <div className="rego-fields">
            {[['Make','Toyota'],['Model','Camry'],['Year','2020'],['Colour','Silver'],['Body','Sedan'],['VIN','JTDBZ3FH4L91XX']].map(([l,v]) => (
              <div key={l} className="rf">
                <div className="rf-lbl">{l}</div>
                <div className="rf-val" style={l === 'VIN' ? { fontSize: 10, fontFamily: 'monospace' } : {}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 16px 14px' }}>
            <InfoBanner icon="CheckCircle2" variant="green" style={{ marginBottom: 10 }}>
              <strong style={{ color: 'var(--green)' }}>No finance encumbrance found.</strong> PPSR shows this vehicle has no registered financial interest. Eligible for use as security.
            </InfoBanner>
            <div className="g2">
              <div className="fld" style={{ marginBottom: 0 }}>
                <label className="fl">Current odometer</label>
                <div className="flex-between"><input className="inp" placeholder="e.g. 62,000" /><span className="text-small text-border2">km</span></div>
              </div>
              <div className="fld" style={{ marginBottom: 0 }}>
                <label className="fl">Estimated value</label>
                <input className="inp" placeholder="e.g. $28,000" />
              </div>
            </div>
          </div>
        </div>
      )}

      {result === 'flagged' && (
        <div className="rego-result show">
          <div className="rego-head">
            <span style={{ fontSize: 13, fontWeight: 700 }}>Vehicle found · <span style={{ color: 'var(--red)' }}>finance detected</span></span>
            <span className="rego-plate">{plate}</span>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <div className="info-banner" style={{ background: 'var(--redbg)', border: '1px solid var(--redborder)', marginBottom: 10 }}>
              <span className="icon"><ShieldX size={15} style={{ color: 'var(--red)' }} /></span>
              <span style={{ color: 'rgba(247,95,122,.8)' }}>
                <strong style={{ color: 'var(--red)' }}>Finance encumbrance detected.</strong> This vehicle cannot be used as security. Use a different vehicle or proceed unsecured.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <BtnGhost onClick={reset}>Try different vehicle</BtnGhost>
              <BtnPrimary onClick={reset}>Proceed unsecured →</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
