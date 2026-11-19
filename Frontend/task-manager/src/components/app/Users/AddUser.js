import React, { useEffect, useState } from 'react';
import { createAxiosWithToken } from '../../../CreateAxios';
import * as Yup from "yup";
import { useFormik } from 'formik';
import Model from '../../../controls/Model';
import {
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineUser,
    AiOutlineIdcard,
    AiOutlineHome,
    AiOutlineLock,
    AiOutlineSave,
} from "react-icons/ai";
import { MdOutlineDone, MdErrorOutline } from "react-icons/md";
import { useToast } from '../../../toast/ToastProvider';
import { useAuthenticate } from '../../../useAuthenticate';

export default function AddUser({ isOpen, setIsOpen, id, getAllUser, editData }) {
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const [authenticate, setAuthenticate] = useAuthenticate()


    const schema = Yup.object().shape({
        email: Yup.string().required("Email is required"),
        phoneNumber: Yup.string().min(10, " Must Min 10 Digits").max(10, "Must Max 10 Digits").required("Phone Number is required"),
        userName: Yup.string().required("User Name is required"),
        fullName: Yup.string().required("Full Name is required"),
        address: Yup.string().required("Address is required"),
        password: Yup.string().required("Password is required"),
    });
    const { handleChange, handleSubmit, values, errors, touched, handleBlur, setValues } = useFormik({
        initialValues: {
            id: "",
            email: "",
            phoneNumber: "",
            userName: "",
            fullName: "",
            address: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit(val) {
            addUser(val);
        },
    });
    useEffect(() => {
        if (id)
            setValues(editData)
    }, [id])
    const addUser = (val) => {
        setLoading(true)
        createAxiosWithToken(authenticate.loginData.token).post('ApplicationUser/Add', val)
            .then(res => {
                console.log(res)
                if (res.data) {
                    toast.open("User Added Successfully.", "text-green-400", <MdOutlineDone />);
                    setIsOpen(!isOpen)
                    getAllUser()
                    setValues({
                        id: "",
                        email: "",
                        phoneNumber: "",
                        userName: "",
                        fullName: "",
                        address: "",
                        password: ""
                    });
                }
                else {
                    toast.open(res.data, "text-red-400", <MdErrorOutline />);
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Error Response:", err.response?.data);
                toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
                setLoading(false)
            })
    };
    const inputBase =
        "w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400";
    const inputError = "border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-400";
    const inputNormal = "border-gray-200";
    return (
        <Model title='Add User' isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <form
                    onSubmit={handleSubmit} className='space-y-4'
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-50">
                                    <AiOutlineMail className="text-base text-blue-500" />
                                </span>
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter Email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.email && touched.email ? inputError : inputNormal}`}
                            />
                            {errors.email && touched.email && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-green-50">
                                    <AiOutlinePhone className="text-base text-green-500" />
                                </span>
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter Phone Number"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.phoneNumber && touched.phoneNumber ? inputError : inputNormal}`}
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-100">
                                    <AiOutlineUser className="text-base text-gray-500" />
                                </span>
                                User Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                placeholder="Enter User Name"
                                value={values.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.userName && touched.userName ? inputError : inputNormal}`}
                            />
                            {errors.userName && touched.userName && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.userName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-purple-50">
                                    <AiOutlineIdcard className="text-base text-purple-500" />
                                </span>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter Full Name"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.fullName && touched.fullName ? inputError : inputNormal}`}
                            />
                            {errors.fullName && touched.fullName && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.fullName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-teal-50">
                                    <AiOutlineHome className="text-base text-teal-500" />
                                </span>
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter Address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.address && touched.address ? inputError : inputNormal}`}
                            />
                            {errors.address && touched.address && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.address}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-50">
                                    <AiOutlineLock className="text-base text-amber-500" />
                                </span>
                                Password
                            </label>
                            <input
                                // type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${inputBase} ${errors.password && touched.password ? inputError : inputNormal}`}
                            />
                            {errors.password && touched.password && (
                                <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-3 mb-2 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md py-2 font-semibold shadow-md hover:bg-indigo-700 transition ${loading ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                            >
                                {loading ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <AiOutlineSave className="text-lg" />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Model>
    );
}