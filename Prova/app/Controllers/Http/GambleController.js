'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with gambles
 */

const formatDate = (date) => {

  const dateString = date.toLocaleDateString().split('/');

  const day = dateString[0];
  const month = dateString[1];
  const year = dateString[2];

  return `${day}/${month}/${year}`;
}

const Gamble = use('App/Models/Gamble');
const Game = use('App/Models/Game');
const Mail = use('Mail');
const User = use('App/Models/User');
const Keu = use('Kue');
const Job = use('App/Jobs/NewBetMail');

class GambleController {

  async index({ request, response, view }) {
    try {
      const gambles = await Gamble.query().with('user').with('game').fetch();

      return gambles;
    } catch (err) {


      return response.status(400).send({ error: err.message });
    }
  }



  async store({ request, response, auth }) {
    console.log('aquiii');
    try {

      const data = request.input('data');
      console.log('data', data);
      const teste = data.map((element) => {
        console.log('element', element);
        return { ...element, gameNumbers: element.gameNumbers.toString(), user_id: auth.user.id }
      });

      const games = await Game.all();
      const allGames = games.toJSON();

      let teste2 = [];

      for (let i = 0; i < teste.length; i++) {
        let teste3 = { ...teste[i], type: '', color: '', maxNumber: 0 };

        for (let j = 0; j < allGames.length; j++) {
          if (teste[i].game_id === allGames[j].id) {
            teste3.type = allGames[j].type
            teste3.color = allGames[j].color;
            teste3.maxNumber = allGames[j]['max-number']
            teste2.push(teste3);
          }
        }
      }

      teste2.map((game) => {

        const gameType = allGames.find(gm => gm.type === game.type);

        console.log(gameType['max-number'], game.gameNumbers.split(',').length)
        if (gameType['max-number'] !== game.gameNumbers.split(',').length) {
          throw new Error('mismatched game numbers')
        }
      })

      const newGambles = teste2.map((gamble) => {
        const date = new Date();
        return { ...gamble, price: gamble.price.toFixed(2).toString().replace('.', ','), date_game: formatDate(date) };
      })

      const user = await User.find(auth.user.id);


      const gamble = await Gamble.createMany(teste);
      Keu.dispatch(Job.key, { name: user.name, newGambles, allGames, email: user.email }, { attempts: 3 });
      return newGambles;
    }
    catch (err) {
      console.log('aquii');
      console.log(err.message);
      return response.status(400).json({error: err.message});
      return err;
      // return response.status(400).send({ error: err.message });
    }

  }


  async show({ params, request, response, view }) {
    try {
      const gamble = await Gamble.findOrFail(params.id);

      return gamble;
    }
    catch (err) {
      console.log(err.message);
      return response.status(err.status).send({ error: err.message });
    }

  }




  async update({ params, request, response }) {

    try {
      const data = request.all();
      const gamble = await Gamble.findOrFail(params.id);
      const game = await Game.find(data.game_id);
      if (!game) {
        throw new Error('Game not found');
      }
      gamble.merge(data);
      await gamble.save();
      return gamble;
    }
    catch (err) {
      console.log(err.message);
      return response.status(400).send({ error: err.message });
    }
  }


  async destroy({ params, request, response }) {
    try {
      const gamble = await Gamble.findOrFail(params.id);
      await gamble.delete();
    }

    catch (err) {
      return response.status(err.status).send({ error: err.message });
    }
  }
}

module.exports = GambleController
