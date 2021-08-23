'use strict'

const User = use('App/Models/User');
const Database = use('Database');

class UserController {

  async index({ request, response }) {
    try {
      const users = await User.all();
      return users;
    }
    catch (err) {
      return response.status(err.status).send({ error: 'Sommeting went wrong' });
    }
  }
  async store({ request, response }) {
    const { name, email, password } = request.only(['name', 'email', 'password']);
    const user = await User.create({ name, email, password });

    return user;

  }


  async show({ auth, request, response }) {
    try {
      // const query = request.get();

      // const user = await User.find(1)
      const users = await User.query('id').where('id', auth.user.id).with('gambles.game').fetch();



      // const teste = await user
      //   .gambles()
      //   .where('id', 1)
      //   .with('user')
      //   .fetch()

      // const teste2 = await User.count('u');
      return users;
    }
    catch (err) {

      console.log(err.message);
      return response.status(400).send({ error: err.message });
    }
  }


  async update({ request, response, auth }) {
    try {
      const data = request.only(['email', 'password', 'name']);
      const user = await User.findOrFail(auth.user.id);
      user.merge(data);
      await user.save();

      return user;
    }
    catch (err) {

      return response.status(err.status).send({ error: 'Sommeting went wrong' });
    }
  }

  async destroy({ request, response, auth }) {
    try {
      const user = await User.findOrFail(auth.user.id);
      await user.delete();
    }
    catch (err) {
      return response.status(err.status).send({ error: 'Sommeting went wrong' });
    }
  }
  async addingNumbers({ request, response, auth }) {
    try {
      const games = request.input('games');

      const trx = await Database.beginTransaction();
      const user = await User.findOrFail(auth.user.id, trx);


      const gameObj = games.map(element => {
        return { ...element, user_id: auth.user.id }
      });
      await user.gambles().createMany(gameObj, trx);
      await trx.commit();
      return user;
    }
    catch (err) {
      console.log(err);
      return response.status(400).send({ error: err.message });
    }
  }
}

module.exports = UserController
