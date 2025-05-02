import React, { useState, useEffect } from 'react'
import Pagination from '../../components/Pagination'
import Add from '../../components/Employee/Add'
import Edit from '../../components/Employee/Edit'
import { toast } from 'react-toastify'
import api from '../../api/employeeApi.js'
import { useAuth } from '../../context/authContext.jsx'
import { isAdminOrHR } from '../../constants/roles.js'
import UploadEmployeeModal from '../../components/UploadEmployeeModal'
import ActionEmployee from '../../components/Action/ActionEmployee.jsx'
import { formatNumberWithComma } from '../../utils/spFunc.js'

const Employee = () => {
    const { user } = useAuth()
    const role = user.role
    const [employee, setEmployee] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15
    const totalPages = Math.ceil(employee.length / pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAllEmployees()
            setEmployee(res.data)
            console.log("Employee: ", res.data)
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (item) => {
        setEditItem(item)
        setIsEditOpen(true)
    }

    const handleDelete = async (item) => {
        const confirm = window.confirm(`Bạn có chắc muốn xóa nhân viên ${item.name}?`)
        if (!confirm) return

        try {
            await api.deleteEmployee(item.id)
            fetchData()
            toast.info(`Đã xóa nhân viên ${item.name}`)
        } catch (error) {
            console.error('Lỗi khi xóa:', error)
        }
    }

    const paginatedData = employee.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const openAddModal = () => setIsOpen(true)
    const closeAddModal = () => setIsOpen(false)

    return (
        <div>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4 space-x-2">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-semibold text-lg">Danh sách nhân viên</h1>
                    </div>
                    {isAdminOrHR(role) && (
                        <ActionEmployee
                            employees={employee}
                            paginatedData={paginatedData}
                            openModal={openModal}
                            onOpenAddModal={openAddModal}
                        />
                    )}
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã NV</th>
                            <th className="px-4 py-2 text-left">Họ tên</th>
                            <th className="px-4 py-2 text-left">Phòng ban</th>
                            <th className="px-4 py-2 text-left">Chức vụ</th>
                            <th className="px-4 py-2 text-left">Loại nhân viên</th>
                            <th className="px-4 py-2 text-left">SĐT</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Lương cơ bản</th>
                            {(role === 'admin' || role === 'nhân sự') && (
                                <th className="px-4 py-2 text-left">Thao tác</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {employee.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2 uppercase">{row.code || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.name}</td>
                                    <td className="px-4 py-2 capitalize">{row.department?.name || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.position?.name || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.type || '---'}</td>
                                    <td className="px-4 py-2">{row.phone || '---'}</td>
                                    <td className="px-4 py-2 lowercase">{row.email || '---'}</td>
                                    <td className="px-4 py-2 lowercase">{(formatNumberWithComma(row.default_basic_salary))}</td>
                                    {(isAdminOrHR(role)) && (
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button className="text-blue-500 hover:underline" onClick={() => handleEdit(row)}>Chỉnh sửa</button>
                                                <button className="text-red-500 hover:underline" onClick={() => handleDelete(row)}>Xóa</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center text-gray-500 py-4">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Add isOpen={isOpen} onClose={closeAddModal} onCreated={fetchData} />
                <Edit isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} employees={editItem} onUpdated={fetchData} />
                <UploadEmployeeModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
    )
}

export default Employee