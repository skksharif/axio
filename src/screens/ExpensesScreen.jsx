import { Users, AlertTriangle } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaStrip } from '../components/common/AnikaStrip';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InfoBanner } from '../components/common/InfoBanner';
import { ToggleSwitch } from '../components/forms/ToggleSwitch';
import { Stepper } from '../components/forms/Stepper';
import { RangeSlider } from '../components/forms/RangeSlider';
import { EXPENSE_CATEGORIES, HEM_SINGLE, HEM_COUPLE } from '../data/expenseCategories';
import './ExpensesScreen.css';

export function ExpensesScreen() {
  const { state, updateState, stepExpense, next, prev } = useApp();
  const isCouple = state.relationshipStatus === 'married' || state.relationshipStatus === 'defacto';
  const HEM = isCouple ? HEM_COUPLE : HEM_SINGLE;

  const setExpense = (id, v) =>
    updateState({ expenses: { ...state.expenses, [id]: Math.max(0, v) } });

  const totalExp = Object.values(state.expenses).reduce((a, b) => a + b, 0);
  const yourShare = Math.round(totalExp * state.sharedPct / 100);
  const partnerCovers = totalExp - yourShare;

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 7 · Living expenses"
        title="Monthly"
        titleGradient="living expenses"
        sub="Declare your actual monthly costs. Accuracy matters — lenders cross-check against bank statements."
      />

      {isCouple && (
        <div className={`shared-card ${isCouple ? 'show' : ''}`}>
          <div className="shared-top">
            <div>
              <div className="badge badge-green" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={13} /> Household split available
              </div>
              <div className="text-strong" style={{ fontSize: 14, fontWeight: 800, marginBottom: 5 }}>Are your expenses shared with your partner?</div>
              <div className="text-small text-border2">
                You're {state.relationshipStatus === 'married' ? 'married' : 'in a de facto relationship'}. If your partner contributes, declare your share only — improves serviceability.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <ToggleSwitch on={state.sharedExpenses} onToggle={() => updateState({ sharedExpenses: !state.sharedExpenses })} />
              <div className="text-small text-green">{state.sharedExpenses ? 'Shared on' : 'Shared off'}</div>
            </div>
          </div>
          {state.sharedExpenses && (
            <>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--greenborder)' }}>
                <div className="flex-between" style={{ marginBottom: 10 }}>
                  <span className="text-small text-border2">Your share of household expenses</span>
                  <span className="text-strong">{state.sharedPct}%</span>
                </div>
                <RangeSlider
                  label="" value={state.sharedPct} displayValue="" min={10} max={90} step={5}
                  onChange={v => updateState({ sharedPct: v })}
                  minLabel="10%" maxLabel="90%"
                  accentColor="var(--green)"
                />
              </div>
              <div className="shared-stats">
                <div className="s-stat"><div className="s-stat-lbl">Your share</div><div className="s-stat-val">{state.sharedPct}%</div></div>
                <div className="s-stat"><div className="s-stat-lbl">Partner covers</div><div className="s-stat-val">${partnerCovers.toLocaleString()}</div></div>
                <div className="s-stat"><div className="s-stat-lbl">Your total</div><div className="s-stat-val">${yourShare.toLocaleString()}</div></div>
              </div>
            </>
          )}
          <div className="shared-anika-row">
            <div className="ai-orb" style={{ width: 26, height: 26, minWidth: 26, fontSize: 9 }}>AI</div>
            <div className="text-small text-green" style={{ lineHeight: 1.65 }}>
              <strong>Anika:</strong> Shared split accepted only when partner has demonstrable independent income.
            </div>
          </div>
        </div>
      )}

      <AnikaStrip>
        <strong>Anika HEM benchmark:</strong> For a {isCouple ? 'couple' : 'single applicant'} in Sydney the minimum lender benchmark is <strong>{isCouple ? '$4,620' : '$3,840'}/mo</strong>. If declared expenses are lower, lenders apply the higher figure.
      </AnikaStrip>

      <Card>
        <CardTitle icon="BarChart2">Monthly expenses</CardTitle>
        {EXPENSE_CATEGORIES.map(e => (
          <div key={e.id} className="expense-row">
            <div className="er-left">
              <div className="er-icon"><Icon name={e.icon} size={20} /></div>
              <div>
                <div className="er-name">{e.name}</div>
                <div className="er-sub">{e.sub}</div>
              </div>
            </div>
            <div className="er-right">
              {state.sharedExpenses && isCouple && (
                <div className="er-share">Your share: ${Math.round((state.expenses[e.id] || 0) * state.sharedPct / 100).toLocaleString()}</div>
              )}
              <Stepper
                value={state.expenses[e.id] || 0}
                onDecrement={() => stepExpense(e.id, -e.step)}
                onIncrement={() => stepExpense(e.id, e.step)}
                onChange={(v) => setExpense(e.id, v)}
              />
            </div>
          </div>
        ))}

        <div className="total-bar" style={{ marginTop: 18 }}>
          <div>
            <div className="tb-label">Total monthly expenses</div>
            <div className="tb-sub">Annualises to ${Math.round(totalExp * 12).toLocaleString()} p.a.</div>
          </div>
          <div>
            <div className="tb-val">${totalExp.toLocaleString()}</div>
          </div>
        </div>

        {totalExp < HEM && (
          <InfoBanner icon="AlertTriangle" variant="yellow" style={{ marginTop: 12, marginBottom: 0 }}>
            Declared expenses below HEM benchmark of <strong>${HEM.toLocaleString()}/mo</strong>. Lenders will apply the higher figure in their assessment.
          </InfoBanner>
        )}
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to documents →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
