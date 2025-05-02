import React, { useState, useEffect } from 'react'
import api from '../../api/attendanceApi.js'
import Pagination from '../../components/Pagination'
import Button from '../../components/Button.jsx'
import Add from '../../components/Attendance/Add.jsx'
import Edit from '../../components/Attendance/Edit.jsx'
import Delete from '../../components/Attendance/Delete.jsx'
import UploadAttendanceModal from '../../components/UploadAttendanceModal'
import { useAuth } from '../../context/authContext'
import { isAdminOrHR } from '../../constants/roles'
import { formatNumberWithComma } from '../../utils/spFunc.js'
import { IoAccessibility } from "react-icons/io5"
import { CiImport } from "react-icons/ci"

const Attendance = () => {
  const { user } = useAuth()
  const role = user.role

  const [attendance, setAttendance] = useState([])
  const [selectedAttendance, setSelectedAttendance] = useState(null)

  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.ceil(attendance.length / pageSize)
  const paginatedData = attendance.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const fetchData = async () => {
    try {
      const res = await api.getAll()
      setAttendance(res.data)
      console.log("Attendance: ", res.data)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const openAddModal = () => setIsOpenAdd(true)
  const closeAddModal = () => setIsOpenAdd(false)

  const openEditModal = (item) => {
    setSelectedAttendance(item)
    setIsOpenEdit(true)
  }
  const closeEditModal = () => setIsOpenEdit(false)

  const openDeleteModal = (item) => {
    setSelectedAttendance(item)
    setIsOpenDelete(true)
  }
  const closeDeleteModal = () => setIsOpenDelete(false)

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-4 bg-white shadow rounded-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-lg">Bảng chấm công</h1>
            {isAdminOrHR(role) && (
              <Button icon={IoAccessibility} onClick={openAddModal}>Thêm chấm công</Button>
            )}
          </div>
          <Button icon={CiImport} onClick={openModal}>Import Excel</Button>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Mã nhân viên</th>
              <th className="py-2 px-4 text-left">Tên nhân viên</th>
              <th className="py-2 px-4 text-left">Số giờ đã làm</th>
              <th className="py-2 px-4 text-left">Số giờ làm tối thiểu</th>
              <th className="py-2 px-4 text-left">Loại hình</th>
              <th className="py-2 px-4 text-left">Ngày áp dụng</th>
              <th className="py-2 px-4 text-left">Lương nhận</th>
              {isAdminOrHR(role) && (
                <th className="py-2 px-4 text-left">Hành động</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">Không có dữ liệu</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id} className='border-t hover:bg-gray-50'>
                  <td className="py-2 px-4 text-left">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="py-2 px-4 text-left">{item.employee.code}</td>
                  <td className="py-2 px-4 text-left">{item.employee.name}</td>
                  <td className="py-2 px-4 text-left">{formatNumberWithComma(item.total_work_hours)} Giờ</td>
                  <td className="py-2 px-4 text-left">{formatNumberWithComma(item.workRule.min_work_hours)} Giờ</td>
                  <td className="py-2 px-4 text-left capitalize">{item.work_type}</td>
                  <td className="px-4 py-2">
                    {item.month && item.year ? `${item.month}/${item.year}` : '---'}
                  </td>
                  <td className="py-2 px-4 text-left">{formatNumberWithComma(item.earned_amount)}</td>
                  {isAdminOrHR(role) && (
                    <td className="py-2 px-4 text-left space-x-2">
                      <button className='text-blue-500 hover:underline capitalize' onClick={() => openEditModal(item)}>Sửa</button>
                      <button className='text-red-500 hover:underline capitalize' onClick={() => openDeleteModal(item)}>Xóa</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Add isOpen={isOpenAdd} onClose={closeAddModal} onCreated={fetchData} />
      <Edit isOpen={isOpenEdit} onClose={closeEditModal} onUpdated={fetchData} attendance={selectedAttendance} />
      <Delete isOpen={isOpenDelete} onClose={closeDeleteModal} onDeleted={fetchData} attendanceId={selectedAttendance?.id} />
      <UploadAttendanceModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default Attendance