import { Check } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InfoBanner } from '../components/common/InfoBanner';
import { INCOME_TYPES } from '../data/incomeTypes';
import { fmt } from '../utils/format';
import '../components/ui/ALCard.css';
import './IncomeScreen.css';

export function IncomeScreen() {
  const { state, toggleIncomeType, next, prev } = useApp();
  const totalIncome = 74400;

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 4 · Income"
        title=""
        titleGradient="Income"
        sub="Select all income types that apply. Anika annualises each source automatically."
      />

      <Card>
        <CardTitle icon="Sparkles">Select your income types</CardTitle>
        <div className="income-type-grid">
          {INCOME_TYPES.map(t => (
            <div
              key={t.id}
              className={`itc ${state.incomeTypes.includes(t.id) ? 'on' : ''}`}
              onClick={() => toggleIncomeType(t.id)}
            >
              <div className="itc-check"><Check size={11} strokeWidth={2.5} /></div>
              <div className="itc-icon"><Icon name={t.icon} size={22} /></div>
              <div className="itc-label">{t.label}</div>
              <div className="itc-hint">{t.hint}</div>
            </div>
          ))}
        </div>

        {state.incomeTypes.length > 0 && (
          <div className="income-entries">
            {state.incomeTypes.map(id => {
              const type = INCOME_TYPES.find(t => t.id === id);
              return (
                <div key={id} className="income-entry">
                  <div className="income-entry-head">
                    <div className="income-entry-label">{type?.label}</div>
                  </div>
                  <div className="g2">
                    <div className="fld"><label className="fl">Gross amount</label><input className="inp" placeholder="$0" /></div>
                    <div className="fld"><label className="fl">Frequency</label>
                      <select className="sel"><option>Weekly</option><option>Fortnightly</option><option>Monthly</option><option>Annually</option></select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <InfoBanner icon="TrendingUp" variant="green" style={{ marginTop: 14 }}>
          <strong style={{ color: 'var(--green)' }}>Total declared income</strong> annualised across all sources.
        </InfoBanner>
        <div className="totals-row">
          <div className="tot-box hl">
            <div className="tot-lbl">Declared income</div>
            <div className="tot-val">{fmt(totalIncome)} p.a.</div>
            <div className="text-small" style={{ color: 'rgba(15,224,133,.6)', marginTop: 3 }}>Annualised figure</div>
          </div>
          <div className="tot-box blue">
            <div className="tot-lbl">Sources selected</div>
            <div className="tot-val">{state.incomeTypes.length}</div>
          </div>
        </div>
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to assets →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
