/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
    children,
    onClick,
    icon: Icon,
    variant = 'gradient',
    className = '',
    as: Component = 'button',
    ...rest
}) => {
    const buttonClass = variant === 'gradient'
        ? 'bg-gradient-to-r from-[#14ADD6] to-[#384296] text-white hover:opacity-90'
        : variant === 'none'
            ? 'bg-transparent text-gray-600 border-none hover:opacity-75'
            : 'bg-white text-gray-400 border border-gray-400 hover:opacity-75'

    return (
        <Component
            onClick={onClick}
            className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${buttonClass} ${className}`}
            {...rest}
        >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{children}</span>
        </Component>
    )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.elementType,
    variant: PropTypes.oneOf(['gradient', 'default', 'none']),
    className: PropTypes.string
}

export default Button