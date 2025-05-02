import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import EmployeeSelect from '../EmployeeSelect'
import attendanceApi from '../../api/attendanceApi.js'
import employeeApi from '../../api/employeeApi.js'
import workRuleApi from '../../api/workRuleApi.js'

const Edit = ({ isOpen, onClose, onUpdated, attendance }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [employees, setEmployees] = useState([])
  const [workRules, setWorkRules] = useState([])
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeApi.getAllEmployees()
        const formatted = res.data.map(emp => ({
          label: `${emp.code} - ${emp.name}`,
          value: emp.id
        }))
        setEmployees(formatted)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error)
      }
    }

    if (isOpen) {
      fetchEmployees()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && attendance) {
      workRuleApi.getAll()
        .then(response => {
          setWorkRules(response.data)
        })
        .catch(error => {
          console.error("Lỗi khi lấy danh sách work rules:", error)
          toast.error('Lỗi khi lấy danh sách quy tắc làm việc')
        })
      reset({
        employee_id: attendance.employee_id || '',
        apply_date: attendance.apply_date || '',
        total_work_hours: parseFloat(attendance.total_work_hours || ''),
        work_type: attendance.work_type || 'fulltime',
        work_rule_id: attendance.work_rule_id || ''
      })
    }
  }, [isOpen, attendance, reset])

  const onSubmit = async (data) => {
    console.log('Submitting data:', data)
    try {
      const [yearStr, monthStr] = data.apply_date.split('-')
      const payload = {
        ...data,
        month: parseInt(monthStr),
        year: parseInt(yearStr)
      }
      await attendanceApi.update(attendance.id, payload)
      toast.success('Cập nhật bảng chấm công thành công!')
      onUpdated?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật chấm công:', error)
      toast.error('Có lỗi khi cập nhật bảng chấm công!')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
        <h2 className="text-lg font-semibold mb-4">Cập nhật bảng chấm công nhân viên</h2>
        <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <Select
            label="Nhân viên"
            name="employee_id"
            options={employees}
            {...register('employee_id', { required: 'Vui lòng chọn nhân viên' })}
          />
          <Input
            label="Ngày áp dụng"
            name="apply_date"
            type="month"
            id="monthYear"
            {...register('apply_date', { required: 'Vui lòng chọn tháng áp dụng' })}
          />
          <Input
            label="Số giờ đã làm"
            name="total_work_hours"
            isRequired
            {...register('total_work_hours', { required: 'Vui lòng nhập số giờ đã làm' })}
          />
          {errors.total_work_hours && <p className="text-sm text-red-500">{errors.total_work_hours.message}</p>}

          <Select
            label="Loại hình làm việc"
            name="work_type"
            options={[
              { value: 'fulltime', label: 'Fulltime' },
              { value: 'parttime', label: 'Parttime' }
            ]}
            {...register('work_type')}
          />
          {errors.work_type && (
            <p className="text-red-500 text-sm">{errors.work_type.message}</p>
          )}
          <Select
            label="Quy tắc làm việc"
            name="work_rule_id"
            required
            options={workRules.map(rule => ({
              value: rule.id,
              label: rule.name
            }))}
            {...register('work_rule_id', { required: 'Bắt buộc chọn quy tắc làm việc' })}
          />
          {errors.work_rule_id && (
            <p className="text-red-500 text-sm">{errors.work_rule_id.message}</p>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default Edit