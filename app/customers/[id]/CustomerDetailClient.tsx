'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addCustomerSale, addCustomerPayment } from './actions'

type Category = { id: number; name: string; pricePerKg: number }

export default function CustomerDetailClient({
  customer,
  categories,
  stats,
}: {
  customer: any
  categories: Category[]
  stats: { totalSales: number; totalPaid: number; remainingDebt: number }
}) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices')
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const handleSale = async (formData: FormData) => {
    await addCustomerSale(customer.id, formData)
    setIsSaleModalOpen(false)
    window.location.reload()
  }

  const handlePayment = async (formData: FormData) => {
    await addCustomerPayment(customer.id, formData)
    setIsPaymentModalOpen(false)
    window.location.reload()
  }

  const exportPDF = async (invoice: any) => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // Header
    doc.setFontSize(20)
    doc.text('فاتورة بيع', 105, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.text(`رقم الفاتورة: #${invoice.id}`, 190, 40, { align: 'right' })
    doc.text(`التاريخ: ${new Date(invoice.date).toLocaleDateString('ar-EG')}`, 190, 48, { align: 'right' })
    doc.text(`العميل: ${customer.name}`, 190, 56, { align: 'right' })
    doc.text(`التليفون: ${customer.phone || '-'}`, 190, 64, { align: 'right' })

    // Table
    const tableData = invoice.items.map((item: any) => [
      item.category.name,
      `${item.bales}`,
      `${item.kg}`,
      `${item.pricePerKgAtSale} ج.م`,
      `${item.totalAmount.toLocaleString()} ج.م`,
    ])

    autoTable(doc, {
      head: [['الصنف', 'البالات', 'الكيلو', 'سعر الكيلو', 'الإجمالي']],
      body: tableData,
      startY: 75,
      styles: { halign: 'right', font: 'helvetica' },
      headStyles: { fillColor: [41, 128, 185] },
    })

    const finalY = (doc as any).lastAutoTable.finalY || 100
    doc.setFontSize(14)
    doc.text(`إجمالي الفاتورة: ${invoice.totalAmount.toLocaleString()} ج.م`, 190, finalY + 15, { align: 'right' })

    doc.save(`فاتورة-${customer.name}-${invoice.id}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h2 className="text-3xl font-bold">ملف العميل: {customer.name}</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">إجمالي المبيعات</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.totalSales.toLocaleString()} ج.م</p></CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">ما تم تحصيله</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-700">{stats.totalPaid.toLocaleString()} ج.م</p></CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">المديونية المتبقية</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-orange-700">{stats.remainingDebt.toLocaleString()} ج.م</p></CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium ${activeTab === 'invoices' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
        >
          الفواتير
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 font-medium ${activeTab === 'payments' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
        >
          المدفوعات
        </button>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsSaleModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center">
              <Plus className="w-5 h-5" /> إضافة فاتورة بيع
            </button>
          </div>
          <div className="space-y-4">
            {customer.invoices.map((inv: any) => (
              <div key={inv.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                  <div>
                    <span className="font-bold text-lg">فاتورة #{inv.id}</span>
                    <span className="text-gray-500 text-sm mr-3">{new Date(inv.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600 text-lg">{inv.totalAmount.toLocaleString()} ج.م</span>
                    <button
                      onClick={() => exportPDF(inv)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm border border-blue-300 px-2 py-1 rounded"
                    >
                      <FileText className="w-4 h-4" /> PDF
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="p-3">الصنف</th>
                        <th className="p-3">البالات</th>
                        <th className="p-3">الكيلو</th>
                        <th className="p-3">سعر الكيلو (وقت البيع)</th>
                        <th className="p-3">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv.items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-3 font-medium">{item.category.name}</td>
                          <td className="p-3">{item.bales}</td>
                          <td className="p-3">{item.kg}</td>
                          <td className="p-3">{item.pricePerKgAtSale} ج.م</td>
                          <td className="p-3 font-bold text-green-600">{item.totalAmount.toLocaleString()} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {customer.invoices.length === 0 && (
              <div className="py-10 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                لا توجد فواتير مسجلة
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setIsPaymentModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center">
              <Plus className="w-5 h-5" /> تسجيل دفعة
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                  <tr>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">موعد السداد</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.payments.map((pay: any) => (
                    <tr key={pay.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-4">{new Date(pay.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="p-4 font-bold text-green-600">{pay.amount.toLocaleString()} ج.م</td>
                      <td className="p-4">{pay.dueDate ? new Date(pay.dueDate).toLocaleDateString('ar-EG') : 'بدون موعد'}</td>
                      <td className="p-4">
                        {pay.isPaid ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">تم التحصيل</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">معلقة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {customer.payments.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">لا توجد مدفوعات</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">إضافة فاتورة بيع جديدة</h3>
            <form action={handleSale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الصنف</label>
                <select name="categoryId" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700">
                  <option value="">اختر الصنف...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — السعر الحالي: {c.pricePerKg} ج.م/ك</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عدد البالات</label>
                  <input name="bales" type="number" min="1" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الوزن بالكيلو</label>
                  <input name="kg" type="number" step="0.1" required className="w-full border rounded-lg p-2 dark:bg-gray-900 dark:border-gray-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                ⚠️ سعر البيع سيُثبَّت تلقائياً بالسعر الحالي للصنف وقت تسجيل الفاتورة
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsSaleModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">إنشاء الفاتورة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">تسجيل دفعة من العميل</h3>
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
                <input name="isPaid" id="isPaidCustomer" type="checkbox" className="w-4 h-4" defaultChecked />
                <label htmlFor="isPaidCustomer" className="text-sm font-medium">وصل الدفع فعلاً؟</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-700">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">تأكيد</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
