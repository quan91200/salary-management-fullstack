import React from 'react'
import Logo from '../../public/assets/logo.svg'
import Dropdown from './Dropdown'
import { useAuth } from '../context/authContext'
import AdA from '../assets/admin.png'
import { Link } from 'react-router-dom'
import config from '../config/index.js'

const Header = () => {
    const { logout, user } = useAuth()
    const today = new Date().toLocaleDateString('vi-VN')
    return (
        <div className='w-full max-h-20 border-b border-gray-300 bg-white shadow-md'>
            <div className='flex items-center justify-between px-3 py-3'>
                {/* Logo */}
                <Link className='h-10' to={config.routes.dashboard}>
                    <img
                        src={Logo}
                        alt='Logo'
                        className='w-full h-full object-contain'
                    />
                </Link>

                {/* Chào người dùng */}
                <div className='text-sm font-medium'>
                    <p className='font-bold capitalize'>Xin chào, {user.fullname}</p>
                    Hôm nay là: {today}
                </div>

                {/* Dropdown user */}
                <div className='flex items-center space-x-3'>
                    <Dropdown>
                        <Dropdown.Trigger className='flex items-center gap-2 cursor-pointer'>
                            <img
                                src={AdA}
                                alt='Avatar'
                                className='w-10 h-10 rounded-full shadow-xl border border-gray-400 hover:opacity-75'
                            />
                        </Dropdown.Trigger>

                        <Dropdown.Content align='right'>
                            <Dropdown.Link onClick={logout}>Đăng xuất</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                    <div className='flex flex-col space-y-0'>
                        <span className='text-sm font-medium'>
                            {user.fullname}
                        </span>
                        <span className='text-sm capitalize'>{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header