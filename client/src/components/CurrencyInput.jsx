import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

const formatNumber = (value) => {
  if (!value) return ''
  const number = value.toString().replace(/\D/g, '')
  return new Intl.NumberFormat('vi-VN').format(Number(number))
}

const unformatNumber = (value) => {
  return value.replace(/\D/g, '')
}

const CurrencyInput = forwardRef(({ value, onChange, label, name, isRequired = false, ...rest }, ref) => {
  const handleChange = (e) => {
    const raw = e.target.value
    const unformatted = unformatNumber(raw)
    onChange(unformatted === '' ? 0 : Number(unformatted))
  }

  return (
    <div className='flex flex-col space-y-1 w-full'>
      {label && (
        <label htmlFor={name} className='text-sm font-medium text-gray-700 capitalize'>
          {label}{isRequired && <span className='text-red-500'> *</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        value={formatNumber(value)}
        onChange={handleChange}
        placeholder='Nhập số tiền'
        required={isRequired}
        className='p-2 border border-gray-200 rounded-md text-sm shadow w-full outline-none placeholder:italic'
        ref={ref}
        {...rest}
      />
    </div>
  )
})

CurrencyInput.displayName = 'CurrencyInput'

CurrencyInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool
}

export default CurrencyInput