import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/salaryApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'

const Generate = ({ isOpen, onClose, onCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    reset({
      apply_date: '',
    })
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const [year, month] = data.apply_date.split('-')
      const payload = {
        ...data,
        month: parseInt(month),
        year: parseInt(year),
      }
      await api.generate(payload)
      console.log(payload)
      toast.success('Đã tạo hàng loạt lương nhân viên!')
      onCreated?.()
      onClose()
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error)
      alert('Đã xảy ra lỗi khi tạo lương cho nhân viên. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} position='center'>
      <div className='bg-white rounded-md p-6 max-w-2xl w-2xl'>
        <h2 className='text-lg font-semibold mb-4'>Tạo bảng lương nhân viên hàng loạt</h2>
        <form className='flex flex-col space-y-4 w-full' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-3 w-full'>
            <Input
              label="Ngày áp dụng"
              name="apply_date"
              type="month"
              id="monthYear"
              isRequired
              {...register('apply_date', { required: 'Vui lòng chọn ngày áp dụng' })}
            />
            {errors.apply_date && <p className="text-sm text-red-500">{errors.apply_date.message}</p>}
          </div>
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

export default Generate