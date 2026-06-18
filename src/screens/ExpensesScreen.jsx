import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Receipt, Sparkles, SlidersHorizontal } from "lucide-react";
import { Icon } from "../components/common/Icon";
import { useApp } from "../context/AppContext";
import { ScreenHeader } from "../components/common/ScreenHeader";
import { AnikaPanel } from "../components/common/AnikaPanel";
import { BtnPrimary, BtnGhost, BtnRow } from "../components/common/Button";
import { Card, CardTitle } from "../components/common/Card";
import { AnikaInsightCard } from "../components/common/AnikaInsightCard";
import { ToggleSwitch } from "../components/forms/ToggleSwitch";
import { Stepper } from "../components/forms/Stepper";
import { RangeSlider } from "../components/forms/RangeSlider";
import {
  EXPENSE_CATEGORIES,
  HEM_SINGLE,
  HEM_COUPLE,
} from "../data/expenseCategories";
import { getStep } from '../constants/screens';
import "./ExpensesScreen.css";

export function ExpensesScreen() {
  const { state, updateState, stepExpense, next, prev } = useApp();

  const isMarried = state.relationshipStatus === "married";
  const isCouple  =
    state.relationshipStatus === "married" ||
    state.relationshipStatus === "defacto";
  const isRenter  = ['rent---agent', 'rent---private'].includes(state.livingStatus);

  const HEM = isCouple ? HEM_COUPLE : HEM_SINGLE;

  const partnerLabel = isMarried ? "spouse" : "partner";

  // Reset shared split state when user is no longer in a couple relationship
  useEffect(() => {
    if (!isCouple) {
      updateState({ sharedExpenses: false, sharedPct: 50 });
    }
  }, [isCouple, updateState]);

  // Clear rental fields when user is no longer a renter
  useEffect(() => {
    if (!isRenter) {
      setSoleRenter(null);
      setRentalAmount('');
      setRentalFreq('Monthly');
      setLeaseCount('');
      setFullRentalAmount('');
    }
  }, [isRenter]);

  const setExpense = (id, v) =>
    updateState({ expenses: { ...state.expenses, [id]: Math.max(0, v) } });

  const totalExp      = Object.values(state.expenses).reduce((a, b) => a + b, 0);
  const yourShare     = Math.round((totalExp * state.sharedPct) / 100);
  const partnerCovers = totalExp - yourShare;

  const [pctInput,         setPctInput]         = useState(String(state.sharedPct));

  // Keep pct input display in sync when state is reset externally
  useEffect(() => { setPctInput(String(state.sharedPct)); }, [state.sharedPct]);

  const [soleRenter,       setSoleRenter]       = useState(null);
  const [rentalAmount,     setRentalAmount]     = useState("");
  const [rentalFreq,       setRentalFreq]       = useState("Monthly");
  const [leaseCount,       setLeaseCount]       = useState("");
  const [fullRentalAmount, setFullRentalAmount] = useState("");

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step ${getStep('expenses')} · Living expenses`}
        title="Monthly"
        titleGradient="living expenses"
        sub={
          <>
            <span className="sh-sub-row">
              <Sparkles size={13} style={{ color: 'var(--hover)' }} />
              <span>Based on your profile, Anika AI has automatically estimated your essential living expenses.</span>
            </span>
            <span className="sh-sub-row">
              <SlidersHorizontal size={13} style={{ color: 'var(--hover)' }} />
              <span>Please review and adjust where required, and add any non-essential expenses that apply.</span>
            </span>
          </>
        }
      />

      {/* ── Household Split ─────────────────────────────────────────── */}
      {isCouple && (
        <div className="hh-split-card">
          {/* Header */}
          <div className="hh-split-head">
            <div className="hh-split-badge">
              <Users size={11} />
              Household Split Available
            </div>
            <div className="hh-split-title">
              Are your living expenses shared with your {partnerLabel}?
            </div>
            <div className="hh-split-sub">
              You're {isMarried ? "married" : "in a de facto relationship"}. If
              your {partnerLabel} contributes to household expenses, declare only
              your share to improve serviceability calculations.
            </div>
          </div>

          {/* Toggle row */}
          <div className="hh-split-toggle-row">
            <div className="hh-split-toggle-lbl">Shared Expenses</div>
            <div className="hh-split-toggle-side">
              <span className={`hh-split-status${state.sharedExpenses ? " on" : ""}`}>
                {state.sharedExpenses ? "Enabled" : "Disabled"}
              </span>
              <ToggleSwitch
                on={state.sharedExpenses}
                onToggle={() =>
                  updateState({ sharedExpenses: !state.sharedExpenses })
                }
              />
            </div>
          </div>

          {/* Slider + stats when enabled */}
          {state.sharedExpenses && (
            <>
              <div className="hh-split-slider">
                <div className="hh-split-slider-row">
                  <span className="hh-split-slider-label">
                    Your share of household expenses
                  </span>
                </div>
                <RangeSlider
                  label=""
                  value={state.sharedPct}
                  displayValue=""
                  min={0}
                  max={100}
                  step={5}
                  onChange={(v) => { updateState({ sharedPct: v }); setPctInput(String(v)); }}
                  minLabel="0%"
                  maxLabel="100%"
                  accentColor="var(--green)"
                />
                <div className="hh-pct-row">
                  <span className="hh-pct-label">Your Share %</span>
                  <div className="hh-pct-wrap">
                    <input
                      className="hh-pct-input"
                      type="number"
                      min="0"
                      max="100"
                      value={pctInput}
                      onChange={e => {
                        setPctInput(e.target.value);
                        const n = parseInt(e.target.value, 10);
                        if (!isNaN(n) && n >= 0 && n <= 100) updateState({ sharedPct: n });
                      }}
                      onBlur={() => {
                        const n = parseInt(pctInput, 10);
                        const clamped = isNaN(n) ? state.sharedPct : Math.min(100, Math.max(0, n));
                        updateState({ sharedPct: clamped });
                        setPctInput(String(clamped));
                      }}
                    />
                    <span className="hh-pct-suffix">%</span>
                  </div>
                </div>
              </div>
              <div className="shared-stats">
                <div className="s-stat">
                  <div className="s-stat-lbl">Your share</div>
                  <div className="s-stat-val">{state.sharedPct}%</div>
                </div>
                <div className="s-stat">
                  <div className="s-stat-lbl">
                    {isMarried ? "Spouse" : "Partner"} covers
                  </div>
                  <div className="s-stat-val">
                    ${partnerCovers.toLocaleString()}
                  </div>
                </div>
                <div className="s-stat">
                  <div className="s-stat-lbl">Your total</div>
                  <div className="s-stat-val">${yourShare.toLocaleString()}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Anika AI guidance — contextual per relationship status ─── */}
      <AnikaPanel
        key={isCouple ? (isMarried ? "married" : "defacto") : "single"}
        message={
          isCouple
            ? `Shared expense declarations are accepted when your ${partnerLabel} contributes independently to household costs. Please ensure declared expenses accurately reflect your personal share.`
            : `Lenders apply a minimum HEM benchmark based on your household type. For a single applicant in Sydney the minimum is $3,840/mo — if declared expenses fall below this, the higher figure is used in serviceability calculations.`
        }
        thinkingMs={400}
      />

      {/* ── Rent declaration — shown only for rental residential status ─── */}
      <AnimatePresence>
        {isRenter && (
          <motion.div
            key="rent-declaration"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            style={{ marginBottom: 20 }}
          >
      <Card>
        <CardTitle icon="Home">Essential Living Expenses</CardTitle>
        <div className="rent-section">
          <div className="rent-section-title">Rent Declaration</div>
          <div className="rent-row">
            <span className="rent-label">Sole renter?</span>
            <div className="yn-pills">
              <button
                className={`yn-pill ${soleRenter === "yes" ? "active" : ""}`}
                onClick={() => setSoleRenter("yes")}
              >
                Yes
              </button>
              <button
                className={`yn-pill ${soleRenter === "no" ? "active" : ""}`}
                onClick={() => setSoleRenter("no")}
              >
                No
              </button>
            </div>
          </div>

          {soleRenter === "yes" && (
            <div className="rent-fields">
              <div className="rent-field">
                <label>Rental amount</label>
                <input
                  placeholder="$0"
                  value={rentalAmount}
                  onChange={(e) => setRentalAmount(e.target.value)}
                />
              </div>
              <div className="rent-field">
                <label>Frequency</label>
                <div className="freq-pills">
                  {["Weekly", "Fortnightly", "Monthly"].map((f) => (
                    <button
                      key={f}
                      className={`freq-pill ${rentalFreq === f ? "active" : ""}`}
                      onClick={() => setRentalFreq(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {soleRenter === "no" && (
            <div className="rent-fields">
              <div className="rent-field">
                <label>People on the lease</label>
                <input
                  type="number"
                  min="1"
                  placeholder="2"
                  value={leaseCount}
                  onChange={(e) => setLeaseCount(e.target.value)}
                />
              </div>
              <div className="rent-field">
                <label>Full rental amount</label>
                <input
                  placeholder="$0"
                  value={fullRentalAmount}
                  onChange={(e) => setFullRentalAmount(e.target.value)}
                />
              </div>
              <div className="rent-field rent-field--wide">
                <label>Frequency</label>
                <div className="freq-pills">
                  {["Weekly", "Fortnightly", "Monthly"].map((f) => (
                    <button
                      key={f}
                      className={`freq-pill ${rentalFreq === f ? "active" : ""}`}
                      onClick={() => setRentalFreq(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Monthly expense breakdown ─────────────────────────────── */}
      <Card>
        <CardTitle icon="BarChart2">Monthly expenses</CardTitle>
        {EXPENSE_CATEGORIES.map((e) => (
          <div key={e.id} className="expense-row">
            <div className="er-left">
              <div className="er-icon">
                <Icon name={e.icon} size={20} />
              </div>
              <div>
                <div className="er-name">{e.name}</div>
                <div className="er-sub">{e.sub}</div>
              </div>
            </div>
            <div className="er-right">
              {state.sharedExpenses && isCouple && (
                <div className="er-share">
                  Your share: $
                  {Math.round(
                    ((state.expenses[e.id] || 0) * state.sharedPct) / 100,
                  ).toLocaleString()}
                </div>
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
            <div className="tb-sub">
              Annualises to ${Math.round(totalExp * 12).toLocaleString()} p.a.
            </div>
          </div>
          <div>
            <div className="tb-val">${totalExp.toLocaleString()}</div>
          </div>
        </div>

        {totalExp < HEM && (
          <AnikaInsightCard
            variant="warning"
            style={{ marginTop: 12, marginBottom: 0 }}
            message={`Your declared expenses are below the HEM benchmark of $${HEM.toLocaleString()}/mo. Lenders are required to use the higher of declared or benchmark expenses when assessing your borrowing capacity. This may reduce the maximum loan amount available to you.`}
            summary={`Lenders will substitute $${HEM.toLocaleString()}/mo — the HEM benchmark — in their serviceability calculations.`}
          />
        )}
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
