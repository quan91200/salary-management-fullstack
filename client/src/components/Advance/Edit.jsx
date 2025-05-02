import React, { useState, useEffect } from 'react'
import api from '../../api/advanceApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import { useForm, Controller } from 'react-hook-form'
import CurrencyInput from '../CurrencyInput'

const Edit = ({ isOpen, onClose, advance, onUpdated }) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !advance) return

        reset({
            employee_id: String(advance.employee_id) || '',
            advance_date: advance.advance_date || '',
            amount: advance.amount || '',
            reason: advance.reason || ''
        })
    }, [isOpen, reset, advance])

    const onSubmit = async (data) => {
        if (!advance?.id) return

        setLoading(true)
        try {
            const [year, month] = data.advance_date.split('-')

            const updatedData = {
                ...data,
                month: parseInt(month),
                year: parseInt(year),
            }
            const res = await api.update(advance.id, updatedData)
            console.log('Cập nhật thành công:', res.data)
            onUpdated?.()
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert(`Đã xảy ra lỗi khi sửa ${advance.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="font-semibold mb-4 text-[1rem]">Sửa tạm ứng lương cho nhân viên: {advance?.employee.code} - {advance?.employee.name}</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center space-y-4">
                        <Input
                            label="Ngày tạm ứng"
                            name="advance_date"
                            placeholder="Ngày tạm ứng"
                            type="date"
                            isRequired
                            {...register('advance_date')}
                        />
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: 'Vui lòng nhập số tiền tạm ứng' }}
                            render={({ field }) => (
                                <CurrencyInput
                                    label='Số tiền tạm ứng'
                                    isRequired
                                    {...field}
                                />
                            )}
                        />
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                        <Input
                            label="Lý do tạm ứng"
                            name="reason"
                            placeholder="Lý do tạm ứng"
                            {...register('reason')}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
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