import { prisma } from '@/lib/prisma'
import { ShoppingCart, TrendingUp, HandCoins, Wallet, Clock, User, Users } from 'lucide-react'

type UnifiedTransaction = {
  id: string
  type: 'sale' | 'purchase' | 'payment' | 'collection'
  title: string
  party: string
  amount: number
  date: Date
  details: string
  color: string
}

export default async function TransactionsPage() {
  const [purchases, sales, supplierPayments, customerPayments] = await Promise.all([
    prisma.supplierInvoice.findMany({ include: { supplier: true, category: true }, orderBy: { date: 'desc' }, take: 50 }),
    prisma.saleInvoice.findMany({ include: { customer: true, items: { include: { category: true } } }, orderBy: { date: 'desc' }, take: 50 }),
    prisma.supplierPayment.findMany({ include: { supplier: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.customerPayment.findMany({ include: { customer: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ])

  // Map to unified format
  const unified: UnifiedTransaction[] = [
    ...purchases.map(p => ({
      id: `p-${p.id}`,
      type: 'purchase' as const,
      title: 'شراء بضاعة (وارد)',
      party: p.supplier.name,
      amount: p.totalAmount,
      date: p.date,
      details: `${p.bales} بالة - ${p.category.name} (${p.kg} ك)`,
      color: 'bg-orange-500',
    })),
    ...sales.map(s => ({
      id: `s-${s.id}`,
      type: 'sale' as const,
      title: 'بيع بضاعة (صادر)',
      party: s.customer.name,
      amount: s.totalAmount,
      date: s.date,
      details: `${s.items.length} أصناف (${s.items.reduce((acc, i) => acc + i.bales, 0)} بالة)`,
      color: 'bg-emerald-500',
    })),
    ...supplierPayments.map(sp => ({
      id: `sp-${sp.id}`,
      type: 'payment' as const,
      title: 'دفع للمورد (صادر مالي)',
      party: sp.supplier.name,
      amount: sp.amount,
      date: sp.createdAt,
      details: 'تسديد مالي كاش',
      color: 'bg-red-500',
    })),
    ...customerPayments.map(cp => ({
      id: `cp-${cp.id}`,
      type: 'collection' as const,
      title: 'تحصيل من عميل (وارد مالي)',
      party: cp.customer.name,
      amount: cp.amount,
      date: cp.createdAt,
      details: 'تحصيل مبلغ كاش',
      color: 'bg-green-500',
    })),
  ]

  // Sort by date descending
  unified.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-600" />
          سجل المعاملات اليومية
        </h2>
        <p className="text-slate-500 mt-2">متابعة كافة حركات المخزن والحسابات بالتفصيل والوقت</p>
      </div>

      <div className="relative space-y-4">
        {/* Vertical Line */}
        <div className="absolute right-[23px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        {unified.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400">لا توجد معاملات مسجلة حتى الآن</p>
          </div>
        ) : (
          unified.map((t, idx) => (
            <div key={t.id} className="relative flex flex-col md:flex-row gap-6 group">
              {/* Icon / Dot */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center p-2.5 z-10 shadow-lg transition-transform group-hover:scale-110
                ${t.color} text-white
              `}>
                {t.type === 'sale' && <TrendingUp className="w-full h-full" />}
                {t.type === 'purchase' && <ShoppingCart className="w-full h-full" />}
                {t.type === 'payment' && <Wallet className="w-full h-full" />}
                {t.type === 'collection' && <HandCoins className="w-full h-full" />}
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${t.color} text-white`}>
                        {t.type === 'sale' ? 'مبيعات' : t.type === 'purchase' ? 'مشتريات' : t.type === 'payment' ? 'سداد' : 'تحصيل'}
                       </span>
                       <span className="text-slate-400 text-xs font-mono">
                         {t.date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} — {t.date.toLocaleDateString('ar-EG')}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.title}</h3>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                       <User className="w-4 h-4" />
                       <span className="font-semibold">{t.party}</span>
                       <span className="text-slate-300 dark:text-slate-600">|</span>
                       <span>{t.details}</span>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className={`text-2xl font-black ${t.type === 'sale' || t.type === 'collection' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.type === 'sale' || t.type === 'collection' ? '+' : '-'} {t.amount.toLocaleString()} 
                      <span className="text-xs font-normal mr-1 text-slate-400">ج.م</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
