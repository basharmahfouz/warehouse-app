import { prisma } from '@/lib/prisma'
import { ShoppingCart } from 'lucide-react'
import PurchaseForm from './PurchaseForm'

export default async function PurchasesPage() {
  const [suppliers, categories] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">شراء بضاعة جديدة</h2>
          <p className="text-slate-500">تسجيل بضاعة واردة من الموردين وتحديث المخزن</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border dark:border-slate-700">
        <PurchaseForm suppliers={suppliers} categories={categories} />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 ملحوظة: سجل شراء البضاعة سيظهر في صفحة التاجر المختارة وسيتم زيادة الكميات في المخزن تلقائياً.
        </p>
      </div>
    </div>
  )
}
