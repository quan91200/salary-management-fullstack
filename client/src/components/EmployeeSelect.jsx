import React, { useEffect, useState } from 'react'
import api from '../api/employeeApi.js'
import Select from './Select'

const EmployeeSelect = ({
    name = 'employee_id',
    required = false,
    register,
    errors,
    onChange,
}) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getAllEmployees()
                const formatted = res.data.map(d => ({
                    value: d.id,
                    label: `${d.code} - ${d.name}`
                }))
                setOptions(formatted)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách Nhân viên:', error)
            }
        }

        fetchData()
    }, [])
    const handleChange = (e) => {
        const selectedId = e.target.value
        const selectedOption = options.find(opt => opt.value === selectedId)
        if (onChange && selectedOption) {
            onChange(selectedOption)
        }
    }
    return (
        <div>
            <Select
                label="Chọn Nhân viên"
                name={name}
                placeholderOp={"Chọn nhân viên"}
                options={options}
                required={required}
                onChange={handleChange}
                {...register(name, { required: required && 'Vui lòng chọn Nhân viên' })}
            />
            {errors?.[name] && <p className='text-sm text-red-500'>{errors[name]?.message}</p>}
        </div>
    )
}

export default EmployeeSelect