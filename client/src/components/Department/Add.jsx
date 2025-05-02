import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import Select from '../Select'
import { toast } from 'react-toastify'
import api from '../../api/departmentApi'

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
            email: '',
            phone: '',
            status: ''
        })
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const res = await api.createDepartment(data)
            console.log('Tạo thành công:', res.data)
            toast.success(`Đã tạo ${data.name}`)
            onCreated?.()
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert('Đã xảy ra lỗi khi tạo phòng ban. Vui lòng thử lại!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 w-2xl max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Thêm Phòng ban</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-center space-x-5'>
                        <div className='flex flex-col space-y-2 w-full'>
                            <Input
                                label="Mã phòng ban"
                                name="code"
                                placeholder="VD: PB001"
                                isRequired
                                {...register('code', { required: 'Mã Phòng ban là bắt buộc' })}
                            />
                            {errors.code && <p className='text-sm text-red-500'>{errors.code.message}</p>}
                            <Input
                                label="Tên phòng ban"
                                name="name"
                                placeholder="Phòng Hành chính"
                                isRequired
                                {...register('name', { required: 'Tên phòng ban là bắt buộc' })}
                            />
                            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-2 w-full'>
                            <Input
                                label="Email"
                                name="email"
                                placeholder="abc@company.com"
                                type="email"
                                {...register('email', {
                                    required: 'Email là bắt buộc',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Email không hợp lệ',
                                    }
                                })}
                            />
                            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
                            <Select
                                label="Trạng thái"
                                name="status"
                                required
                                options={statusOptions}
                                {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                            />
                            {errors.status && <p className='text-sm text-red-500'>{errors.status.message}</p>}
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

export default Add