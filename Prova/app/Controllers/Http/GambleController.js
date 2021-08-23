'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with gambles
 */



const Gamble = use('App/Models/Gamble');
const Game = use('App/Models/Game');
const Mail = use('Mail');

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

      const data = request.input('data');

      console.log(data)
      // const game = await Game.find(params.games_id);

      // const gameNumbers = data.gameNumbers.toString();
      // console.log(game['max-number'], data.gameNumbers.length )
      // console.log('gamenubers', data.gameNumbers.length);
      // if(game['max-number'] !==  data.gameNumbers.length){
      //   throw new Error('mismatched game numbers')
      // }

      // const gamble = await Gamble.create({ gameNumbers, game_date: data.game_date,price: data.price, user_id: auth.user.id, game_id: params.games_id });
      const teste = data.map((element) =>{
        return {...element, gameNumbers: element.gameNumbers.toString(), user_id: auth.user.id}
      });

      await Mail.send(
        ['emails.new_bet'],
        { name:'1', betNumbers: teste },
        message => {
          message
            .to('email@teste.com')
            .from('daniel@teste.com', 'Daniel |Teste')
            .subject('Nova aposta')
        }
      )
      const gamble = await Gamble.createMany(teste);
      return gamble;
    }
    catch (err) {

      console.log(err.message);
      return response.status(400).send({ error: err.message });
    }

  }


  async show({ params, request, response, view }) {
    try{
      const gamble = await Gamble.findOrFail(params.id);

      return gamble;
    }
    catch(err){
      console.log(err.message);
      return response.status(err.status).send({error: err.message});
    }

  }




  async update({ params, request, response }) {

    try{
      const data = request.all();
      const gamble = await Gamble.findOrFail(params.id);
      gamble.merge(data);
      await gamble.save();
      return gamble;
    }
    catch(err){
      console.log(err.message);
      return response.status(err.status).send({error: err.message});
    }
  }


  async destroy({ params, request, response }) {
    try{
      const gamble = await Gamble.findOrFail(params.id);
      await gamble.delete();
    }

    catch(err){
      return response.status(err.status).send({error: err.message});
    }
  }
}

module.exports = GambleController
