'use strict'

const User = use('App/Models/User');
class UserController {

  async store({ request, response }) {
    const { name, email, password } = request.only(['name', 'email', 'password']);
    const user = await User.create({ name, email, password });

    return user;

  }


  async show({ request, response }) {
    const users = await User.all();
    return users;
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
    try{
      const user = await User.findOrFail(auth.user.id);
      await user.delete();
    }
    catch(err){
      return response.status(err.status).send({ error: 'Sommeting went wrong' });
    }
  }
}

module.exports = UserController
