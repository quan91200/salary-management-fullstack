import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import Pagination from '../../components/Pagination'
import Add from '../../components/Department/Add'
import Edit from '../../components/Department/Edit'
import { IoPersonAddOutline } from "react-icons/io5"
import { toast } from 'react-toastify'
import api from '../../api/departmentApi.js'
import DepartmentList from '../../components/Export/DepartmentList'

const Department = () => {
    const [department, setDepartment] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(department.length / pageSize)
    const paginatedData = department.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAllDepartments()
            setDepartment(res.data)
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
        if (window.confirm(`Bạn có chắc muốn xóa phòng ban ${item.name}?`)) {
            try {
                await api.deleteDepartment(item.id)
                fetchData()
                toast.info(`Đã xóa phòng ban ${item.name}`)
            } catch (error) {
                const msg = error.response?.data?.message || 'Lỗi xóa phòng ban'
                toast.error(msg)
                console.error('Lỗi khi xóa:', error)
            }
        }
    }
    console.log("Departments: ", department)
    return (
        <div>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-semibold text-lg">Danh sách phòng ban</h1>
                        <Button onClick={() => setIsOpen(true)} icon={IoPersonAddOutline}>
                            Tạo Phòng ban
                        </Button>
                    </div>
                    {/* <DepartmentList departments={department} paginatedData={paginatedData} /> */}
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã phòng ban</th>
                            <th className="px-4 py-2 text-left">Tên phòng ban</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {department.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2 uppercase">{row.code || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.name}</td>
                                    <td className="px-4 py-2 lowercase">{row.email}</td>
                                    <td className="px-4 py-2 capitalize">{row.status}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button className="text-blue-500 hover:underline capitalize" onClick={() => handleEdit(row)}>
                                                Chỉnh sửa
                                            </button>
                                            <button className="text-red-500 hover:underline capitalize" onClick={() => handleDelete(row)}>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                    Chưa có dữ liệu ...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Add
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onCreated={fetchData}
                />
                <Edit
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    department={editItem}
                    onUpdated={fetchData}
                />
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Department