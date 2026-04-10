'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addSale(formData: FormData) {
  const customerId = Number(formData.get('customerId'))
  const categoryId = Number(formData.get('categoryId'))
  const bales = Number(formData.get('bales'))
  const kg = Number(formData.get('kg'))

  const receivedAmount = Number(formData.get('receivedAmount')) || 0

  if (!customerId || !categoryId || !bales || !kg) {
    return { error: 'برجاء ملء جميع الحقول بشكل صحيح' }
  }

  try {
    // 1. حساب المخزون الحالي للتأكد من التوفر
    const supplierSum = await prisma.supplierInvoice.aggregate({
      where: { categoryId },
      _sum: { bales: true, kg: true }
    })
    
    const salesSum = await prisma.saleInvoiceItem.aggregate({
      where: { categoryId },
      _sum: { bales: true, kg: true }
    })

    const currentBales = (supplierSum._sum.bales || 0) - (salesSum._sum.bales || 0)
    const currentKg = (supplierSum._sum.kg || 0) - (salesSum._sum.kg || 0)

    if (bales > currentBales || kg > currentKg) {
      return { 
        error: `الكمية غير متوفرة! المتاح: ${currentBales} بالة و ${currentKg} كيلو فقط.` 
      }
    }

    // 2. جلب الصنف لمعرفة السعر الحالي
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) return { error: 'الصنف غير موجود في النظام' }

    const pricePerKgAtSale = category.pricePerKg
    const totalAmount = kg * pricePerKgAtSale

    // 3. تنفيذ العملية المالية والمخزنية في Transaction
    await prisma.$transaction(async (tx) => {
      // أ. إنشاء الفاتورة
      const invoice = await tx.saleInvoice.create({
        data: {
          customerId,
          totalAmount,
          items: {
            create: [
              {
                categoryId,
                bales,
                kg,
                pricePerKgAtSale,
                totalAmount,
              }
            ]
          }
        }
      })

      // ب. إذا كان هناك مبلغ محصل، نسجله
      if (receivedAmount > 0) {
        await tx.customerPayment.create({
          data: {
            customerId,
            amount: receivedAmount,
            isPaid: true,
            paidDate: new Date(),
            dueDate: new Date(),
          }
        })
      }
    })

    revalidatePath('/')
    revalidatePath('/inventory')
    revalidatePath('/customers')
    revalidatePath(`/customers/${customerId}`)

    return { success: true }
  } catch (error) {
    console.error('Sale Error:', error)
    return { error: 'حدث خطأ أثناء تسجيل عملية البيع' }
  }
}
