import React, { useState, useEffect } from 'react'
import api from '../../api/bonusApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import EmployeeSelect from '../EmployeeSelect'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import CurrencyInput from '../CurrencyInput'

const Add = ({ isOpen, onClose, onCreated }) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        reset({
            employee_id: '',
            kpi_bonus: 0,
            position_bonus: 0,
            project_bonus: 0,
            contract_bonus: 0,
            other_bonus: 0,
            lunch_allowance: 0,
            transport_allowance: 0,
            apply_date: '',
        })
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setLoading(true)
        const [year, month] = data.apply_date.split('-')

        const createBonuses = (data) => {
            const bonusFields = [
                { id: 1, field: 'kpi_bonus' },
                { id: 2, field: 'position_bonus' },
                { id: 3, field: 'project_bonus' },
                { id: 4, field: 'contract_bonus' },
                { id: 5, field: 'other_bonus' },
                { id: 6, field: 'lunch_allowance' },
                { id: 7, field: 'transport_allowance' },
            ]

            return bonusFields.map((bonus) => ({
                bonus_id: bonus.id,
                amount: data[bonus.field] || 0,
            }))
        }
        const bonuses = createBonuses(data)
        const payload = {
            ...data,
            month: parseInt(month),
            year: parseInt(year),
            bonuses
        }

        try {
            await api.create(payload)
            toast.success(`Đã tạo lương thưởng thành công`)
            onCreated?.()
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi thưởng:', err)
            alert('Đã xảy ra lỗi khi tạo thưởng. Vui lòng thử lại!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Thêm Thưởng / Trợ cấp</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className='flex flex-col space-y-1'>
                            <EmployeeSelect
                                register={register}
                                errors={errors}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                label="Ngày áp dụng"
                                name="apply_date"
                                type="month"
                                id="monthYear"
                                isRequired
                                {...register('apply_date', {
                                    required: 'Ngày áp dụng là bắt buộc'
                                })}
                            />
                            {errors.apply_date && <p className="text-sm text-red-500">{errors.apply_date.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="kpi_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng KPI' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Thưởng KPI'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.kpi_bonus && <p className="text-sm text-red-500">{errors.kpi_bonus.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="position_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Chức vụ' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Thưởng Chức vụ'
                                        isRequired
                                        {...field}
                                    />
                                )}
                            />
                            {errors.position_bonus && <p className="text-sm text-red-500">{errors.position_bonus.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="project_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Dự án' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Thưởng Dự án'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.project_bonus && <p className="text-sm text-red-500">{errors.project_bonus.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="contract_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Hợp đồng' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Thưởng Hợp đồng'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.contract_bonus && <p className="text-sm text-red-500">{errors.contract_bonus.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="other_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Khác' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Thưởng Khác'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.other_bonus && <p className="text-sm text-red-500">{errors.other_bonus.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="lunch_allowance"
                                control={control}
                                rules={{ required: 'Nhập số tiền Trợ cấp ăn trưa' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Trợ cấp ăn trưa'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.lunch_allowance && <p className="text-sm text-red-500">{errors.lunch_allowance.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <Controller
                                name="transport_allowance"
                                control={control}
                                rules={{ required: 'Nhập số tiền Trợ cấp xăng xe' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Trợ cấp xăng xe'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.transport_allowance && <p className="text-sm text-red-500">{errors.transport_allowance.message}</p>}
                        </div>
                    </div>
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