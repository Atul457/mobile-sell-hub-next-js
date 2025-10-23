export function convertToNumber(value: any): number {
    const parsedValue = parseFloat(value)
    return isNaN(parsedValue) ? 0 : parsedValue
}

function formatNumber(number: string | number) {
    // Convert the number to a string and remove any non-digit characters
    const cleanNumber = number.toString().replace(/\D/g, '')

    // Apply the format based on the length of the number
    if (cleanNumber.length <= 8) {
        return cleanNumber.replace(/(\d{3})(\d{3})/, '($1) $2')
    } else if (cleanNumber.length <= 11) {
        return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3')
    } else if (cleanNumber.length <= 15) {
        return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})(\d{4})/, '($1) $2 $3 $4')
    } else if (cleanNumber.length <= 20) {
        return cleanNumber.replace(/(\d{3})(\d{3})(\d{4})(\d{4})(\d{4})/, '($1) $2 $3 $4 $5')
    } else {
        return number // If number length is out of range, return as is
    }
}

const number = {
    convertToNumber,
    formatNumber
}

export { number }
