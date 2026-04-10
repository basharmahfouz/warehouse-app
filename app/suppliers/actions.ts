'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addSupplier(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const notes = formData.get('notes') as string

  if (!name) return { error: 'الاسم مطلوب' }

  await prisma.supplier.create({
    data: { name, phone, notes }
  })

  revalidatePath('/suppliers')
}

export async function updateSupplier(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const notes = formData.get('notes') as string

  if (!name) return { error: 'الاسم مطلوب' }

  await prisma.supplier.update({
    where: { id },
    data: { name, phone, notes }
  })

  revalidatePath('/suppliers')
}

export async function deleteSupplier(id: number) {
  await prisma.supplier.delete({ where: { id } })
  revalidatePath('/suppliers')
}
