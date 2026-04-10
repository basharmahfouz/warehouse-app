'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MobileHeader isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
