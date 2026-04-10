'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addCategory(formData: FormData) {
  const name = formData.get('name') as string
  const pricePerKg = Number(formData.get('pricePerKg'))

  if (!name || isNaN(pricePerKg)) return { error: 'بيانات غير صحيحة' }

  await prisma.category.create({
    data: { name, pricePerKg }
  })

  revalidatePath('/inventory')
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const pricePerKg = Number(formData.get('pricePerKg'))

  if (!name || isNaN(pricePerKg)) return { error: 'بيانات غير صحيحة' }

  await prisma.category.update({
    where: { id },
    data: { name, pricePerKg }
  })

  revalidatePath('/inventory')
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({ where: { id } })
  revalidatePath('/inventory')
}
