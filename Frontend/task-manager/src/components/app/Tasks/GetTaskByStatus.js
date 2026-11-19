import React, { useEffect, useState } from 'react';
import { CreateAxios } from '../../../CreateAxios'
import { MdCheckCircle } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { MdPendingActions } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa';

export default function GetTaskByStatus() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData(status);
  }, [status]);

  const getData = (status) => {
    setIsLoading(true);
    CreateAxios.get(`TaskManager/GetByIsCompleted?eBool=${status}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  return (
    <>
      <div className="text-center font-semibold mt-6 text-3xl text-gray-800">
        <div className="text-center text-3xl font-semibold text-gray-900  tracking-wide flex justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-black hover:text-gray-500 focus:outline-none mr-2"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl text-gray-500" />
          </button>

          <BiTask size={32} className="text-indigo-600" />
          <span>Task Status List</span>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-150"
        >
          <option value={1}>✅ Completed</option>
          <option value={0}>⏳ Pending</option>
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {isLoading ? (
          <div className="col-span-full text-center">
            <button
              disabled
              type="button"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg animate-pulse"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M100 50.5908C100 78.2051..." fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393..." fill="currentColor" />
              </svg>
              Loading...
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-sm">No tasks found.</div>
        ) : (
          data.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium space-y-2 text-gray-400 tracking-widest uppercase flex items-center gap-1">
                  <MdCheckCircle className="text-green-400" />
                  Task #{task.id}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${task.isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {task.isCompleted ? (
                    <>
                      <MdCheckCircle />
                      Completed
                    </>
                  ) : (
                    <>
                      <MdPendingActions />
                      Pending
                    </>
                  )}
                </span>
              </div>
              <div className='space-y-2'> 
                <BiTask className="text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  {task.title}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            </div>
          ))
        )}
      </div>
    </>

  );

}