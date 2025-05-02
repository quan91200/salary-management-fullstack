import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Button from './Button'
import React, { forwardRef } from 'react'

const ExportModal = forwardRef(({
  isOpen,
  onClose,
  data,
  paginatedData,
  onExport,
  filename
}, ref) => {
  const [loading, setLoading] = useState(false)

  const handleExport = (isAll) => {
    setLoading(true)
    onExport(data, filename, isAll, paginatedData)
    setLoading(false)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              ref={ref}
              className="bg-white dark:bg-zinc-900 dark:text-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                Xuất Excel
              </Dialog.Title>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                Bạn muốn xuất dữ liệu nào?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => handleExport(false)}
                  disabled={loading}
                >
                  Trang hiện tại
                </Button>
                <Button
                  onClick={() => handleExport(true)}
                  disabled={loading}
                >
                  Toàn bộ
                </Button>
                <Button
                  variant="default"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
})

export default ExportModal