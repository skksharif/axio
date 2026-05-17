import { FileText, Building2, CreditCard, Activity, Layers } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnGhost, BtnRow } from '../components/common/Button';
import { Card, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import '../components/forms/ChoiceCard.css';
import '../components/ui/ALCard.css';
import './DashboardScreen.css';

const EXPLORE_PRODUCTS = [
  { icon: 'Car',        title: 'Car Loan',    desc: 'From 5.99% p.a.' },
  { icon: 'Home',       title: 'Home Loan',   desc: 'From 5.89% p.a.' },
  { icon: 'CreditCard', title: 'Credit Card', desc: 'From 12.99%' },
];

const TIMELINE = [
  { label: 'Application submitted',    sub: 'Today, 2:14 PM',       done: true },
  { label: 'Soft credit check complete', sub: 'Today, 2:15 PM',     done: true },
  { label: 'Documents required',       sub: '2 items pending',      active: true },
  { label: 'Lender assessment',        sub: 'Estimated 24–48 hrs',  pending: true },
  { label: 'Approval & settlement',    sub: '',                      pending: true },
];

const SNAPSHOT = [
  { key: 'Annual income',   val: '$74,400', color: 'var(--green)' },
  { key: 'Total assets',    val: '$805,000' },
  { key: 'Monthly expenses', val: '$3,640' },
  { key: 'Monthly surplus',  val: '$1,460', color: 'var(--green)' },
  { key: 'Debt-to-income',   val: '42%',    color: 'var(--green)' },
];

const DOCS = [
  { Icon: FileText,  name: 'Payslips',         status: 'Needed',   variant: 'yellow' },
  { Icon: Building2, name: 'Bank statements',  status: 'Needed',   variant: 'yellow' },
  { Icon: CreditCard,name: 'Identity',         status: 'Verified', variant: 'green' },
];

export function DashboardScreen() {
  const { prev } = useApp();

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Dashboard · Welcome back"
        title="Your"
        titleGradient="portal"
        sub={
          <>
            <span className="sh-sub-row">
              <Activity size={13} style={{ color: 'var(--hover)' }} />
              <span>Track your application progress in real time.</span>
            </span>
            <span className="sh-sub-row">
              <FileText size={13} style={{ color: 'var(--hover)' }} />
              <span>Manage documents and review your submission.</span>
            </span>
            <span className="sh-sub-row">
              <Layers size={13} style={{ color: 'var(--hover)' }} />
              <span>Explore more products — all from one place.</span>
            </span>
          </>
        }
      />

      <div className="card dash-hero-card" style={{ marginBottom: 20 }}>
        <div className="flex-between" style={{ alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="text-small text-border2" style={{ marginBottom: 4 }}>Active application</div>
            <div className="text-strong" style={{ fontSize: 20 }}>Personal Loan · $25,000</div>
            <div className="text-small text-border2" style={{ marginTop: 3 }}>Lender One · 8.49% p.a. · $620/mo</div>
          </div>
          <Badge variant="yellow" style={{ fontSize: 13, padding: '8px 16px', flexShrink: 0 }}>Awaiting docs</Badge>
        </div>

        <div className="divider" />

        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <div key={i} className="tl-item">
              <div className={`tl-dot ${t.done ? 'done' : t.pending ? 'pending' : ''}`} />
              <div className={`tl-label ${t.active ? 'text-accent' : t.pending ? 'text-border2' : ''}`}>{t.label}</div>
              {t.sub && <div className="tl-sub">{t.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="text-small text-border2" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Financial snapshot</div>
          {SNAPSHOT.map(row => (
            <div key={row.key} className="sum-row">
              <span className="sum-key">{row.key}</span>
              <span className="sum-val" style={{ color: row.color || 'var(--text0)' }}>{row.val}</span>
            </div>
          ))}
        </div>

        <div className="dash-card">
          <div className="text-small text-border2" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Documents</div>
          {DOCS.map((d, i) => (
            <div key={i} className="doc-item dash-doc-item">
              <div className="doc-icon" style={{ width: 30, height: 30, fontSize: 14 }}>
                <d.Icon size={16} />
              </div>
              <div className="doc-info"><div className="doc-name" style={{ fontSize: 12.5 }}>{d.name}</div></div>
              <Badge variant={d.variant}>{d.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <Card style={{ marginTop: 14 }}>
        <CardTitle icon="Car">Explore more products</CardTitle>
        <div className="choice-grid-3">
          {EXPLORE_PRODUCTS.map(p => (
            <div key={p.title} className="dash-product-card">
              <div style={{ marginBottom: 6 }}><Icon name={p.icon} size={22} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text1)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
      </BtnRow>
    </div>
  );
}
