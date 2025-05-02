import axiosClient from './axiosClient'

const advanceApi = {
    getAll: () => axiosClient.get('/advances'),
    getById: (id) => axiosClient.get(`/advances/${id}`),
    create: (data) => axiosClient.post('/advances', data),
    update: (id, data) => axiosClient.put(`/advances/${id}`, data),
    delete: (id) => axiosClient.delete(`/advances/${id}`),
}

export default advanceApi