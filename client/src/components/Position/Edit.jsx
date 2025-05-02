import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import api from '../../api/positionApi.js'

const status = [
    { label: 'Kích hoạt', value: 'kích hoạt' },
    { label: 'Không kích hoạt', value: 'không kích hoạt' }
]

const Edit = ({ isOpen, onClose, position, onUpdated }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (position) {
            reset({
                code: position.code || '',
                name: position.name || '',
                status: position.status || '',
            })
        }
    }, [position, reset])

    const onSubmit = async (data) => {
        if (!position?.id) return
        setLoading(true)
        try {
            await api.updatePosition(position.id, data)
            onUpdated?.()
            toast.info('Cập nhật thành công!')
            onClose()
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err)
            alert(`Đã xảy ra lỗi khi sửa ${position.name}. Vui lòng thử lại!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} position="center">
            <div className="bg-white rounded-md p-6 max-w-2xl w-2xl">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa Chức vụ</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-2">
                        <Input
                            label="Mã Chức vụ"
                            name="code"
                            placeholder="VD: PB001"
                            {...register('code', { required: 'Mã chức vụ là bắt buộc' })}
                        />
                        {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
                        <Input
                            label="Tên Chức vụ"
                            name="name"
                            placeholder="Ví dụ: Trưởng phòng"
                            {...register('name', { required: 'Tên chức vụ là bắt buộc' })}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        <Select
                            label="Trạng thái"
                            name="status"
                            options={status}
                            {...register('status', { required: 'Vui lòng chọn trạng thái' })}
                        />
                        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
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
    position: PropTypes.object,
    onUpdated: PropTypes.func
}

export default Edit