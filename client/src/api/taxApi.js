import axiosClient from './axiosClient'

const Taxapi = {
    getAll: () => axiosClient.get('/employee-tax'),
    create: (data) => axiosClient.post('/employee-tax', data),
    createAll: (data) => axiosClient.post('/employee-tax/generate', data),
    delete: (params) => {
        const query = new URLSearchParams(params).toString()
        return axiosClient.delete(`/employee-tax?${query}`)
    },
}

export default Taxapi