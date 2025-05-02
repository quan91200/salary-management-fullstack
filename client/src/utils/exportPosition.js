import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportPosition = (
  positions,
  filename = 'Danh_sach_chuc_vu',
  exportAll = true,
  currentPageData = []
) => {
  if (!Array.isArray(positions) || positions.length === 0) return

  const exportData = exportAll ? positions : currentPageData

  const data = exportData.map((pos, index) => ({
    STT: index + 1,
    'Mã chức vụ': pos.code || '',
    'Tên chức vụ': pos.name || '',
    'Trạng thái': pos.status || ''
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách chức vụ')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, `${filename}.xlsx`)
}