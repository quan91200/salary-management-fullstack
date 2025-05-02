import React from 'react'
import PropTypes from 'prop-types'

const Input = React.forwardRef(({
    label,
    placeholder,
    isRequired = false,
    name = '',
    type = 'text',
    step,
    min,
    max,
    ...rest
}, ref) => {
    return (
        <div className='flex flex-col space-y-1 w-full'>
            {label && (
                <label htmlFor={name} className='text-sm font-medium text-gray-700 capitalize'>
                    {label}{isRequired && <span className='text-red-500'> *</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                required={isRequired}
                className='p-2 border border-gray-200 rounded-md text-sm shadow w-full outline-none placeholder:italic'
                step={step}
                min={min}
                max={max}
                {...rest}
            />
        </div>
    )
})

Input.displayName = 'Input'

Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Input