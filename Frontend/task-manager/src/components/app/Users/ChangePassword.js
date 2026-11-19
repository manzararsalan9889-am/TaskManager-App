import React, { useEffect, useState } from 'react'
import { RiArrowGoBackLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { CreateAxios } from '../../../CreateAxios';
import Model from '../../../controls/Model';
import { FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../../toast/ToastProvider';
import { MdOutlineDone } from 'react-icons/md';

export default function ChangePassword({ isOpen, setIsOpen, editData }) {
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const toast = useToast()

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log({
            userId,
            oldPassword,
            newPassword
        })
        try {
            const res = await CreateAxios.post("ApplicationUser/ChangePassword", {
                userId: userId.trim(),
                oldPassword,
                newPassword
            },);
            setMessage(res.data);
            setIsOpen(!isOpen)
            setLoading(false)
            toast.open("Changed password successfully", "text-green-400", <MdOutlineDone />);


        } catch (err) {
            setLoading(false)
            setMessage(err.response?.data || "Something went wrong");
        }

    };
    useEffect(() => {
        if (editData) {
            setUserId(editData.id);
        }
    }, [editData])
    
    return (
        <Model title='📝 Change Password' isOpen={isOpen} setIsOpen={setIsOpen}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-md mx-auto">
                <div className='space-y-3'>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Old Password</label>
                        <input
                            type="text"
                            name="oldPassword"
                            value={oldPassword}
                           onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full rounded-md border px-4 py-2 border-gray-300"
                            placeholder="Enter old password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">New Password</label>
                        <input
                            type="text"
                            name="newPassword"
                            value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-md border px-4 py-2 border-gray-300"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className='flex items-center justify-center'>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </Model>
    );
}