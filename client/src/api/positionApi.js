import axiosClient from './axiosClient'

const positionApi = {
    getAllPositions: () => axiosClient.get('/positions'),
    createPosition: (data) => axiosClient.post('/positions', data),
    getPositionById: (id) => axiosClient.get(`/positions/${id}`),
    updatePosition: (id, data) => axiosClient.put(`/positions/${id}`, data),
    deletePosition: (id) => axiosClient.delete(`/positions/${id}`),
}

export default positionApi