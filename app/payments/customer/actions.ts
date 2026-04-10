'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function recordCustomerCollection(formData: FormData) {
  const customerId = Number(formData.get('customerId'))
  const amount = Number(formData.get('amount'))
  const note = formData.get('note') as string

  if (!customerId || !amount) {
    return { error: 'برجاء اختيار العميل وتحديد المبلغ' }
  }

  try {
    await prisma.customerPayment.create({
      data: {
        customerId,
        amount,
        isPaid: true,
        paidDate: new Date(),
        dueDate: new Date(),
      }
    })

    revalidatePath('/')
    revalidatePath('/customers')
    revalidatePath(`/customers/${customerId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Customer Collection Error:', error)
    return { error: 'حدث خطأ أثناء تسجيل المحصل' }
  }
}
