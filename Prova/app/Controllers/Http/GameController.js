'use strict'

const Game = use('App/Models/Game');

class GameController {

  async index({ request, response, view }) {
    try{
      const games = await Game.all();
      return games;
    }
    catch(err){
      return response.status(err.status).send({error: err.message});
    }
  }




  async store({ request, response }) {

    try {

      const data = request.all();
      console.log(data);
      const game = await Game.create(data);
      return game;
    }
    catch(err){
      console.log(err.message);
      return response.status(err.status).send({error: err.message});
    }
  }


  async show({ params, request, response}) {
    try{

      const game = await Game.findOrFail(params.id);
      return game;
    }
    catch(err){
      return response.status(err.status).send({error: err.message});
    }
  }



  async update({ params, request, response }) {
    try{
      const data = request.all();
      const game = await Game.findOrFail(params.id);
       game.merge(data);
       await game.save();
       return game;
    }
    catch(err){
      return response.status(400).send({error: err.message})
    }
  }


  async destroy({ params, request, response }) {

    try{
      const game = await Game.findOrFail(params.id);
      await game.delete();
    }
    catch(err){
      return response.status(err.status).send({ error: 'Sommeting went wrong' });
    }
  }
}

module.exports = GameController
