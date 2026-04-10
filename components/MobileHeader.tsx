'use client'

import { Menu, Package, X } from 'lucide-react'

interface MobileHeaderProps {
  isOpen: boolean
  toggle: () => void
}

export default function MobileHeader({ isOpen, toggle }: MobileHeaderProps) {
  return (
    <header className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-md font-bold text-slate-800 dark:text-white leading-tight">مخزن الملابس</h1>
      </div>
      
      <button 
        onClick={toggle}
        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        aria-label="القائمة"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </header>
  )
}
