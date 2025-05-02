import React, { useEffect, useState } from 'react'
import api from '../api/departmentApi.js'
import Select from './Select'

const DepartmentSelect = ({ name = 'department_id', required = false, register, errors }) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getAllDepartments()
                const formatted = res.data.map(d => ({
                    value: d.id,
                    label: d.name
                }))
                setOptions(formatted)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách Phòng ban:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <Select
                label="Phòng ban"
                name={name}
                options={options}
                placeholderOp={"Chọn phòng ban"}
                required={required}
                {...register(name, { required: required && 'Vui lòng chọn phòng ban' })}
            />
            {errors?.[name] && <p className='text-sm text-red-500'>{errors[name]?.message}</p>}
        </div>
    )
}

export default DepartmentSelect