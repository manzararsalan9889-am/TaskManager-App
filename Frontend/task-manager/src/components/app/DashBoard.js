import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreateAxios } from '../../CreateAxios'
import { useAuthenticate } from '../../useAuthenticate'
import { MdCheckCircle, MdPendingActions, MdErrorOutline, MdArrowForward, MdOutlineTask } from 'react-icons/md'
import { BiTask } from 'react-icons/bi'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { useToast } from '../../toast/ToastProvider'

// ── Mini bar chart (pure Tailwind) ──────────────────────────────────────────
function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
        <div className="flex items-end gap-0.5 h-8">
            {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 1].map((m, i) => (
                <div
                    key={i}
                    className={`w-2 rounded-sm ${color} opacity-30`}
                    style={{ height: `${Math.round(m * pct)}%`, minHeight: 3, transition: 'height 0.6s ease' }}
                />
            ))}
        </div>
    )
}

// ── Donut chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ completed, pending, total }) {
    const r = 52
    const circ = 2 * Math.PI * r
    const completedPct = total > 0 ? completed / total : 0
    const pendingPct   = total > 0 ? pending   / total : 0
    const gap = 3

    const completedLen = circ * completedPct - gap
    const pendingLen   = circ * pendingPct   - gap
    const completedOff = -circ * 0.25
    const pendingOff   = completedOff - completedLen - gap

    return (
        <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-0">
                {/* bg ring */}
                <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f0ec" strokeWidth="14" />
                {/* pending */}
                {pending > 0 && (
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#f59e0b" strokeWidth="14"
                        strokeDasharray={`${pendingLen} ${circ - pendingLen}`}
                        strokeDashoffset={pendingOff}
                        strokeLinecap="round" />
                )}
                {/* completed */}
                {completed > 0 && (
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#059669" strokeWidth="14"
                        strokeDasharray={`${completedLen} ${circ - completedLen}`}
                        strokeDashoffset={completedOff}
                        strokeLinecap="round" />
                )}
            </svg>
            {/* center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-stone-800 leading-none">{total}</span>
                <span className="text-[10px] text-stone-400 font-medium mt-0.5">tasks</span>
            </div>
        </div>
    )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DashBoard() {
    const [tasks, setTasks]   = useState([])
    const [loading, setLoading] = useState(false)
    const [authenticate] = useAuthenticate()
    const user = authenticate?.loginData
    const toast = useToast()

    useEffect(() => { fetchTasks() }, [])

    const fetchTasks = () => {
        setLoading(true)
        CreateAxios.get('TaskManager/GetAllTasks')
            .then(res => {
                if (res.data) setTasks(res.data)
                else toast.open(res.data?.result?.message, 'text-red-400', <MdErrorOutline />)
                setLoading(false)
            })
            .catch(() => {
                toast.open('Something went wrong!', 'text-red-400', <MdErrorOutline />)
                setLoading(false)
            })
    }

    const total     = tasks.length
    const completed = tasks.filter(t =>  t.isCompleted).length
    const pending   = tasks.filter(t => !t.isCompleted).length
    const recentTasks = [...tasks].slice(0, 5)

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="space-y-6">

            {/* ── STAT CARDS ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Total */}
                <StatCard
                    label="Total Tasks"
                    value={loading ? '—' : total}
                    sub="All tasks assigned"
                    icon={<HiOutlineClipboardList size={18} className="text-stone-500" />}
                    iconBg="bg-stone-100"
                    accent="border-l-stone-400"
                    bar={<MiniBar value={total} max={total || 1} color="bg-stone-400" />}
                />

                {/* Pending */}
                <StatCard
                    label="Pending"
                    value={loading ? '—' : pending}
                    sub={`${total > 0 ? Math.round((pending/total)*100) : 0}% of total`}
                    icon={<MdPendingActions size={18} className="text-amber-600" />}
                    iconBg="bg-amber-50"
                    accent="border-l-amber-400"
                    bar={<MiniBar value={pending} max={total || 1} color="bg-amber-400" />}
                />

                {/* Completed */}
                <StatCard
                    label="Completed"
                    value={loading ? '—' : completed}
                    sub={`${completionRate}% completion rate`}
                    icon={<MdCheckCircle size={18} className="text-emerald-600" />}
                    iconBg="bg-emerald-50"
                    accent="border-l-emerald-500"
                    bar={<MiniBar value={completed} max={total || 1} color="bg-emerald-500" />}
                />
            </div>

            {/* ── MIDDLE ROW: Donut + User Profile ─────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Donut chart card */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Task Overview</p>
                    <div className="flex items-center gap-8">
                        <DonutChart completed={completed} pending={pending} total={total} />
                        <div className="space-y-3">
                            <LegendItem color="bg-emerald-500" label="Completed" value={completed} total={total} />
                            <LegendItem color="bg-amber-400"  label="Pending"   value={pending}   total={total} />
                            <LegendItem color="bg-stone-200"  label="Total"     value={total}      total={total} hidePct />
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-5">
                        <div className="flex justify-between text-[11px] text-stone-400 mb-1.5">
                            <span>Completion</span>
                            <span className="font-semibold text-emerald-600">{completionRate}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* User Profile card */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Your Profile</p>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center shrink-0">
                            <span className="text-white text-xl font-bold">
                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-base font-bold text-stone-800">{user?.userName || 'User'}</p>
                            <p className="text-xs text-stone-400">{user?.email || 'No email'}</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Total',     val: total,     color: 'text-stone-700' },
                            { label: 'Pending',   val: pending,   color: 'text-amber-600' },
                            { label: 'Done',      val: completed, color: 'text-emerald-600' },
                        ].map(s => (
                            <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
                                <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                                <p className="text-[10px] text-stone-400 font-medium mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RECENT TASKS TABLE ────────────────────────── */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                        <BiTask size={16} className="text-stone-400" />
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Recent Tasks</p>
                    </div>
                    <Link
                        to="/tasks"
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        View all <MdArrowForward size={13} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-emerald-600 animate-spin" />
                        <p className="text-sm text-stone-400">Loading…</p>
                    </div>
                ) : recentTasks.length === 0 ? (
                    <div className="flex flex-col items-center py-16 gap-2">
                        <MdOutlineTask size={28} className="text-stone-200" />
                        <p className="text-sm text-stone-400">No tasks yet</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                            <div className="grid grid-cols-[48px_1fr_1.4fr_2fr_110px] gap-4 px-6 py-2.5 bg-stone-50 border-b border-stone-100">
                                {['ID', 'Name', 'Title', 'Description', 'Status'].map(h => (
                                    <span key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</span>
                                ))}
                            </div>
                            <div className="divide-y divide-stone-100">
                                {recentTasks.map(item => (
                                    <div key={item.id} className="grid grid-cols-[48px_1fr_1.4fr_2fr_110px] gap-4 px-6 py-3.5 items-center hover:bg-stone-50/70 transition-colors group">
                                        <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded w-fit">
                                            {String(item.id).padStart(3, '0')}
                                        </span>
                                        <span className="text-sm font-semibold text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                                            {item.name}
                                        </span>
                                        <span className="text-sm text-stone-500 truncate">{item.title}</span>
                                        <span className="text-xs text-stone-400 truncate">{item.description}</span>
                                        <StatusBadge done={item.isCompleted} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-stone-100">
                            {recentTasks.map(item => (
                                <div key={item.id} className="px-5 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                                            #{String(item.id).padStart(3, '0')}
                                        </span>
                                        <StatusBadge done={item.isCompleted} />
                                    </div>
                                    <p className="text-sm font-bold text-stone-800 mb-0.5">{item.name}</p>
                                    <p className="text-xs text-stone-500 mb-1">{item.title}</p>
                                    <p className="text-xs text-stone-400 leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, iconBg, accent, bar }) {
    return (
        <div className={`bg-white rounded-2xl border border-stone-200 border-l-4 ${accent} shadow-sm px-5 py-4`}>
            <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                    {icon}
                </div>
                {bar}
            </div>
            <p className="text-2xl font-bold text-stone-800 leading-none mb-1">{value}</p>
            <p className="text-xs font-semibold text-stone-500">{label}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">{sub}</p>
        </div>
    )
}

function LegendItem({ color, label, value, total, hidePct }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0
    return (
        <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-sm ${color} shrink-0`} />
            <span className="text-xs text-stone-600 font-medium">{label}</span>
            <span className="text-xs font-bold text-stone-800 ml-auto">{value}</span>
            {!hidePct && <span className="text-[10px] text-stone-400 w-7 text-right">{pct}%</span>}
        </div>
    )
}

function StatusBadge({ done }) {
    return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
            ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {done
                ? <><MdCheckCircle size={11} /> Done</>
                : <><MdPendingActions size={11} /> Pending</>
            }
        </span>
    )
}