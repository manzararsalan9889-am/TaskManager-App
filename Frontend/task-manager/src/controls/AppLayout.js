import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MdNotificationsNone, MdSearch } from 'react-icons/md'
import Sidebar from './SideBar'
import { useAuthenticate } from '../useAuthenticate'

const pageTitles = {
    '/dashboard': { title: 'Dashboard',  sub: 'Welcome back! Here\'s what\'s happening.' },
    '/tasks':     { title: 'All Tasks',  sub: 'View and manage all your tasks.' },
    '/get/user':     { title: 'All Users',  sub: 'View and manage all Users.' },
    '/profile':   { title: 'Profile',    sub: 'Manage your account settings.' },
}

export default function AppLayout() {
    const location = useLocation()
    const [authenticate] = useAuthenticate()
    const user = authenticate?.loginData
    const page = pageTitles[location.pathname] || { title: 'Task Board', sub: '' }

    return (
        <div className="flex min-h-screen bg-[#F7F6F2]">

            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* ── TOPBAR ── */}
                <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
                    <div className="flex items-center justify-between px-6 h-16">

                        {/* Page title */}
                        <div>
                            <h1 className="text-[15px] font-bold text-stone-800 leading-tight">{page.title}</h1>
                            <p className="text-[11px] text-stone-400 hidden sm:block">{page.sub}</p>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">

                            {/* Notification bell */}
                            <button className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-all relative">
                                <MdNotificationsNone size={18} />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </button>

                            {/* Avatar */}
                            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-100 ml-1">
                                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="hidden sm:block text-sm font-semibold text-stone-700">
                                    {user?.userName || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 px-5 sm:px-8 py-7 pb-24 md:pb-7">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}