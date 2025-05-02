import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportSalary = (
  salary,
  filename = 'salary_export',
  exportAll = true,
  currentPageData = [],
  currentPage = 1,
  pageSize = 10
) => {
  if (!Array.isArray(salary) || salary.length === 0) return

  const exportData = exportAll ? salary : (currentPageData.length > 0 ? currentPageData : salary)

  const data = exportData.map((row, idx) => ({
    STT: (currentPage - 1) * pageSize + idx + 1,
    'Mã nhân viên': row.employee.code || 'N/A',
    'Tên nhân viên': row.employee.name || 'N/A',
    'Lương cơ bản': row.basic_salary || '',
    'Tổng thưởng trợ cấp': row.total_bonus || '',
    'Tạm ứng': row.advance_amount || '',
    'Thuế TNCN': row.personal_tax_amount || '',
    'Bảo hiểm bắt buộc': row.total_deductions || '',
    'Ngày áp dụng': (row.month + '/' + row.year) || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lương')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, `${filename}.xlsx`)
}