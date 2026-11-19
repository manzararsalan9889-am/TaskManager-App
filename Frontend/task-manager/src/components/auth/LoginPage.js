import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import { FaArrowLeft } from "react-icons/fa";
import { useToast } from '../../toast/ToastProvider';
import { useAuthenticate } from '../../useAuthenticate';
import { CreateAxios } from '../../CreateAxios';
import { setLoginInfo } from '../../LoginInfo';
import { MdErrorOutline } from 'react-icons/md';
import { RiShieldUserFill, RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { MdVerifiedUser } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';

const schema = yup.object().shape({
    userName: yup.string().required("Username is required"),
    password: yup.string().min(3, "Min 3 characters").max(15, "Max 15 characters").required("Password is required"),
})

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [authenticate, setAuthenticate] = useAuthenticate()
    const toast = useToast()

    const { handleChange, values, handleSubmit, errors, touched, handleBlur } = useFormik({
        initialValues: { userName: "", password: "" },
        validationSchema: schema,
        onSubmit(val) { getLogin(val) }
    })

    const getLogin = (val) => {
        setLoading(true)
        CreateAxios.post("/ApplicationUser/Token", val)
            .then(res => {
                let mydata = res.data
                if (mydata) {
                    setAuthenticate({ isLogin: true, loginData: mydata })
                    setLoginInfo({ isLogin: true, loginData: mydata })
                } else {
                    toast.open(res.data.result.message, "text-red-400", <MdErrorOutline />)
                    setAuthenticate({ isLogin: false, loginData: "" })
                }
                setLoading(false)
            }).catch(() => {
                toast.open("Incorrect username or password!", "text-red-400", <MdErrorOutline />)
                setLoading(false)
            })
    }

    return (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-4 py-6">

            {/* Card */}
            <div className="w-full max-w-[420px] bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">

                {/* ── TOP BRAND STRIP ── */}
                <div className="bg-emerald-700 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <BiTask size={18} className="text-white" />
                        </div>
                        <span className="text-white font-semibold text-[15px] tracking-tight">Task Board</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/15 text-white/90 text-[11px] font-medium px-3 py-1 rounded-full">
                        <MdVerifiedUser size={11} className="text-emerald-300" />
                        Secure Login
                    </div>
                </div>

                {/* ── FORM BODY ── */}
                <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-3">

                    {/* Heading */}
                    <div className="mb-1">
                        <h2 className="text-xl font-bold text-stone-800 tracking-tight mb-1">Welcome back</h2>
                        <p className="text-xs text-stone-400 font-medium">Sign in to your account to continue</p>
                    </div>

                    {/* ── USERNAME ── */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">
                            <RiShieldUserFill size={13} className="text-emerald-600" />
                            Username
                        </label>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter your username"
                            value={values.userName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 outline-none transition-all
                                ${errors.userName && touched.userName
                                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}`}
                        />
                        {errors.userName && touched.userName && (
                            <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5">
                                <MdErrorOutline size={13} /> {errors.userName}
                            </p>
                        )}
                    </div>

                    {/* ── PASSWORD ── */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">
                            <BsFillShieldLockFill size={12} className="text-emerald-600" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-stone-800 placeholder:text-stone-300 outline-none transition-all
                                    ${errors.password && touched.password
                                        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                {showPassword ? <RiEyeOffFill size={17} /> : <RiEyeFill size={17} />}
                            </button>
                        </div>
                        {errors.password && touched.password && (
                            <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5">
                                <MdErrorOutline size={13} /> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* ── REMEMBER ME ── */}
                    <div className="flex items-center gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`w-[18px] h-[18px] rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all
                                ${rememberMe
                                    ? "bg-emerald-600 border-emerald-600"
                                    : "bg-white border-stone-300 hover:border-stone-400"}`}
                        >
                            {rememberMe && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                                </svg>
                            )}
                        </button>
                        <span
                            className="text-sm text-stone-500 cursor-pointer select-none"
                            onClick={() => setRememberMe(!rememberMe)}
                        >
                            Remember me
                        </span>
                    </div>

                    {/* ── SUBMIT ── */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2
                            ${loading
                                ? "bg-emerald-800 cursor-not-allowed"
                                : "bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] shadow-md shadow-emerald-100"}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in…
                            </>
                        ) : 'Sign In'}
                    </button>

                    {/* ── DIVIDER ── */}
                    <div className="flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-stone-100" />
                        <span className="text-[11px] text-stone-300 font-medium">or</span>
                        <div className="flex-1 h-px bg-stone-100" />
                    </div>

                    {/* ── GO BACK ── */}
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-sm font-medium text-stone-500 hover:text-stone-700 transition-all"
                    >
                        <FaArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
                        Go Back
                    </button>

                </form>
            </div>
        </div>
    )
}