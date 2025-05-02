import React, { useState, useEffect } from 'react'
import { formatNumberWithComma } from '../../utils/spFunc'
import api from '../../api/taxApi.js'
import Pagination from '../../components/Pagination'
import Add from '../../components/Tax/Add'
import ActionTax from '../../components/Action/ActionTax'
import Generate from '../../components/Tax/Generate'
import Delete from '../../components/Tax/Delete'
import { isAdminOrHR } from '../../constants/roles.js'
import { useAuth } from '../../context/authContext'

const Tax = () => {
    const { user } = useAuth()
    const role = user.role
    const [taxes, setTaxes] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [generate, setGenerate] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const pageSize = 10

    const totalPages = Math.ceil(taxes.length / pageSize)
    const paginatedData = taxes.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const fetchData = async () => {
        try {
            const res = await api.getAll()
            setTaxes(res.data)
            console.log("Tax: ", res.data)
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openAddModal = () => setIsOpen(true)
    const openGenerate = () => setGenerate(true)
    const openDelete = () => setIsDelete(true)
    return (
        <div className='flex flex-col space-y-2'>
            <div className="p-4 bg-white shadow rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <h1 className="font-semibold text-lg">Thuế thu nhập cá nhân</h1>
                    </div>
                    {isAdminOrHR(role) && (
                        <ActionTax
                            tax={taxes}
                            paginatedData={paginatedData}
                            onOpenAddModal={openAddModal}
                            onGenerate={openGenerate}
                            onDelete={openDelete}
                        />
                    )}
                </div>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Mã nhân viên</th>
                            <th className="px-4 py-2 text-left">Tên nhân viên</th>
                            <th className="px-4 py-2 text-left">Thu nhập chịu thuế</th>
                            <th className="px-4 py-2 text-left">Số người phụ thuộc</th>
                            <th className="px-4 py-2 text-left">Giảm trừ người nộp</th>
                            <th className="px-4 py-2 text-left">Giảm trừ người phụ thuộc</th>
                            <th className="px-4 py-2 text-left">Thu nhập tính thuế</th>
                            <th className="px-4 py-2 text-left">Thuế TNCN</th>
                            <th className="px-4 py-2 text-left">Ngày áp dụng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => {
                                return (
                                    <tr key={row.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td className="px-4 py-2">{row.employee_code || 'N/A'}</td>
                                        <td className="px-4 py-2">{row.employee_name || 'N/A'}</td>
                                        <td className="px-4 py-2">{formatNumberWithComma(row.gross_income)}</td>
                                        <td className="px-4 py-2">{row.number_of_dependents}</td>
                                        <td className="px-4 py-2">{formatNumberWithComma(row.personal_deduction)}</td>
                                        <td className="px-4 py-2">{formatNumberWithComma(row.dependent_deduction_per_person)}</td>
                                        <td className="px-4 py-2">{formatNumberWithComma(row.taxable_income)}</td>
                                        <td className="px-4 py-2">{formatNumberWithComma(row.tax_amount)}</td>
                                        <td className="px-4 py-2">
                                            {row.month && row.year ? `${row.month}/${row.year}` : '---'}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={12} className="px-4 py-4 text-center text-gray-500">
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
                <Generate
                    isOpen={generate}
                    onClose={() => setGenerate(false)}
                    onCreated={fetchData}
                />
                <Delete
                    isOpen={isDelete}
                    onClose={() => setIsDelete(false)}
                    onDeleted={fetchData}
                />
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div >
    )
}

export default Tax