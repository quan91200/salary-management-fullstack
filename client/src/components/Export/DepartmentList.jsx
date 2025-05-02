import { exportDepartment } from '../../utils/exportDepartment.js'
import ExportModal from '../ExportModal'
import Button from '../Button'
import { BiExport } from 'react-icons/bi'
import { useState } from 'react'

const DepartmentList = ({ departments, paginatedData }) => {
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsExportOpen(true)} icon={BiExport}>
        Xuất Excel
      </Button>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={departments}
        paginatedData={paginatedData}
        onExport={exportDepartment}
        filename="Danh_sach_phong_ban"
      />
    </>
  )
}

export default DepartmentList