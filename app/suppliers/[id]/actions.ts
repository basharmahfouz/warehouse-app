'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addSupplierInvoice(supplierId: number, formData: FormData) {
  const categoryId = Number(formData.get('categoryId'))
  const bales = Number(formData.get('bales'))
  const kg = Number(formData.get('kg'))
  const pricePerKg = Number(formData.get('pricePerKg'))

  if (!categoryId || !bales || !kg || !pricePerKg) return { error: 'بيانات غير مكتملة' }

  const totalAmount = kg * pricePerKg

  await prisma.supplierInvoice.create({
    data: {
      supplierId,
      categoryId,
      bales,
      kg,
      pricePerKg,
      totalAmount,
    }
  })

  revalidatePath(`/suppliers/${supplierId}`)
}

export async function addSupplierPayment(supplierId: number, formData: FormData) {
  const amount = Number(formData.get('amount'))
  const dueDateStr = formData.get('dueDate') as string
  const isPaid = formData.get('isPaid') === 'on'

  if (!amount) return { error: 'المبلغ مطلوب' }

  const dueDate = dueDateStr ? new Date(dueDateStr) : null

  await prisma.supplierPayment.create({
    data: {
      supplierId,
      amount,
      dueDate,
      isPaid,
      paidDate: isPaid ? new Date() : null
    }
  })

  revalidatePath(`/suppliers/${supplierId}`)
}
