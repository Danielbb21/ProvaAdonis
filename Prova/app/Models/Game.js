'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Game extends Model {
  gambles(){
    return this.hasMany('App/Models/Gamble');

  }
}

module.exports = Game
