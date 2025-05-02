import React, { useState, useEffect } from 'react'
import api from '../../api/bonusApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import EmployeeSelect from '../EmployeeSelect'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import CurrencyInput from '../CurrencyInput'

const Edit = ({ isOpen, onClose, bonusData, onUpdated }) => {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (bonusData) {

            const bonuses = bonusData.bonuses.reduce((acc, bonus) => {
                acc[bonus.bonus_code] = bonus.amount
                return acc;
            }, {})
            reset({
                ...bonusData,
                kpi_bonus: parseInt(bonuses.kpi_bonus || 0),
                position_bonus: parseInt(bonuses.position_bonus || 0),
                project_bonus: parseInt(bonuses.project_bonus || 0),
                contract_bonus: parseInt(bonuses.contract_bonus || 0),
                other_bonus: parseInt(bonuses.other_bonus || 0),
                lunch_allowance: parseInt(bonuses.lunch_allowance || 0),
                transport_allowance: parseInt(bonuses.transport_allowance || 0),
                apply_date: bonusData.apply_date || '',
            })
            if (bonusData.employee_id) {
                setValue('employee_id', bonusData.employee_id)
            }
        }
    }, [isOpen, bonusData, reset, setValue])

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const res = await api.update(data.employee_id, data)
            console.log('Cập nhật thành công:', res.data)
            onUpdated?.()
            toast.info('Cập nhật thành công!')
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert(`Đã xảy ra lỗi khi sửa ${data.employees.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Sửa Thưởng / Trợ cấp</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1">
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
                                type="date"
                                isRequired
                                {...register('apply_date', {
                                    required: 'Ngày áp dụng là bắt buộc'
                                })}
                            />
                            {errors.apply_date && <p className="text-sm text-red-500">{errors.apply_date.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="kpi_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng KPI' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Thưởng KPI"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.kpi_bonus && <p className="text-sm text-red-500">{errors.kpi_bonus.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="position_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Chức vụ' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Thưởng Chức vụ"
                                        isRequired
                                        {...field}
                                    />
                                )}
                            />
                            {errors.position_bonus && <p className="text-sm text-red-500">{errors.position_bonus.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="project_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Dự án' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Thưởng Dự án"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.project_bonus && <p className="text-sm text-red-500">{errors.project_bonus.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="contract_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Hợp đồng' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Thưởng Hợp đồng"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.contract_bonus && <p className="text-sm text-red-500">{errors.contract_bonus.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="other_bonus"
                                control={control}
                                rules={{ required: 'Nhập số tiền Thưởng Khác' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Thưởng Khác"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.other_bonus && <p className="text-sm text-red-500">{errors.other_bonus.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="lunch_allowance"
                                control={control}
                                rules={{ required: 'Nhập số tiền Trợ cấp ăn trưa' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Trợ cấp ăn trưa"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.lunch_allowance && <p className="text-sm text-red-500">{errors.lunch_allowance.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Controller
                                name="transport_allowance"
                                control={control}
                                rules={{ required: 'Nhập số tiền Trợ cấp xăng xe' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Trợ cấp xăng xe"
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

export default Edit