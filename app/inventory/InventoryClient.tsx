'use client'

import { useState } from 'react'
import { Plus, Edit, PackageSearch } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { addCategory, updateCategory } from './actions'

type CategoryType = {
  id: number
  name: string
  pricePerKg: number
  availableBales: number
  availableKg: number
}

export default function InventoryClient({ initialCategories }: { initialCategories: CategoryType[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CategoryType | null>(null)

  const openModal = (item?: CategoryType) => {
    setEditingItem(item || null)
    setIsModalOpen(true)
  }

  const handleAction = async (formData: FormData) => {
    if (editingItem) {
      await updateCategory(editingItem.id, formData)
    } else {
      await addCategory(formData)
    }
    setIsModalOpen(false)
    window.location.reload() // Simple way to fetch updated data for now
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PackageSearch className="text-blue-500" /> الأصناف والمخزن
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" /> إضافة صنف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <Card key={cat.id} className="relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
            <CardContent className="pt-6 p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <button
                  onClick={() => openModal(cat)}
                  className="text-gray-400 hover:text-blue-600 transition"
                  title="تعديل الصنف"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                  <span className="text-gray-500 dark:text-gray-400">سعر الكيلو (البيع)</span>
                  <span className="font-bold text-green-600">{cat.pricePerKg} ج.م</span>
                </div>
                <div className="flex justify-between p-2">
                  <span className="text-gray-500 dark:text-gray-400">الكمية המتاحة</span>
                  <span className="font-bold">
                    {cat.availableBales} بالة <span className="text-gray-400 text-xs">({cat.availableKg} ك)</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            لا توجد أصناف مسجلة. اضغط على أضف صنف للبدء.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl border dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'تعديل صنف' : 'إضافة صنف جديد'}</h3>
            <form action={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم الصنف</label>
                <input
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 pt-2"
                  placeholder="مثال: بنطلون حريمي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر للكيلو (ج.م)</label>
                <input
                  name="pricePerKg"
                  type="number"
                  step="0.01"
                  defaultValue={editingItem?.pricePerKg}
                  required
                  className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 150"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
