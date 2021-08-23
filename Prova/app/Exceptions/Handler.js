'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

const Youch = use('youch')
const Env = use('Env')
class ExceptionHandler extends BaseExceptionHandler {

  async handle(error, { request, response }) {
    if (error.name === 'ValidationException') {
      response.status(error.status).send(error.messages)
    }
    if (Env.get('NODE_ENV') === 'development') {
      console.log(error);
      const youch = new Youch(error, request.request)
      const errorJSON = await youch.toJSON()

      return response.status(error.status).send(errorJSON)
    }

    return response.status(error.status)

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
