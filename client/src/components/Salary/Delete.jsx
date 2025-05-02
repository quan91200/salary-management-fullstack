import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import salaryApi from '../../api/salaryApi'
import employeeApi from '../../api/employeeApi'
import Modal from '../Modal'
import Button from '../Button'
import Select from 'react-select'

const Delete = ({ isOpen, onClose, onDeleted }) => {
  const { setValue, control } = useForm()
  const [employeeCodes, setEmployeeCodes] = useState([])
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const fetchEmployees = async () => {
      try {
        const res = await employeeApi.getAllEmployees()
        setEmployeeCodes(res.data)
      } catch (error) {
        console.error('Lỗi khi lấy nhân viên:', error)
      }
    }
    fetchEmployees()
  }, [isOpen])

  const resetForm = () => {
    setMonth('')
    setYear('')
    setConfirm(false)
    setEmployeeCodes([])
  }

  const handleDelete = async () => {
    try {
      const params = {}

      const selectedEmployees = employeeCodes.map(emp => emp.code)
      if (selectedEmployees.length > 0) {
        params.employee_codes = selectedEmployees.join(',')
      }

      if (month && year) {
        params.month = month
        params.year = year
      }

      if (selectedEmployees.length === 0 && !month && !year && confirm) {
        params.confirm = true
      }

      console.log('params:', params)
      await salaryApi.deleteSalary(params)

      toast.success('Xóa dữ liệu lương thành công!')
      onDeleted?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi xóa lương:', error)
      toast.error('Có lỗi khi xóa lương!')
    }
  }

  const monthsInVietnamese = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ]

  const handleMonthChange = (e) => setMonth(e.target.value)
  const handleYearChange = (e) => setYear(e.target.value)

  return (
    isOpen && (
      <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm(); }} position="center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-2xl">
          <h2 className="text-lg font-semibold mb-4">Xác nhận xóa lương</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Chọn nhân viên</label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={employeeCodes}
                  getOptionLabel={(option) => `${option.code} (${option.name})`}
                  getOptionValue={(option) => option.code}
                  onChange={(val) => {
                    field.onChange(val)
                    setValue('code', val)
                    setEmployeeCodes(val)
                  }}
                />
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Chọn tháng và năm</label>
            <div className="flex space-x-4">
              <select
                value={month}
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">--Chọn tháng--</option>
                {monthsInVietnamese.map((monthName, idx) => (
                  <option key={idx} value={idx + 1}>{monthName}</option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={handleYearChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Năm"
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="confirm"
              checked={confirm}
              onChange={() => setConfirm(!confirm)}
              className="mr-2"
            />
            <label htmlFor="confirm" className="text-sm">Xóa toàn bộ dữ liệu</label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => { onClose(); resetForm(); }} variant="default">Hủy</Button>
            <Button onClick={handleDelete}>Xóa</Button>
          </div>
        </div>
      </Modal>
    )
  )
}

export default Delete