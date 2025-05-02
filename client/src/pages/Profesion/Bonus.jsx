import React, { useState, useEffect } from 'react'
import api from '../../api/bonusApi.js'
import { BiDollar } from "react-icons/bi"
import Pagination from '../../components/Pagination'
import Button from '../../components/Button'
import Add from '../../components/Bonus/Add'
import Edit from '../../components/Bonus/Edit'
import { formatNumberWithComma } from '../../utils/spFunc'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/authContext'
import { isAdminOrHR } from '../../constants/roles.js'

const Bonus = () => {
    const { user } = useAuth()
    const role = user.role
    const [bonuses, setBonuses] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    const totalPages = Math.ceil(bonuses.length / pageSize)
    const paginatedData = bonuses.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAll()
            setBonuses(res.data)
            console.log("Bonus: ", res.data)
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

    const handleDelete = async (row) => {
        const { employee_id, month, year, employee_name } = row

        if (window.confirm(`Bạn có chắc muốn xóa thưởng của nhân viên ${employee_name} trong tháng ${month}/${year}?`)) {
            try {
                await api.delete(employee_id, month, year)
                fetchData()
                toast.info(`Đã xóa thưởng của nhân viên ${employee_name} trong tháng ${month}/${year}`)
            } catch (error) {
                console.error('Lỗi khi xóa:', error)
            }
        }
    }

    return (
        <div className='flex flex-col space-y-2'>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-semibold text-lg">Thưởng và trợ cấp</h1>
                        {isAdminOrHR(role) && (
                            <Button icon={BiDollar} onClick={() => setIsOpen(true)}>Thêm lương thưởng</Button>
                        )}
                    </div>
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã nhân viên</th>
                            <th className="px-4 py-2 text-left">Tên nhân viên</th>
                            <th className="px-4 py-2 text-left">Ngày áp dụng</th>
                            <th className="px-4 py-2 text-left">Thưởng KPI</th>
                            <th className="px-4 py-2 text-left">Thưởng Chức vụ</th>
                            <th className="px-4 py-2 text-left">Thưởng Dự án</th>
                            <th className="px-4 py-2 text-left">Thưởng Hợp đồng</th>
                            <th className="px-4 py-2 text-left">Thưởng Khác</th>
                            <th className="px-4 py-2 text-left">Trợ cấp ăn trưa</th>
                            <th className="px-4 py-2 text-left">Trợ cấp xăng xe</th>
                            {(isAdminOrHR(role)) && (
                                <th className="px-4 py-2 text-left">Hành động</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={`${row.employee_id}_${row.month}_${row.year}`} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                    <td className="px-4 py-2">{row.employee_code || 'N/A'}</td>
                                    <td className="px-4 py-2">{row.employee_name || 'N/A'}</td>
                                    <td className="px-4 py-2">{row.month}/{row.year}</td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'kpi_bonus')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'position_bonus')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'project_bonus')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'contract_bonus')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'other_bonus')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'lunch_allowance')?.amount || 0
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatNumberWithComma(
                                            row.bonuses.find(bonus => bonus.bonus_code === 'transport_allowance')?.amount || 0
                                        )}
                                    </td>

                                    {/* Hành động */}
                                    {(isAdminOrHR(role)) && (
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-500 hover:underline capitalize"
                                                    onClick={() => handleEdit(row)}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    className="text-red-500 hover:underline capitalize"
                                                    onClick={() => handleDelete(row)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
                                    Chưa có dữ liệu ...
                                </td>
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
                bonusData={editItem}
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

export default Bonus