import React, { useState, useEffect } from 'react'
import api from '../../api/deductionApi.js'
import { IoPersonAddOutline } from "react-icons/io5"
import Pagination from '../../components/Pagination.jsx'
import Button from '../../components/Button.jsx'
import Add from '../../components/Deduction/Add.jsx'
import Edit from '../../components/Deduction/Edit.jsx'
import { toast } from 'react-toastify'

const Deduction = () => {
    const [salary, setSalary] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(salary.length / pageSize)
    const paginatedData = salary.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAll()
            setSalary(res.data)
            console.log("Deduction: ", res.data)
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
        const confirm = window.confirm(`Bạn có chắc muốn xóa  ${item.name}?`)
        if (!confirm) return

        try {
            await api.delete(item.id)
            fetchData()
            toast.info(`Đã xóa chức vụ ${item.name}`)
        } catch (error) {
            console.error('Lỗi khi xóa:', error)
        }
    }
    return (
        <div>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className='flex items-center space-x-2'>
                        <h1 className="font-semibold text-lg">Danh sách các khoản trích theo lương</h1>
                        <Button onClick={() => setIsOpen(true)} icon={IoPersonAddOutline}>
                            Thêm mới
                        </Button>
                    </div>
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã Khoản trích theo lương</th>
                            <th className="px-4 py-2 text-left">Tên Khoản trích theo lương</th>
                            <th className="px-4 py-2 text-left">Tỉ lệ trích theo lương</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salary.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2 uppercase">{row.code || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.name || '---'}</td>
                                    <td className="px-4 py-2">{row.percentage}%</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button className='text-blue-500 hover:underline' onClick={() => handleEdit(row)}>Chỉnh sửa</button>
                                            <button className='text-red-500 hover:underline' onClick={() => handleDelete(row)}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-gray-500">
                                <td colSpan="9" className="text-center text-gray-500 py-4">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Add
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onCreated={fetchData}
            />
            <Edit
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                deduction={editItem}
                onUpdated={fetchData}
            />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Deduction