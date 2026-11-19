// ... (imports remain the same)

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { createAxiosWithToken } from "../../../CreateAxios";
import { MdErrorOutline, MdOutlineDone } from "react-icons/md";
import { AiOutlineHome, AiOutlineIdcard, AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import Model from "../../../controls/Model";
import { useToast } from "../../../toast/ToastProvider";
import * as Yup from "yup";
import { useAuthenticate } from "../../../useAuthenticate";

export default function EditUser({ isOpen, setIsOpen, id, getAllUser, editData }) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [authenticate, setAuthenticate] = useAuthenticate()

    const schema = Yup.object().shape({
        email: Yup.string().required("Email is required"),
        phoneNumber: Yup.string().required("Phone Number is required"),
        userName: Yup.string().required("User Name is required"),
        fullName: Yup.string().required("Full Name is required"),
        address: Yup.string().required("Address is required"),
        password: Yup.string()
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
        enableReinitialize: true,
        onSubmit(val) {
            editUser(val);
        },
    });

    useEffect(() => {
        if (editData) {
            setValues({
                id: editData.id || "",
                email: editData.email || "",
                phoneNumber: editData.phoneNumber || "",
                userName: editData.userName || "",
                fullName: editData.fullName || "",
                address: editData.address || "",
                password: ""
            });
        }
    }, [editData]);

    const editUser = (val) => {
        setLoading(true);
        createAxiosWithToken(authenticate.loginData.token).post('ApplicationUser/Update', val)
            .then((res) => {
                if (res.data) {
                    toast.open("User Edited Successfully.", "text-green-400", <MdOutlineDone />);
                    setIsOpen(false);
                    getAllUser();
                } else {
                    toast.open("Failed to update user.", "text-red-400", <MdErrorOutline />);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error Response:", err.response?.data);
                toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
                setLoading(false);
            });
    };

    return (
        <Model title='Edit User' isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="px-4 py-2">
                <form onSubmit={handleSubmit}
                >
                    <div className="space-y-3 gap-2 p-2">
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlineMail className="text-xl text-blue-500" /> Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-md border px-4 py-2 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.email && touched.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlinePhone className="text-xl text-green-500" /> Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-md border px-4 py-2 ${errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.phoneNumber && touched.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlineUser className="text-xl text-gray-500" /> User Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={values.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-md border px-4 py-2 ${errors.userName && touched.userName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.userName && touched.userName && <p className="text-red-600 text-sm">{errors.userName}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlineIdcard className="text-xl text-purple-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-md border px-4 py-2 ${errors.fullName && touched.fullName ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.fullName && touched.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlineHome className="text-xl text-teal-500" /> Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-md border px-4 py-2 ${errors.address && touched.address ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.address && touched.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold">
                                <AiOutlineLock className="text-xl text-amber-500" /> Password
                            </label>
                            <input
                                // type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Leave empty to keep existing"
                                className={`w-full rounded-md border px-4 py-2 ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.password && touched.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                        </div>
                        <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-3 mb-2 bg-indigo-600 text-white rounded-md py-2 font-semibold hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    </div>

                    
                </form>
            </div>
        </Model>
    );
}
