import React, { useEffect, useState } from 'react';
import { createAxiosWithToken } from '../../../CreateAxios';
import Model from '../../../controls/Model';
import { MdOutlineDone, MdErrorOutline } from "react-icons/md";
import { useToast } from '../../../toast/ToastProvider';
import { useAuthenticate } from '../../../useAuthenticate';

export default function DeleteTask({ isOpen, setIsOpen, editData, id, getAll }) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [authenticate, setAuthenticate] = useAuthenticate()

  const deleteTask = (id) => {
    setLoading(true)
    createAxiosWithToken(authenticate.loginData.token).post('TaskManager/DeleteTasks?Id=' + id)
      .then(res => {
        let mydata = res.data;
        if (mydata) {
          toast.open("Task Deleted Successfully.", "text-green-400", <MdOutlineDone />);
          setIsOpen(!isOpen)
          getAll()
        } else {
          toast.open(res.data.result.message, "text-red-400", <MdErrorOutline />);
        }

        setLoading(false)
      })
      .catch(err => {
        toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
        setLoading(false)
      })
  };

  return (
    <Model title='Delete Task' isOpen={isOpen} setIsOpen={setIsOpen} >
      {editData &&
        <div className="text-center my-2 p-4 max-w-sm mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Are you sure to delete?
          </h2>
          {!loading ? (
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => deleteTask(editData.id)}
                className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 text-gray-800 font-semibold px-7 py-2 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              disabled
              className="bg-red-600 text-white rounded-lg py-2 px-10 shadow-md cursor-not-allowed animate-pulse font-semibold"
            >
              Deleting...
            </button>
          )}
        </div>




      }
    </Model>
  );
}
