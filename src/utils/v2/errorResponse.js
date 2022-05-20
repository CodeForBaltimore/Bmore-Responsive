class ErrorResponse {
  constructor(code, message = null) {
    this.statusCode = code
    this.defaultCodeMessages = {
      400: 'Request invalid',
      401: 'Invalid credentials',
      403: 'Access not permitted',
      404: 'Not Found',
      500: 'Request processing failed'
    }
    if (message === null) {
      this.message = code in this.defaultCodeMessages ? this.defaultCodeMessages[code] : '',
    }
    this.details = []
  }

  /**
     * code setter
     *
     * @param {number} code
     */
  setCode(code) {
    this.body.statusCode = code
    this.body.message = this.defaultCodeMessages[code]
  }

  /**
     * message setter
     *
     * @param {String} message
     */
  setMessage(message = null) {
    this.body.message = message === null ? this.defaultCodeMessages[this.body.statusCode] : message
  }

  /**
     * code getter
     *
     * @returns {number}
     */
  getCode() {
    return this.body.statusCode
  }

  /**
     * codes getter
     *
     * @returns {Array}
     */
  getDefaultCodeMessages() {
    return this.defaultCodeMessages
  }

  addDetail(name, value) {
    this.details.push({'name': name, 'value': value})
  }

  /**
     * body getter
     *
     * @returns {Object}
     */
  getBody() {
    let body = this.body
    if (this.details.length > 0) {
      body = {
        ...body,
        'details': this.details
      }
    }
    return body
  }
}

exports.ErrorResponse = ErrorResponse
