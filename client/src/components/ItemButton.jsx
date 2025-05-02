import React from 'react'
import { IoIosArrowUp } from 'react-icons/io'
import { Link, useLocation } from 'react-router-dom'

const ItemButton = ({
    icon,
    label,
    to,
    collapsed,
    hasRightIcon = false,
    exact = false
}) => {
    const location = useLocation()

    const isActive = exact
        ? location.pathname === to
        : location.pathname.startsWith(to)

    return (
        <Link
            to={to}
            className={`flex items-center justify-between hover:bg-gray-100 p-2 cursor-pointer transition-all
                ${collapsed ? 'justify-center' : ''}
                ${isActive && !collapsed ? 'border-l-5 border-blue-500 bg-blue-100' : 'border-l-5 border-transparent'}
            `}
        >
            <div
                className={`flex items-center space-x-2 
                    ${collapsed ? 'justify-center w-full' : hasRightIcon ? '' : 'pl-4'}
                    ${isActive && collapsed ? 'p-2 bg-gray-100 rounded' : ''}
                `}
            >
                <span className='flex items-center'>{icon}</span>
                {!collapsed && <span className='text-[0.9rem]'>{label}</span>}
            </div>

            {!collapsed && hasRightIcon && (
                <IoIosArrowUp className='ml-auto text-gray-500' size={16} />
            )}
        </Link>
    )
}

export default ItemButton
