class Response {
  constructor() {
    this.code = 200
    this.codes = {
      200: 'OK',
      201: 'Created',
      400: 'Request invalid',
      401: 'Invalid credentials',
      403: 'Access not permitted',
      404: 'Not Found',
      429: 'Too many requests',
      500: 'Request processing failed'
    }
    this.message = this.codes[this.code]
    this.headers
  }

  /**
     * code setter
     *
     * @param {number} code
     */
  setCode(code) {
    this.code = code
    this.message = this.codes[code]
  }

  /**
     * message setter
     *
     * @param {String} message
     */
  setMessage(message = null) {
    if (message === null) {
      this.message = this.codes[this.code]
    } else {
      this.message = message
    }
  }

  /**
     * headers setter
     *
     * @param {Object} headers
     */
  setHeaders(headers) {
    this.headers = headers
  }

  /**
     * code getter
     *
     * @returns {number}
     */
  getCode() {
    return this.code
  }

  /**
     * codes getter
     *
     * @returns {Array}
     */
  getCodes() {
    return this.codes
  }

  /**
     * message getter
     *
     * @returns {String}
     */
  getMessage() {
    return this.message
  }

  getHeaders() {
    return this.headers
  }
}

exports.Response = Response
