import React from 'react'

export default function Modal({ isOpen, setIsOpen, title, children }) {
    const changeIsOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden={!isOpen}
            className={
                (!isOpen ? "hidden " : "") +
                "flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 bg-slate-900/50 justify-center items-center w-full max-h-full"
            }
        >
            <div className="relative p-4 w-full max-w-2xl overflow-hidden">
                <div className="relative bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-700 rounded-t-xl">
                        <h3 className="text-base font-semibold text-white">
                            {title}
                        </h3>
                        <button
                            onClick={changeIsOpen}
                            type="button"
                            className="text-white bg-transparent hover:bg-gray-100 hover:text-black rounded-lg text-sm w-7 h-7 ms-auto inline-flex justify-center items-center transition-colors duration-150"
                        >
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}