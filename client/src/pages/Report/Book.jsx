import React from 'react'
import { IoPersonAddOutline } from "react-icons/io5"
import Button from '../../components/Button.jsx'

const salaryData = [
  {
    date: '01/03',
    description: "Hạch toán lương NV",
    debit: "",
    credit: "",
    amount: "",
    note: "5,000,000"
  },
  {
    date: '31/03',
    description: "Hạch toán lương tháng 3",
    debit: "622,642",
    credit: "",
    amount: "170,000,000",
    note: "175,000,000"
  },
  {
    date: '01/04',
    description: "Chi lương tháng 3",
    debit: "111",
    credit: "170,000,000",
    amount: "",
    note: "5,000,000"
  },
]

const Book = () => {
  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold text-lg">
            Báo cáo tổng hợp tiền lương và các khoản trích theo lương
          </h1>
          <Button icon={IoPersonAddOutline}>
            Xuất khẩu
          </Button>
        </div>

        <table className="min-w-full text-sm table-auto">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Diễn giải</th>
              <th className="px-4 py-2">TK đối xứng</th>
              <th className="px-4 py-2">Số phát sinh nợ</th>
              <th className="px-4 py-2">Số phát sinh có</th>
              <th className="px-4 py-2">Số dữ cuối kỳ</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.date}</td>
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

export default Book