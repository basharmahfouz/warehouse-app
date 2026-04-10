'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addPurchase } from './actions'

export default function PurchaseForm({ suppliers, categories }: { suppliers: any[], categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await addPurchase(formData)
    setLoading(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'تم تسجيل الشراء بنجاح!' })
      router.push('/inventory')
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">التاجر (المورد)</label>
          <select 
            name="supplierId" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition"
          >
            <option value="">اختر التاجر...</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">الصنف</label>
          <select 
            name="categoryId" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition"
          >
            <option value="">اختر الصنف...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">عدد البالات</label>
          <input 
            name="bales" 
            type="number" 
            required 
            min="1" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">الوزن الإجمالي (كيلو)</label>
          <input 
            name="kg" 
            type="number" 
            step="0.1" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">سعر الشراء (للكيلو بـ ج.م)</label>
          <input 
            name="pricePerKg" 
            type="number" 
            step="0.01" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition"
            placeholder="السعر الذي اشتريت به"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">المبلغ المدفوع (كاش)</label>
          <input 
            name="paidAmount" 
            type="number" 
            step="0.01" 
            defaultValue="0"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 transition border-orange-300"
            placeholder="المبلغ الذي دفعته حالياً"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        {loading ? 'جاري الحفظ...' : 'تأكيد عملية الشراء'}
      </button>
    </form>
  )
}
