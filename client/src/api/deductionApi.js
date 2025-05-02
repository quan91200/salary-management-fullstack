import axiosClient from './axiosClient'

const deductionApi = {
    getAll: () => axiosClient.get('/deductions'),
    getById: (id) => axiosClient.get(`/deductions/${id}`),
    create: (data) => axiosClient.post('/deductions', data),
    update: (id, data) => axiosClient.put(`/deductions/${id}`, data),
    delete: (id) => axiosClient.delete(`/deductions/${id}`),
}

export default deductionApi