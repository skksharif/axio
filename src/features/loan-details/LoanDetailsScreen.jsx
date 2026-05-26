import { useEffect } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, Target, Building2, Check } from 'lucide-react';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@shared/hooks/useApp';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { AnikaPanel } from '@/components/common/AnikaPanel';
import { BtnPrimary, BtnGhost, BtnRow } from '@/components/common/Button';
import { Card, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { InfoBanner } from '@/components/common/InfoBanner';
import { ChoiceCard, ChoiceGrid, CondCard } from '@/components/forms/ChoiceCard';
import { Chip, Chips } from '@/components/forms/Chip';
import { RangeSlider } from '@/components/forms/RangeSlider';
import { RepayBox } from '@/components/forms/FormField';
import { RegoLookup } from '@/components/ui/RegoLookup';
import { JointApplicant } from '@/components/feature/JointApplicant';
import { PURPOSES } from '@shared/data/purposes';
import { MARKETPLACE_CARS, MARKETPLACE_STATS } from '@shared/data/productData';
import { fmt, calcRepay, getRate, getRateLabel } from '@shared/utils/format';
import { getStep } from '@shared/constants/screens';
import './LoanDetailsScreen.css';

const LOAN_TERMS_MO = [12, 24, 36, 48, 60, 72, 84];

const SECURITY_ASSET_TYPES = [
  { id: 'vehicle',   icon: 'Car',    title: 'Vehicle',   desc: 'Cars, SUVs, Utes & Vans' },
  { id: 'caravan',   icon: 'Truck',  title: 'Caravan',   desc: 'Caravans, campers & RVs' },
  { id: 'marine',    icon: 'Anchor', title: 'Marine',    desc: 'Boats, jet skis & marine assets' },
  { id: 'motorbike', icon: 'Bike',   title: 'Motorbike', desc: 'Road, cruiser & dirt bikes' },
];
const BALLOON_MAX_TERM = 60;

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
        eyebrow={`Step ${getStep('loandetails')} · ${isPersonal ? 'Personal Loan' : 'Car Loan'} Details`}
        title="Tell us about"
        titleGradient={isPersonal ? 'your loan' : 'your car loan'}
        sub={
          <>
            <span className="sh-sub-row">
              <Target size={13} style={{ color: 'var(--hover)' }} />
              <span>Tell us what you'll use the loan for.</span>
            </span>
            <span className="sh-sub-row">
              <Building2 size={13} style={{ color: 'var(--hover)' }} />
              <span>We'll match you with the best lenders and products for your profile.</span>
            </span>
          </>
        }
      />

      <AnikaPanel
        message={
          isPersonal
            ? "I'm reviewing your loan details in real time to match your profile against our full lender panel. Your purpose, amount and term shape your eligibility, indicative rate and approval probability — I'll surface your personalised results once we have a few more details."
            : "I'm analysing your vehicle loan details as you go. Condition, purchase type and loan structure all influence which lenders are available to you, what rate you'll qualify for, and your approval likelihood. Everything runs as a soft check — no credit file impact."
        }
      />

      {isPersonal
        ? <PersonalLoanDetails repay={repay} rateLabel={rateLabel} />
        : <CarLoanDetails repay={repay} rateLabel={rateLabel} />
      }

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue →</BtnPrimary>
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
        <div className="amount-term-guide">
          <p className="amount-term-body">
            Choose how much you would like to borrow and how long you would like to repay the loan over.
          </p>
          <div className="amount-term-hint">
            <Icon name="Info" size={12} />
            Longer terms may lower repayments, while shorter terms may reduce total interest.
          </div>
        </div>
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
          <Chips className="chips-even">
            {LOAN_TERMS_MO.map(mo => (
              <Chip key={mo} selected={state.loanTerm === mo} onClick={() => updateState({ loanTerm: mo })}>
                {mo} months
              </Chip>
            ))}
          </Chips>
        </div>
        <RepayBox
          label="Estimated monthly repayment"
          sub="Indicative · actual rate confirmed after matching"
          value={state.loanTerm ? `${fmt(repay)} / month` : '$0 / month'}
          rateLabel={rateLabel}
        />
      </Card>

      <Card>
        <div className="sec-loan-hd">
          <CardTitle icon="Lock">Would You Like to Secure Your Personal Loan</CardTitle>
          <p className="sec-loan-sub">
            A secured personal loan uses an asset, such as a vehicle, as security for the loan.
          </p>
        </div>
        <AnikaPanel
          message="Securing against a vehicle you own outright typically reduces your rate by 1.5–3% and improves approval probability. The vehicle must have no existing finance."
          thinkingMs={400}
        />
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
          The asset used as security <strong>must be owned outright with no existing finance</strong>. A PPSR / title check will be run during assessment.
        </InfoBanner>
        {state.securityType === 'secured' && (
          <div className="sec-type-section">
            <div className="sec-type-hd">
              <span className="sec-type-lbl">What type of asset?</span>
            </div>
            <div className="sec-type-grid">
              {SECURITY_ASSET_TYPES.map(t => (
                <div
                  key={t.id}
                  className={`sec-type-card${state.securityAssetType === t.id ? ' on' : ''}`}
                  onClick={() => updateState({ securityAssetType: t.id })}
                >
                  <div className="sec-type-icon"><Icon name={t.icon} size={18} /></div>
                  <div className="sec-type-body">
                    <div className="sec-type-title">{t.title}</div>
                    <div className="sec-type-desc">{t.desc}</div>
                  </div>
                  <div className="cc-check"><Check size={10} strokeWidth={2.8} /></div>
                </div>
              ))}
            </div>
            {state.securityAssetType && (
              <div className="sec-type-form">
                <RegoLookup prefix="pl" />
              </div>
            )}
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
  const balloonRestricted = state.balloonPct >= 30;

  useEffect(() => {
    if (state.balloonPct >= 30 && state.loanTerm > BALLOON_MAX_TERM) {
      updateState({ loanTerm: null });
    }
  }, [state.balloonPct, state.loanTerm, updateState]);

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
            <div className="veh-fields">
              <div className="veh-row-2">
                <div className="fld"><label className="fl">Year</label><input className="inp" placeholder={state.vehicleCondition === 'new' ? 'e.g. 2024' : 'e.g. 2020'} /></div>
                <div className="fld"><label className="fl">Make</label><input className="inp" placeholder="e.g. Toyota" /></div>
              </div>
              <div className="veh-row-2">
                <div className="fld"><label className="fl">Model</label><input className="inp" placeholder="e.g. Camry" /></div>
                <div className="fld"><label className="fl">Series / Variant</label><input className="inp" placeholder="e.g. GX, Sport, Executive" /></div>
              </div>
              {state.vehicleCondition !== 'new' && (
                <div className="veh-row-2">
                  <div className="fld">
                    <label className="fl">Odometer</label>
                    <input key={state.vehicleCondition} className="inp" placeholder="e.g. 85,000 km" />
                  </div>
                  <div aria-hidden="true" />
                </div>
              )}
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
              <BtnPrimary onClick={() => {}}>Continue →</BtnPrimary>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle icon="DollarSign">Loan amount</CardTitle>
        <RangeSlider label="Vehicle price / loan amount" value={state.loanAmount} prefix="$" min={5000} max={500000} step={1000} onChange={v => updateState({ loanAmount: v })} minLabel="$5,000" maxLabel="$500,000" />

        <div className="divider" />
        <RangeSlider label="Cash deposit" value={state.deposit} prefix="$" min={0} max={200000} step={500} onChange={v => updateState({ deposit: v })} minLabel="$0" maxLabel="$200,000" />

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
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
              <div className="text-strong text-small" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="CreditCard" size={13} /> Trade-in under finance?
              </div>
              <Chips>
                <Chip selected={state.tradeInFinance === true}  onClick={() => updateState({ tradeInFinance: true })}>Yes</Chip>
                <Chip selected={state.tradeInFinance === false} onClick={() => updateState({ tradeInFinance: false })}>No</Chip>
              </Chips>
            </div>
          </>
        )}

        <div className="divider" />
        <div className="text-strong text-small" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="CircleDollarSign" size={13} /> Balloon payment <span className="text-border2" style={{ fontSize: 11, fontWeight: 400 }}>(optional)</span>
        </div>
        <div className="card" style={{ background: 'var(--bg2)', borderRadius: 'var(--r8)', padding: 14 }}>
          <RangeSlider label="Balloon percentage" value={state.balloonPct} suffix="%" min={0} max={30} step={1} onChange={v => updateState({ balloonPct: v })} minLabel="0%" maxLabel="30%" />
        </div>

        <div className="divider" />
        <div className="fld" style={{ marginBottom: 0 }}>
          <label className="fl">Loan term</label>
          <Chips className="chips-even">
            {LOAN_TERMS_MO.map(mo => {
              const isDisabled = balloonRestricted && mo > BALLOON_MAX_TERM;
              return (
                <Chip key={mo} selected={state.loanTerm === mo} disabled={isDisabled} onClick={() => updateState({ loanTerm: mo })}>
                  {mo} months
                </Chip>
              );
            })}
          </Chips>
          {balloonRestricted && (
            <p className="loan-term-helper">
              Loan terms above 60 months are unavailable for balloon payments over 30%.
            </p>
          )}
        </div>

        <RepayBox label="Estimated monthly repayment" sub="Indicative · confirmed after matching" value={state.loanTerm ? `${fmt(repay)} / month` : '$0 / month'} rateLabel={rateLabel} />

        <div className="grid-4" style={{ marginTop: 12 }}>
          {[
            { label: 'Vehicle price', val: fmt(state.loanAmount), accent: false },
            { label: 'Cash deposit',  val: `${fmt(state.deposit)}`, accent: false },
            { label: 'Trade-in',      val: '$0', accent: false },
            { label: 'Net loan',      val: fmt(netLoan), accent: true },
          ].map(b => (
            <div key={b.label} className="card" style={{ background: b.accent ? 'rgba(79,110,247,.1)' : 'var(--bg2)', border: `1px solid ${b.accent ? 'rgba(79,110,247,.25)' : 'var(--border)'}`, borderRadius: 'var(--r8)', padding: 12, textAlign: 'center', marginBottom: 0 }}>
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
