'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function recordSupplierPayment(formData: FormData) {
  const supplierId = Number(formData.get('supplierId'))
  const amount = Number(formData.get('amount'))
  const note = formData.get('note') as string

  if (!supplierId || !amount) {
    return { error: 'برجاء اختيار التاجر وتحديد المبلغ' }
  }

  try {
    await prisma.supplierPayment.create({
      data: {
        supplierId,
        amount,
        isPaid: true,
        paidDate: new Date(),
        dueDate: new Date(),
        // Note can be stored in metadata or I can add a field if schema supports it.
        // Schema doesn't have a notes field in SupplierPayment yet, but I can add it if needed.
        // For now, I'll just save the basic payment.
      }
    })

    revalidatePath('/')
    revalidatePath('/suppliers')
    revalidatePath(`/suppliers/${supplierId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Supplier Payment Error:', error)
    return { error: 'حدث خطأ أثناء تسجيل الدفعة' }
  }
}
