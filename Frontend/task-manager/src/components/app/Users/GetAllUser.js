import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { CreateAxios } from '../../../CreateAxios';
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { GrFormAdd } from "react-icons/gr";
import DeleteUser from './DeleteUser';
import EditUser from './EditUser';
import AddUser from './AddUser';
import { MdCheckCircle } from 'react-icons/md';
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaUser, FaIdBadge, FaArrowLeft } from "react-icons/fa";
import { HiOutlineUserCircle } from 'react-icons/hi';
import { TbLockBitcoin } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { useToast } from '../../../toast/ToastProvider';
import { useAuthenticate } from '../../../useAuthenticate';
import { setLoginInfo } from '../../../LoginInfo';
import ChangePassword from './ChangePassword';

export default function GetAllUser() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const toast = useToast()
  const [authenticate, setAuthenticate] = useAuthenticate()

  useEffect(() => {
    getAllUser()
  }, [])

  const editOpen = (data) => {
    setEditData(data)
    setIsOpen(!isOpen)
  }

  const deleteOpen = (data) => {
    setEditData(data)
    setIsOpenDelete(!isOpenDelete)
  }

  const changepassOpen = (data) => {
    setEditData(data)
    setIsChangePassOpen(!isChangePassOpen)
  }
  const getAllUser = () => {
    setLoading(true);
    CreateAxios.get("ApplicationUser/GetAll")
      .then((res) => {
        console.log(res);
        let mydata = res.data;
        if (mydata) {
          setUsers(mydata)
        } else {
          toast.open(res.data, "text-red-400", <MdErrorOutline />);
        }
        setLoading(false);
      }).catch(err => {
        toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
        setLoading(false);
      });
  };
  const logout = () => {
    setAuthenticate({
      isLogin: false,
      loginData: ""
    })
    setLoginInfo({
      isLogin: false,
      loginData: ""
    })
  }


  return (
    <div >
      {/* Action row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsOpenAdd(true)}
          className="group bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500
           active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm
           flex items-center transition-all duration-300 ease-in-out focus:outline-none"
        >
          <GrFormAdd className="text-xl transform transition-transform duration-300 group-hover:rotate-90 mr-1" />
          <span className="tracking-wide text-sm">Add User</span>
        </button>
      </div>
      
      {/* Section label */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">All Users</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-[#FAFAF8]">
              <th className="px-6 py-3.5 font-semibold">ID</th>
              <th className="px-4 py-3.5 font-semibold">Full Name</th>
              <th className="px-4 py-3.5 font-semibold">User Name</th>
              <th className="px-4 py-3.5 font-semibold">Email</th>
              <th className="px-4 py-3.5 font-semibold">Phone</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400 italic text-sm">
                  No users available.
                </td>
              </tr>
            ) : (
              users.map((item) => {
                const locked = item.lockoutEnabled || item.isLocked;
                return (
                  <tr key={item.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-block bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {String(item.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                       
                        <span className="font-medium text-gray-900">{item.fullName || item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                       
                        {item.userName}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        {item.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        {item.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Change Password"
                          onClick={() => changepassOpen(item)}
                          className="p-1.5 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-transform hover:scale-110"
                        >
                          <TbLockBitcoin size={16} />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => editOpen(item)}
                          className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-transform hover:scale-110"
                        >
                          <BiSolidEditAlt size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteOpen(item)}
                          className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-transform hover:scale-110"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 text-xs text-gray-400 border-t border-gray-50">
        </div>
      </div>

      <EditUser
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editData={editData}
        id={editData && editData.id}
        getAllUser={getAllUser}
      />
      <DeleteUser
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        editData={editData}
        id={editData && editData.id}
        getAllUser={getAllUser}
      />
      <AddUser
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        getAllUser={getAllUser}
      />
      <ChangePassword
        isOpen={isChangePassOpen}
        setIsOpen={setIsChangePassOpen}
        editData={editData}
      />
    </div>
  )
}