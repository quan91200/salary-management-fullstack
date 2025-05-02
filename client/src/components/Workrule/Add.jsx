import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import workRuleApi from '../../api/workRuleApi.js'

const Add = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    reset({
      name: '',
      work_type: '',
      min_work_hours: ''
    })
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const payload = {
        ...data,
        min_work_hours: parseFloat(data.min_work_hours),
      }
      console.log("Before created: ", payload)
      await workRuleApi.create(payload)
      console.log("WorkRule: ", payload)
      toast.success('Tạo quy tắc làm việc thành công!')
      onCreated?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo quy tắc làm việc:', error)
      toast.error('Có lỗi khi tạo quy tắc làm việc!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position='center'>
      <div className='bg-white rounded-md p-6 max-w-2xl w-2xl'>
        <h2 className="text-lg font-semibold mb-4">Thêm quy định tính lương</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên quy định tính lương"
            name="name"
            isRequired
            {...register('name', { required: 'Vui lòng nhập tên quy tắc' })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Select
            label="Dành cho loại nhân viên"
            name="work_type"
            required
            options={[
              { label: 'Fulltime', value: 'fulltime' },
              { label: 'Parttime', value: 'parttime' }
            ]}
            {...register('work_type', { required: 'Vui lòng chọn loại công việc' })}
          />
          {errors.work_type && <p className="text-red-500 text-sm">{errors.work_type.message}</p>}

          <Input
            label="Số giờ làm tối thiểu"
            name="min_work_hours"
            type="number"
            step="0.1"
            isRequired
            {...register('min_work_hours', {
              required: 'Vui lòng nhập số giờ làm tối thiểu',
              min: { value: 1, message: 'Giá trị phải lớn hơn 0' }
            })}
          />
          {errors.min_work_hours && (
            <p className="text-red-500 text-sm">{errors.min_work_hours.message}</p>
          )}

          <div className="flex justify-end pt-4 space-x-2">
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