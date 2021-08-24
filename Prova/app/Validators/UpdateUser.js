'use strict'

class UpdateUser {
  get validateAll(){
    return true;
  }

  get rules () {
    return {
      email: 'email',
      password: 'confirmed'
    }
  }
}

module.exports = UpdateUser
