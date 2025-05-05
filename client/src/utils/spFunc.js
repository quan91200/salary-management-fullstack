export const formatNumberWithComma = (number) => {
    return new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 0
    }).format(number)
}

export const formatPercentage = (percentage) => {
    const value = percentage * 100;
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
}

export const formatNumberInput = (input) => {
    let value = input.toString().replace(/\D/g, '')
    if (value === '') value = '0'
    return Number(value).toLocaleString()
}

export const formatMonthYear = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1 // vì getMonth() trả về từ 0-11
    const year = date.getFullYear()
    return `${month < 10 ? '0' + month : month}/${year}`
}  