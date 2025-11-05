export class error_response extends Error {
  constructor(message, status_code) {
    super(message)
    this.status_code = status_code

    Error.captureStackTrace(this, this.constructor)
  }
}