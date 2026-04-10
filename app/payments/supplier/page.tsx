import { prisma } from '@/lib/prisma'
import { Wallet } from 'lucide-react'
import SupplierPaymentForm from './SupplierPaymentForm'

export default async function SupplierPaymentsPage() {
  const suppliers = await prisma.supplier.findMany({ 
    orderBy: { name: 'asc' },
    include: {
      invoices: true,
      payments: true
    }
  })

  // Calculate current debt for each supplier to help the user
  const suppliersWithDebt = suppliers.map(s => {
    const totalInvoices = s.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
    const totalPaid = s.payments.reduce((acc, pay) => acc + pay.amount, 0)
    return {
      id: s.id,
      name: s.name,
      debt: totalInvoices - totalPaid
    }
  })

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
          <Wallet className="w-7 h-7 text-red-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">تسديد مبالغ للموردين</h2>
          <p className="text-slate-500">تسجيل دفع مبالغ مالية للموردين لتسوية مديونيات قديمة</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border dark:border-slate-700">
        <SupplierPaymentForm suppliers={suppliersWithDebt} />
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          📍 ملاحظة: هذا الإجراء لتسجيل الدفعات المالية فقط، ولا يؤثر على كميات البضاعة في المخزن.
        </p>
      </div>
    </div>
  )
}
