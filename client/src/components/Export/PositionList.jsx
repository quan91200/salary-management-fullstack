import { exportPosition } from '../../utils/exportPosition'
import ExportModal from '../ExportModal'
import Button from '../Button'
import { BiExport } from 'react-icons/bi'
import { useState } from 'react'

const PositionList = ({ positions, paginatedData }) => {
  const [isExportOpen, setIsExportOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsExportOpen(true)} icon={BiExport}>
        Xuất Excel
      </Button>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={positions}
        paginatedData={paginatedData}
        onExport={exportPosition}
        filename="Danh_sach_chuc_vu"
      />
    </>
  )
}

export default PositionList