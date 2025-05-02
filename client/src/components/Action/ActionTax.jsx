import React from 'react'
import { Menu } from '@headlessui/react'
import Button from '../Button'
import { useAuth } from '../../context/authContext'
import { isAdminOrKeToan } from '../../constants/roles'
import TaxList from '../Export/TaxList'
import { TbAdjustmentsCog } from 'react-icons/tb'
import { BiLayerPlus } from "react-icons/bi"
import { TbHttpDelete } from "react-icons/tb"
import { TbEdit } from "react-icons/tb"

const ActionTax = ({
  tax,
  paginatedData,
  onOpenAddModal,
  onGenerate,
  onDelete,
}) => {
  const { user } = useAuth()
  const role = user.role

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className='outline-none'>
        <Button as="div" icon={TbAdjustmentsCog}>Thao tác</Button>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 bg-white shadow-lg rounded border-none outline-none w-60">
        <div className="p-2">
          {isAdminOrKeToan(role) && (
            <>
              <Menu.Item>
                <Button
                  onClick={onOpenAddModal}
                  icon={TbEdit}
                  variant="none"
                >
                  Cập nhật Thuế
                </Button>
              </Menu.Item>

              <Menu.Item>
                <Button
                  onClick={onGenerate}
                  icon={BiLayerPlus}
                  variant="none"
                >
                  Cập nhật hàng loạt
                </Button>
              </Menu.Item>

              <Menu.Item>
                <Button
                  onClick={onDelete}
                  icon={TbHttpDelete}
                  variant="none"
                >
                  Xóa Thuế TNCN
                </Button>
              </Menu.Item>
            </>
          )}
          <div className="border-t my-2"></div>
          <Menu.Item>
            <TaxList taxData={tax} paginatedData={paginatedData} />
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  )
}

export default ActionTax