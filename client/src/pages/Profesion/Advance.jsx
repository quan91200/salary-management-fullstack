import React, { useState, useEffect } from 'react'
import api from '../../api/advanceApi.js'
import Button from '../../components/Button.jsx'
import Pagination from '../../components/Pagination.jsx'
import { LiaMoneyCheckAltSolid } from "react-icons/lia"
import { formatNumberWithComma } from '../../utils/spFunc.js'
import Add from '../../components/Advance/Add.jsx'
import Edit from '../../components/Advance/Edit.jsx'
import { toast } from 'react-toastify'

const Advance = () => {
    const [advances, setAdvances] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(advances.length / pageSize)
    const paginatedData = advances.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAll()
            setAdvances(res.data)
            console.log('Dữ liệu tạm ứng lương:', res.data)
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
        const confirm = window.confirm(`Bạn có chắc muốn xóa tạm ứng lương của ${item.employees.name}?`)
        if (!confirm) return

        try {
            await api.delete(item.id)
            fetchData()
            toast.info(`Đã xóa Tạm ứng của ${item.employees.name}`)
        } catch (error) {
            console.error('Lỗi khi xóa:', error)
        }
    }
    return (
        <div>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4 space-x-2">
                    <div className='flex items-center space-x-2'>
                        <h1 className="font-semibold text-lg">Danh sách tạm ứng lương</h1>
                        <Button onClick={() => setIsOpen(true)} icon={LiaMoneyCheckAltSolid}>
                            Thêm mới Tạm ứng
                        </Button>
                    </div>
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã NV</th>
                            <th className="px-4 py-2 text-left">Họ tên NV</th>
                            <th className="px-4 py-2 text-left">Ngày tạm ứng</th>
                            <th className="px-4 py-2 text-left">Số tiền tạm ứng</th>
                            <th className="px-4 py-2 text-left">Lý do tạm ứng</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {advances.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2">{row.employee.code || '---'}</td>
                                    <td className="px-4 py-2">{row.employee.name}</td>
                                    <td className="px-4 py-2">
                                        {row.month && row.year ? `${row.month}/${row.year}` : '---'}
                                    </td>
                                    <td className="px-4 py-2">{formatNumberWithComma(row.amount) || '---'}</td>
                                    <td className="px-4 py-2">{row.reason || '---'}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button className='text-blue-500 hover:underline' onClick={() => handleEdit(row)}>Chỉnh sửa</button>
                                            <button className='text-red-500 hover:underline' onClick={() => handleDelete(row)}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
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
                onUpdated={fetchData}
                advance={editItem}
            />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default Advance