import { prisma } from '@/lib/prisma'
import { Package, Truck, Users, AlertCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Dashboard() {
  const supplierInvoices = await prisma.supplierInvoice.aggregate({ _sum: { bales: true, kg: true } })
  const saleInvoices = await prisma.saleInvoiceItem.aggregate({ _sum: { bales: true, kg: true } })
  const totalBales = (supplierInvoices._sum.bales || 0) - (saleInvoices._sum.bales || 0)
  const totalKg = (supplierInvoices._sum.kg || 0) - (saleInvoices._sum.kg || 0)

  const supplierPurchases = await prisma.supplierInvoice.aggregate({ _sum: { totalAmount: true } })
  const supplierPaid = await prisma.supplierPayment.aggregate({ _sum: { amount: true } })
  const supplierDebt = (supplierPurchases._sum.totalAmount || 0) - (supplierPaid._sum.amount || 0)

  const customerSales = await prisma.saleInvoice.aggregate({ _sum: { totalAmount: true } })
  const customerPaidAgg = await prisma.customerPayment.aggregate({ _sum: { amount: true } })
  const customerDebt = (customerSales._sum.totalAmount || 0) - (customerPaidAgg._sum.amount || 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const today = new Date()

  const pendingSupplierPayments = await prisma.supplierPayment.findMany({
    where: { isPaid: false, dueDate: { lte: nextWeek, gte: today } },
    include: { supplier: true }
  })

  const pendingCustomerPayments = await prisma.customerPayment.findMany({
    where: { isPaid: false, dueDate: { lte: nextWeek, gte: today } },
    include: { customer: true }
  })

  const totalSuppliers = await prisma.supplier.count()
  const totalCustomers = await prisma.customer.count()
  const totalCategories = await prisma.category.count()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">لوحة التحكم</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">نظرة عامة على المخزن والحسابات</p>
      </div>

      {/* Quick counts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'أصناف', value: totalCategories, color: 'bg-violet-500' },
          { label: 'تجار', value: totalSuppliers, color: 'bg-red-500' },
          { label: 'عملاء', value: totalCustomers, color: 'bg-green-500' },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border dark:border-slate-700 flex items-center gap-3 shadow-sm">
            <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-2 w-32 h-32 bg-white/5 rounded-full"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium opacity-90">إجمالي المخزن المتاح</CardTitle>
            <Package className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{totalBales} بالة</div>
            <p className="text-sm opacity-80 mt-1">≈ {totalKg.toLocaleString()} كيلو</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-red-500 to-red-700 text-white">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-2 w-32 h-32 bg-white/5 rounded-full"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium opacity-90">ديون للتجار</CardTitle>
            <Truck className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{supplierDebt.toLocaleString()}</div>
            <p className="text-sm opacity-80 mt-1">جنيه مصري</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-700 text-white">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-2 w-32 h-32 bg-white/5 rounded-full"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium opacity-90">ديون على العملاء</CardTitle>
            <Users className="w-5 h-5 opacity-80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{customerDebt.toLocaleString()}</div>
            <p className="text-sm opacity-80 mt-1">جنيه مصري</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          تنبيهات السداد (الأيام الـ 7 القادمة)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border dark:border-slate-700 shadow-sm">
            <CardHeader className="border-b dark:border-slate-700 bg-red-50 dark:bg-red-900/10 rounded-t-xl">
              <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                <Truck className="w-4 h-4" /> مستحقات للتجار
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {pendingSupplierPayments.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">لا توجد مدفوعات مستحقة قريباً ✓</p>
              ) : (
                <ul className="space-y-3">
                  {pendingSupplierPayments.map(p => (
                    <li key={p.id} className="flex justify-between items-center border-b dark:border-slate-700 pb-2">
                      <span className="font-medium">{p.supplier.name}</span>
                      <div className="text-left">
                        <span className="block font-bold text-red-600">{p.amount.toLocaleString()} ج.م</span>
                        <span className="text-xs text-slate-500">{p.dueDate?.toLocaleDateString('ar-EG')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border dark:border-slate-700 shadow-sm">
            <CardHeader className="border-b dark:border-slate-700 bg-green-50 dark:bg-green-900/10 rounded-t-xl">
              <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                <Users className="w-4 h-4" /> مستحقات من العملاء
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {pendingCustomerPayments.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">لا توجد تحصيلات مستحقة قريباً ✓</p>
              ) : (
                <ul className="space-y-3">
                  {pendingCustomerPayments.map(p => (
                    <li key={p.id} className="flex justify-between items-center border-b dark:border-slate-700 pb-2">
                      <span className="font-medium">{p.customer.name}</span>
                      <div className="text-left">
                        <span className="block font-bold text-green-600">{p.amount.toLocaleString()} ج.م</span>
                        <span className="text-xs text-slate-500">{p.dueDate?.toLocaleDateString('ar-EG')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
