import React, { useContext, useEffect } from 'react'
import axios from 'axios'

const userContext = React.createContext()

const AuthContext = ({ children }) => {
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const storedUser = localStorage.getItem("user")
                const token = localStorage.getItem('token')

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser))
                } else {
                    if (token) {
                        const res = await axios.post(
                            'http://localhost:5004/api/auth/verify',
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )
                        if (res.data.success) {
                            localStorage.setItem("user", JSON.stringify(res.data.user))
                            setUser(res.data.user)
                        } else {
                            setUser(null)
                        }
                    } else {
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error("Error verifying user:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        verifyUser()
    }, [])

    const login = (token, user) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        console.log("Logout")
    }

    return (
        <userContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </userContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(userContext)
export default AuthContext