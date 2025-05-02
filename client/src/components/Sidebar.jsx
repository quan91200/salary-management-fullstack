import React from 'react'
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu"
import ItemButton from './ItemButton'
import config from '../config/index.js'
import { useAuth } from '../context/authContext'
import { isAdminOrHR, isAdminOrKeToan } from '../constants/roles.js'
import { BiSolidDollarCircle } from "react-icons/bi"
import { BsPeopleFill } from "react-icons/bs"
import { MdDashboard, MdWork } from "react-icons/md"
import { FaBuilding, FaUserShield, FaFileInvoiceDollar, FaMoneyCheck } from "react-icons/fa"
import { FaUniversalAccess, FaMoneyBillWave } from "react-icons/fa6"
import { ImCalculator } from "react-icons/im"
import { IoMdAnalytics, IoIosBookmarks } from "react-icons/io"
import { HiMiniUserGroup } from "react-icons/hi2"
import { PiInvoiceBold, PiNotebookFill } from "react-icons/pi"

const Sidebar = ({ collapsed, setCollapsed }) => {
    const { user } = useAuth()
    const role = user.role
    return (
        <div className='h-full flex flex-col'>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`p-2 text-gray-700 hover:bg-gray-200 rounded-lg m-2 transition-all ${collapsed ? 'self-center' : 'self-end'}`}
            >
                {collapsed ? (
                    <LuChevronsRight size={20} />
                ) : (
                    <LuChevronsLeft size={20} />
                )}
            </button>

            <div className='flex flex-col py-2'>
                {/**Danh mục */}
                <ItemButton
                    icon={<MdDashboard size={20} />}
                    label={'Danh mục'}
                    collapsed={collapsed}
                    hasRightIcon={true}
                />
                <ItemButton
                    to={config.routes.employee}
                    icon={<BsPeopleFill size={20} />}
                    label={'Quản lý nhân viên'}
                    collapsed={collapsed}
                />
                {(isAdminOrHR(role)) && (
                    <>
                        <ItemButton
                            to={config.routes.department}
                            icon={<FaBuilding size={20} />}
                            label={'Quản lý phòng ban'}
                            collapsed={collapsed}
                        />
                        <ItemButton
                            to={config.routes.position}
                            icon={<HiMiniUserGroup size={20} />}
                            label={'Quản lý chức vụ'}
                            collapsed={collapsed}
                        />
                    </>
                )}

                <ItemButton
                    to={config.routes.salary}
                    icon={<PiInvoiceBold size={20} />}
                    label={'Quản lý bảng lương'}
                    collapsed={collapsed}
                />
                {(isAdminOrKeToan(role)) && (
                    <ItemButton
                        to={config.routes.deduction}
                        icon={<FaUserShield size={20} />}
                        label={'Khoản trích theo lương'}
                        collapsed={collapsed}
                    />
                )}
                {/*Nghiệp vụ */}
                <ItemButton
                    icon={<MdWork size={20} />}
                    label={'Nghiệp vụ'}
                    collapsed={collapsed}
                    hasRightIcon={true}
                />

                {(isAdminOrKeToan(role)) && (
                    <>
                        <ItemButton
                            to={config.routes.workrule}
                            icon={<ImCalculator size={20} />}
                            label={'Tính lương'}
                            collapsed={collapsed}
                        />
                        <ItemButton
                            to={config.routes.advance}
                            icon={<FaMoneyCheck size={20} />}
                            label={'Tạm ứng'}
                            collapsed={collapsed}
                        />
                        <ItemButton
                            to={config.routes.tax}
                            icon={<FaFileInvoiceDollar size={20} />}
                            label={'Thuế TNCN'}
                            collapsed={collapsed}
                        />
                    </>
                )}

                <ItemButton
                    to={config.routes.bonus}
                    icon={<BiSolidDollarCircle size={20} />}
                    label={'Thưởng và trợ cấp'}
                    collapsed={collapsed}
                />
                <ItemButton
                    to={config.routes.attendance}
                    icon={<FaUniversalAccess size={20} />}
                    label={'Chấm công'}
                    collapsed={collapsed}
                />
                {/*Báo cáo */}
                <ItemButton
                    icon={<IoMdAnalytics size={20} />}
                    label={'Báo cáo'}
                    collapsed={collapsed}
                    hasRightIcon={true}
                />
                {(isAdminOrKeToan(role)) && (
                    <>
                        <ItemButton
                            to={config.routes.total}
                            icon={<FaMoneyBillWave size={20} />}
                            label={'Báo cáo tổng hợp'}
                            collapsed={collapsed}
                        />
                        <ItemButton
                            to={config.routes.note}
                            icon={<PiNotebookFill size={20} />}
                            label={'Nhật ký chung'}
                            collapsed={collapsed}
                        />
                        <ItemButton
                            to={config.routes.book}
                            icon={<IoIosBookmarks size={20} />}
                            label={'Sổ cái tài khoản'}
                            collapsed={collapsed}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default Sidebar