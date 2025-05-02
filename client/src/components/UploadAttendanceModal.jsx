import React, { useState } from 'react'
import Modal from './Modal'
import api from '../api/attendanceApi.js'
import Button from './Button.jsx'
import { toast } from 'react-toastify'

function UploadAttendanceModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Vui lòng chọn file Excel trước.')
      return
    }

    try {
      setUploading(true)
      await api.upload(file)
      toast.success('Upload thành công!')
      setFile(null)
      onClose()
    } catch (error) {
      console.error(error)
      const apiMessage = error.response?.data?.message || error.message
      toast.error('Upload thất bại: ' + apiMessage)

      const errorFile = error.response?.data?.errorFile
      if (errorFile) {
        toast.info(
          <a
            href={`/${errorFile}`}
            download
            className="text-blue-500 underline"
          >
            Tải về file lỗi
          </a>,
          { autoClose: false }
        )
      }
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} position="center">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload danh sách chấm công
        </h2>

        <label className="block mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
          />
        </label>

        <div className="flex justify-end gap-3">
          <Button variant="default" onClick={handleClose}>Đóng</Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Đang upload...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UploadAttendanceModal