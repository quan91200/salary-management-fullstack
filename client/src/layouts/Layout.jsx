import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className='flex h-screen'>
            <div
                className={`bg-white shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                    }`}
            >
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            <div className='flex-1 flex flex-col'>
                <Header />

                <main className='p-4 bg-gray-100 flex-1 overflow-auto'>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    {children}
                </main>
            </div>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout