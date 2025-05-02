import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from '../../public/assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import config from '../config'
import authApi from '../api/authApi'

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [serverError, setServerError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        setServerError(null)
        setLoading(true)
        console.log("Dữ liệu form nhập vào Register:", data)
        try {
            const res = await authApi.register(data)
            if (res.data.success) {
                console.log("Register success")
                navigate('/')
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message)
            } else {
                setServerError("Đã xảy ra lỗi. Vui lòng thử lại.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen flex relative'>
            <div className='absolute left-0 top-0 py-3 px-8'><img src={logo} alt='logo' /></div>
            <div className='w-[50%] bg-login flex items-center justify-center'>
                <div className='px-6 py-8 bg-gray-50 rounded-lg shadow-xl w-[350px]'>
                    <h2 className='text-4xl font-bold text-center'>Đăng ký</h2>
                    <p className='my-4 text-center'>Tạo tài khoản mới</p>
                    {serverError && <p className='text-center text-sm text-red-500 mb-2'>{serverError}</p>}
                    <form className='flex flex-col space-y-2' onSubmit={handleSubmit(onSubmit)}>
                        <Select
                            label="Vai trò"
                            name="role"
                            options={[
                                { label: 'Admin', value: 'admin' },
                                { label: 'Nhân sự', value: 'nhân sự' },
                                { label: 'Kế toán', value: 'kế toán' },
                            ]}
                            {...register('role', { required: 'Vui lòng chọn Vai trò' })}
                        />
                        {errors.role && <p className='text-sm text-red-500'>{errors.role.message}</p>}
                        <Input
                            name='fullname'
                            placeholder="Họ tên"
                            {...register('fullname', { required: 'Họ tên là bắt buộc' })}
                        />
                        {errors.fullname && <p className='text-sm text-red-500'>{errors.fullname.message}</p>}

                        <Input
                            name='email'
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'Email là bắt buộc',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Email không hợp lệ',
                                },
                            })}
                        />
                        {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}

                        <Input
                            name='password'
                            type="password"
                            placeholder="Mật khẩu"
                            {...register('password', {
                                required: 'Mật khẩu là bắt buộc',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                },
                            })}
                        />
                        {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}

                        <Button
                            type="submit"
                            disabled={loading}
                            className='flex justify-center'
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </Button>

                        <p className='text-sm text-center mt-2'>
                            Đã có tài khoản? <Link to={config.routes.login} className='text-blue-500 hover:underline'>Đăng nhập</Link>
                        </p>
                    </form>
                </div>
            </div>
            <div className='w-[50%] flex items-center justify-center'>
                <div className='bg-icon p-56'></div>
            </div>
        </div>
    )
}

export default Register