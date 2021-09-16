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
const Database = use('Database');
const Gamble = use('App/Models/Gamble');
const Game = use('App/Models/Game');
const Mail = use('Mail');
const User = use('App/Models/User');
const Keu = use('Kue');
const Job = use('App/Jobs/NewBetMail');

const formatDate2 = (date) => {
  const dateSeperated = date.split('/');
  const day = dateSeperated[0];
  const month = dateSeperated[1];
  const year = dateSeperated[2];

  return `${year}-${month}-${day}`;
}
class GambleController {

  async index({ auth, request, response, view }) {
    try {

      const { page, type } = request.get();
      console.log('PAGE', page, type);

      const date = new Date();
      const games_id = request.all();
      const tewst = games_id.game_id;
      console.log('Games_id',games_id);
      const g = games_id.games;
      console.log('g', g);
      const formatedDate = formatDate2(date.toLocaleDateString());
      // console.log('FORMATED', formatedDate);
      // console.log('type', type);
      let arr = g.split(',');

      // for(var i = 0;i< g.length;i++){
      //   arr.push(g[i]);
      // }
      console.log('arrr', arr);
      if (type) {
        const game = await Game.find('type', type);
        // console.log('Gmae', game);
        if (game) {
          // console.log('aquii');
          const gambles = await Gamble.query().where('user_id', auth.user.id).WhereIn('game_id', game.id).whereBetween('game_date', [formatedDate + 'T00:00:00.000Z', formatedDate + 'T23:59:17.000Z']).with('user').with('game').paginate(+page, 10);
          const allGambles = gambles.toJSON();
          return gambles;
        }
        else{
          console.log('aquii');

          const gambles = await Gamble.query().where('user_id', auth.user.id).whereBetween('game_date', [formatedDate + 'T00:00:00.000Z', formatedDate + 'T23:59:17.000Z']).with('user').with('game').paginate(+page, 10);
          const allGambles = gambles.toJSON();
          // console.log('games', allGambles);
          return gambles;
        }
      }
      else if(arr[0] !== ''){
        console.log('aquiii3', arr.length);
        const gambles = await Gamble.query().where('user_id', auth.user.id).from('gambles').whereIn('game_id', arr).whereBetween('game_date', [formatedDate + 'T00:00:00.000Z', formatedDate + 'T23:59:17.000Z']).with('user').with('game').paginate(+page, 10);
        return gambles;
      }
      else {
        console.log('aquii2');
        const gambles = await Gamble.query().where('user_id', auth.user.id).whereBetween('game_date', [formatedDate + 'T00:00:00.000Z', formatedDate + 'T23:59:17.000Z']).with('user').with('game').paginate(+page, 10);
        const allGambles = gambles.toJSON();

        return gambles;
      }
      // const teste = allGambles.filter(element => {
      //   const t = new Date().toString().split('GMT')[0];
      //   const date_game = element.game_date.toString().split('GMT')[0].split(' ');
      //   const dayGame = date_game[2];
      //   const monthGame = date_game[1];
      //   const yearGame = date_game[3];
      //   const totalDate = dayGame + '-' + monthGame + '-' + yearGame;

      //   const tt = t.split(' ');
      //   const dayT = tt[2];
      //   const monthT = tt[1];
      //   const yearT = tt[3];
      //   const totalDateT = dayT + '-' + monthT + '-' + yearT;
      //   // console.log("element251", totalDate, totalDateT );
      //   return totalDate === totalDateT;
      // })
      // // console.log('teste', teste);
      // const totalPages = Math.ceil(teste.length / 10);
      // let totalPerPage = 10;
      // console.log(teste.length, totalPages)
      // // if (teste.length >= totalPages) {
      // //   totalPerPage = teste.length;
      // // }
      // // else {
      // //   totalPerPage = teste.length - totalPages
      // // }
      // const totalToReturn = +page.page === 0 ? (page.page - 1) * totalPerPage : (page.page - 1) * totalPerPage + 1;
      // console.log('TOTAL', totalToReturn);
      // let dataToBeReturned = [];
      // for (let i = totalToReturn - 1; i < totalPerPage * page.page; i++) {
      //   console.log('i', i)
      //   if (teste[i]) {
      //     dataToBeReturned.push(teste[i]);
      //   }
      // }

      // return { total: teste.length, perPage: totalPerPage, page: +page.page, lastPage: totalPages, data: dataToBeReturned };
      // // return gambles;
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
      return response.status(400).json({ error: err.message });
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

  async show({ params, request, response, view }) {
    try {
      const gamble = await Gamble.query().with('user').with('game').fetch();

      return gamble;
    }
    catch (err) {
      console.log(err.message);
      return response.status(err.status).send({ error: err.message });
    }

  }

}

module.exports = GambleController
