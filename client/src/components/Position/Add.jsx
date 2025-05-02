import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import { useForm } from 'react-hook-form'
import Select from '../Select'
import { toast } from 'react-toastify'
import api from '../../api/positionApi.js'

const statusOptions = [
    { label: 'kích hoạt', value: 'kích hoạt' },
    { label: 'không kích hoạt', value: 'không kích hoạt' },
]

const Add = ({ isOpen, onClose, onCreated }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        reset({
            code: '',
            name: '',
            phone: '',
        })
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const res = await api.createPosition(data)
            console.log('Tạo thành công:', res.data)
            toast.success(`Đã tạo ${data.name}`)
            onCreated?.()
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert('Đã xảy ra lỗi khi tạo chức vụ. Vui lòng thử lại!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Thêm Chức vụ</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2'>
                        <Input
                            label="Mã Chức vụ"
                            name="code"
                            placeholder="VD: PB001"
                            isRequired
                            {...register('code', { required: 'Mã Chức vụ là bắt buộc' })}
                        />
                        {errors.code && <p className='text-sm text-red-500'>{errors.code.message}</p>}
                        <Input
                            label="Tên Chức vụ"
                            name="name"
                            placeholder="Trường phòng"
                            isRequired
                            {...register('name', { required: 'Tên Chức vụ là bắt buộc' })}
                        />
                        {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
                        <Select
                            label="Trạng thái"
                            name="status"
                            required
                            options={statusOptions}
                            {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                        />
                        {errors.status && <p className='text-sm text-red-500'>{errors.status.message}</p>}
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

export default Add