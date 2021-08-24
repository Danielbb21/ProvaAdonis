'use strict'

class ForgotPasswordEmailSend {
  get validateAll(){
    return true;
  }

  get rules () {
    return {
     email: 'required|email',
     redirect_url: 'required'
    }
  }
}

module.exports = ForgotPasswordEmailSend
