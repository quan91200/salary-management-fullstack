import React from 'react'
import { toast } from 'react-toastify'
import Modal from '../Modal'
import Button from '../Button'
import attendanceApi from '../../api/attendanceApi'

const Delete = ({ isOpen, onClose, onDeleted, attendanceId }) => {
  const handleDelete = async () => {
    try {
      await attendanceApi.delete(attendanceId)
      toast.success('Xóa bảng chấm công thành công!')
      onDeleted?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi xóa chấm công:', error)
      toast.error('Có lỗi khi xóa bảng chấm công!')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="bg-white rounded-md p-6 max-w-md w-full text-center">
        <h2 className="text-lg font-semibold mb-4">Xác nhận xóa bảng chấm công?</h2>
        <p>Bạn có chắc chắn muốn xóa bản ghi này không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Delete