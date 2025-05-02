import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/employeeApi.js'
import Modal from '../Modal'
import Button from '../Button'
import Input from '../Input'
import PositionSelect from '../PositionSelect'
import DepartmentSelect from '../DepartmentSelect'
import Select from '../Select'
import CurrencyInput from '../CurrencyInput.jsx'

const statusOptions = [
    { label: 'Fulltime', value: 'fulltime' },
    { label: 'Parttime', value: 'parttime' },
]

const Add = ({ isOpen, onClose, onCreated }) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        reset({
            code: '',
            name: '',
            department_id: '',
            position_id: '',
            type: '',
            phone: '',
            email: '',
            default_basic_salary: '',
            default_number_of_dependents: '',
        })
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const res = await api.createEmployee(data)
            console.log('Tạo thành công Employee:', res.data)
            toast.success(`Đã tạo ${data.name}`)
            onCreated?.()
            onClose()
        } catch (err) {
            console.error('Lỗi khi gửi yêu cầu:', err)
            alert('Đã xảy ra lỗi khi tạo nhân viên. Vui lòng thử lại!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Thêm Nhân viên</h2>
                <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-start justify-center space-x-5 w-full'>
                        <div className='flex flex-col space-y-5 w-full'>
                            <Input
                                label="Mã số thuế nhân viên"
                                name="code"
                                placeholder="Mã số thuế nhân viên"
                                isRequired
                                {...register('code', { required: 'Mã số thuế nhân viên là bắt buộc' })}
                            />
                            {errors.code && <p className='text-sm text-red-500'>{errors.code.message}</p>}
                            <PositionSelect
                                required
                                register={register}
                                errors={errors}
                            />
                            <Select
                                label='Loại nhân viên'
                                name='type'
                                options={statusOptions}
                                placeholderOp={"Chọn loại nhân viên"}
                                {...register('type', { required: 'Vui lòng chọn loại nhân viên' })}
                            />
                            {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
                            <Input
                                label="Số điện thoại"
                                name="phone"
                                placeholder="0123456789"
                                type="tel"
                                isRequired
                                {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                            />
                            {errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
                            <Input
                                label="Số người phụ thuộc"
                                name="default_number_of_dependents"
                                placeholder="Số người phụ thuộc"
                                type="tel"
                                isRequired
                                {...register('default_number_of_dependents', { required: 'Số người phụ thuộc' })}
                            />
                            {errors.default_number_of_dependents && <p className='text-sm text-red-500'>{errors.default_number_of_dependents.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-5 w-full'>
                            <Input
                                label="Họ tên NV"
                                name="name"
                                placeholder="Họ và tên"
                                isRequired
                                {...register('name', { required: 'Họ tên NV là bắt buộc' })}
                            />
                            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
                            <DepartmentSelect
                                required
                                register={register}
                                errors={errors}
                            />
                            <Input
                                label="email"
                                name="email"
                                placeholder="Nhập email"
                                isRequired
                                {...register('email', { required: 'email là bắt buộc' })}
                            />
                            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
                            <Controller
                                name="default_basic_salary"
                                control={control}
                                rules={{ required: 'Nhập số tiền lương cơ bản' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label='Lương cơ bản'
                                        {...field}
                                    />
                                )}
                            />
                            {errors.default_basic_salary && <p className="text-sm text-red-500">{errors.default_basic_salary.message}</p>}
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