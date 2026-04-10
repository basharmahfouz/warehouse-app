'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Users, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { addCustomer, updateCustomer } from './actions'

type CustomerType = {
  id: number
  name: string
  phone: string
  remainingDebt: number
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: CustomerType[] }) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustomerType | null>(null)

  const openModal = (item?: CustomerType) => {
    setEditingItem(item || null)
    setIsModalOpen(true)
  }

  const handleAction = async (formData: FormData) => {
    if (editingItem) {
      await updateCustomer(editingItem.id, formData)
    } else {
      await addCustomer(formData)
    }
    setIsModalOpen(false)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-green-500" /> قائمة العملاء
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" /> إضافة عميل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(cust => (
          <Card key={cust.id} className="relative overflow-hidden group hover:shadow-md transition bg-white dark:bg-slate-800">
            <div className={`absolute top-0 right-0 w-2 h-full ${cust.remainingDebt > 0 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <CardContent className="pt-6 p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{cust.name}</h3>
                <div className="flex gap-2 text-gray-400">
                  <button onClick={() => openModal(cust)} className="hover:text-blue-600 transition" title="تعديل">
                    <Edit className="w-4 h-4" />
                  </button>
                  <Link href={`/customers/${cust.id}`} className="hover:text-green-600 transition" title="عرض التفاصيل والفواتير">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>رقم التليفون: {cust.phone || '-'}</p>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded mt-3">
                  <span>المديونية (لنا)</span>
                  <span className={`font-bold ${cust.remainingDebt > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {cust.remainingDebt.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            لا يوجد عملاء. اضغط على أضف عميل للبدء.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'تعديل بيانات عميل' : 'إضافة عميل جديد'}</h3>
            <form action={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم العميل</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500" placeholder="مثال: شركة النور" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم التليفون (اختياري)</label>
                <input name="phone" defaultValue={editingItem?.phone} className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-green-500" placeholder="01xxxxxxxxx" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-200">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
