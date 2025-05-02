import ExportModal from '../ExportModal'
import { exportToExcel } from '../../utils/exportEmp.js'
import { useState } from 'react'
import Button from '../Button'
import { BiExport } from "react-icons/bi"
import React, { useRef } from 'react'
const EmployeeList = ({ employees, paginatedData }) => {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const modalRef = useRef(null)
  return (
    <>
      <Button
        variant='none'
        icon={BiExport}
        onClick={() => setIsExportOpen(true)}
      >
        Xuất Excel
      </Button>

      <ExportModal
        ref={modalRef}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={employees}
        paginatedData={paginatedData}
        onExport={exportToExcel}
        filename="Danh_sach_nhan_vien"
      />

    </>
  )
}

export default EmployeeList