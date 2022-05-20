class ErrorResponse {

  constructor(code = 404, message = null) {
    this.statusCode = code
    this.defaultCodeMessages = {
      400: 'Request invalid',
      401: 'Invalid credentials',
      403: 'Access not permitted',
      404: 'Not Found',
      500: 'Request processing failed'
    }
    this.setMessage(message)
    this.details = []
  }

  /**
     * message setter
     *
     * @param {String} message
     */
  setMessage(message = null) {
    if (message !== null) {
      this.message = message
    }
    else {
      this.message = this.statusCode in this.defaultCodeMessages ? this.defaultCodeMessages[this.statusCode] : ''
    }
  }

  /**
     * code getter
     *
     * @returns {number}
     */
  getCode() {
    return this.statusCode
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
    const body = {
      'message': this.message,
      'statusCode': this.statusCode
    }
    if (this.details.length > 0) {
      body.details = this.details
    }
    return body
  }
}

exports.ErrorResponse = ErrorResponse
