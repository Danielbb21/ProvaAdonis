'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with gambles
 */



const Gamble = use('App/Models/Gamble');
class GambleController {

  async index({ request, response, view }) {
    try {
      const gambles = await Gamble.query().with('user').with('game').fetch();
      console.log(gambles);
      return gambles;
    } catch (err) {

      console.log(err.message);
      return response.status(400).send({ error: err.message });
    }
  }




  async store({ params, request, response, auth }) {
    try {
      console.log('aqui');
      const data = request.only(['gameNumbers', 'game_date']);
      const gameNumbers = data.gameNumbers.toString();

      const gamble = await Gamble.create({ gameNumbers, game_date: data.game_date, user_id: auth.user.id, game_id: params.games_id });
      return gamble;
    }
    catch (err) {

      console.log(err.message);
      return response.status(400).send({ error: err.message });
    }

  }


  async show({ params, request, response, view }) {
  }




  async update({ params, request, response }) {
  }


  async destroy({ params, request, response }) {
  }
}

module.exports = GambleController
