import { db } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Package, User, Phone, MapPin, Mail, Calendar } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function updateOrderStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage() {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  
  return (
    <div dir="rtl">
      <h1 style={{ color: 'var(--brand-blue)', marginBottom: '1.5rem', fontSize: '2rem' }}>إدارة الطلبات (Orders)</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {allOrders.map(async (order) => {
          const items = await db.select({
            quantity: orderItems.quantity,
            price: orderItems.priceAtTime,
            nameAr: products.nameAr,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

          return (
            <div key={order.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>معرف الطلب:</span>
                  <p style={{ fontWeight: 'bold', margin: '0.2rem 0' }}>#{order.id.slice(0, 8)}</p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}><Calendar size={12} /> {order.createdAt?.toLocaleString()}</p>
                </div>
                <div>
                  <form action={updateOrderStatus} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f9f9f9', outline: 'none' }}>
                      <option value="pending">قيد الانتظار (Pending)</option>
                      <option value="processing">قيد المعالجة (Processing)</option>
                      <option value="shipped">تم الشحن (Shipped)</option>
                      <option value="delivered">تم التوصيل (Delivered)</option>
                      <option value="cancelled">ملغى (Cancelled)</option>
                    </select>
                    <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>تحديث الحالة</button>
                  </form>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Customer Info */}
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--brand-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> معلومات الزبون</h3>
                  <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><strong>{order.customerName}</strong></p>
                  <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {order.customerEmail}</p>
                  <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {order.customerPhone}</p>
                  <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}><MapPin size={14} style={{ flexShrink: 0 }} /> {order.shippingAddress}</p>
                </div>

                {/* Items and Payment */}
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--brand-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Package size={18} /> المنتجات والمستحقات</h3>
                  <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '1rem', background: '#fafafa' }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <span>{item.nameAr} x {item.quantity}</span>
                        <span>{(item.price * item.quantity / 1000).toFixed(3)} DT</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #ddd', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>المجموع الإجمالي:</span>
                      <span style={{ color: 'var(--brand-blue)' }}>{(order.totalAmount / 1000).toFixed(3)} DT</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                    <p style={{ margin: '0.2rem 0' }}><strong>طريقة الدفع:</strong> {order.paymentMethod === 'stripe' ? 'بطاقة بنكية (Stripe)' : 'عند الاستلام (COD)'}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>حالة الدفع:</strong> <span style={{ color: order.paymentStatus === 'completed' ? 'green' : 'orange', fontWeight: 'bold' }}>{order.paymentStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
