'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')


class ExceptionHandler extends BaseExceptionHandler {

  async handle(error, { request, response }) {
    if (error.name === 'ValidationException') {
      response.status(error.status).send(error.messages)
    }
  }


  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
  }
}

module.exports = ExceptionHandler
