import ExportModal from '../ExportModal'
import { exportSalary } from '../../utils/exportSalary.js'  // <--- chú ý file export riêng cho tax
import { useState, useRef } from 'react'
import Button from '../Button'
import { BiExport } from "react-icons/bi"

const SalaryList = ({ salary, paginatedData, currentPage, pageSize }) => {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const modalRef = useRef(null)

  return (
    <>
      <Button
        variant='none'
        icon={BiExport}
        onClick={() => setIsExportOpen(true)}
      >
        Xuất Excel Lương
      </Button>

      <ExportModal
        ref={modalRef}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={salary}
        paginatedData={paginatedData}
        onExport={(data, exportAll, currentPageData) =>
          exportSalary(data, 'Danh_sach_luong', exportAll, currentPageData, currentPage, pageSize)
        }
        filename="Danh_sach_thue"
      />
    </>
  )
}

export default SalaryList