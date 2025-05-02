import axiosClient from './axiosClient'

const departmentApi = {
    getAllDepartments: () => axiosClient.get('/departments'),
    createDepartment: (data) => axiosClient.post('/departments', data),
    getDepartmentById: (id) => axiosClient.get(`/departments/${id}`),
    updateDepartment: (id, data) => axiosClient.put(`/departments/${id}`, data),
    deleteDepartment: (id) => axiosClient.delete(`/departments/${id}`),
}

export default departmentApi