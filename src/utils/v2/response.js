class Response {
  constructor() {
    this.defaultCodeMessages = {
      200: 'OK',
      201: 'Created',
      400: 'Request invalid',
      401: 'Invalid credentials',
      403: 'Access not permitted',
      404: 'Not Found',
      429: 'Too many requests',
      500: 'Request processing failed'
    }
    this.body = {
      'message': this.defaultCodeMessages[200],
      'statusCode': 200
    }
    this.details = []
    this.headers
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
     * message getter
     *
     * @returns {String}
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

  /**
     * header getter
     *
     * @returns {Object}
     */
  getHeaders() {
    return this.headers
  }
}

exports.Response = Response
