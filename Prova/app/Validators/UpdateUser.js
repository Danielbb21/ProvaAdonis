'use strict'

class UpdateUser {
  get validateAll(){
    return true;
  }

  get rules () {
    const userId = this.ctx.auth.user.id
    console.log(userId);

    return {
      email: `unique:users,email,id,${userId}`,
      password: 'confirmed'
    }
  }
}

module.exports = UpdateUser
