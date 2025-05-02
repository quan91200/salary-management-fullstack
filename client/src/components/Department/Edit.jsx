import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal'
import Input from '../Input'
import Select from '../Select'
import Button from '../Button'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/departmentApi.js'

const status = [
    { label: 'Kích hoạt', value: 'kích hoạt' },
    { label: 'Không kích hoạt', value: 'không kích hoạt' }
]

const Edit = ({ isOpen, onClose, department, onUpdated }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (department) {
            reset({
                code: department.code || '',
                name: department.name || '',
                email: department.email || '',
                status: department.status || ''
            })
        }
    }, [department, reset])

    const onSubmit = async (data) => {
        if (!department?.id) return
        setLoading(true)
        try {
            await api.updateDepartment(department.id, data)
            onUpdated?.()
            toast.info('Cập nhật thành công!')
            onClose()
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err)
            alert(`Đã xảy ra lỗi khi sửa ${department.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Phòng ban</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center space-x-5">
                        <div className="flex flex-col space-y-2">
                            <Input
                                label="Mã phòng ban"
                                name="code"
                                placeholder="VD: PB001"
                                {...register('code', { required: 'Mã phòng ban là bắt buộc' })}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
                            <Input
                                label="Tên phòng ban"
                                name="name"
                                placeholder="Phòng Hành chính"
                                {...register('name', { required: 'Tên phòng ban là bắt buộc' })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Input
                                label="Email"
                                name="email"
                                placeholder="abc@company.com"
                                type="email"
                                {...register('email', { required: 'Email phòng ban là bắt buộc' })}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            <Select
                                label="Trạng thái"
                                name="status"
                                options={status}
                                {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                            />
                            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
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
    department: PropTypes.object,
    onUpdated: PropTypes.func
}

export default Edit