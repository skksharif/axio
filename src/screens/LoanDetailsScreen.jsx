import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaStrip } from '../components/common/AnikaStrip';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { InfoBanner } from '../components/common/InfoBanner';
import { ChoiceCard, ChoiceGrid, CondCard } from '../components/forms/ChoiceCard';
import { Chip, Chips } from '../components/forms/Chip';
import { RangeSlider } from '../components/forms/RangeSlider';
import { RepayBox } from '../components/forms/FormField';
import { RegoLookup } from '../components/ui/RegoLookup';
import { JointApplicant } from '../components/feature/JointApplicant';
import { PURPOSES } from '../data/purposes';
import { MARKETPLACE_CARS, MARKETPLACE_STATS } from '../data/productData';
import { fmt, calcRepay, getRate, getRateLabel } from '../utils/format';
import './LoanDetailsScreen.css';

const LOAN_TERMS = [1, 2, 3, 4, 5, 6, 7];

export function LoanDetailsScreen() {
  const { state, updateState, next, prev } = useApp();
  const isPersonal = state.loanType === 'personal';

  const rate     = getRate(state.loanType, state.vehicleCondition, state.securityType);
  const rateLabel = getRateLabel(state.loanType, state.vehicleCondition, state.securityType);
  const netAmt   = isPersonal ? state.loanAmount : Math.max(0, state.loanAmount - state.deposit);
  const repay    = calcRepay(netAmt, state.loanTerm, rate);

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step 2 · ${isPersonal ? 'Personal Loan' : 'Car Loan'} Details`}
        title="Tell us about"
        titleGradient={isPersonal ? 'your loan' : 'your car loan'}
        sub="Anika uses these details to run early lender signals and estimate your repayment."
      />

      <AnikaStrip>
        <strong>Anika is running in the background.</strong> Your answers determine lender panel, indicative rates and approval probability. All matching is soft enquiry only — zero credit file impact.
      </AnikaStrip>

      {isPersonal
        ? <PersonalLoanDetails repay={repay} rateLabel={rateLabel} />
        : <CarLoanDetails repay={repay} rateLabel={rateLabel} />
      }

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to profile →</BtnPrimary>
      </BtnRow>
    </div>
  );
}

function PersonalLoanDetails({ repay, rateLabel }) {
  const { state, updateState } = useApp();

  return (
    <>
      <Card>
        <CardTitle icon="Target">What is the loan for?</CardTitle>
        <ChoiceGrid cols={3}>
          {PURPOSES.map(p => (
            <ChoiceCard
              key={p.id}
              selected={state.purpose === p.id}
              onClick={() => updateState({ purpose: p.id })}
            >
              <div className="cc-icon" style={{ marginBottom: 7 }}><Icon name={p.icon} size={22} /></div>
              <div className="cc-title" style={{ fontSize: 12 }}>{p.title}</div>
              <div className="cc-desc" style={{ fontSize: 10.5 }}>{p.hint}</div>
            </ChoiceCard>
          ))}
        </ChoiceGrid>
      </Card>

      <Card>
        <CardTitle icon="DollarSign">Loan amount &amp; term</CardTitle>
        <RangeSlider
          label="Loan amount"
          value={state.loanAmount}
          prefix="$"
          min={5000} max={80000} step={500}
          onChange={v => updateState({ loanAmount: v })}
          minLabel="$5,000" maxLabel="$80,000"
        />
        <div className="divider" />
        <div className="fld">
          <label className="fl">Loan term</label>
          <Chips>
            {LOAN_TERMS.map(y => (
              <Chip key={y} selected={state.loanTerm === y} onClick={() => updateState({ loanTerm: y })}>
                {y} {y === 1 ? 'year' : 'years'}
              </Chip>
            ))}
          </Chips>
        </div>
        <RepayBox
          label="Estimated monthly repayment"
          sub="Indicative · actual rate confirmed after matching"
          value={`${fmt(repay)} / mo`}
          rateLabel={rateLabel}
        />
      </Card>

      <Card>
        <CardTitle icon="Lock">Would you like to secure this loan?</CardTitle>
        <AnikaStrip style={{ marginBottom: 16 }}>
          <strong>Securing against a vehicle you own outright</strong> typically reduces your rate by 1.5–3% and improves approval probability. The vehicle must have no existing finance.
        </AnikaStrip>
        <ChoiceGrid cols={2}>
          <ChoiceCard
            selected={state.securityType === 'unsecured'}
            onClick={() => updateState({ securityType: 'unsecured' })}
          >
            <div className="cc-icon"><Icon name="ClipboardList" size={22} /></div>
            <div className="cc-title">Unsecured</div>
            <div className="cc-desc">No asset required. Based on income and credit profile.</div>
            <div style={{ marginTop: 10 }}><Badge variant="yellow">From 8.49% p.a.</Badge></div>
          </ChoiceCard>
          <ChoiceCard
            selected={state.securityType === 'secured'}
            onClick={() => updateState({ securityType: 'secured' })}
          >
            <div className="cc-icon"><Icon name="Car" size={22} /></div>
            <div className="cc-title">Secured — vehicle</div>
            <div className="cc-desc">Use a vehicle you own outright. Lower rate, better approval odds.</div>
            <div style={{ marginTop: 10 }}><Badge variant="green">From 6.49% p.a.</Badge></div>
          </ChoiceCard>
        </ChoiceGrid>
        <div className="divider" />
        <InfoBanner icon="AlertTriangle" variant="yellow">
          The vehicle used as security <strong>must be owned outright with no existing finance</strong>. A PPSR check will be run during assessment.
        </InfoBanner>
        {state.securityType === 'secured' && (
          <div className="cond-panel show">
            <RegoLookup prefix="pl" />
          </div>
        )}
      </Card>

      <JointApplicant />
    </>
  );
}

function CarLoanDetails({ repay, rateLabel }) {
  const { state, updateState } = useApp();

  const netLoan = Math.max(0, state.loanAmount - state.deposit);

  return (
    <>
      <Card>
        <CardTitle icon="Car">What type of vehicle?</CardTitle>
        <div className="cond-grid">
          {[
            { id: 'new',  icon: 'Sparkles', title: 'New',  desc: 'Brand new from dealer',             badge: <Badge variant="green">From 5.99%</Badge> },
            { id: 'used', icon: 'Car',      title: 'Used', desc: 'Previously owned & registered',     badge: <Badge variant="blue">Up to 12 yrs</Badge> },
            { id: 'demo', icon: 'Tag',      title: 'Demo', desc: 'Dealer demonstrator, low kms',       badge: <Badge variant="yellow">Near-new rates</Badge> },
          ].map(c => (
            <CondCard
              key={c.id}
              icon={<Icon name={c.icon} size={28} />}
              title={c.title}
              desc={c.desc}
              badge={c.badge}
              selected={state.vehicleCondition === c.id}
              onClick={() => updateState({ vehicleCondition: c.id })}
            />
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle icon="Building">Where are you buying from?</CardTitle>
        <ChoiceGrid cols={2}>
          <ChoiceCard selected={state.purchaseType === 'dealer'} onClick={() => updateState({ purchaseType: 'dealer' })}>
            <div className="cc-icon"><Icon name="Store" size={22} /></div>
            <div className="cc-title">Dealership</div>
            <div className="cc-desc">Licensed motor dealer — franchised, independent or online.</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center' }}>
              <Badge variant="blue" style={{ fontSize: 10 }}>GST invoice</Badge>
              <Badge variant="blue" style={{ fontSize: 10 }}>Warranty options</Badge>
            </div>
          </ChoiceCard>
          <ChoiceCard selected={state.purchaseType === 'private'} onClick={() => updateState({ purchaseType: 'private' })}>
            <div className="cc-icon"><Icon name="Handshake" size={22} /></div>
            <div className="cc-title">Private sale</div>
            <div className="cc-desc">Individual seller via Carsales, Gumtree, Facebook Marketplace.</div>
            <div style={{ marginTop: 8 }}><Badge variant="yellow" style={{ fontSize: 10 }}>PPSR check required</Badge></div>
          </ChoiceCard>
        </ChoiceGrid>
      </Card>

      <Card>
        <CardTitle icon="Search">Have you found a vehicle?</CardTitle>
        <ChoiceGrid cols={2}>
          <ChoiceCard selected={state.vehicleFound} onClick={() => updateState({ vehicleFound: true })}>
            <div className="cc-icon"><Icon name="CheckCircle2" size={22} /></div>
            <div className="cc-title">Yes — vehicle in mind</div>
            <div className="cc-desc">I have a specific car selected or know the details.</div>
          </ChoiceCard>
          <ChoiceCard selected={!state.vehicleFound} onClick={() => updateState({ vehicleFound: false })}>
            <div className="cc-icon"><Icon name="ShoppingCart" size={22} /></div>
            <div className="cc-title">Not yet — still browsing</div>
            <div className="cc-desc">Get approved first, then shop with your budget confirmed.</div>
          </ChoiceCard>
        </ChoiceGrid>

        {state.vehicleFound && (
          <>
            <div className="divider" />
            <div className="g3">
              <div className="fld"><label className="fl">Year</label><input className="inp" placeholder="e.g. 2023" /></div>
              <div className="fld"><label className="fl">Make</label><input className="inp" placeholder="e.g. Toyota" /></div>
              <div className="fld"><label className="fl">Model</label><input className="inp" placeholder="e.g. Camry" /></div>
            </div>
            <div className="g2">
              <div className="fld"><label className="fl">Purchase price</label><input className="inp" placeholder="$0" /></div>
              <div className="fld"><label className="fl">Odometer</label><input className="inp" placeholder="km" /></div>
            </div>
          </>
        )}

        {!state.vehicleFound && (
          <div className="mp-card show">
            <div className="mp-top">
              <div className="flex-between" style={{ gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div className="mp-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={12} /> Axio Vehicle Marketplace — unlocks after approval
                  </div>
                  <div className="mp-sub">Complete your application and get approved. Your portal will unlock the marketplace filtered to exactly your approved budget.</div>
                </div>
                <Badge variant="blue" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>In your portal</Badge>
              </div>
            </div>
            <div className="mp-stats">
              {MARKETPLACE_STATS.map((s, i) => (
                <div key={i} className="mp-stat">
                  <div className="mp-stat-val">{s.val}</div>
                  <div className="mp-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
            <div className="mp-cars">
              {MARKETPLACE_CARS.map((c, i) => (
                <div key={i} className="mp-car">
                  <div className="mp-car-img"><Icon name={c.icon} size={22} /></div>
                  <div className="mp-car-info">
                    <div className="mp-car-name">{c.name}</div>
                    <div className="mp-car-price">{c.price}</div>
                    <div className="mp-car-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mp-cta-row">
              <div className="text-small text-border2"><strong className="text-strong">Budget-matched listings</strong> unlock after approval.</div>
              <BtnPrimary onClick={() => {}}>Continue to get approved →</BtnPrimary>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle icon="DollarSign">Loan amount, deposit &amp; trade-in</CardTitle>
        <RangeSlider label="Vehicle price / loan amount" value={state.loanAmount} prefix="$" min={5000} max={500000} step={1000} onChange={v => updateState({ loanAmount: v })} minLabel="$5,000" maxLabel="$500,000" />

        <div className="divider" />
        <RangeSlider label="Cash deposit" value={state.deposit} displayValue={fmt(state.deposit)} min={0} max={200000} step={500} onChange={v => updateState({ deposit: v })} minLabel="$0" maxLabel="$200,000" />

        <div className="divider" />
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <div className="text-strong text-small" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} /> Trade-in vehicle
          </div>
          <Chips>
            <Chip selected={state.tradeIn} onClick={() => updateState({ tradeIn: true })}>Yes</Chip>
            <Chip selected={!state.tradeIn} onClick={() => updateState({ tradeIn: false })}>No</Chip>
          </Chips>
        </div>
        {state.tradeIn && (
          <>
            <InfoBanner icon="Sparkles" variant="blue">Enter your trade-in rego — Anika retrieves vehicle details automatically.</InfoBanner>
            <RegoLookup prefix="ti" />
          </>
        )}

        <div className="divider" />
        <div className="text-strong text-small" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="CircleDollarSign" size={13} /> Balloon payment <span className="text-border2" style={{ fontSize: 11, fontWeight: 400 }}>(optional)</span>
        </div>
        <div className="card" style={{ background: 'var(--bg2)', borderRadius: 'var(--r8)', padding: 14 }}>
          <RangeSlider label="Balloon percentage" value={state.balloonPct} displayValue={`${state.balloonPct}%`} min={0} max={40} step={5} onChange={v => updateState({ balloonPct: v })} minLabel="0% (none)" maxLabel="40%" />
        </div>

        <div className="divider" />
        <div className="fld" style={{ marginBottom: 0 }}>
          <label className="fl">Loan term</label>
          <Chips>
            {LOAN_TERMS.map(y => (
              <Chip key={y} selected={state.loanTerm === y} onClick={() => updateState({ loanTerm: y })}>
                {y} {y === 1 ? 'year' : 'years'}
              </Chip>
            ))}
          </Chips>
        </div>

        <RepayBox label="Estimated monthly repayment" sub="Indicative · confirmed after matching" value={`${fmt(repay)} / mo`} rateLabel={rateLabel} />

        <div className="grid-4" style={{ marginTop: 12 }}>
          {[
            { label: 'Vehicle price', val: fmt(state.loanAmount), accent: false },
            { label: 'Cash deposit',  val: `−${fmt(state.deposit)}`, accent: false },
            { label: 'Trade-in',      val: '−$0', accent: false },
            { label: 'Net loan',      val: fmt(netLoan), accent: true },
          ].map(b => (
            <div key={b.label} className="card" style={{ background: b.accent ? 'rgba(79,110,247,.1)' : 'var(--bg2)', border: `1px solid ${b.accent ? 'rgba(79,110,247,.25)' : 'var(--border)'}`, borderRadius: 'var(--r8)', padding: 12, textAlign: 'center' }}>
              <div className="text-small text-border2" style={{ marginBottom: 3 }}>{b.label}</div>
              <div className="text-strong" style={b.accent ? { color: '#8ea6ff' } : {}}>{b.val}</div>
            </div>
          ))}
        </div>
      </Card>

      <JointApplicant />
    </>
  );
}
