'use strict'

const User = use('App/Models/User');
const Database = use('Database');
const Game = use('App/Models/Game');

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
    try{
    const { name, email, password } = request.only(['name', 'email', 'password']);
    const user = await User.create({ name, email, password });

    return user;
    }
    catch(err){
      return response.status(400).send({ error: err.message });
    }
  }


  async show({ auth,  response }) {
    try {
      console.log('aquii');
      const users = await User.query().where('id', auth.user.id).with('gambles.game').fetch();
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
      const userExists = await User.findBy('email', data.email);
      if(userExists && userExists.id !== auth.user.id){
        throw new Error('There is already a user with this email');
      }
      const user = await User.findOrFail(auth.user.id);
      user.merge(data);
      await user.save();

      return user;
    }
    catch (err) {
      console.log('aquiii', err.message);
      return response.status(400).send({ error: err.message });
    }
  }

  async destroy({ request, response, auth }) {
    try {
      const user = await User.findOrFail(auth.user.id);


      await user.delete();
    }
    catch (err) {

      return response.status(400).send({ error: err.message });
    }
  }

}


module.exports = UserController
