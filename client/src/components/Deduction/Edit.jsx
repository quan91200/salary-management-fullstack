import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../api/deductionApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import { toast } from 'react-toastify'

const Edit = ({ isOpen, onClose, onUpdated, deduction }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        reset({
            code: deduction?.code || '',
            name: deduction?.name || '',
            percentage: deduction?.percentage * 100 || '',
        })
    }, [isOpen, reset, deduction])

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                percentage: parseFloat(data.percentage) / 100
            }

            const res = await api.update(deduction.id, payload)
            console.log('Cập nhật thành công:', res.data)
            onUpdated?.()
            toast.info('Cập nhật thành công!')
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert(`Đã xảy ra lỗi khi sửa ${deduction.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 w-2xl max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Khoản trích theo lương</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col space-y-2 w-full'>
                        <Input
                            label="Mã khoản trích theo lương"
                            name="code"
                            placeholder="VD: BHXH"
                            isRequired
                            {...register('code', { required: 'Mã khoản là bắt buộc' })}
                        />
                        {errors.code && <p className='text-sm text-red-500'>{errors.code.message}</p>}
                        <Input
                            label="Tên khoản trích theo lương"
                            name="name"
                            placeholder="Bảo hiểm xã hội"
                            isRequired
                            {...register('name', { required: 'Tên khoản là bắt buộc' })}
                        />
                        {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
                        <Input
                            label="Tỉ lệ trích theo lương (%)"
                            name="percentage"
                            placeholder=""
                            type="number"
                            step="0.01"
                            min="0"
                            {...register('percentage', {
                                required: 'Không được để trống',
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: 'Phải lớn hơn hoặc bằng 0'
                                },
                                max: {
                                    value: 100,
                                    message: 'Không được lớn hơn 100'
                                }
                            })}
                        />
                        {errors.percentage && <p className='text-sm text-red-500'>{errors.percentage.message}</p>}
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

export default Edit