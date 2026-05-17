import { useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InfoBanner } from '../components/common/InfoBanner';
import { ChoiceCard, ChoiceGrid } from '../components/forms/ChoiceCard';
import { Chip, Chips } from '../components/forms/Chip';
import { DateSelect } from '../components/forms/DateSelect';
import { getInitials } from '../utils/format';
import './ProfileScreen.css';

const REL_OPTIONS = [
  { id: 'single',    icon: 'User',         title: 'Single' },
  { id: 'married',   icon: 'Heart',        title: 'Married' },
  { id: 'defacto',   icon: 'Users',        title: 'De facto' },
  { id: 'separated', icon: 'UserMinus',    title: 'Separated' },
  { id: 'divorced',  icon: 'FileX',        title: 'Divorced' },
  { id: 'widowed',   icon: 'Feather',      title: 'Widowed' },
];
const RESIDENCY_OPTIONS = [
  { id: 'citizen', icon: 'Globe',         title: 'Australian citizen' },
  { id: 'pr',      icon: 'ClipboardList', title: 'Permanent resident' },
  { id: 'visa',    icon: 'Plane',         title: 'Visa holder' },
];
const LIVING_OPTIONS = ['Mortgage','Owner','Rent — agent','Rent — private','Family','Boarding'];
const EMP_OPTIONS    = ['Full-time','Part-time','Casual','Contract','Self-employed','Not employed','Other'];
const DEPENDANT_AGES = ['0–2 years','3–5 years','6–12 years','13–17 years','18+ (still dependent)'];

const EMP_META = {
  'full-time':     { label: 'Full-time Employment',  icon: 'Briefcase'  },
  'part-time':     { label: 'Part-time Employment',  icon: 'Clock'      },
  'casual':        { label: 'Casual Employment',     icon: 'CalendarDays' },
  'contract':      { label: 'Contract Employment',   icon: 'FileText'   },
  'self-employed': { label: 'Self-employed',          icon: 'Building2'  },
  'other':         { label: 'Other Employment',      icon: 'HelpCircle' },
};

const EMPTY_EMP = { employer: '', phone: '', years: '', months: '' };

/* ─── Per-type employment detail block ───────────────────────── */
function EmploymentBlock({ typeId, label, icon, details, onUpdate, otherText, setOtherText }) {
  const isLast = typeId !== 'other'; // fld margin-bottom handled by block padding
  return (
    <motion.div
      className="emp-block"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="emp-block-header">
        <div className="emp-block-icon">
          <Icon name={icon} size={15} />
        </div>
        <span className="emp-block-title">{label}</span>
      </div>

      <div className="g2">
        <div className="fld">
          <label className="fl">Employer / ABN</label>
          <input className="inp" placeholder="⌕  Search employer or ABN"
            value={details.employer}
            onChange={e => onUpdate('employer', e.target.value)} />
        </div>
        <div className="fld">
          <label className="fl">Employer phone</label>
          <input className="inp" placeholder="02 0000 0000"
            value={details.phone}
            onChange={e => onUpdate('phone', e.target.value)} />
        </div>
        <div className="fld" style={{ marginBottom: typeId === 'other' ? undefined : 0 }}>
          <label className="fl">Years in role</label>
          <input className="inp" type="number" min="0" placeholder="Years"
            value={details.years}
            onChange={e => onUpdate('years', e.target.value)} />
        </div>
        <div className="fld" style={{ marginBottom: typeId === 'other' ? undefined : 0 }}>
          <label className="fl">Months (0–11)</label>
          <input className="inp" type="number" min="0" max="11" placeholder="Months"
            value={details.months}
            onChange={e => onUpdate('months', e.target.value)} />
        </div>
      </div>

      {typeId === 'other' && (
        <div className="fld" style={{ marginBottom: 0 }}>
          <label className="fl">Describe your employment</label>
          <input className="inp"
            placeholder="e.g. freelance photographer, board director"
            value={otherText}
            onChange={e => setOtherText(e.target.value)} />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main screen ─────────────────────────────────────────────── */
export function ProfileScreen() {
  const { state, updateState, toggleDependantAge, toggleEmploymentType, next, prev } = useApp();

  const [addrYrs,      setAddrYrs]      = useState('');
  const [dob,          setDob]          = useState(null);
  const [visaExpiry,   setVisaExpiry]   = useState(null);
  const [partnerDob,   setPartnerDob]   = useState(null);
  const [otherEmpText, setOtherEmpText] = useState('');
  const [empDetails,   setEmpDetails]   = useState({});

  const isCouple = state.relationshipStatus === 'married' || state.relationshipStatus === 'defacto';
  const initials = getInitials(state.firstName, state.lastName);

  const checkAddr = (yrs) => {
    setAddrYrs(yrs);
    updateState({ addressHistoryUnder3: yrs && Number(yrs) < 3 });
  };

  const updateEmpDetail = (typeId, field, value) => {
    setEmpDetails(prev => ({
      ...prev,
      [typeId]: { ...EMPTY_EMP, ...prev[typeId], [field]: value },
    }));
  };

  const getEmpDetails = (typeId) => ({ ...EMPTY_EMP, ...empDetails[typeId] });

  // "not-employed" is exclusive and needs no employer form
  const activeEmpTypes = state.employmentTypes.filter(t => t !== 'not-employed');

  // Show previous-employment panel if ANY active type has < 3 years entered
  const needsPrevEmp = activeEmpTypes.some(t => {
    const yrs = getEmpDetails(t).years;
    return yrs !== '' && Number(yrs) < 3;
  });

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 3 · Profile"
        title="About"
        titleGradient="you"
        sub={
          <>
            <span style={{ display: 'block' }}>
              Tell us about yourself, your relationship status, and household situation so Anika AI can match you with suitable lenders and loan options.
            </span>
            <span className="sh-sub-row" style={{ marginTop: 9 }}>
              <AlertTriangle size={13} style={{ color: 'rgba(251, 191, 36, 0.85)' }} />
              <span>
                Please ensure your information is accurate and matches your{' '}
                <strong style={{ fontWeight: 600, color: 'rgba(196, 148, 255, 0.85)' }}>government-issued document</strong>.
              </span>
            </span>
          </>
        }
      />

      {/* ── Personal information ─────────────────────────────── */}
      <Card>
        <CardTitle icon="User">Personal information</CardTitle>
        <div className="flex-between" style={{ gap: 20, marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="text-strong">
              {state.firstName || state.lastName
                ? `${state.firstName} ${state.lastName}`.trim()
                : 'Your name'}
            </div>
            <div className="text-small text-border2" style={{ marginTop: 3 }}>
              Personal loan applicant · Axio Finance
            </div>
          </div>
        </div>
        <div className="g2">
          <div className="fld"><label className="fl">First name</label><input className="inp" placeholder="First name" value={state.firstName} onChange={e => updateState({ firstName: e.target.value })} /></div>
          <div className="fld"><label className="fl">Last name</label><input className="inp" placeholder="Last name" value={state.lastName} onChange={e => updateState({ lastName: e.target.value })} /></div>
          <div className="fld"><label className="fl">Date of birth</label><DateSelect value={dob} onChange={setDob} yearRange={[1940, new Date().getFullYear() - 18]} /></div>
          <div className="fld"><label className="fl">Gender (optional)</label>
            <select className="sel"><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option></select>
          </div>
          <div className="fld"><label className="fl">Mobile</label><input className="inp" placeholder="0400 000 000" /></div>
          <div className="fld"><label className="fl">Email</label><input className="inp" placeholder="you@example.com" /></div>
        </div>
      </Card>

      {/* ── Residency ─────────────────────────────────────────── */}
      <Card>
        <CardTitle icon="Globe">Residency status</CardTitle>
        <ChoiceGrid cols={3}>
          {RESIDENCY_OPTIONS.map(r => (
            <ChoiceCard key={r.id} selected={state.residency === r.id} onClick={() => updateState({ residency: r.id })}>
              <div className="cc-icon"><Icon name={r.icon} size={22} /></div>
              <div className="cc-title" style={{ fontSize: 12.5 }}>{r.title}</div>
            </ChoiceCard>
          ))}
        </ChoiceGrid>
        <div className="divider" />
        <InfoBanner icon="Sparkles" variant="blue">Visa details required by lenders for assessment eligibility.</InfoBanner>
        {state.residency === 'visa' && (
          <div className="g2">
            <div className="fld"><label className="fl">Visa class</label>
              <select className="sel">
                <option value="">Select…</option>
                <option>482 — Temporary Skill Shortage</option>
                <option>485 — Temporary Graduate</option>
                <option>500 — Student</option>
                <option>820 — Partner (temporary)</option>
                <option>Other visa class</option>
              </select>
            </div>
            <div className="fld"><label className="fl">Visa subclass number</label><input className="inp" placeholder="e.g. 482" /></div>
            <div className="fld"><label className="fl">Visa expiry</label><DateSelect value={visaExpiry} onChange={setVisaExpiry} yearRange={[new Date().getFullYear(), new Date().getFullYear() + 15]} /></div>
            <div className="fld"><label className="fl">Work entitlement</label>
              <select className="sel"><option>Full work rights</option><option>Limited work rights</option><option>No work rights</option></select>
            </div>
          </div>
        )}
      </Card>

      {/* ── Relationship & household ──────────────────────────── */}
      <Card>
        <CardTitle icon="Users">Relationship &amp; household</CardTitle>
        <div className="fld">
          <label className="fl">Relationship status</label>
          <div className="choice-grid-6" style={{ marginTop: 8 }}>
            {REL_OPTIONS.map(r => (
              <ChoiceCard key={r.id} selected={state.relationshipStatus === r.id} onClick={() => updateState({ relationshipStatus: r.id })}>
                <div className="cc-icon" style={{ marginBottom: 7 }}><Icon name={r.icon} size={20} /></div>
                <div className="cc-title" style={{ fontSize: 11.5 }}>{r.title}</div>
              </ChoiceCard>
            ))}
          </div>
        </div>
        <div className="divider" />
        {isCouple && (
          <>
            <InfoBanner icon="Users" variant="blue">Partner details help assess household position. Income is not declared as yours unless adding a joint applicant.</InfoBanner>
            <div className="g2">
              <div className="fld"><label className="fl">Partner full name</label><input className="inp" placeholder="Full name" /></div>
              <div className="fld"><label className="fl">Partner date of birth</label><DateSelect value={partnerDob} onChange={setPartnerDob} yearRange={[1940, new Date().getFullYear() - 18]} /></div>
              <div className="fld"><label className="fl">Partner employment</label>
                <select className="sel"><option value="">Select…</option><option>Full-time</option><option>Part-time</option><option>Casual</option></select>
              </div>
              <div className="fld"><label className="fl">Partner income (approx.)</label><input className="inp" placeholder="$0 — optional" /></div>
            </div>
            <div className="divider" />
          </>
        )}
        <div className="fld" style={{ marginBottom: 0 }}>
          <label className="fl">Number of dependants</label>
          <div className="text-small text-border2" style={{ margin: '6px 0 12px' }}>Include all children and others you financially support.</div>
          <div className="grid-4">
            {[0,1,2,3,4,'5+'].map((n, i) => (
              <Chip key={i} selected={state.dependants === i} onClick={() => updateState({ dependants: i })}
                style={{ height: 48, borderRadius: 'var(--r8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800 }}>
                {n}
              </Chip>
            ))}
          </div>
          {state.dependants > 0 && (
            <div>
              <div className="text-small text-border2" style={{ margin: '12px 0 8px' }}>Age ranges — select all that apply:</div>
              <Chips>
                {DEPENDANT_AGES.map(a => (
                  <Chip key={a} selected={state.dependantAges.includes(a)} onClick={() => toggleDependantAge(a)}>{a}</Chip>
                ))}
              </Chips>
              <InfoBanner icon="Sparkles" variant="blue" style={{ marginTop: 12, marginBottom: 0 }}>
                Anika: younger dependants attract a higher HEM benchmark applied by lenders.
              </InfoBanner>
            </div>
          )}
        </div>
      </Card>

      {/* ── Residential history ───────────────────────────────── */}
      <Card>
        <CardTitle icon="Home">Residential history</CardTitle>
        <div className="fld"><label className="fl">Current address</label><input className="inp" placeholder="⌕  Search address" /></div>
        <div className="fld">
          <label className="fl">Living situation</label>
          <Chips className="chips-grid" style={{ marginTop: 8 }}>
            {LIVING_OPTIONS.map(l => {
              const id = l.toLowerCase().replace(/ /g,'-').replace(/—/g,'-');
              return <Chip key={id} selected={state.livingStatus === id} onClick={() => updateState({ livingStatus: id })}>{l}</Chip>;
            })}
          </Chips>
        </div>
        <div className="g2">
          <div className="fld"><label className="fl">Years at address</label><input className="inp" type="number" min="0" placeholder="Years" value={addrYrs} onChange={e => checkAddr(e.target.value)} /></div>
          <div className="fld"><label className="fl">Months (0–11)</label><input className="inp" type="number" min="0" max="11" placeholder="Months" /></div>
        </div>
        {state.addressHistoryUnder3 && (
          <div className="cond-panel show">
            <div className="cond-head" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} /> Previous address needed — current address under 3 years
            </div>
            <div className="fld"><label className="fl">Previous address</label><input className="inp" placeholder="⌕  Search previous address" /></div>
            <div className="g2">
              <div className="fld" style={{ marginBottom: 0 }}><label className="fl">Years there</label><input className="inp" type="number" min="0" placeholder="Years" /></div>
              <div className="fld" style={{ marginBottom: 0 }}><label className="fl">Months</label><input className="inp" type="number" min="0" max="11" placeholder="Months" /></div>
            </div>
          </div>
        )}
      </Card>

      {/* ── Employment ────────────────────────────────────────── */}
      <Card>
        <CardTitle icon="Briefcase">Employment</CardTitle>

        <div className="fld">
          <label className="fl">Employment type</label>
          <div className="text-small text-border2" style={{ margin: '4px 0 10px' }}>Select all that apply.</div>
          <Chips className="chips-grid">
            {EMP_OPTIONS.map(e => {
              const id = e.toLowerCase().replace(/ /g,'-');
              return (
                <Chip key={id} selected={state.employmentTypes.includes(id)} onClick={() => toggleEmploymentType(id)}>
                  {e}
                </Chip>
              );
            })}
          </Chips>
          {activeEmpTypes.length > 1 && (
            <div className="emp-count-badge">
              <Icon name="Layers" size={11} />
              {activeEmpTypes.length} employment types selected
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          {activeEmpTypes.map(typeId => (
            <EmploymentBlock
              key={typeId}
              typeId={typeId}
              label={EMP_META[typeId]?.label ?? typeId}
              icon={EMP_META[typeId]?.icon ?? 'Briefcase'}
              details={getEmpDetails(typeId)}
              onUpdate={(field, value) => updateEmpDetail(typeId, field, value)}
              otherText={otherEmpText}
              setOtherText={setOtherEmpText}
            />
          ))}
        </AnimatePresence>

        {needsPrevEmp && (
          <div className="cond-panel show" style={{ marginTop: 14 }}>
            <div className="cond-head" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} /> Previous employment needed — current role under 3 years
            </div>
            <div className="g2">
              <div className="fld"><label className="fl">Previous employer / ABN</label><input className="inp" placeholder="⌕  Search" /></div>
              <div className="fld"><label className="fl">Previous role title</label><input className="inp" placeholder="e.g. Senior Analyst" /></div>
            </div>
          </div>
        )}

        <div className="text-small text-border2" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={10} /> Anika will never contact your employer without your explicit consent.
        </div>
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue to income →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
