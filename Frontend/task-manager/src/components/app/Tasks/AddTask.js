import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAxiosWithToken } from "../../../CreateAxios";
import Model from "../../../controls/Model";
import { MdOutlineDone, MdErrorOutline } from "react-icons/md";
import { AiOutlineEdit, AiOutlineFileText, AiOutlineCheckCircle } from "react-icons/ai";
import { useToast } from "../../../toast/ToastProvider";
import { useAuthenticate } from "../../../useAuthenticate";

export default function AddTask({ isOpen, setIsOpen, id, getAll, editData }) {
  const [loading, setLoading] = useState(false);
  const [authenticate, setAuthenticate] = useAuthenticate();
  const [isCompleted] = useState("0");
  const toast = useToast();

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    isCompleted: Yup.string().required("Status is required"),
  });

  const { handleChange, handleSubmit, values, errors, touched, handleBlur, setValues } =
    useFormik({
      initialValues: { title: "", description: "", isCompleted: isCompleted },
      validationSchema: schema,
      onSubmit(val) {
        val.isCompleted = Number(val.isCompleted);
        addTask(val);
      },
    });

  useEffect(() => {
    if (id) setValues(editData);
  }, [id]);

  const addTask = (val) => {
    setLoading(true);
    createAxiosWithToken(authenticate.loginData.token)
      .post("TaskManager/AddTasks", val)
      .then((res) => {
        if (res.data) {
          toast.open("Task Added Successfully.", "text-green-500", <MdOutlineDone />);
          setIsOpen(!isOpen);
          getAll();
          setValues({ title: "", description: "", isCompleted: "0" });
        } else {
          toast.open(res.data.result.message, "text-red-500", <MdErrorOutline />);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.open("Something went wrong!", "text-red-500", <MdErrorOutline />);
        setLoading(false);
      });
  };

  const inputBase =
    "w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400";
  const inputError = "border-red-400 bg-red-50 focus:ring-red-300 focus:border-red-400";
  const inputNormal = "border-gray-200";

  return (
    <Model title="Add Task" isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="px-4 pb-4 pt-2 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title Field */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-100 text-indigo-500">
                <AiOutlineEdit className="text-sm" />
              </span>
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Design landing page"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputBase} ${errors.title && touched.title ? inputError : inputNormal}`}
            />
            {errors.title && touched.title && (
              <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 text-amber-500">
                <AiOutlineFileText className="text-sm" />
              </span>
              Description
            </label>
            <textarea
              name="description"
              placeholder="Briefly describe the task..."
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`${inputBase} resize-none ${errors.description && touched.description ? inputError : inputNormal}`}
            />
            {errors.description && touched.description && (
              <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                {errors.description}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 text-emerald-500">
                <AiOutlineCheckCircle className="text-sm" />
              </span>
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Pending Option */}
              <label
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-200 ${
                  String(values.isCompleted) === "0"
                    ? "border-amber-400 bg-amber-50 shadow-sm"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="isCompleted"
                  value="0"
                  checked={String(values.isCompleted) === "0"}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-lg">⏳</span>
                <div>
                  <p className={`text-sm font-semibold leading-tight ${String(values.isCompleted) === "0" ? "text-amber-700" : "text-gray-600"}`}>
                    Pending
                  </p>
                  <p className="text-xs text-gray-400">In progress</p>
                </div>
              </label>

              {/* Completed Option */}
              <label
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-200 ${
                  String(values.isCompleted) === "1"
                    ? "border-emerald-400 bg-emerald-50 shadow-sm"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="isCompleted"
                  value="1"
                  checked={String(values.isCompleted) === "1"}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-lg">✅</span>
                <div>
                  <p className={`text-sm font-semibold leading-tight ${String(values.isCompleted) === "1" ? "text-emerald-700" : "text-gray-600"}`}>
                    Completed
                  </p>
                  <p className="text-xs text-gray-400">All done</p>
                </div>
              </label>
            </div>
            {errors.isCompleted && touched.isCompleted && (
              <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[9px] font-bold">!</span>
                {errors.isCompleted}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gray-200 to-transparent" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200
              ${loading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] hover:shadow-lg hover:shadow-indigo-200"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <MdOutlineDone className="text-base" />
                {id ? "Update Task" : "Save Task"}
              </>
            )}
          </button>

        </form>
      </div>
    </Model>
  );
}