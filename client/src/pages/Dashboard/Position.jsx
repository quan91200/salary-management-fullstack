import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import Pagination from '../../components/Pagination'
import Add from '../../components/Position/Add'
import Edit from '../../components/Position/Edit'
import { IoPersonAddOutline } from "react-icons/io5"
import { toast } from 'react-toastify'
import api from '../../api/positionApi.js'
import PositionList from '../../components/Export/PositionList'

const Position = () => {
    const [position, setPosition] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(position.length / pageSize)
    const paginatedData = position.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAllPositions()
            setPosition(res.data)
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
        if (window.confirm(`Bạn có chắc muốn xóa Chức vụ ${item.name}?`)) {
            try {
                await api.deletePosition(item.id)
                fetchData()
                toast.info(`Đã xóa chức vụ ${item.name}`)
            } catch (error) {
                const msg = error.response?.data?.message || 'Lỗi xóa chức vụ'
                toast.error(msg)
                console.error('Lỗi khi xóa:', error)
            }
        }
    }

    return (
        <div>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className='flex items-center space-x-2'>
                        <h1 className="font-semibold text-lg">Danh sách Chức vụ</h1>
                        <Button onClick={() => setIsOpen(true)} icon={IoPersonAddOutline}>
                            Tạo Chức vụ
                        </Button>
                    </div>
                    {/* <PositionList positions={position} paginatedData={paginatedData} /> */}
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã chức vụ</th>
                            <th className="px-4 py-2 text-left">Tên chức vụ</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {position.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2 uppercase">{row.code || '---'}</td>
                                    <td className="px-4 py-2 capitalize">{row.name}</td>
                                    <td className="px-4 py-2 capitalize">{row.status}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button className='text-blue-500 hover:underline capitalize' onClick={() => handleEdit(row)}>Chỉnh sửa</button>
                                            <button className='text-red-500 hover:underline capitalize' onClick={() => handleDelete(row)}>Xóa</button>
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
                <Add
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onCreated={fetchData}
                />
                <Edit
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    position={editItem}
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

export default Position