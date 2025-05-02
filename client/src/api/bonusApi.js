import axiosClient from './axiosClient'

const bonusApi = {
    getAll: () => axiosClient.get('/employee-bonus'),
    getById: (id) => axiosClient.get(`/employee-bonus/${id}`),
    create: (data) => axiosClient.post('/employee-bonus', data),
    update: (id, data) => axiosClient.put(`/employee-bonus/${id}`, data),
    delete: (employee_id, month, year) => axiosClient.delete(`/employee-bonus/${employee_id}/${month}/${year}`),
}

export default bonusApi