import salaryApi from '../../api/salaryApi.js'
import empApi from '../../api/employeeApi.js'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import Input from '../Input.jsx'
import Modal from '../Modal.jsx'
import Button from '../Button.jsx'

const Add = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await empApi.getAllEmployees()
        setEmployees(empRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    reset({
      employee_id: '',
      base_salary: '',
      overtime_salary: '',
      bonus_id: '',
      deduction_id: '',
      advance_id: '',
      tax_id: '',
    })
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    console.log(data)
    try {
      await salaryApi.create(data)
      toast.success(`Đã tạo Bảng lương cho`)
      onCreated?.()
      onClose()
    } catch (error) {
      console.error('Error creating salary component:', error)
      alert('Đã xảy ra lỗi khi tạo bảng lương. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position={'center'}>
      <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
        <h2 className="text-xl font-semibold mb-4">Tạo bảng lương</h2>
        <form className='flex flex-col items-start space-y-5' onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col w-full">
            Nhân viên
            <select {...register('employee_id')} className="border p-2 rounded">
              <option value="">-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.code} - {emp.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Lương cơ bản"
            name="base_salary"
            isRequired
            placeholder="2,000,000"
            {...register('base_salary', {
              required: 'Vui lòng nhập số tiền',
              pattern: {
                value: /^[\d,]+$/,
                message: 'Chỉ được nhập số'
              }
            })}
            {...register('base_salary')}
          />
          {errors.base_salary && <p className="text-sm text-red-500">{errors.base_salary.message}</p>}
          <Input
            label="Lương OT"
            name="overtime_salary"
            isRequired
            placeholder="2,000,000"
            {...register('overtime_salary', {
              required: 'Vui lòng nhập số tiền',
              pattern: {
                value: /^[\d,]+$/,
                message: 'Chỉ được nhập số'
              }
            })}
            {...register('overtime_salary')}
          />
          {errors.overtime_salary && <p className="text-sm text-red-500">{errors.overtime_salary.message}</p>}
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div >
    </Modal >
  )
}

export default Add