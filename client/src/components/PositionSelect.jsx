import React, { useEffect, useState } from 'react'
import api from '../api/positionApi.js'
import Select from './Select'

const PositionSelect = ({ name = 'position_id', required = false, register, errors }) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getAllPositions()
                const formatted = res.data.map(d => ({
                    value: d.id,
                    label: d.name
                }))
                setOptions(formatted)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách Chức vụ:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <Select
                label="Chức vụ"
                name={name}
                options={options}
                placeholderOp={"Chọn chức vụ"}
                required={required}
                {...register(name, { required: required && 'Vui lòng chọn chức vụ' })}
            />
            {errors?.[name] && <p className='text-sm text-red-500'>{errors[name]?.message}</p>}
        </div>
    )
}

export default PositionSelect