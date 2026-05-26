import { useState } from 'react';
import { AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
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
import { getStep } from '../constants/screens';
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

const EMP_REQUIRED_MONTHS = 36;
const EMPTY_EMP_ENTRY     = { employer: '', role: '', phone: '', years: '', months: '' };

const toEmpMonths = (e) =>
  (Math.max(0, Number(e.years) || 0)) * 12 +
  Math.min(11, Math.max(0, Number(e.months) || 0));

// Clamps a raw month input value to [0, 11]; returns '' for empty input.
const clampMonths = (val) => {
  if (val === '' || val === undefined) return '';
  const n = parseInt(val, 10);
  return isNaN(n) ? '' : String(Math.min(11, Math.max(0, n)));
};

// Prevents e/E/./+/- key entry in month number inputs.
const blockInvalidMonthKeys = (e) => {
  if (['-', '+', '.', 'e', 'E'].includes(e.key)) e.preventDefault();
};

/* ─── Employment history block (per type) ─────────────────────── */
function EmploymentBlock({ typeId, label, icon, entries, onUpdate, otherText, setOtherText }) {
  const totalMonths = entries.reduce((s, e) => s + toEmpMonths(e), 0);
  const satisfied   = totalMonths >= EMP_REQUIRED_MONTHS;

  return (
    <motion.div
      className="emp-block"
      layout
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

      {/* Current employment entry */}
      <div className="rh-section-label" style={{ marginBottom: 12 }}>
        <span className="rh-live-dot" />
        Current Employment
      </div>

      <div className="g2">
        <div className="fld">
          <label className="fl">Employer / ABN</label>
          <input className="inp" placeholder="⌕  Search employer or ABN"
            value={entries[0].employer}
            onChange={e => onUpdate(0, 'employer', e.target.value)} />
        </div>
        <div className="fld">
          <label className="fl">Employer phone</label>
          <input className="inp" placeholder="02 0000 0000"
            value={entries[0].phone}
            onChange={e => onUpdate(0, 'phone', e.target.value)} />
        </div>
      </div>

      <div className="fld">
        <label className="fl">Role / position</label>
        <input className="inp" placeholder="e.g. Senior Analyst"
          value={entries[0].role}
          onChange={e => onUpdate(0, 'role', e.target.value)} />
      </div>

      <div className="g2">
        <div className="fld" style={{ marginBottom: typeId === 'other' ? undefined : 0 }}>
          <label className="fl">Years in role</label>
          <input className="inp" type="number" min="0" placeholder="Years"
            value={entries[0].years}
            onChange={e => onUpdate(0, 'years', e.target.value)} />
        </div>
        <div className="fld" style={{ marginBottom: typeId === 'other' ? undefined : 0 }}>
          <label className="fl">Months (0–11)</label>
          <input className="inp" type="number" inputMode="numeric" pattern="[0-9]*"
            min="0" max="11" step="1" placeholder="Months"
            value={entries[0].months}
            onChange={e => onUpdate(0, 'months', e.target.value)}
            onKeyDown={blockInvalidMonthKeys} />
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

      {/* Previous employment entries — animated, progressive */}
      <AnimatePresence initial={false}>
        {entries.slice(1).map((entry, relIdx) => {
          const idx       = relIdx + 1;
          const runningMo = entries.slice(0, idx).reduce((s, e) => s + toEmpMonths(e), 0);
          const stillNeed = Math.max(0, EMP_REQUIRED_MONTHS - runningMo);
          const needYrs   = Math.floor(stillNeed / 12);
          const needMo    = stillNeed % 12;
          const pct       = Math.min(100, Math.round((runningMo / EMP_REQUIRED_MONTHS) * 100));
          const needLabel = stillNeed === 0
            ? 'Employment history complete'
            : `${needYrs > 0 ? `${needYrs}y ` : ''}${needMo > 0 ? `${needMo}mo ` : ''}more needed`;

          return (
            <motion.div
              key={idx}
              className="rh-prev-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="rh-prev-header">
                <div className="rh-prev-icon">
                  <AlertTriangle size={12} />
                </div>
                <div className="rh-prev-header-body">
                  <div className="rh-prev-title">Previous Employment {relIdx + 1}</div>
                  <div className="rh-prev-sub">{needLabel}</div>
                </div>
                <div className="rh-prev-pct">{pct}%</div>
              </div>

              <div className="rh-prev-body">
                <div className="g2">
                  <div className="fld">
                    <label className="fl">Employer / ABN</label>
                    <input className="inp" placeholder="⌕  Search employer or ABN"
                      value={entry.employer}
                      onChange={e => onUpdate(idx, 'employer', e.target.value)} />
                  </div>
                  <div className="fld">
                    <label className="fl">Role / position</label>
                    <input className="inp" placeholder="e.g. Sales Manager"
                      value={entry.role}
                      onChange={e => onUpdate(idx, 'role', e.target.value)} />
                  </div>
                  <div className="fld" style={{ marginBottom: 0 }}>
                    <label className="fl">Years there</label>
                    <input className="inp" type="number" min="0" placeholder="Years"
                      value={entry.years}
                      onChange={e => onUpdate(idx, 'years', e.target.value)} />
                  </div>
                  <div className="fld" style={{ marginBottom: 0 }}>
                    <label className="fl">Months (0–11)</label>
                    <input className="inp" type="number" inputMode="numeric" pattern="[0-9]*"
                      min="0" max="11" step="1" placeholder="Months"
                      value={entry.months}
                      onChange={e => onUpdate(idx, 'months', e.target.value)}
                      onKeyDown={blockInvalidMonthKeys} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Employment history summary strip */}
      {totalMonths > 0 && (
        <div className={`rh-summary ${satisfied ? 'ok' : 'warn'}`}>
          {satisfied ? (
            <>
              <CheckCircle2 size={14} />
              <span>
                Employment history complete —{' '}
                {Math.floor(totalMonths / 12)} yr{Math.floor(totalMonths / 12) !== 1 ? 's' : ''}
                {totalMonths % 12 > 0 ? ` ${totalMonths % 12} mo` : ''} recorded
              </span>
            </>
          ) : (
            <>
              <AlertTriangle size={14} />
              <span>Additional employment history required — minimum 3 years needed</span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main screen ─────────────────────────────────────────────── */
export function ProfileScreen() {
  const { state, updateState, toggleDependantAge, toggleEmploymentType, next, prev } = useApp();

  const [dob,          setDob]          = useState(null);
  const [visaExpiry,   setVisaExpiry]   = useState(null);
  const [otherEmpText, setOtherEmpText] = useState('');
  const [empHistory,   setEmpHistory]   = useState({});

  // ── Dynamic residential history ──────────────────────────────
  const EMPTY_ADDR = { address: '', years: '', months: '', status: '' };
  const REQUIRED_MONTHS = 36;

  const [addresses, setAddresses] = useState([{ ...EMPTY_ADDR }]);

  const toAddrMonths = (a) =>
    (Math.max(0, Number(a.years) || 0)) * 12 +
    Math.min(11, Math.max(0, Number(a.months) || 0));

  // Number of address slots to show: stop when cumulative >= 36,
  // or add one more empty slot if current last entry has a duration.
  const visibleCount = (() => {
    let running = 0;
    for (let i = 0; i < addresses.length; i++) {
      const mo = toAddrMonths(addresses[i]);
      running += mo;
      if (running >= REQUIRED_MONTHS) return i + 1;
      if (mo === 0) return i + 1; // don't cascade past an empty entry
    }
    return addresses.length + 1; // need one more
  })();

  // Padded view — always exactly visibleCount entries for rendering
  const viewAddrs = Array.from({ length: visibleCount }, (_, i) =>
    addresses[i] ?? { ...EMPTY_ADDR }
  );

  const totalAddrMonths = viewAddrs.reduce((s, a) => s + toAddrMonths(a), 0);
  const addrSatisfied   = totalAddrMonths >= REQUIRED_MONTHS;

  const updateAddr = (idx, field, value) => {
    const val = field === 'months' ? clampMonths(value) : value;
    if (idx === 0 && field === 'status') updateState({ livingStatus: value });
    setAddresses(prev => {
      const padded = [...prev];
      while (padded.length <= idx) padded.push({ ...EMPTY_ADDR });
      return padded.map((a, i) => i === idx ? { ...a, [field]: val } : a);
    });
  };

  const initials = getInitials(state.firstName, state.lastName);

  // ── Dynamic employment history ────────────────────────────────
  const getEmpEntries = (typeId) => empHistory[typeId] ?? [{ ...EMPTY_EMP_ENTRY }];

  const getEmpVisibleCount = (typeId) => {
    const entries = getEmpEntries(typeId);
    let running = 0;
    for (let i = 0; i < entries.length; i++) {
      const mo = toEmpMonths(entries[i]);
      running += mo;
      if (running >= EMP_REQUIRED_MONTHS) return i + 1;
      if (mo === 0) return i + 1;
    }
    return entries.length + 1;
  };

  const getEmpViewEntries = (typeId) => {
    const count = getEmpVisibleCount(typeId);
    return Array.from({ length: count }, (_, i) =>
      getEmpEntries(typeId)[i] ?? { ...EMPTY_EMP_ENTRY }
    );
  };

  const updateEmpHistory = (typeId, idx, field, value) => {
    const val = field === 'months' ? clampMonths(value) : value;
    setEmpHistory(prev => {
      const current = prev[typeId] ?? [{ ...EMPTY_EMP_ENTRY }];
      const padded  = [...current];
      while (padded.length <= idx) padded.push({ ...EMPTY_EMP_ENTRY });
      return {
        ...prev,
        [typeId]: padded.map((e, i) => i === idx ? { ...e, [field]: val } : e),
      };
    });
  };

  // "not-employed" is exclusive and needs no employer form
  const activeEmpTypes = state.employmentTypes.filter(t => t !== 'not-employed');

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow={`Step ${getStep('profile')} · Profile`}
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

        {/* Current address block */}
        <div className="rh-section-label">
          <span className="rh-live-dot" />
          Current Address
        </div>

        <div className="fld">
          <label className="fl">Address</label>
          <input className="inp" placeholder="⌕  Search address"
            value={viewAddrs[0].address}
            onChange={e => updateAddr(0, 'address', e.target.value)} />
        </div>

        <div className="fld">
          <label className="fl">Living situation</label>
          <Chips className="chips-grid" style={{ marginTop: 8 }}>
            {LIVING_OPTIONS.map(l => {
              const id = l.toLowerCase().replace(/ /g,'-').replace(/—/g,'-');
              return (
                <Chip key={id}
                  selected={state.livingStatus === id}
                  onClick={() => { updateState({ livingStatus: id }); updateAddr(0, 'status', id); }}>
                  {l}
                </Chip>
              );
            })}
          </Chips>
        </div>

        <div className="g2">
          <div className="fld">
            <label className="fl">Years at address</label>
            <input className="inp" type="number" min="0" placeholder="Years"
              value={viewAddrs[0].years}
              onChange={e => updateAddr(0, 'years', e.target.value)} />
          </div>
          <div className="fld">
            <label className="fl">Months (0–11)</label>
            <input className="inp" type="number" inputMode="numeric" pattern="[0-9]*"
              min="0" max="11" step="1" placeholder="Months"
              value={viewAddrs[0].months}
              onChange={e => updateAddr(0, 'months', e.target.value)}
              onKeyDown={blockInvalidMonthKeys} />
          </div>
        </div>

        {/* Previous address blocks — animated, progressive */}
        <AnimatePresence initial={false}>
          {viewAddrs.slice(1).map((addr, relIdx) => {
            const idx        = relIdx + 1;
            const runningMo  = viewAddrs.slice(0, idx).reduce((s, a) => s + toAddrMonths(a), 0);
            const stillNeed  = Math.max(0, REQUIRED_MONTHS - runningMo);
            const needYrs    = Math.floor(stillNeed / 12);
            const needMo     = stillNeed % 12;
            const pct        = Math.min(100, Math.round((runningMo / REQUIRED_MONTHS) * 100));
            const needLabel  = stillNeed === 0
              ? 'Address history complete'
              : `${needYrs > 0 ? `${needYrs}y ` : ''}${needMo > 0 ? `${needMo}mo ` : ''}more needed`;

            return (
              <motion.div
                key={idx}
                className="rh-prev-block"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="rh-prev-header">
                  <div className="rh-prev-icon">
                    <MapPin size={12} />
                  </div>
                  <div className="rh-prev-header-body">
                    <div className="rh-prev-title">Previous Address {relIdx + 1}</div>
                    <div className="rh-prev-sub">{needLabel}</div>
                  </div>
                  <div className="rh-prev-pct">{pct}%</div>
                </div>

                <div className="rh-prev-body">
                  <div className="fld">
                    <label className="fl">Address</label>
                    <input className="inp" placeholder="⌕  Search previous address"
                      value={addr.address}
                      onChange={e => updateAddr(idx, 'address', e.target.value)} />
                  </div>
                  <div className="fld">
                    <label className="fl">Residential status</label>
                    <select className="sel" value={addr.status}
                      onChange={e => updateAddr(idx, 'status', e.target.value)}>
                      <option value="">Select…</option>
                      {LIVING_OPTIONS.map(l => {
                        const id = l.toLowerCase().replace(/ /g,'-').replace(/—/g,'-');
                        return <option key={id} value={id}>{l}</option>;
                      })}
                    </select>
                  </div>
                  <div className="g2">
                    <div className="fld" style={{ marginBottom: 0 }}>
                      <label className="fl">Years at address</label>
                      <input className="inp" type="number" min="0" placeholder="Years"
                        value={addr.years}
                        onChange={e => updateAddr(idx, 'years', e.target.value)} />
                    </div>
                    <div className="fld" style={{ marginBottom: 0 }}>
                      <label className="fl">Months (0–11)</label>
                      <input className="inp" type="number" inputMode="numeric" pattern="[0-9]*"
                        min="0" max="11" step="1" placeholder="Months"
                        value={addr.months}
                        onChange={e => updateAddr(idx, 'months', e.target.value)}
                        onKeyDown={blockInvalidMonthKeys} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Status summary — only show once user has started filling */}
        {totalAddrMonths > 0 && (
          <div className={`rh-summary ${addrSatisfied ? 'ok' : 'warn'}`}>
            {addrSatisfied ? (
              <>
                <CheckCircle2 size={14} />
                <span>
                  Residential history complete —{' '}
                  {Math.floor(totalAddrMonths / 12)} yr{Math.floor(totalAddrMonths / 12) !== 1 ? 's' : ''}
                  {totalAddrMonths % 12 > 0 ? ` ${totalAddrMonths % 12} mo` : ''} recorded
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} />
                <span>
                  Additional address history required — minimum 3 years needed
                  {` (${Math.ceil((REQUIRED_MONTHS - totalAddrMonths) / 12 * 10) / 10} yr${Math.ceil((REQUIRED_MONTHS - totalAddrMonths) / 12 * 10) / 10 !== 1 ? 's' : ''} remaining)`}
                </span>
              </>
            )}
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
              entries={getEmpViewEntries(typeId)}
              onUpdate={(idx, field, value) => updateEmpHistory(typeId, idx, field, value)}
              otherText={otherEmpText}
              setOtherText={setOtherEmpText}
            />
          ))}
        </AnimatePresence>
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
