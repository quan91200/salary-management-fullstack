import React from 'react'
import { Menu } from '@headlessui/react'
import Button from '../Button'
import { CiImport } from "react-icons/ci"
import { IoPersonAddOutline } from "react-icons/io5"
import { TbAdjustmentsCog } from "react-icons/tb"
import EmployeeList from '../Export/EmployeeList'
import { isAdminOrHR } from '../../constants/roles'
import { useAuth } from '../../context/authContext'

const ActionEmployee = ({
  employees,
  paginatedData,
  openModal,
  onOpenAddModal
}) => {
  const { user } = useAuth()
  const role = user.role
  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button>
          <Button as='div' icon={TbAdjustmentsCog}>Thao tác</Button>
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 bg-white shadow-lg rounded border-none w-60">
          <div className="p-2">
            <Menu.Item>
              {(isAdminOrHR(role)) && (
                <Button onClick={onOpenAddModal} icon={IoPersonAddOutline} variant='none' >
                  Thêm Nhân viên
                </Button>
              )}
            </Menu.Item>

            <Menu.Item>
              <Button onClick={openModal} icon={CiImport} variant='none'>Import Excel</Button>
            </Menu.Item>
            <div className="border-t my-2"></div>

            <Menu.Item>
              <EmployeeList employees={employees} paginatedData={paginatedData} />
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </>
  )
}

export default ActionEmployee