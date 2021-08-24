'use strict'

class CreateGame {
  get validateAll(){
    return true;
  }

  get rules () {
    return {
      type: 'required|unique:games',
      description: 'required',
      range: 'required',
      price: 'required',
      'max-number': 'required',
      color: 'required',
      'min-cart-value': 'required'
    }
  }
}

module.exports = CreateGame
