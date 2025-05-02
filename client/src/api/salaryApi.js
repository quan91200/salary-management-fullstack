import axiosClient from "./axiosClient"

const salaryApi = {
  getAll: () => axiosClient.get('/salaries'),
  generate: (data) => axiosClient.post(`/salaries/generate`, data),
  deleteSalary: (params) => {
    const query = new URLSearchParams(params).toString()
    return axiosClient.delete(`/salaries?${query}`)
  },
}

export default salaryApi