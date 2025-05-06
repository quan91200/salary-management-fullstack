import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (
  employees,
  filename = 'export',
  exportAll = true,
  currentPageData = []
) => {
  if (!Array.isArray(employees) || employees.length === 0) return

  const exportData = exportAll ? employees : (currentPageData.length > 0 ? currentPageData : employees)

  const data = exportData.map((emp, index) => ({
    STT: index + 1,
    'Mã nhân viên': emp.code || '',
    'Họ tên': emp.name || '',
    'Phòng ban': emp.department?.code || '',
    'Chức vụ': emp.position?.code || '',
    'Loại nhân viên': emp.type || '',
    'SĐT': emp.phone || '',
    'Email': emp.email || '',
    'Lương cơ bản': emp.default_basic_salary || '',
    'Số người phụ thuộc': emp.default_number_of_dependents || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, `${filename}.xlsx`)
}