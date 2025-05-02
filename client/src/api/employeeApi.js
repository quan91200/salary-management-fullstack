import axiosClient from './axiosClient'

const employeeApi = {
    uploadEmployee: (file) => {
        const formData = new FormData()
        formData.append('file', file)

        return axiosClient.post('/employees/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    createEmployee: (data) => axiosClient.post('/employees', data),
    getAllEmployees: () => axiosClient.get('/employees'),
    getEmployeesByCodes: (codes) => {
        const params = new URLSearchParams()
        params.append('codes', codes.join(','))

        return axiosClient.get(`/employees?${params.toString()}`)
    },
    getEmployeeById: (id) => axiosClient.get(`/employees/${id}`),
    updateEmployee: (id, data) => axiosClient.put(`/employees/${id}`, data),
    deleteEmployee: (id) => axiosClient.delete(`/employees/${id}`),
}

export default employeeApi