'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addPurchase(formData: FormData) {
  const supplierId = Number(formData.get('supplierId'))
  const categoryId = Number(formData.get('categoryId'))
  const bales = Number(formData.get('bales'))
  const kg = Number(formData.get('kg'))
  const pricePerKg = Number(formData.get('pricePerKg'))

  const paidAmount = Number(formData.get('paidAmount')) || 0

  if (!supplierId || !categoryId || !bales || !kg || !pricePerKg) {
    return { error: 'برجاء ملء جميع الحقول بشكل صحيح' }
  }

  const totalAmount = kg * pricePerKg

  try {
    await prisma.$transaction(async (tx) => {
      // 1. إنشاء الفاتورة
      await tx.supplierInvoice.create({
        data: {
          supplierId,
          categoryId,
          bales,
          kg,
          pricePerKg,
          totalAmount,
        }
      })

      // 2. إذا كان هناك مبلغ مدفوع، نسجله
      if (paidAmount > 0) {
        await tx.supplierPayment.create({
          data: {
            supplierId,
            amount: paidAmount,
            isPaid: true,
            paidDate: new Date(),
            dueDate: new Date(), // بما أنه مدفوع فوراً
          }
        })
      }
    })

    revalidatePath('/')
    revalidatePath('/inventory')
    revalidatePath('/suppliers')
    revalidatePath(`/suppliers/${supplierId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Purchase Error:', error)
    return { error: 'حدث خطأ أثناء تسجيل العملية' }
  }
}
