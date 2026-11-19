import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateAxios } from '../../../CreateAxios';
import { MdErrorOutline, MdPendingActions, MdCheckCircle } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { HiOutlineClipboardList, HiOutlineLogin } from 'react-icons/hi';
import { useToast } from '../../../toast/ToastProvider';

export default function GetAllPage() {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
    const toast = useToast();

    useEffect(() => { getAll(); }, []);

    const getAll = () => {
        setLoading(true);
        CreateAxios.get('TaskManager/GetAllTasks')
            .then((res) => {
                const mydata = res.data;
                if (mydata) {
                    setStudents(mydata);
                } else {
                    toast.open(res.data.result.message, 'text-red-500', <MdErrorOutline />);
                }
                setLoading(false);
            })
            .catch(() => {
                toast.open('Something went wrong!', 'text-red-500', <MdErrorOutline />);
                setLoading(false);
            });
    };

    const pending   = students.filter(t => !t.isCompleted);
    const completed = students.filter(t =>  t.isCompleted);

    const filtered =
        filter === 'pending'   ? pending :
        filter === 'completed' ? completed :
        students;

    return (
        <div className="min-h-screen bg-[#F7F6F2]">

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center shrink-0">
                            <BiTask size={17} className="text-white" />
                        </div>
                        <span className="text-[15px] font-semibold text-stone-800 tracking-tight">
                            Task Board
                        </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {!loading && (
                            <span className="hidden sm:inline text-xs text-stone-400 font-medium">
                                {students.length} task{students.length !== 1 ? 's' : ''}
                            </span>
                        )}
                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full transition-colors"
                        >
                            <HiOutlineLogin size={13} />
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── PAGE BODY ── */}
            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

                {/* ── STATS / FILTER TABS ── */}
                {!loading && students.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-7 whitespace-nowrap">
                        {[
                            { label: 'All Tasks',  count: students.length, key: 'all',
                              active: 'bg-stone-800 text-white border-stone-800',
                              idle:   'bg-white text-stone-600 border-stone-200 hover:border-stone-300',
                              dot: 'bg-stone-400' },
                            { label: 'Pending',    count: pending.length,  key: 'pending',
                              active: 'bg-amber-500 text-white border-amber-500',
                              idle:   'bg-white text-amber-700 border-stone-200 hover:border-amber-200',
                              dot: 'bg-amber-400' },
                            { label: 'Completed',  count: completed.length,key: 'completed',
                              active: 'bg-emerald-600 text-white border-emerald-600',
                              idle:   'bg-white text-emerald-700 border-stone-200 hover:border-emerald-200',
                              dot: 'bg-emerald-500' },
                        ].map(s => (
                            <button
                                key={s.key}
                                onClick={() => setFilter(s.key)}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 border font-medium transition-all shadow-sm
                                    ${filter === s.key ? s.active : s.idle}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${filter === s.key ? 'bg-white/60' : s.dot}`} />
                                    <span className="text-xs font-semibold tracking-wide">{s.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* ── LOADING ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-36 gap-4">
                        <div className="w-9 h-9 rounded-full border-2 border-stone-200 border-t-emerald-600 animate-spin" />
                        <p className="text-sm text-stone-400 font-medium tracking-wide">Loading tasks…</p>
                    </div>

                ) : students.length === 0 ? (
                    /* ── EMPTY ── */
                    <div className="flex flex-col items-center justify-center py-36 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                            <HiOutlineClipboardList size={26} className="text-stone-300" />
                        </div>
                        <p className="text-sm font-semibold text-stone-500">No tasks available</p>
                        <p className="text-xs text-stone-400">Tasks will appear here once added.</p>
                    </div>

                ) : (
                    <>
                        {/* Section header row */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                                {filter === 'all' ? 'All Tasks' : filter === 'pending' ? 'Pending Tasks' : 'Completed Tasks'}
                            </p>
                            <p className="text-[11px] text-stone-400">
                                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* ════════════════════════════════
                            DESKTOP  →  Table / List view
                        ════════════════════════════════ */}
                        <div className="hidden md:block bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

                            {/* Table Head */}
                            <div className="grid grid-cols-[56px_1fr_1.4fr_2fr_120px] gap-4 px-6 py-3 bg-stone-50 border-b border-stone-100">
                                {['ID', 'Name', 'Title', 'Description', 'Status'].map(h => (
                                    <span key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</span>
                                ))}
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-stone-100">
                                {filtered.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center gap-2">
                                        <p className="text-sm text-stone-400">No {filter} tasks found.</p>
                                        <button onClick={() => setFilter('all')} className="text-xs text-emerald-600 underline underline-offset-2">
                                            Show all
                                        </button>
                                    </div>
                                ) : filtered.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-[56px_1fr_1.4fr_2fr_120px] gap-4 px-6 py-4 items-center hover:bg-stone-50/70 transition-colors group"
                                    >
                                        {/* ID */}
                                        <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded w-fit">
                                            {String(item.id).padStart(3, '0')}
                                        </span>

                                        {/* Name */}
                                        <span className="text-sm font-semibold text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                                            {item.name}
                                        </span>

                                        {/* Title */}
                                        <span className="text-sm text-stone-600 truncate">{item.title}</span>

                                        {/* Description */}
                                        <span className="text-xs text-stone-400 truncate leading-relaxed">{item.description}</span>

                                        {/* Status */}
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit
                                            ${item.isCompleted
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'}`}>
                                            {item.isCompleted
                                                ? <><MdCheckCircle size={11} /> Done</>
                                                : <><MdPendingActions size={11} /> Pending</>
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            {filtered.length > 0 && (
                                <div className="px-6 py-3 bg-stone-50 border-t border-stone-100">
                                    <p className="text-xs text-stone-400">
                                        Showing <span className="font-semibold text-stone-600">{filtered.length}</span> of{' '}
                                        <span className="font-semibold text-stone-600">{students.length}</span> tasks
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ════════════════════════════════
                            MOBILE  →  Card view
                        ════════════════════════════════ */}
                        <div className="md:hidden space-y-3">
                            {filtered.length === 0 ? (
                                <div className="py-16 flex flex-col items-center gap-2">
                                    <p className="text-sm text-stone-400">No {filter} tasks found.</p>
                                    <button onClick={() => setFilter('all')} className="text-xs text-emerald-600 underline underline-offset-2">
                                        Show all
                                    </button>
                                </div>
                            ) : filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-2xl border shadow-sm p-4
                                        ${item.isCompleted
                                            ? 'border-l-4 border-l-emerald-400 border-stone-100'
                                            : 'border-l-4 border-l-amber-400 border-stone-100'}`}
                                >
                                    {/* Card Top */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                                            #{String(item.id).padStart(3, '0')}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
                                            ${item.isCompleted
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'}`}>
                                            {item.isCompleted
                                                ? <><MdCheckCircle size={11} /> Done</>
                                                : <><MdPendingActions size={11} /> Pending</>
                                            }
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <p className="text-sm font-bold text-stone-800 mb-0.5 leading-snug">{item.name}</p>

                                    {/* Title */}
                                    <p className="text-xs font-medium text-stone-500 mb-3">{item.title}</p>

                                    {/* Description */}
                                    <div className="border-t border-stone-100 pt-2.5">
                                        <p className="text-xs text-stone-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}