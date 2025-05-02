import axiosClient from './axiosClient'

const workRuleApi = {
  getAll: () => axiosClient.get('/work-rule'),
  create: (data) => axiosClient.post('/work-rule', data),
  update: (id, data) => axiosClient.put(`/work-rule/${id}`, data),
  delete: (id) => axiosClient.delete(`/work-rule/${id}`),
}

export default workRuleApi