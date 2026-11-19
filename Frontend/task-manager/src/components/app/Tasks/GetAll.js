import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateAxios } from '../../../CreateAxios';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';
import AddTask from './AddTask';
import { GrFormAdd } from 'react-icons/gr';
import { BiSolidEditAlt, BiTask, BiLinkAlt } from 'react-icons/bi';
import { MdDelete, MdPendingActions, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useToast } from '../../../toast/ToastProvider';

export default function GetAll() {
  const [loading, setLoading]       = useState(false);
  const [students, setStudents]     = useState([]);
  const [editData, setEditData]     = useState();
  const [isOpen, setIsOpen]         = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenAdd, setIsOpenAdd]   = useState(false);
  const [filter, setFilter]         = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const getAll = useCallback(() => {
    setLoading(true);
    CreateAxios.get('tasks', {
      params: {
        priority: priorityFilter === '' ? undefined : priorityFilter,
        sortBy: sortByDueDate ? 'dueDate' : undefined,
      },
    })
      .then((res) => {
        if (res.data) setStudents(res.data);
      else toastRef.current.open(res.data.result.message, 'text-red-400', <MdErrorOutline />);
        setLoading(false);
      })
      .catch(() => {
      toastRef.current.open('Something went wrong!', 'text-red-400', <MdErrorOutline />);
        setLoading(false);
      });
  }, [priorityFilter, sortByDueDate]);

  useEffect(() => { getAll(); }, [getAll]);

  const editOpen   = (data) => { setEditData(data); setIsOpen(true); };
  const deleteOpen = (data) => { setEditData(data); setIsOpenDelete(true); };

  const pending   = students.filter(t => !t.isCompleted);
  const completed = students.filter(t =>  t.isCompleted);
  const filtered  =
    filter === 'pending'   ? pending :
    filter === 'completed' ? completed :
    students;

  return (
    <div className="space-y-6">

      {/* ── TOP ACTION BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIsOpenAdd(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95
            text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-200
            transition-all duration-200"
        >
          <GrFormAdd size={18} />
          Add Task
        </button>

        <Link
          to="/status"
          className="flex items-center gap-2 bg-white hover:bg-stone-50 active:scale-95
            text-stone-600 hover:text-stone-800 text-sm font-semibold px-4 py-2.5 rounded-xl
            border border-stone-200 shadow-sm transition-all duration-200"
        >
          <BiLinkAlt size={16} />
          Get by Status
        </Link>
      </div>

      {/* ── PRIORITY / SORT CONTROLS ── */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          Priority
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All priorities</option>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </label>
        <button
          type="button"
          aria-pressed={sortByDueDate}
          onClick={() => setSortByDueDate((sort) => !sort)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
            sortByDueDate
              ? 'border-emerald-600 bg-emerald-700 text-white'
              : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
          }`}
        >
          {sortByDueDate ? 'Due date: sorted' : 'Sort by due date'}
        </button>
      </div>

      {/* ── FILTER TABS ── */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-3 gap-3 whitespace-nowrap">
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
              <span className="text-base font-bold tabular-nums">{s.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── LOADING ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-36 gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-stone-200 border-t-emerald-600 animate-spin" />
          <p className="text-sm text-stone-400 font-medium">Loading tasks…</p>
        </div>

      ) : students.length === 0 ? (
        /* ── EMPTY ── */
        <div className="flex flex-col items-center justify-center py-36 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
            <HiOutlineClipboardList size={26} className="text-stone-300" />
          </div>
          <p className="text-sm font-semibold text-stone-500">No tasks available</p>
          <p className="text-xs text-stone-400">Click "Add Task" to create your first task.</p>
        </div>

      ) : (
        <>
          {/* Section label */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
              {filter === 'all' ? 'All Tasks' : filter === 'pending' ? 'Pending Tasks' : 'Completed Tasks'}
            </p>
            <p className="text-[11px] text-stone-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* ══════════════════════════════
              DESKTOP  →  Table view
          ══════════════════════════════ */}
          <div className="hidden md:block bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

            {/* Head */}
            <div className="grid grid-cols-[52px_1fr_1.3fr_2fr_90px_110px_120px_96px] gap-4 px-6 py-3 bg-stone-50 border-b border-stone-100">
              {['ID', 'Name', 'Title', 'Description', 'Priority', 'Due date', 'Status', 'Actions'].map(h => (
                <span key={h} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <EmptyFilter onReset={() => setFilter('all')} filter={filter} />
              ) : filtered.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-[52px_1fr_1.3fr_2fr_90px_110px_120px_96px] gap-4 px-6 py-4 items-center
                    hover:bg-stone-50/70 transition-colors group"
                >
                  <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded w-fit">
                    {String(item.id).padStart(3, '0')}
                  </span>
                  <span className="text-sm font-semibold text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm text-stone-500 truncate">{item.title}</span>
                  <span className="text-xs text-stone-400 truncate">{item.description}</span>
                  <PriorityBadge priority={item.priority} />
                  <span className="text-xs text-stone-500">{formatDueDate(item.dueDate)}</span>
                  <StatusBadge done={item.isCompleted} />
                  <div className="flex items-center gap-2">
                    <button
                      title="Edit"
                      onClick={() => editOpen(item)}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100
                        flex items-center justify-center transition-all hover:scale-105"
                    >
                      <BiSolidEditAlt size={15} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteOpen(item)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100
                        flex items-center justify-center transition-all hover:scale-105"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
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

          {/* ══════════════════════════════
              MOBILE  →  Card view
          ══════════════════════════════ */}
          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <EmptyFilter onReset={() => setFilter('all')} filter={filter} />
            ) : filtered.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm p-4
                  ${item.isCompleted
                    ? 'border-l-4 border-l-emerald-400 border-stone-100'
                    : 'border-l-4 border-l-amber-400 border-stone-100'}`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                    #{String(item.id).padStart(3, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={item.priority} />
                    <StatusBadge done={item.isCompleted} />
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-800 mb-0.5">{item.name}</p>
                <p className="text-xs font-medium text-stone-500 mb-3">{item.title}</p>

                <p className="text-xs text-stone-500 mb-3">
                  Due: <span className="font-medium text-stone-700">{formatDueDate(item.dueDate)}</span>
                </p>

                <div className="border-t border-stone-100 pt-2.5 flex items-end justify-between gap-3">
                  <p className="text-xs text-stone-400 leading-relaxed flex-1">{item.description}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      title="Edit"
                      onClick={() => editOpen(item)}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100
                        flex items-center justify-center transition-all"
                    >
                      <BiSolidEditAlt size={15} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteOpen(item)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100
                        flex items-center justify-center transition-all"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── MODALS ── */}
      <EditTask
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        id={editData?.id}
        getAll={getAll}
      />
      <DeleteTask
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        editData={editData}
        id={editData?.id}
        getAll={getAll}
      />
      <AddTask
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        getAll={getAll}
      />
    </div>
  );
}

/* ── Sub-components ── */
function StatusBadge({ done }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
      ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {done
        ? <><MdCheckCircle size={11} /> Done</>
        : <><MdPendingActions size={11} /> Pending</>
      }
    </span>
  );
}

function PriorityBadge({ priority }) {
  const priorities = {
    0: { label: 'Low', style: 'bg-sky-100 text-sky-700' },
    1: { label: 'Medium', style: 'bg-amber-100 text-amber-700' },
    2: { label: 'High', style: 'bg-rose-100 text-rose-700' },
  };
  const value = priorities[priority] || priorities[0];

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${value.style}`}>
      {value.label}
    </span>
  );
}

function formatDueDate(dueDate) {
  if (!dueDate) return '—';
  const date = dueDate.slice(0, 10);
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function EmptyFilter({ filter, onReset }) {
  return (
    <div className="flex flex-col items-center py-16 gap-2">
      <p className="text-sm text-stone-400">No {filter} tasks found.</p>
      <button onClick={onReset} className="text-xs text-emerald-600 underline underline-offset-2">
        Show all tasks
      </button>
    </div>
  );
}