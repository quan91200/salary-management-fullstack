export const ROLES = {
  ADMIN: 'admin',
  NHAN_SU: 'nhân sự',
  KE_TOAN: 'kế toán',
}

export const isAdminOrHR = (role) => {
  return role === ROLES.ADMIN || role === ROLES.NHAN_SU
}

export const isAdminOrKeToan = (role) => {
  return role === ROLES.ADMIN || role === ROLES.KE_TOAN
}

export const isHROrKeToan = (role) => {
  return role === ROLES.NHAN_SU || role === ROLES.KE_TOAN
}

export const isAdmin = (role) => {
  return role === ROLES.ADMIN
}

export const isHR = (role) => {
  return role === ROLES.NHAN_SU
}

export const isKeToan = (role) => {
  return role === ROLES.KE_TOAN
}
