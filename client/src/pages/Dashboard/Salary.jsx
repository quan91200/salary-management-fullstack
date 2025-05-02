import React, { useState, useEffect } from 'react'
import api from '../../api/salaryApi.js'
import Pagination from '../../components/Pagination.jsx'
import { formatNumberWithComma } from '../../utils/spFunc.js'
import ActionSalary from '../../components/Action/ActionSalary.jsx'
import Generate from '../../components/Salary/Generate.jsx'
import Delete from '../../components/Salary/Delete.jsx'
import { isAdminOrKeToan } from '../../constants/roles.js'
import { useAuth } from '../../context/authContext.jsx'

const Salary = () => {
  const { user } = useAuth()
  const role = user.role
  const [salary, setSalary] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [generate, setGenerate] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const pageSize = 15

  const totalPages = Math.ceil(salary.length / pageSize)
  const paginatedData = salary.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const fetchData = async () => {
    try {
      const res = await api.getAll()
      setSalary(res.data)
      console.log("Salary: ", res.data)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openGenerate = () => setGenerate(true)
  const openDelete = () => setIsDelete(true)
  return (
    <div>
      <div className="p-4 bg-white shadow rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-lg">Danh sách Bảng lương</h1>
          {isAdminOrKeToan(role) && (
            <ActionSalary
              salary={salary}
              paginatedData={paginatedData}
              openGenerate={openGenerate}
              openDelete={openDelete}
            />
          )}
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-1 py-2 text-left">STT</th>
              <th className="px-1 py-2 text-left">Mã NV</th>
              <th className="px-1 py-2 text-left">Tên NV</th>
              <th className="px-1 py-2 text-left">Lương cơ bản</th>
              <th className="px-1 py-2 text-left">Tổng thưởng trợ cấp</th>
              <th className="px-1 py-2 text-left">Tạm ứng</th>
              <th className="px-1 py-2 text-left">Thuế TNCN</th>
              <th className="px-1 py-2 text-left">Bảo hiểm bắt buộc</th>
              <th className="px-1 py-2 text-left">Lương ròng</th>
              <th className="px-1 py-2 text-left">Ngày áp dụng</th>
            </tr>
          </thead>
          <tbody>
            {salary.length > 0 ? (
              paginatedData.map((row, idx) => {
                return (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-1 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-1 py-2">{row.employee.code || '---'}</td>
                    <td className="px-1 py-2">{row.employee.name || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.basic_salary) || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.total_bonus) || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.advance_amount) || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.personal_tax_amount) || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.total_deductions) || '---'}</td>
                    <td className="px-1 py-2">{formatNumberWithComma(row.net_salary) || '---'}</td>
                    <td className="px-1 py-2">{(row.month + '/' + row.year) || '---'}</td>
                  </tr>
                )
              })
            ) : (
              <tr className="text-gray-500">
                <td colSpan="100%" className="text-center py-4">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
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
  )
}

export default Salary