import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAxiosWithToken } from "../../../CreateAxios";
import Model from "../../../controls/Model";
import { AiOutlineEdit, AiOutlineFileText, AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineDone, MdErrorOutline } from "react-icons/md";
import { useToast } from "../../../toast/ToastProvider";
import { useAuthenticate } from "../../../useAuthenticate";

export default function EditTask({ isOpen, setIsOpen, id, getAll, editData }) {
  const [loading, setLoading] = useState(false);
  const [isCompleted] = useState("0");
  const toast = useToast()
  const [authenticate, setAuthenticate] = useAuthenticate()

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    isCompleted: Yup.string().required("Status is required"),
  });

  const { handleChange, handleSubmit, values, errors, touched, handleBlur, setValues } = useFormik({
    initialValues: {
      id: id,
      title: "",
      description: "",
      isCompleted: isCompleted,
      priority: 1,
      dueDate: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit(val) {
      val.isCompleted = Number(val.isCompleted);
      val.priority = Number(val.priority);
      val.dueDate = val.dueDate || null;
      editTask(val);
    },
  });

  useEffect(() => {
    if (id && editData) {
      setValues({
        ...editData,
        isCompleted: String(editData.isCompleted),
        priority: String(editData.priority ?? 1),
        dueDate: editData.dueDate ? editData.dueDate.slice(0, 10) : "",
      });
    }
  }, [id, editData, setValues])

  const editTask = (val) => {
    setLoading(true);
    createAxiosWithToken(authenticate.loginData.token).post("TaskManager/UpdateTasks", val)
      .then((res) => {
        if (res.data) {
          toast.open("Task Edited Successfully.", "text-green-400", <MdOutlineDone />);
          setIsOpen(!isOpen)
          getAll()
        } else {
          toast.open(res.data.result.message, "text-red-400", <MdErrorOutline />);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.open("Something went wrong!", "text-red-400", <MdErrorOutline />);
        setLoading(false);
      })
  };

  return (
    <Model title='Edit Task' isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">

        {/* Title */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
            <AiOutlineEdit size={13} className="text-blue-500" />
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300
              outline-none transition-all
              ${errors.title && touched.title
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'}`}
          />
          {errors.title && touched.title && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <MdErrorOutline size={13} /> {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
            <AiOutlineFileText size={13} className="text-amber-500" />
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Enter description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300
              outline-none transition-all
              ${errors.description && touched.description
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'}`}
          />
          {errors.description && touched.description && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <MdErrorOutline size={13} /> {errors.description}
            </p>
          )}
        </div>

        {/* Priority and due date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Priority</label>
            <select
              name="priority"
              value={values.priority}
              onChange={handleChange}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Due date</label>
            <input
              type="date"
              name="dueDate"
              value={values.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Is Completed */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest">
            <AiOutlineCheckCircle size={13} className="text-emerald-500" />
            Status
          </label>
          <select
            name="isCompleted"
            value={values.isCompleted}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 outline-none transition-all
              ${errors.isCompleted && touched.isCompleted
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'}`}
          >
            <option value={1}>✅ Completed</option>
            <option value={0}>⏳ Pending</option>
          </select>
          {errors.isCompleted && touched.isCompleted && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <MdErrorOutline size={13} /> {errors.isCompleted}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
            text-white transition-all mt-1
            ${loading
              ? 'bg-emerald-400 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] shadow-sm shadow-emerald-200'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </>
          ) : 'Save Changes'}
        </button>

      </form>
    </Model>
  );
}