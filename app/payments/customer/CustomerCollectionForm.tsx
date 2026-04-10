'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { recordCustomerCollection } from './actions'

export default function CustomerCollectionForm({ customers }: { customers: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const currentCustomer = customers.find(c => c.id.toString() === selectedCustomerId)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await recordCustomerCollection(formData)
    setLoading(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'تم تسجيل التحصيل بنجاح!' })
      router.push('/customers')
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
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">اختر العميل</label>
        <select 
          name="customerId" 
          required 
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-green-500 transition"
        >
          <option value="">اختر العميل من القائمة...</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} (مديونية: {c.debt.toLocaleString()} ج.م)</option>
          ))}
        </select>
        {currentCustomer && (
          <p className="mt-2 text-sm font-bold text-green-600">
            المديونية الحالية على العميل: {currentCustomer.debt.toLocaleString()} جنيه مصري
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">المبلغ المحصل (ج.م)</label>
        <input 
          name="amount" 
          type="number" 
          step="0.01" 
          required 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-green-500 transition text-2xl font-bold border-green-200"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">ملاحظات (اختياري)</label>
        <textarea 
          name="note" 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-green-500 transition"
          rows={3}
          placeholder="أي تفاصيل تخص عملية التحصيل..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-xl"
      >
        {loading ? 'جاري الحفظ...' : 'تأكيد عملية التحصيل'}
      </button>
    </form>
  )
}
