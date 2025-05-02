import React from 'react'
import PropTypes from 'prop-types'

const Select = React.forwardRef(({
    label,
    name,
    required = false,
    placeholderOp = '-- Chọn --',
    options = [],
    ...rest
}, ref) => {
    return (
        <div className="flex flex-col space-y-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}{required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <select
                ref={ref}
                name={name}
                id={name}
                required={required}
                className="p-2 border border-gray-200 rounded-md text-sm shadow outline-none"
                {...rest}
            >
                <option className='italic text-gray-300' value="">{placeholderOp}</option>
                {options.map(opt => (
                    <option className='capitalize' key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
})

Select.displayName = 'Select'

Select.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholderOp: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.node
        })
    ).isRequired
}

export default Select