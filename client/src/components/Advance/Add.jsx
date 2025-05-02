import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import api from '../../api/advanceApi.js'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import Input from '../../components/Input'
import EmployeeSelect from '../../components/EmployeeSelect'
import { toast } from 'react-toastify'
import CurrencyInput from '../CurrencyInput'

const Add = ({ isOpen, onClose, onCreated }) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (!isOpen) return
        reset({
            employee_id: '',
            advance_date: '',
            amount: '',
            reason: ''
        })
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        console.log(data)
        setLoading(true)
        try {
            const [year, month] = data.advance_date.split('-')
            const payload = {
                ...data,
                month: parseInt(month),
                year: parseInt(year),
            }
            await api.create(payload)
            console.log(payload)
            toast.success(`Đã tạo Tạm ứng lương`)
            onCreated?.()
            onClose()
        } catch (error) {
            console.error('Lỗi khi tạo tạm ứng lương:', error)
            const errorMessage = error?.response?.data?.message
            if (errorMessage === 'Nhân viên này đã ứng lương trong tháng này rồi') {
                toast.error(errorMessage)
            } else {
                toast.error('Đã xảy ra lỗi khi tạo tạm ứng lương. Vui lòng thử lại!')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white p-6 rounded-md max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Thêm Tạm ứng lương</h2>
                <form className="flex flex-col items-start space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-2 w-full gap-5'>
                        <EmployeeSelect
                            required
                            register={register}
                            errors={errors}
                            className='w-1/2'
                        />
                        <div>
                            <Input
                                label="Ngày tạm ứng"
                                name="advance_date"
                                type="date"
                                isRequired
                                {...register('advance_date', { required: 'Vui lòng chọn ngày tạm ứng' })}
                            />
                            {errors.advance_date && <p className="text-sm text-red-500">{errors.advance_date.message}</p>}
                        </div>
                        <div>
                            <Controller
                                name="amount"
                                control={control}
                                rules={{ required: 'Nhập số tiền tạm ứng' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Số tiền tạm ứng'
                                        isRequired
                                        {...field}
                                    />
                                )}
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                        </div>
                        <div>
                            <Input
                                label="Lý do tạm ứng"
                                name="reason"
                                placeholder="Nhập lý do tạm ứng"
                                {...register('reason')}
                            />
                            {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
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