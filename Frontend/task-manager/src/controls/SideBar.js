import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BiTask } from 'react-icons/bi'
import { MdDashboard, MdChecklist, MdLogout, MdManageAccounts } from 'react-icons/md'
import { useAuthenticate } from '../useAuthenticate'
import { setLoginInfo } from '../LoginInfo'
import { RiShieldUserFill } from 'react-icons/ri'

const navItems = [
    { to: '/dashboard',  label: 'Dashboard',  icon: MdDashboard },
    { to: '/tasks',      label: 'All Tasks',   icon: MdChecklist },
    { to: '/get/user',      label: 'All Users',   icon: RiShieldUserFill },
    { to: '/profile',    label: 'Profile',     icon: MdManageAccounts },
]

export default function Sidebar({ user }) {
    const [, setAuthenticate] = useAuthenticate()
    const navigate = useNavigate()

    const handleLogout = () => {
        setAuthenticate({ isLogin: false, loginData: '' })
        setLoginInfo({ isLogin: false, loginData: '' })
        navigate('/login')
    }

    return (
        <>
            <aside className="hidden md:flex flex-col w-[230px] shrink-0 bg-white border-r border-stone-200 min-h-screen sticky top-0 h-screen">

                {/* Brand */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                        <BiTask size={17} className="text-white" />
                    </div>
                    <span className="text-[15px] font-bold text-stone-800 tracking-tight">Task Board</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-2">Menu</p>
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
                                        ${isActive ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                        <Icon size={16} />
                                    </span>
                                    {label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="px-3 py-4 border-t border-stone-100 space-y-1">
                    {/* User card */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-stone-50">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-stone-700 truncate">{user?.userName || 'User'}</p>
                            <p className="text-[10px] text-stone-400 truncate">{user?.email || 'Logged in'}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <MdLogout size={16} />
                        </span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ════════════════════════════════
                MOBILE BOTTOM NAV
            ════════════════════════════════ */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200 flex items-center justify-around px-2 h-16 safe-area-pb">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all
                            ${isActive ? 'text-emerald-700' : 'text-stone-400'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
                                    ${isActive ? 'bg-emerald-50' : ''}`}>
                                    <Icon size={20} className={isActive ? 'text-emerald-700' : 'text-stone-400'} />
                                </span>
                                <span className="text-[10px] font-semibold">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-red-400 transition-all"
                >
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center">
                        <MdLogout size={20} />
                    </span>
                    <span className="text-[10px] font-semibold">Logout</span>
                </button>
            </nav>
        </>
    )
}