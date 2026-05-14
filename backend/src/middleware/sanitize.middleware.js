/**
 * XSS Sanitization Middleware
 * Strips potentially dangerous HTML/JS from request body and query params.
 * Replaces the deprecated xss-clean package.
 */

const scriptPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*"[^"]*"/gi,
  /on\w+\s*=\s*'[^']*'/gi,
  /on\w+\s*=\s*[^\s>]+/gi,
  /javascript\s*:/gi,
  /<\s*iframe\b[^>]*>/gi,
  /<\s*embed\b[^>]*>/gi,
  /<\s*object\b[^>]*>/gi,
]

const stripXSS = (value) => {
  if (typeof value === 'string') {
    let sanitized = value
    for (const pattern of scriptPatterns) {
      sanitized = sanitized.replace(pattern, '')
    }
    return sanitized
  }
  if (Array.isArray(value)) {
    return value.map(stripXSS)
  }
  if (value && typeof value === 'object') {
    const sanitized = {}
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = stripXSS(val)
    }
    return sanitized
  }
  return value
}

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = stripXSS(req.body)
  if (req.query) req.query = stripXSS(req.query)
  if (req.params) req.params = stripXSS(req.params)
  next()
}

module.exports = sanitizeInput
