import { useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaStrip } from '../components/common/AnikaStrip';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { InfoBanner } from '../components/common/InfoBanner';
import { ChoiceCard, ChoiceGrid } from '../components/forms/ChoiceCard';
import { Chip, Chips } from '../components/forms/Chip';
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
const LIVING_OPTIONS = ['Mortgage','Owner','Rent — agent','Rent — private','Parents / family','Boarding'];
const EMP_OPTIONS = ['Full-time','Part-time','Casual','Contract','Self-employed','Not employed'];
const DEPENDANT_AGES = ['0–2 years','3–5 years','6–12 years','13–17 years','18+ (still dependent)'];

export function ProfileScreen() {
  const { state, updateState, toggleDependantAge, next, prev } = useApp();
  const [addrYrs, setAddrYrs] = useState('');
  const [empYrs,  setEmpYrs]  = useState('');
  const isCouple = state.relationshipStatus === 'married' || state.relationshipStatus === 'defacto';
  const initials = getInitials(state.firstName, state.lastName);

  const checkAddr = (yrs) => {
    setAddrYrs(yrs);
    updateState({ addressHistoryUnder3: yrs && Number(yrs) < 3 });
  };
  const checkEmp = (yrs) => {
    setEmpYrs(yrs);
    updateState({ employmentHistoryUnder3: yrs && Number(yrs) < 3 });
  };

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Step 3 · Profile"
        title="About"
        titleGradient="you"
        sub="Your personal details, relationship status and household makeup. Previous address and employment are requested automatically when current history is under 3 years."
      />

      <Card>
        <CardTitle icon="User">Personal information</CardTitle>
        <div className="flex-between" style={{ gap: 20, marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="text-strong">
              {state.firstName || state.lastName ? `${state.firstName} ${state.lastName}`.trim() : 'Your name'}
            </div>
            <div className="text-small text-border2" style={{ marginTop: 3 }}>Personal loan applicant · Axio Finance</div>
          </div>
        </div>
        <div className="g2">
          <div className="fld"><label className="fl">First name</label><input className="inp" placeholder="First name" value={state.firstName} onChange={e => updateState({ firstName: e.target.value })} /></div>
          <div className="fld"><label className="fl">Last name</label><input className="inp" placeholder="Last name" value={state.lastName} onChange={e => updateState({ lastName: e.target.value })} /></div>
          <div className="fld"><label className="fl">Date of birth</label><input className="inp" placeholder="DD / MM / YYYY" /></div>
          <div className="fld"><label className="fl">Gender (optional)</label>
            <select className="sel"><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option></select>
          </div>
          <div className="fld"><label className="fl">Mobile</label><input className="inp" placeholder="0400 000 000" /></div>
          <div className="fld"><label className="fl">Email</label><input className="inp" placeholder="you@example.com" /></div>
        </div>
      </Card>

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
                <option>482 — Temporary Skill Shortage</option><option>485 — Temporary Graduate</option>
                <option>500 — Student</option><option>820 — Partner (temporary)</option><option>Other visa class</option>
              </select>
            </div>
            <div className="fld"><label className="fl">Visa subclass number</label><input className="inp" placeholder="e.g. 482" /></div>
            <div className="fld"><label className="fl">Visa expiry</label><input className="inp" placeholder="DD / MM / YYYY" /></div>
            <div className="fld"><label className="fl">Work entitlement</label>
              <select className="sel"><option>Full work rights</option><option>Limited work rights</option><option>No work rights</option></select>
            </div>
          </div>
        )}
      </Card>

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
              <div className="fld"><label className="fl">Partner date of birth</label><input className="inp" placeholder="DD / MM / YYYY" /></div>
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

      <Card>
        <CardTitle icon="Home">Residential history</CardTitle>
        <div className="fld"><label className="fl">Current address</label><input className="inp" placeholder="⌕  Search address" /></div>
        <div className="fld">
          <label className="fl">Living situation</label>
          <Chips style={{ marginTop: 6 }}>
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

      <Card>
        <CardTitle icon="Briefcase">Employment</CardTitle>
        <div className="fld">
          <label className="fl">Employment type</label>
          <Chips style={{ marginTop: 6 }}>
            {EMP_OPTIONS.map(e => {
              const id = e.toLowerCase().replace(/ /g,'-');
              return <Chip key={id} selected={state.employmentType === id} onClick={() => updateState({ employmentType: id })}>{e}</Chip>;
            })}
          </Chips>
        </div>
        <div className="g2">
          <div className="fld"><label className="fl">Employer / ABN</label><input className="inp" placeholder="⌕  Search employer or ABN" /></div>
          <div className="fld"><label className="fl">Employer phone</label><input className="inp" placeholder="02 0000 0000" /></div>
        </div>
        <div className="g2">
          <div className="fld"><label className="fl">Years in role</label><input className="inp" type="number" min="0" placeholder="Years" value={empYrs} onChange={e => checkEmp(e.target.value)} /></div>
          <div className="fld"><label className="fl">Months (0–11)</label><input className="inp" type="number" min="0" max="11" placeholder="Months" /></div>
        </div>
        {state.employmentHistoryUnder3 && (
          <div className="cond-panel show">
            <div className="cond-head" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={13} /> Previous employment needed — current role under 3 years
            </div>
            <div className="g2">
              <div className="fld"><label className="fl">Previous employer / ABN</label><input className="inp" placeholder="⌕  Search" /></div>
              <div className="fld"><label className="fl">Previous role title</label><input className="inp" placeholder="e.g. Senior Analyst" /></div>
            </div>
          </div>
        )}
        <div className="text-small text-border2" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
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
