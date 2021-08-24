'use strict'

const User = use('App/Models/User');
const Database = use('Database');
const Game = use('App/Models/Game');

const Mail = use('Mail');
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
      const users = await User.query().where('id', auth.user.id).with('gambles').fetch();
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

      return response.status(400).send({ error: 'Sommeting went wrong' });
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

}


module.exports = UserController
