import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import Image from "next/image";
import "./globals.css";

// Use Noto Kufi Arabic for beautiful Arabic typography
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-noto-kufi'
});

export const metadata: Metadata = {
  title: "جمعية حلم البلالـمة | Blelma Dream Association",
  description: "نبض الريف التونسي. أصالة، صمود، وبناء. Empowering local farmers, celebrating vibrant heritage, and building sustainable futures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={notoKufi.className}>
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Image src="/logo.jpg" alt="Association Blelma Dream Logo" width={50} height={50} style={{ borderRadius: '50%' }} />
              <div className="brand-name">
                <span className="brand-ar">حلم البلالـمة</span>
                <span className="brand-en">Blelma Dream</span>
              </div>
            </div>
            <div className="nav-links">
              <a href="#about">اكتشف جذورنا</a>
              <a href="#projects">مشاريعنا</a>
              <a href="#store">المنتجات المحلية</a>
              <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">فيسبوك</a>
            </div>
            <div className="nav-actions">
              <button className="btn-primary">قف معنا</button>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">جمعية حلم البلالـمة</div>
            <p>التنمية الريفية التونسية الأصيلة.</p>
            <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">تابعنا على فيسبوك</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
