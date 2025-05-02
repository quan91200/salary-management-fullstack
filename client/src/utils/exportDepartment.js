import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportDepartment = (
  departments,
  filename = 'Danh_sach_phong_ban',
  exportAll = true,
  currentPageData = []
) => {
  if (!Array.isArray(departments) || departments.length === 0) return

  const exportData = exportAll ? departments : currentPageData

  const data = exportData.map((dep, index) => ({
    STT: index + 1,
    'Mã phòng ban': dep.code || '',
    'Tên phòng ban': dep.name || '',
    'Email': dep.email || '',
    'Trạng thái': dep.status || ''
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách phòng ban')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, `${filename}.xlsx`)
}