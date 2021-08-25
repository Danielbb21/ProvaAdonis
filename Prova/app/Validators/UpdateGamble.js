'use strict'

class UpdateGamble {
  get validateAll(){
    return true;
  }

  get rules () {
    return {
        user_id: 'required',
        game_id: 'required',
        price: 'required'
    }
  }
}

module.exports = UpdateGamble
