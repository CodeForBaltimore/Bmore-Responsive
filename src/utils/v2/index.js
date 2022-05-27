'use strict'

import { ErrorResponse } from './errorResponse'

/**
 * Formats a timestamp to something readable by humans.
 *
 * @param {Number} seconds
 *
 * @return {String}
 */
const formatTime = seconds => {
  function pad(s) {
    return (s < 10 ? '0' : '') + s
  }

  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor(seconds % (60 * 60) / 60)
  const secs = Math.floor(seconds % 60)
  return pad(hours) + ':' + pad(minutes) + ':' + pad(secs)
}

export {
  formatTime,
  ErrorResponse,
}
