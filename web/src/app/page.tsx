import { HardHat, Leaf, Code, Globe2, Sparkles, Heart } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-content">
          <span className="hero-subtitle">معاً نصنع الفارق</span>
          <h1>نبض الريف التونسي.<br />أصالة، صمود، وبناء.</h1>
          <p>
            تجمع <strong>جمعية حلم البلالـمة</strong> بين التراث والأصالة والتنمية المُستدامة. نحن نُمكن الفلاحين، ونضع الشباب في مسار مشرق ونحفظ الذاكرة الريفية التونسية.
          </p>
          <div className="hero-actions">
            <a href="#about" className="btn-primary">
              اكتشف جذورنا
            </a>
            <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* IMPACT / STATS */}
      <section className="section bg-blue-tint">
        <div className="nav-container" style={{ textAlign: "center" }}>
          <h2>تأثيرنا يصنع الأمل</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto", opacity: 0.9 }}>
            بفضل جهود أبناء المنطقة والدعم المتواصل، نجحنا في تحقيق أثر ملموس على أرض الواقع.
          </p>
          
          <div className="grid">
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Heart size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>100+ عائلة</h3>
              <p>استفادت بشكل مباشر من برامجنا التضامنية والفلاحية.</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Sparkles size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>مهرجان ثقافي</h3>
              <p>يحيي العادات الزاخرة ويعرف بفروسية وتقاليد المنطقة.</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Globe2 size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>آفاق المستقبل</h3>
              <p>شراكات متنامية لوضع المنطقة على مسار السياحة التضامنية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section id="projects" className="section">
        <h2>مجالات عملنا</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
          نحن لا نقدم مجرد وعود، بل نزرع أفعالاً تثمر تنمية حقيقية للمنطقة وأهلها.
        </p>

        <div className="grid">
          <div className="card">
            <div className="card-icon">
              <Leaf size={40} color="var(--brand-green)" />
            </div>
            <h3>الزراعة والتنمية الريفية</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              مساعدة صغار الفلاحين للوصول إلى تقنيات حديثة وطرق مستدامة لعصر الزيتون وجني العسل ودعم المنتجات المحلية الأصيلة.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <HardHat size={40} color="var(--brand-blue)" />
            </div>
            <h3>دعم الشباب والمستقبل</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              توفير فرص تكوينية وإدماج الشباب في الحياة الثقافية والاقتصادية للمنطقة لمنع النزوح وبناء اقتصاد مرن.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">
              <Code size={40} color="var(--brand-yellow)" />
            </div>
            <h3>الثقافة والتراث</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              إحياء العادات والتقاليد عبر فعاليات موسمية ومهرجانات تحتفي بالفروسية، اللباس التقليدي والطبخ المحلي.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
