'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addSale } from './actions'

export default function SalesForm({ customers, categories }: { customers: any[], categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCatId, setSelectedCatId] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const currentCategory = categories.find(c => c.id.toString() === selectedCatId)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await addSale(formData)
    setLoading(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'تم تسجيل عملية البيع بنجاح!' })
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">العميل</label>
          <select 
            name="customerId" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">اختر العميل...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">الصنف</label>
          <select 
            name="categoryId" 
            required 
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">اختر الصنف من المخزن...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {currentCategory && (
            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-xs space-y-1">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">سعر البيع: {currentCategory.pricePerKg} ج.م / ك</p>
              <p className="text-slate-600 dark:text-slate-400">المتاح بالمخزن: <span className="font-bold text-slate-900 dark:text-slate-100">{currentCategory.availableBales} بالة</span> و <span className="font-bold text-slate-900 dark:text-slate-100">{currentCategory.availableKg} كيلو</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">عدد البالات المطلوبة</label>
          <input 
            name="bales" 
            type="number" 
            required 
            min="1" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">الوزن الإجمالي المطلوب (كيلو)</label>
          <input 
            name="kg" 
            type="number" 
            step="0.1" 
            required 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">المبلغ المحصل (كاش)</label>
        <input 
          name="receivedAmount" 
          type="number" 
          step="0.01" 
          defaultValue="0"
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 transition border-emerald-300"
          placeholder="المبلغ الذي استلمته من الزبون فوراً"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        {loading ? 'جاري الحفظ...' : 'تأكيد عملية البيع'}
      </button>
    </form>
  )
}
