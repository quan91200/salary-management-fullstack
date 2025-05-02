import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import workRuleApi from '../../api/workRuleApi.js'

const Edit = ({ isOpen, onClose, workRule, onUpdated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('workRule in edit modal:', workRule)
    if (isOpen && workRule) {
      reset({
        name: workRule.name || '',
        work_type: workRule.work_type || 'fulltime',
        min_work_hours: parseFloat(workRule.min_work_hours || '')
      })
    }
  }, [isOpen, workRule, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await workRuleApi.update(workRule.id, data)
      toast.success('Cập nhật quy tắc làm việc thành công!')
      onUpdated?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật quy tắc làm việc:', error)
      toast.error('Có lỗi khi cập nhật quy tắc làm việc!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
        <h2 className="text-lg font-semibold mb-4">Chỉnh sửa quy tắc làm việc</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên quy tắc"
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default Edit