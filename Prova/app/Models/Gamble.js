'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Gamble extends Model {

  static boot() {
    super.boot()
    this.addHook('afterSave', 'GambleHook.sendCreateGambleEmail');
  }

  user() {
    return this.belongsTo('App/Models/User');

  }

  game() {
    return this.belongsTo('App/Models/Game');
  }
}

module.exports = Gamble
