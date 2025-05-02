import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import PositionSelect from '../PositionSelect'
import DepartmentSelect from '../DepartmentSelect'
import Select from '../Select'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/employeeApi.js'
import CurrencyInput from '../CurrencyInput.jsx'

const employeeTypeOptions = [
    { label: 'Fulltime', value: 'fulltime' },
    { label: 'Parttime', value: 'parttime' }
]

const Edit = ({ isOpen, onClose, employees, onUpdated }) => {
    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen || !employees) return

        reset({
            code: employees.code || '',
            name: employees.name || '',
            department_id: String(employees.department_id || ''),
            position_id: String(employees.position_id || ''),
            type: employees.type || '',
            phone: employees.phone || '',
            email: employees.email || '',
            default_basic_salary: parseInt(employees.default_basic_salary || ''),
            default_number_of_dependents: (employees.default_number_of_dependents || ''),
        })
    }, [isOpen, employees, reset])

    const onSubmit = async (data) => {
        if (!employees?.id) {
            toast.error('ID nhân viên không hợp lệ')
            return;
        }
        setLoading(true)
        try {
            await api.updateEmployee(employees.id, data)
            onUpdated?.()
            toast.info('Cập nhật thành công!')
            console.log(data)
            onClose()
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err)
            alert(`Đã xảy ra lỗi khi sửa ${employees.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setValue(name, value)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Nhân viên</h2>
                <form className="flex flex-col space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-start justify-center space-x-5 w-full">
                        <div className="flex flex-col space-y-5 w-full">
                            <Input
                                label="Mã nhân viên"
                                name="code"
                                placeholder="VD: PB001"
                                {...register('code', { required: 'Mã nhân viên là bắt buộc' })}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
                            <PositionSelect
                                value={employees?.position_id}
                                onChange={handleChange}
                                required
                                register={register}
                            />
                            <Select
                                label="Loại nhân viên"
                                name="employee_type_id"
                                options={employeeTypeOptions}
                                {...register('type', { required: 'Vui lòng chọn loại nhân viên' })}
                            />
                            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                            <Input
                                label="Số điện thoại"
                                name="phone"
                                placeholder="0123456789"
                                type="tel"
                                {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
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
                        <div className="flex flex-col space-y-5 w-full">
                            <Input
                                label="Họ tên NV"
                                name="name"
                                placeholder="Họ và tên"
                                {...register('name', { required: 'Họ tên là bắt buộc' })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            <DepartmentSelect
                                value={employees?.department_id}
                                onChange={handleChange}
                                required
                                register={register}
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
                                rules={{ required: 'Lương cơ bản là bắt buộc' }}
                                render={({ field }) => (
                                    <CurrencyInput
                                        label="Lương cơ bản"
                                        isRequired
                                        {...field}
                                    />
                                )}
                            />
                            {errors.default_basic_salary && <p className='text-sm text-red-500'>{errors.default_basic_salary.message}</p>}
                        </div>
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

Edit.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    employees: PropTypes.object,
    onUpdated: PropTypes.func
}

export default Edit