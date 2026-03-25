"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signUp } from "@/app/actions/auth";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await signUp(formData);
      if (res.success) setMsg("إفتح بريدك لتأكيد حسابك (Vérifiez vos emails)");
    } catch (err: any) {
      setMsg(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup" style={{ maxWidth: '400px', margin: '2rem auto', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '15px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>انضم إلينا (Rejoignez-nous)</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" type="text" placeholder="الاسم الكامل" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
        <input name="email" type="email" placeholder="البريد الإلكتروني" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
        <input name="password" type="password" placeholder="كلمة المرور" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
        <button type="submit" disabled={loading} className="btn-primary" style={{ border: 'none' }}>
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </button>
      </form>

      <div style={{ margin: '1rem 0', textAlign: 'center', position: 'relative' }}>
        <span style={{ background: 'var(--bg-secondary)', padding: '0 1rem', position: 'relative', zIndex: 1 }}>أو عبر</span>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)' }}></div>
      </div>

      <button onClick={() => signIn("google")} style={{ width: '100%', padding: '0.8rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <img src="https://www.google.com/favicon.ico" width={16} height={16} />
        GMAIL (Google)
      </button>

      {msg && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--brand-green)', fontWeight: 'bold' }}>{msg}</p>}
    </div>
  );
}
