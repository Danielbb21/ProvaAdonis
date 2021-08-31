'use strict'

const User = use('App/Models/User');

class SessionController {

  async store({request, response, auth}) {
    try{
    const {email, password} = request.all();

    const userExits = await User.findBy('email', email);

    if(!userExits){
      console.log('aquii');
      return response.status(400).json({error: 'User Not Found'});
    }

    const token = await auth.attempt(email, password);
    return  token;
    }
    catch(err){
      return response.status(500).json({error: err.message})
    }
  }
}

module.exports = SessionController
