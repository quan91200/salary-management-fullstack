import React, { useState, useEffect } from 'react'
import Button from '../Button'
import { IoTrashOutline } from 'react-icons/io5'
import api from '../../api/taxApi.js'
import { toast } from 'react-toastify'
import employeeApi from '../../api/employeeApi.js'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'

const Delete = ({ isOpen, onClose, onDeleted }) => {
  const { control, handleSubmit, reset } = useForm()
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await employeeApi.getAllEmployees()
        setEmployeeOptions(empRes.data)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    }
    fetchData()
  }, [])

  const resetForm = () => {
    reset()
    setMonth('')
    setYear('')
    setConfirm(false)
  }

  const onSubmit = async (formData) => {
    try {
      const params = {}

      const selectedEmployees = formData.code || []
      if (selectedEmployees.length > 0) {
        params.employee_codes = selectedEmployees.map(emp => emp.code).join(',')
      }

      if (month && year) {
        params.month = month
        params.year = year
      }

      if (selectedEmployees.length === 0 && !month && !year && confirm) {
        params.confirm = true
      }

      const query = new URLSearchParams(params).toString()
      const url = `${query}`

      console.log('params:', params)
      await api.delete(url)

      if (selectedEmployees.length > 0 && month && year) {
        toast.info(`Xóa thuế TNCN cho các nhân viên ${params.employee_codes} tháng ${month}, ${year} thành công`)
      } else if (selectedEmployees.length > 0) {
        toast.info(`Xóa thuế nhân viên ${params.employee_codes} thành công`)
      } else if (month && year) {
        toast.info(`Xóa thuế TNCN tháng ${month} năm ${year} thành công`)
      } else if (confirm) {
        toast.info('Xóa toàn bộ dữ liệu thành công')
      } else {
        toast.info('Xóa dữ liệu thành công')
      }

      onDeleted()
      onClose()
    } catch (error) {
      console.error('Lỗi khi xóa thuế:', error)
      toast.error('Có lỗi khi xóa thuế')
    }
  }

  const monthsInVietnamese = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ]

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.65)] flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-2xl">
          <h2 className="text-lg font-semibold mb-4">Xác nhận xóa thuế</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Chọn nhân viên</label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={employeeOptions}
                    getOptionLabel={(option) => `${option.code} (${option.name})`}
                    getOptionValue={(option) => option.code}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Chọn tháng và năm</label>
              <div className="flex space-x-4">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Chọn tháng</option>
                  {monthsInVietnamese.map((monthName, index) => (
                    <option key={index} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
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
              <label htmlFor="confirm" className="text-sm">Xóa tất cả dữ liệu</label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => { onClose(); resetForm(); }} variant="default" type="button">Hủy</Button>
              <Button type="submit" icon={IoTrashOutline}>Xóa</Button>
            </div>
          </form>
        </div>
      </div>
    )
  )
}

export default Delete