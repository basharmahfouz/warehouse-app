'use client'

import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addSupplierInvoice, addSupplierPayment } from './actions'

type Supplier = any // For simplicity, using any or define properly
type Category = { id: number; name: string; pricePerKg: number }

export default function SupplierDetailClient({ supplier, categories, stats }: { supplier: Supplier, categories: Category[], stats: any }) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices')
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handleInvoice = async (formData: FormData) => {
    await addSupplierInvoice(supplier.id, formData)
    setIsInvoiceModalOpen(false)
    window.location.reload()
  }

  const handlePayment = async (formData: FormData) => {
    await addSupplierPayment(supplier.id, formData)
    setIsPaymentModalOpen(false)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/suppliers" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-bold">ملف التاجر: {supplier.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">إجمالي البضاعة الواردة</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.totalPurchases.toLocaleString()} ج.م</p></CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">ما تم سداده</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-700">{stats.totalPaid.toLocaleString()} ج.م</p></CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">الباقي (المتأخرات)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-700">{stats.remainingDebt.toLocaleString()} ج.م</p></CardContent>
        </Card>
      </div>

      <div className="flex gap-4 border-b dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium ${activeTab === 'invoices' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          فواتير البضاعة
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 font-medium ${activeTab === 'payments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          المدفوعات
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsInvoiceModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2">
              <Plus className="w-5 h-5"/> إضافة بضاعة واردة
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                  <tr>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الصنف</th>
                    <th className="p-4">الكمية (بالة / ك)</th>
                    <th className="p-4">سعر الشراء</th>
                    <th className="p-4">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {supplier.invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">{new Date(inv.date).toLocaleDateString('ar-EG')}</td>
                      <td className="p-4 font-medium">{inv.category.name}</td>
                      <td className="p-4">{inv.bales} بالة ({inv.kg} ك)</td>
                      <td className="p-4">{inv.pricePerKg} ج.م</td>
                      <td className="p-4 font-bold text-red-600">{inv.totalAmount.toLocaleString()} ج.م</td>
                    </tr>
                  ))}
                  {supplier.invoices.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">لا توجد فواتير مسجلة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsPaymentModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2">
              <Plus className="w-5 h-5"/> تسجيل دفعة مالية
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                  <tr>
                    <th className="p-4">تاريخ الإنشاء</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">موعد السداد</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {supplier.payments.map((pay: any) => (
                    <tr key={pay.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">{new Date(pay.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="p-4 font-bold text-green-600">{pay.amount.toLocaleString()} ج.م</td>
                      <td className="p-4">{pay.dueDate ? new Date(pay.dueDate).toLocaleDateString('ar-EG') : 'بدون موعد'}</td>
                      <td className="p-4">
                        {pay.isPaid ? (
                           <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">تم الدفع</span>
                        ) : (
                           <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">معلقة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {supplier.payments.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">لا توجد مدفوعات مسجلة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">توريد بضاعة جديدة</h3>
            <form action={handleInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الصنف</label>
                <select name="categoryId" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700">
                  <option value="">اختر الصنف...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عدد البالات</label>
                  <input name="bales" type="number" required min="1" className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الوزن بالكيلو</label>
                  <input name="kg" type="number" step="0.1" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">سعر الشراء (للكيلو بـ ج.م)</label>
                <input name="pricePerKg" type="number" step="0.01" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">إضافة الفاتورة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">تسجيل دفعة جديدة</h3>
            <form action={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">المبلغ (ج.م)</label>
                <input name="amount" type="number" step="0.01" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">موعد السداد (اختياري)</label>
                <input name="dueDate" type="date" className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div className="flex items-center gap-2">
                <input name="isPaid" id="isPaid" type="checkbox" className="w-4 h-4" defaultChecked />
                <label htmlFor="isPaid" className="text-sm font-medium">تم الدفع نقداً الآن؟</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">تأكيد</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
