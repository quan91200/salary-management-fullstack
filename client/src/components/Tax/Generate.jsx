import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/taxApi.js'
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
      const res = await api.createAll(payload)
      console.log('Tạo thành công hàng loạt thuế TNCN:', res.data)
      toast.success('Đã tạo hàng loạt thông tin thuế nhân viên!')
      onCreated?.()
      onClose()
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu:', err)
      alert('Đã xảy ra lỗi khi tạo thuế cho nhân viên. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
        <h2 className="text-lg font-semibold mb-4">Thêm Thuế Nhân viên hàng loạt</h2>
        <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className='flex items-start justify-center space-x-5 w-full'>
            <div className='flex flex-col space-y-5 w-full'>
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
            </div>
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