import React, { useState, useEffect } from 'react'
import api from '../../api/workRuleApi.js'
import Pagination from '../../components/Pagination.jsx'
import Button from '../../components/Button.jsx'
import Add from '../../components/Workrule/Add.jsx'
import Edit from '../../components/Workrule/Edit.jsx'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext.jsx'
import { isAdminOrKeToan } from '../../constants/roles.js'
import { formatNumberWithComma } from '../../utils/spFunc.js'
import { IoShieldCheckmarkOutline } from "react-icons/io5"

const WorkRule = () => {
    const { user } = useAuth()
    const role = user.role
    const [workRule, setWorkRule] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(workRule.length / pageSize)
    const paginatedData = workRule.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAll()
            setWorkRule(res.data)
            console.log("Work Rule: ", res.data)
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
        if (window.confirm(`Bạn có chắc muốn xóa Quy định ${item.name}?`)) {
            try {
                await api.delete(item.id)
                fetchData()
                toast.info(`Đã xóa Quy định ${item.name}`)
            } catch (error) {
                const msg = error.response?.data?.message || 'Lỗi xóa Quy định'
                toast.error(msg)
                console.error('Lỗi khi xóa:', error)
            }
        }
    }
    return (
        <>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className='flex items-center space-x-2'>
                        <h1 className="font-semibold text-lg">Quy định tính lương</h1>
                        {isAdminOrKeToan(role) && (
                            <Button onClick={() => setIsOpen(true)} icon={IoShieldCheckmarkOutline}>
                                Thêm quy định mới
                            </Button>
                        )}
                    </div>
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Tên bảng tính lương</th>
                            <th className="px-4 py-2 text-left">Dành cho nhân viên</th>
                            <th className="px-4 py-2 text-left">Số thời gian tối thiểu</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workRule.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2 uppercase">{row.name || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.work_type || '---'}</td>
                                    <td className="px-4 py-2">{formatNumberWithComma(row.min_work_hours)} Giờ</td>
                                    {isAdminOrKeToan(role) && (
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button className='text-blue-500 hover:underline' onClick={() => handleEdit(row)}>Chỉnh sửa</button>
                                                <button className='text-red-500 hover:underline' onClick={() => handleDelete(row)}>Xóa</button>
                                            </div>
                                        </td>
                                    )}
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
                workRule={editItem}
                onUpdated={fetchData}
            />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </>
    )
}

export default WorkRule