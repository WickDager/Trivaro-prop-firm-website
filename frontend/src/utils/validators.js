/**
 * Validation Functions
 */

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  const regex = /^\+?[\d\s-()]{10,}$/
  return regex.test(phone)
}

/**
 * Validate required field
 */
export const isRequired = (value) => {
  return value && value.trim().length > 0
}

/**
 * Validate minimum length
 */
export const minLength = (value, length) => {
  return value && value.length >= length
}

/**
 * Validate maximum length
 */
export const maxLength = (value, length) => {
  return value && value.length <= length
}

/**
 * Validate number range
 */
export const inRange = (value, min, max) => {
  const num = parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}
