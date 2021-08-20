'use strict'

class User {
  get validateAll(){
    return true;
  }

  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required',
      name: 'required'

    }
  }
}

module.exports = User
