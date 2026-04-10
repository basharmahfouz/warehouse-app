'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { recordSupplierPayment } from './actions'

export default function SupplierPaymentForm({ suppliers }: { suppliers: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const currentSupplier = suppliers.find(s => s.id.toString() === selectedSupplierId)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await recordSupplierPayment(formData)
    setLoading(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'تم تسجيل الدفعة بنجاح!' })
      router.push('/suppliers')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">اختر التاجر</label>
        <select 
          name="supplierId" 
          required 
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-500 transition"
        >
          <option value="">اختر التاجر من القائمة...</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name} (مديونية: {s.debt.toLocaleString()} ج.م)</option>
          ))}
        </select>
        {currentSupplier && (
          <p className="mt-2 text-sm font-bold text-red-600 animate-pulse">
            المديونية الحالية: {currentSupplier.debt.toLocaleString()} جنيه مصري
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">المبلغ المراد دفعه (ج.م)</label>
        <input 
          name="amount" 
          type="number" 
          step="0.01" 
          required 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-500 transition text-2xl font-bold"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">ملاحظات (اختياري)</label>
        <textarea 
          name="note" 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-red-500 transition"
          rows={3}
          placeholder="أي تفاصيل تخص الدفعة..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-xl"
      >
        {loading ? 'جاري الحفظ...' : 'تأكيد عملية الدفع'}
      </button>
    </form>
  )
}
