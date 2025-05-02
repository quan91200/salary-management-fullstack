import React from 'react'
import { IoPersonAddOutline } from "react-icons/io5"
import Button from '../../components/Button.jsx'

const salaryData = [
  {
    date: '31/12/2023',
    sct: "SCT001",
    description: "Hạch toán lương NV",
    debit: "642",
    credit: "3341",
    amount: "120,000,000",
    note: ""
  },
  {
    date: '31/12/2023',
    sct: "SCT002",
    description: "Trích BHXH DN phải trả",
    debit: "622",
    credit: "3383",
    amount: "21,000,000",
    note: "17.5%"
  },
  {
    date: '31/12/2023',
    sct: "SCT003",
    description: "Trích BHYT DN phải trả",
    debit: "622",
    credit: "3384",
    amount: "3,600,000",
    note: "3%"
  },
  {
    date: '31/12/2023',
    sct: "SCT004",
    description: "Trích BHTN DN phải trả",
    debit: "622",
    credit: "3386",
    amount: "1,200,000",
    note: "1%"
  },
  {
    date: '31/12/2023',
    sct: "SCT005",
    description: "Trích Kinh Phí Công Đoàn DN chi trả",
    debit: "642",
    credit: "3382",
    amount: "2,400,000",
    note: "2%"
  }
]

const Note = () => {
  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold text-lg">
            Nhật ký chung
          </h1>
          <Button icon={IoPersonAddOutline}>
            Xuất khẩu
          </Button>
        </div>

        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Ngày ghi số</th>
              <th className="px-4 py-2">Số chứng từ</th>
              <th className="px-4 py-2">Diễn giải</th>
              <th className="px-4 py-2">TK Nợ</th>
              <th className="px-4 py-2">TK Có</th>
              <th className="px-4 py-2">Số tiền</th>
              <th className="px-4 py-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.sct}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.debit}</td>
                <td className="px-4 py-2">{item.credit}</td>
                <td className="px-4 py-2">{item.amount}</td>
                <td className="px-4 py-2">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Note