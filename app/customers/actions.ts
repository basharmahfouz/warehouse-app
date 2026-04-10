'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addCustomer(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!name) return { error: 'الاسم مطلوب' }

  await prisma.customer.create({
    data: { name, phone }
  })

  revalidatePath('/customers')
}

export async function updateCustomer(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!name) return { error: 'الاسم مطلوب' }

  await prisma.customer.update({
    where: { id },
    data: { name, phone }
  })

  revalidatePath('/customers')
}

export async function deleteCustomer(id: number) {
  await prisma.customer.delete({ where: { id } })
  revalidatePath('/customers')
}
