import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportTaxToExcel = (
  taxData,
  filename = 'tax_export',
  exportAll = true,
  currentPageData = [],
  currentPage = 1,
  pageSize = 10
) => {
  if (!Array.isArray(taxData) || taxData.length === 0) return

  const exportData = exportAll ? taxData : (currentPageData.length > 0 ? currentPageData : taxData)

  const data = exportData.map((row, idx) => ({
    STT: (currentPage - 1) * pageSize + idx + 1,
    'Mã nhân viên': row.employee_code || 'N/A',
    'Tên nhân viên': row.employee_name || 'N/A',
    'Thu nhập chịu thuế': row.gross_income || 0,
    'Số người phụ thuộc': row.number_of_dependents || 0,
    'Giảm trừ người nộp': row.personal_deduction || 0,
    'Giảm trừ người phụ thuộc': row.dependent_deduction_per_person || 0,
    'Thu nhập tính thuế': row.taxable_income || 0,
    'Thuế TNCN': row.tax_amount || 0,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Thuế TNCN')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(file, `${filename}.xlsx`)
}