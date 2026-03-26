import { db } from '@/db';
import { 
  associationMembers, 
  associationDeliberations, 
  administrativeProjects, 
  associationDonations,
  users,
  accountingAccounts,
  accountingJournal,
  accountingLedger,
  associationInventory,
  auditLogs
} from '@/db/schema';
import { 
  createMember, 
  createDeliberation, 
  createAdministrativeProject, 
  createDonation,
  createAccountingEntry,
  createInventoryItem,
  seedAccounts
} from '@/app/actions/registers';
import { desc, eq, sql } from 'drizzle-orm';
import { 
  FileText, Users, Briefcase, Heart, Plus, Download, 
  Trash2, Landmark, Package, History, AlertTriangle, CheckCircle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRegistersPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // 1. Fetching All Data
  const membersList = (await db.select().from(associationMembers).orderBy(desc(associationMembers.registrationDate))) || [];
  const deliberationsList = (await db.select().from(associationDeliberations).orderBy(desc(associationDeliberations.meetingDate))) || [];
  const projectsList = (await db.select().from(administrativeProjects).orderBy(desc(administrativeProjects.startDate))) || [];
  const donationsList = (await db.select().from(associationDonations).orderBy(desc(associationDonations.dateReceived))) || [];
  
  const accountsList = await db.select().from(accountingAccounts).orderBy(accountingAccounts.code);
  const inventoryList = await db.select().from(associationInventory).orderBy(desc(associationInventory.acquisitionDate));
  const auditList = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(20);

  // Advanced query for Journal with Ledger items
  const journalList = await db.query.accountingJournal.findMany({
    with: {
      entries: {
        with: {
          account: true
        }
      }
    },
    orderBy: [desc(accountingJournal.date)]
  });

  return (
    <div dir="rtl" style={{ fontFamily: 'Inter, sans-serif', color: '#1f2937' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--brand-blue)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>نظام إدارة الجمعية (AMS)</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <span style={{ padding: '0.4rem 0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>ممتثل للمرسوم 88</span>
           <span style={{ padding: '0.4rem 0.8rem', background: '#fef9c3', color: '#854d0e', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>المعيار المحاسبي 45</span>
           
           {accountsList.length === 0 && (
             <form action={seedAccounts}>
               <button type="submit" style={{ padding: '0.4rem 0.8rem', background: 'var(--brand-blue)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                 تجهيز دليل الحسابات (Pre-seed)
               </button>
             </form>
           )}
        </div>
      </header>

      {/* --- DASHBOARD STATS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <StatCard title="الأعضاء" value={membersList.length} icon={<Users size={20} />} color="var(--brand-blue)" />
        <StatCard title="رصيد التبرعات" value={`${donationsList.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString()} د.ت`} icon={<Heart size={20} />} color="var(--brand-green)" />
        <StatCard title="المداولات الموثقة" value={deliberationsList.length} icon={<FileText size={20} />} color="#f59e0b" />
        <StatCard title="قيمة الأصول" value={`${inventoryList.reduce((acc, i) => acc + (i.value || 0), 0).toLocaleString()} د.ت`} icon={<Package size={20} />} color="#6366f1" />
      </div>

      {/* --- REGISTER A & B (MEMBERS & DELIBERATIONS) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        <Section title="سجل الأعضاء والمنخرطين" icon={<Users size={24} />}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
            <form action={createMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <Input name="fullName" label="الاسم واللقب" required />
              <Input name="age" label="العمر" type="number" required />
              <Input name="profession" label="المهنة" required />
              <Input name="nationality" label="الجنسية" defaultValue="تونسية" required />
              <Input name="registrationDate" label="تاريخ الانخراط" type="date" required />
              <Input name="address" label="العنوان" required style={{ gridColumn: 'span 2' }} />
              <button type="submit" className="btn-primary" style={{ height: '45px', border: 'none', alignSelf: 'flex-end' }}>إضافة</button>
            </form>
            <Table headers={['الاسم', 'المهنة', 'التاريخ', 'مبلغ الاشتراك']}>
              {membersList.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: '600' }}>{m.fullName}</td>
                  <td>{m.profession}</td>
                  <td>{m.registrationDate}</td>
                  <td>{m.subscriptionAmount || 0} د.ت</td>
                </tr>
              ))}
            </Table>
          </div>
        </Section>

        <Section title="سجل المداولات (محاضر الجلسات القانونية)" icon={<FileText size={24} />}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
            <form action={createDeliberation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Select name="organ" label="الهيكل">
                  <option value="المكتب التنفيذي">المكتب التنفيذي</option>
                  <option value="الجلسة العامة">الجلسة العامة</option>
                </Select>
                <Input name="meetingDate" label="تاريخ الاجتماع" type="date" required />
                <Input name="location" label="المكان" required />
              </div>
              <Input name="subject" label="موضوع الجلسة" required />
              <textarea name="decisions" placeholder="القرارات المتخذة..." rows={3} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Input name="pvFile" label="نسخة المحضر الموقعة (PDF)" type="file" style={{ flex: 1 }} />
                <button type="submit" className="btn-primary" style={{ border: 'none', padding: '0.8rem 2rem' }}>حفظ المداولة</button>
              </div>
            </form>
            <Table headers={['الهيكل', 'التاريخ', 'الموضوع', 'المستند']}>
              {deliberationsList.map(d => (
                <tr key={d.id}>
                  <td>{d.organ}</td>
                  <td>{d.meetingDate}</td>
                  <td style={{ fontWeight: '600' }}>{d.subject}</td>
                  <td>
                    {d.fileUrl && <a href={d.fileUrl} target="_blank" style={{ color: 'var(--brand-blue)' }}><Download size={16} /></a>}
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </Section>
      </div>

      {/* --- ACCOUNTING SECTION (JOURNAL GENERAL) --- */}
      <Section title="المحاسبة والشفافية المالية (الدفتر اليومي)" icon={<Landmark size={24} />}>
        <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb' }}>
          
          {/* Add Entry Form */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--brand-blue)' }}>تسجيل عملية محاسبية جديدة</h4>
            <form action={createAccountingEntry} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input name="date" label="تاريخ العملية" type="date" required />
              <Input name="description" label="وصف العملية" required />
              <Input name="referenceNumber" label="رقم الوثيقة (فاتورة/وصل)" />
              <Input name="amount" label="المبلغ (د.ت)" type="number" step="0.001" required />
              
              <Select name="debitAccountId" label="حساب المدين (Debit)">
                {accountsList.map(acc => <option key={acc.id} value={acc.id}>{acc.code} - {acc.nameAr}</option>)}
              </Select>
              <Select name="creditAccountId" label="حساب الدائن (Credit)">
                {accountsList.map(acc => <option key={acc.id} value={acc.id}>{acc.code} - {acc.nameAr}</option>)}
              </Select>
              
              <Input name="docFile" label="الوثيقة الثبوتية (Scan)" type="file" />
              <button type="submit" className="btn-primary" style={{ border: 'none', height: '45px', alignSelf: 'flex-end' }}>تسجيل القيد</button>
            </form>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem' }}>
              <AlertTriangle size={12} style={{ marginLeft: '0.3rem' }} /> يُمنع قانوناً دفع مبالغ تتجاوز 500 د.ت نقداً.
            </p>
          </div>

          <Table headers={['التاريخ', 'البيان', 'المدين', 'الدائن', 'المبلغ', 'مستند']}>
             {journalList.map(j => (
               <tr key={j.id} style={{ opacity: j.isLocked ? 0.7 : 1 }}>
                 <td>{j.date}</td>
                 <td style={{ fontWeight: '500' }}>{j.description}</td>
                 <td>{j.entries[0]?.account?.nameAr || '-'}</td>
                 <td>{j.entries[1]?.account?.nameAr || '-'}</td>
                 <td style={{ fontWeight: 'bold' }}>{j.entries[0]?.debit?.toLocaleString()} د.ت</td>
                 <td>
                   {j.documentUrl ? <a href={j.documentUrl} target="_blank" style={{ color: 'var(--brand-blue)' }}><Download size={16} /></a> : '-'}
                 </td>
               </tr>
             ))}
          </Table>
        </div>
      </Section>

      {/* --- INVENTORY SECTION --- */}
      <Section title="سجل جرد الممتلكات" icon={<Package size={24} />}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
           <form action={createInventoryItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
             <Input name="itemNameAr" label="القطعة" required />
             <Input name="quantity" label="الكمية" type="number" required />
             <Input name="value" label="قيمة الاقتناء" type="number" step="0.001" required />
             <Input name="acquisitionDate" label="تاريخ الاقتناء" type="date" required />
             <Input name="location" label="المكان" />
             <button type="submit" className="btn-primary" style={{ border: 'none', height: '45px', alignSelf: 'flex-end' }}>إضافة للجرد</button>
           </form>
           <Table headers={['القطعة', 'الكمية', 'القيمة', 'الحالة']}>
             {inventoryList.map(item => (
               <tr key={item.id}>
                 <td style={{ fontWeight: '600' }}>{item.itemNameAr}</td>
                 <td>{item.quantity}</td>
                 <td>{item.value?.toLocaleString()} د.ت</td>
                 <td><span style={{ padding: '0.2rem 0.5rem', background: '#e0f2fe', borderRadius: '4px', fontSize: '0.8rem' }}>{item.condition || 'جيدة'}</span></td>
               </tr>
             ))}
           </Table>
        </div>
      </Section>

      {/* --- AUDIT LOGS --- */}
      <Section title="سجل التتبع والأمان (Audit Log)" icon={<History size={24} />}>
        <div style={{ background: '#111827', color: '#9ca3af', borderRadius: '16px', padding: '1.5rem', fontSize: '0.85rem' }}>
          {auditList.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #374151' }}>
              <span style={{ color: '#6366f1' }}>[{log.timestamp?.toLocaleTimeString()}]</span>
              <span style={{ color: '#d1d5db' }}>{log.action}</span>
              <span>{log.details}</span>
            </div>
          ))}
          {auditList.length === 0 && <p>لا توجد سجلات تتبع حالياً.</p>}
        </div>
      </Section>

    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, value, icon, color }: any) {
  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#6b7280', fontWeight: '500' }}>{title}</span>
        <div style={{ color }}>{icon}</div>
      </div>
      <p style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{value}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--brand-yellow)', color: 'black', padding: '0.7rem', borderRadius: '12px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--brand-blue)', fontWeight: '700' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({ label, style, ...props }: any) {
  return (
    <div style={style}>
      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>{label}</label>
      <input 
        {...props} 
        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }} 
      />
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>{label}</label>
      <select 
        {...props} 
        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: 'white' }}
      >
        {children}
      </select>
    </div>
  );
}

function Table({ headers, children }: { headers: string[], children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ background: '#f9fafb', color: '#4b5563', fontSize: '0.85rem' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '1rem 0.75rem', fontWeight: '700', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontSize: '0.9rem' }}>
          {children}
        </tbody>
      </table>
      <style>{`
        tbody tr { border-bottom: 1px solid #f3f4f6; transition: background 0.15s; }
        tbody tr:hover { background: #fcfcfc; }
        td { padding: 1rem 0.75rem; vertical-align: middle; }
      `}</style>
    </div>
  );
}
