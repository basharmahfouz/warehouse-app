'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, Truck, ShoppingCart, TrendingUp, HandCoins, Wallet, Clock } from 'lucide-react'

const menuItems = [
  { name: 'الرئيسية', icon: LayoutDashboard, path: '/', color: 'text-violet-500' },
  { name: 'المخزن', icon: Package, path: '/inventory', color: 'text-blue-500' },
  { name: 'شراء بضاعة', icon: ShoppingCart, path: '/purchases', color: 'text-orange-500' },
  { name: 'بيع للعميل', icon: TrendingUp, path: '/sales', color: 'text-emerald-500' },
  { name: 'دفع لمورد', icon: Wallet, path: '/payments/supplier', color: 'text-red-500' },
  { name: 'تحصيل من عميل', icon: HandCoins, path: '/payments/customer', color: 'text-green-500' },
  { name: 'سجل المعاملات', icon: Clock, path: '/transactions', color: 'text-blue-500' },
  { name: 'التجار', icon: Truck, path: '/suppliers', color: 'text-slate-500' },
  { name: 'العملاء', icon: Users, path: '/customers', color: 'text-slate-500' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        w-64 bg-white dark:bg-slate-900 border-l dark:border-slate-700 h-screen sticky top-0 flex flex-col shadow-lg z-50
        transition-transform duration-300 ease-in-out
        fixed md:sticky
        ${isOpen ? 'translate-x-0' : 'translate-x-[100%] md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">مخزن الملابس</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">نظام الإدارة</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 shadow-sm font-semibold border border-blue-100 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                <span>{item.name}</span>
                {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t dark:border-slate-700">
          <p className="text-xs text-slate-400 text-center">© 2026 مخزن الملابس</p>
        </div>
      </aside>
    </>
  )
}
