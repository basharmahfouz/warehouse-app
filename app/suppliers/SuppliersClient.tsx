'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Truck, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { addSupplier, updateSupplier } from './actions'

type SupplierType = {
  id: number
  name: string
  phone: string
  notes: string
  remainingDebt: number
  totalKgFromSupplier: number
}

export default function SuppliersClient({ initialSuppliers }: { initialSuppliers: SupplierType[] }) {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SupplierType | null>(null)

  const openModal = (item?: SupplierType) => {
    setEditingItem(item || null)
    setIsModalOpen(true)
  }

  const handleAction = async (formData: FormData) => {
    if (editingItem) {
      await updateSupplier(editingItem.id, formData)
    } else {
      await addSupplier(formData)
    }
    setIsModalOpen(false)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="text-red-500" /> قائمة التجار (الموردين)
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" /> إضافة تاجر
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(sup => (
          <Card key={sup.id} className="relative overflow-hidden group hover:shadow-md transition bg-white dark:bg-slate-800">
            <div className={`absolute top-0 right-0 w-2 h-full ${sup.remainingDebt > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <CardContent className="pt-6 p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{sup.name}</h3>
                <div className="flex gap-2 text-gray-400">
                  <button onClick={() => openModal(sup)} className="hover:text-blue-600 transition" title="تعديل">
                    <Edit className="w-4 h-4" />
                  </button>
                  <Link href={`/suppliers/${sup.id}`} className="hover:text-green-600 transition" title="عرض التفاصيل">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>رقم التليفون: {sup.phone || '-'}</p>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded mt-3">
                  <span>إجمالي المورد</span>
                  <span className="font-bold">{sup.totalKgFromSupplier} ك</span>
                </div>
                <div className="flex justify-between p-2">
                  <span>الدين المتبقي (له)</span>
                  <span className={`font-bold ${sup.remainingDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {sup.remainingDebt.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            لا يوجد تجار مسجلين. اضغط على أضف تاجر للبدء.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'تعديل بيانات تاجر' : 'إضافة تاجر جديد'}</h3>
            <form action={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم التاجر</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500" placeholder="مثال: الحاج أحمد" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم التليفون</label>
                <input name="phone" defaultValue={editingItem?.phone} className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500" placeholder="01xxxxxxxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ملاحظات</label>
                <textarea name="notes" defaultValue={editingItem?.notes} className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500" rows={3}></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-200">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
