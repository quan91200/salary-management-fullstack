import axiosClient from './axiosClient'

const attendanceApi = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return axiosClient.post('/attendance/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  create: (data) => axiosClient.post('/attendance', data),
  update: (id, data) => axiosClient.put(`/attendance/${id}`, data),
  getAll: () => axiosClient.get('/attendance'),
  delete: (id) => axiosClient.delete(`/attendance/${id}`)
}

export default attendanceApi