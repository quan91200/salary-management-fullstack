import ExportModal from '../ExportModal'
import { exportTaxToExcel } from '../../utils/exportTax.js'  // <--- chú ý file export riêng cho tax
import { useState, useRef } from 'react'
import Button from '../Button'
import { BiExport } from "react-icons/bi"

const TaxList = ({ taxData, paginatedData, currentPage, pageSize }) => {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const modalRef = useRef(null)

  return (
    <>
      <Button
        variant='none'
        icon={BiExport}
        onClick={() => setIsExportOpen(true)}
      >
        Xuất Excel Thuế
      </Button>

      <ExportModal
        ref={modalRef}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={taxData}
        paginatedData={paginatedData}
        onExport={(data, exportAll, currentPageData) =>
          exportTaxToExcel(data, 'Danh_sach_thue', exportAll, currentPageData, currentPage, pageSize)
        }
        filename="Danh_sach_thue"
      />
    </>
  )
}

export default TaxList