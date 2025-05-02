import React, { useState, useEffect } from 'react'
import logo from '../../public/assets/logo.svg'
import { useAuth } from '../context/authContext'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import config from '../config'
import Button from '../components/Button'
import Input from '../components/Input'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MdOutlineWavingHand } from "react-icons/md"
import authApi from '../api/authApi'

const Login = () => {
    const [mode, setMode] = useState("login")
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const {
        handleSubmit,
        control,
        reset
    } = useForm()

    useEffect(() => {
        if (token) setMode("reset")
    }, [token])

    const handleLogin = async (data) => {
        setLoading(true)
        setError(null)
        console.log("Dữ liệu form nhập vào Login: ", data)
        try {
            const res = await authApi.login(data)

            if (res.data.success) {
                console.log("Login API response:", res.data)
                console.log("User received:", res.data.user)
                login(res.data.token, res.data.user)
                localStorage.setItem("token", res.data.token)
                navigate("/employee", { state: { user: res.data.user } })
                toast('Welcome ', { icon: <MdOutlineWavingHand className='animate-bounce' /> })
            }
        } catch (err) {
            setError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const handleForgot = async (data) => {
        setMessage(null)
        try {
            const res = await authApi.forgotPassword(data)
            setMessage(res.data.message)
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi gửi yêu cầu.")
        }
    }

    const handleReset = async (data) => {
        setMessage(null)
        try {
            const response = await authApi.resetPassword({
                token,
                newPassword: data.newPassword
            })

            if (response.data.success) {
                setMessage('Đặt lại mật khẩu thành công')
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } else {
                setMessage(response.data.message || "Lỗi reset mật khẩu.")
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi trong quá trình reset mật khẩu.")
        }
    }

    return (
        <div className='w-full h-screen flex relative'>
            <div className='absolute left-0 top-0 py-3 px-8'><img src={logo} alt='logo' /></div>
            <div className='w-[50%] bg-login flex items-center justify-center'>
                <div className='px-6 py-8 bg-gray-50 rounded-lg shadow-xl w-[350px]'>
                    <h2 className='text-3xl font-bold text-center mb-4'>
                        {mode === "login" ? "Đăng nhập" : mode === "forgot" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                    </h2>

                    {error && <p className='text-red-500 text-sm mb-2 text-center'>{error}</p>}
                    {message && <p className='text-green-600 text-sm mb-2 text-center'>{message}</p>}

                    {mode === "login" && (
                        <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col space-y-3'>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Email là bắt buộc" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Email"
                                        placeholder="Email"
                                        type="email"
                                    />
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Mật khẩu là bắt buộc" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Mật khẩu"
                                        placeholder="Mật khẩu"
                                        type="password"
                                    />
                                )}
                            />

                            <div className="flex justify-between text-sm text-blue-500">
                                <button type="button" onClick={() => setMode("forgot")} className="hover:underline">
                                    Quên mật khẩu?
                                </button>
                                <Link to={config.routes.register} className="hover:underline">Đăng ký</Link>
                            </div>

                            <Button type="submit" disabled={loading} className='flex items-center justify-center'>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </form>
                    )}

                    {mode === "forgot" && (
                        <form onSubmit={handleSubmit(handleForgot)} className='flex flex-col space-y-3'>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Email là bắt buộc" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Email"
                                        placeholder="Nhập email để lấy lại mật khẩu"
                                        isRequired
                                        type="email"
                                    />
                                )}
                            />
                            <Button type="submit" className='flex justify-center'>Gửi liên kết</Button>
                            <button type="button" onClick={() => { setMode("login"); reset() }} className='text-sm text-blue-500 hover:underline mt-2'>
                                Quay lại đăng nhập
                            </button>
                        </form>
                    )}

                    {mode === "reset" && (
                        <form onSubmit={handleSubmit(handleReset)} className='flex flex-col space-y-3'>
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Mật khẩu mới là bắt buộc" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Mật khẩu mới"
                                        placeholder="Mật khẩu mới"
                                        isRequired
                                        type="password"
                                    />
                                )}
                            />
                            <Button type="submit">Cập nhật mật khẩu</Button>
                        </form>
                    )}
                </div>
            </div>

            <div className='w-[50%] flex items-center justify-center'>
                <div className='bg-icon p-56'></div>
            </div>
        </div>
    )
}

export default Login