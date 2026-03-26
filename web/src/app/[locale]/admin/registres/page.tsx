import { db } from '@/db';
import { 
  associationMembers, 
  associationDeliberations, 
  administrativeProjects, 
  associationDonations,
  users
} from '@/db/schema';
import { 
  createMember, 
  createDeliberation, 
  createAdministrativeProject, 
  createDonation 
} from '@/app/actions/registers';
import { desc, eq } from 'drizzle-orm';
import { FileText, Users, Briefcase, Heart, Plus, Download, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminRegistersPage() {
  const membersList = await db.select().from(associationMembers).orderBy(desc(associationMembers.registrationDate));
  const deliberationsList = await db.select().from(associationDeliberations).orderBy(desc(associationDeliberations.meetingDate));
  const projectsList = await db.select().from(administrativeProjects).orderBy(desc(administrativeProjects.startDate));
  const donationsList = await db.select().from(associationDonations).orderBy(desc(associationDonations.dateReceived));
  
  // To allow linking members to portal users, fetch users
  const portalUsers = await db.select().from(users);

  return (
    <div dir="rtl" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--brand-blue)', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>السجلات الإدارية والقانونية</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>الإدارة الرقمية (ERP) الممتثلة للمرسوم عدد 88 لسنة 2011.</p>
      </header>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--brand-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>الأعضاء المسجلين</span>
            <Users size={20} color="var(--brand-blue)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{membersList.length}</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--brand-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>إجمالي التبرعات</span>
            <Heart size={20} color="var(--brand-green)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>
            {donationsList.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString()} <small>د.ت</small>
          </p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>المداولات (PV)</span>
            <FileText size={20} color="#f59e0b" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{deliberationsList.length}</p>
        </div>
      </div>

      {/* --- Register A: Members --- */}
      <Section title="سجل الأعضاء والمنخرطين" icon={<Users size={24} />}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <form action={createMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
            <Input name="fullName" label="الاسم واللقب" required />
            <Input name="age" label="العمر" type="number" required />
            <Input name="profession" label="المهنة" required />
            <Input name="nationality" label="الجنسية" defaultValue="تونسية" required />
            <Input name="registrationDate" label="تاريخ الانخراط" type="date" required />
            <Input name="subscriptionAmount" label="مبلغ الاشتراك (إن وجد)" type="number" step="0.001" />
            <Input name="address" label="العنوان" required style={{ gridColumn: 'span 2' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ height: '48px', width: '100%', border: 'none' }}>إضافة منخرط جديد</button>
            </div>
          </form>

          <Table headers={['الاسم', 'المهنة', 'التاريخ', 'العنوان', 'مبلغ الاشتراك']}>
            {membersList.map(m => (
              <tr key={m.id}>
                <td>{m.fullName}</td>
                <td>{m.profession}</td>
                <td>{m.registrationDate}</td>
                <td style={{ fontSize: '0.85rem' }}>{m.address}</td>
                <td>{m.subscriptionAmount} د.ت</td>
              </tr>
            ))}
          </Table>
        </div>
      </Section>

      {/* --- Register B: Deliberations --- */}
      <Section title="سجل مداولات الهياكل الإدارية" icon={<FileText size={24} />}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
           <form action={createDeliberation} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem' }}>
               <Select name="organ" label="الهيكل">
                 <option value="المكتب التنفيذي">المكتب التنفيذي</option>
                 <option value="الجلسة العامة">الجلسة العامة</option>
                 <option value="اللجان المتخصصة">اللجان المتخصصة</option>
               </Select>
               <Input name="meetingDate" label="تاريخ الاجتماع" type="date" required />
               <Input name="location" label="مكان الاجتماع" required />
             </div>
             <Input name="subject" label="موضوع المداولة" required />
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>القرارات المتخذة</label>
               <textarea name="decisions" required rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
             </div>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>ملف المحضر (PDF/Image)</label>
               <input name="pvFile" type="file" accept=".pdf,image/*" style={{ padding: '0.5rem' }} />
             </div>
             <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', border: 'none' }}>حفظ المداولة</button>
           </form>

           <Table headers={['الهيكل', 'التاريخ', 'الموضوع', 'القرارات', 'الملف']}>
             {deliberationsList.map(d => (
               <tr key={d.id}>
                 <td>{d.organ}</td>
                 <td>{d.meetingDate}</td>
                 <td style={{ fontWeight: '600' }}>{d.subject}</td>
                 <td style={{ fontSize: '0.85rem' }}>{d.decisions.substring(0, 100)}...</td>
                 <td>
                   {d.fileUrl && (
                     <a href={d.fileUrl} target="_blank" style={{ color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                       <Download size={14} /> المحضر
                     </a>
                   )}
                 </td>
               </tr>
             ))}
           </Table>
        </div>
      </Section>

      {/* --- Register C: Projects --- */}
      <Section title="سجل النشاطات والمشاريع" icon={<Briefcase size={24} />}>
         <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <form action={createAdministrativeProject} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              <Input name="title" label="عنوان المشروع" required style={{ gridColumn: 'span 2' }} />
              <Input name="nature" label="طبيعة النشاط" required />
              <Input name="budget" label="الميزانية التقديرية (د.ت)" type="number" step="0.001" required />
              <Input name="fundingSource" label="مصدر التمويل" />
              <Input name="partners" label="الشركاء" />
              <Input name="startDate" label="تاريخ البدء" type="date" />
              <Input name="endDate" label="تاريخ الانتهاء المتوقع" type="date" />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ height: '48px', width: '100%', border: 'none' }}>إضافة مشروع</button>
              </div>
            </form>

            <Table headers={['المشروع', 'الطبيعة', 'الميزانية', 'التمويل', 'الشراكة']}>
              {projectsList.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '600' }}>{p.title}</td>
                  <td>{p.nature}</td>
                  <td>{p.budget?.toLocaleString()} د.ت</td>
                  <td>{p.fundingSource || '-'}</td>
                  <td>{p.partners || '-'}</td>
                </tr>
              ))}
            </Table>
         </div>
      </Section>

      {/* --- Register D: Donations --- */}
      <Section title="سجل المساعدات والهبات" icon={<Heart size={24} />}>
         <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <form action={createDonation} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              <Input name="donorName" label="هوية المانح" required style={{ gridColumn: 'span 2' }} />
              <Select name="nature" label="نوع الهبة">
                <option value="نقدي">نقدي (CASH)</option>
                <option value="عيني">عيني (SERVICE/STUFF)</option>
              </Select>
              <Select name="source" label="المصدر">
                <option value="خاص">خاص (PRIVATE)</option>
                <option value="عمومي">عمومي (PUBLIC)</option>
              </Select>
              <Select name="origin" label="الأصل">
                <option value="وطني">وطني (NATIONAL)</option>
                <option value="أجنبي">أجنبي (FOREIGN)</option>
              </Select>
              <Input name="amount" label="المبلغ (د.ت)" type="number" step="0.001" required />
              <Input name="dateReceived" label="تاريخ الاستلام" type="date" required />
              <Input name="purpose" label="الغرض من الهبة" />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ height: '48px', width: '100%', border: 'none' }}>تسجيل الهبة</button>
              </div>
            </form>

            <Table headers={['المانح', 'المبلغ', 'النوع', 'المصدر', 'الأصل', 'التاريخ']}>
              {donationsList.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: '600' }}>{d.donorName}</td>
                  <td style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}>{d.amount?.toLocaleString()} د.ت</td>
                  <td>{d.nature}</td>
                  <td>{d.source}</td>
                  <td>{d.origin}</td>
                  <td>{d.dateReceived}</td>
                </tr>
              ))}
            </Table>
         </div>
      </Section>
    </div>
  );
}

// Helper Components
function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--brand-yellow)', color: 'black', padding: '0.8rem', borderRadius: '12px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--brand-blue)' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({ label, style, ...props }: any) {
  return (
    <div style={style}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{label}</label>
      <input 
        {...props} 
        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} 
      />
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>{label}</label>
      <select 
        {...props} 
        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
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
          <tr style={{ borderBottom: '2px solid var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ fontSize: '0.95rem' }}>
          {children}
        </tbody>
      </table>
      <style>{`
        tbody tr { border-bottom: 1px solid var(--bg-secondary); transition: background 0.2s; }
        tbody tr:hover { background: #fafafa; }
        td { padding: 1.2rem 0.5rem; vertical-align: middle; }
      `}</style>
    </div>
  );
}
