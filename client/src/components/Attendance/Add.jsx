import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import attendanceApi from '../../api/attendanceApi.js'
import EmployeeSelect from '../EmployeeSelect.jsx'
import workRuleApi from '../../api/workRuleApi.js'  // Import API cho workRules

const Add = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [workRules, setWorkRules] = useState([])

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log("Giá trị form hiện tại:", value)
  //   })
  //   return () => subscription.unsubscribe()
  // }, [watch])


  useEffect(() => {
    if (isOpen) {
      workRuleApi.getAll()
        .then(response => {
          setWorkRules(response.data)
        })
        .catch(error => {
          console.error("Lỗi khi lấy danh sách work rules:", error)
          toast.error('Lỗi khi lấy danh sách quy tắc làm việc')
        })

      reset({
        employee_id: '',
        apply_date: '',
        total_work_hours: '',
        work_type: 'fulltime',
        work_rule_id: '',
      })
    }
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    console.log("Attendance: ", data)
    try {
      const [year, month] = data.apply_date.split('-')
      const payload = {
        ...data,
        month: parseInt(month),
        year: parseInt(year),
      }
      await attendanceApi.create(payload)
      toast.success('Tạo bảng chấm công thành công!')
      console.log("Created: ", payload)
      onCreated?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo chấm công:', error)
      toast.error('Có lỗi khi tạo bảng chấm công!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
        <h2 className="text-lg font-semibold mb-4">Tạo bảng chấm công nhân viên</h2>
        <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <EmployeeSelect
            required
            register={register}
            errors={errors}
          />
          <div>
            <Input
              label="Ngày áp dụng"
              name="apply_date"
              type="date"
              isRequired
              {...register('apply_date', { required: 'Vui lòng chọn ngày áp dụng' })}
            />
            {errors.apply_date && <p className="text-sm text-red-500">{errors.apply_date.message}</p>}
          </div>
          <Input
            label="Số giờ đã làm"
            name="total_work_hours"
            type="number"
            isRequired
            {...register('total_work_hours', { required: 'Vui lòng nhập Số giờ đã làm' })}
          />
          {errors.total_work_hours && <p className="text-sm text-red-500">{errors.total_work_hours.message}</p>}
          <Select
            label="Loại công việc"
            name="work_type"
            required
            options={[
              { value: 'fulltime', label: 'Fulltime' },
              { value: 'parttime', label: 'Parttime' }
            ]}
            {...register('work_type', { required: 'Bắt buộc chọn loại công việc' })}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default Add