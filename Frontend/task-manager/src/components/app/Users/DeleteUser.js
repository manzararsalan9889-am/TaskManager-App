import React, { useEffect, useState } from 'react';
import { createAxiosWithToken } from '../../../CreateAxios';
import Model from '../../../controls/Model';
import { MdOutlineDone, MdErrorOutline } from "react-icons/md";
import { useToast } from '../../../toast/ToastProvider';
import { useAuthenticate } from '../../../useAuthenticate';

export default function DeleteUser({ isOpen, setIsOpen, editData, getAllUser }) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [authenticate, setAuthenticate] = useAuthenticate()
  const deleteUser = (id) => {
    setLoading(true)
    createAxiosWithToken(authenticate.loginData.token).post('ApplicationUser/Delete?Id=' + id)
      .then(res => {
        let mydata = res.data;
        if (mydata) {
          toast.open("User Deleted Successfully.", "text-green-400", <MdOutlineDone />);
          setIsOpen(!isOpen)
          getAllUser()
        } else {
          toast.open(res.data, "text-red-400", <MdErrorOutline />);
        }

        setLoading(false)
      })
      .catch(err => {
        toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
        setLoading(false)
      })
  };

  return (
    <Model title='Delete User' isOpen={isOpen} setIsOpen={setIsOpen} >
      {editData &&
        <div className="text-center my-2 bg-white rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Are you sure to delete?
          </h2>
          <div>
            {!loading ?
              <div className='items-center space-x-8 justify-center'>
                <button type='submit' className="button2" onClick={() => deleteUser(editData.id)}>Deletel</button>
                <button className="button3 mt-2 mb-5" onClick={() => { setIsOpen(isOpen.id) }}>Cancel</button>
              </div>
              :
              <button disabled className="my-3 mt-2 bg-red-600 text-white rounded-md py-1 px-10 shadow-md">Deleting...</button>

            }
          </div>
        </div>}
    </Model>
  );
}
