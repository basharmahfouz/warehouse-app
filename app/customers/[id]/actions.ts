'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addCustomerSale(customerId: number, formData: FormData) {
  const categoryId = Number(formData.get('categoryId'))
  const bales = Number(formData.get('bales'))
  const kg = Number(formData.get('kg'))

  if (!categoryId || !bales || !kg) return { error: 'بيانات غير مكتملة' }

  // Get current price of the category to lock it
  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) return { error: 'الصنف غير موجود' }

  const pricePerKgAtSale = category.pricePerKg
  const totalAmount = kg * pricePerKgAtSale

  // Create an invoice with one item for simplicity
  await prisma.saleInvoice.create({
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

  revalidatePath(`/customers/${customerId}`)
  return { success: true }
}

export async function addCustomerPayment(customerId: number, formData: FormData) {
  const amount = Number(formData.get('amount'))
  const dueDateStr = formData.get('dueDate') as string
  const isPaid = formData.get('isPaid') === 'on'

  if (!amount) return { error: 'المبلغ مطلوب' }

  const dueDate = dueDateStr ? new Date(dueDateStr) : null

  await prisma.customerPayment.create({
    data: {
      customerId,
      amount,
      dueDate,
      isPaid,
      paidDate: isPaid ? new Date() : null
    }
  })

  revalidatePath(`/customers/${customerId}`)
  return { success: true }
}
