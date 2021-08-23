'use strict'

const User = use('App/Models/User');
const crypto = require('crypto');
const Mail = use('Mail');
const moment = require('moment');

class ForgotPasswordController {

  async store({ request, response }) {
    try {
      const email = request.input('email');
      const cry = crypto.randomBytes(10).toString('hex');
      const user = await User.findByOrFail('email', email);

      // console.log('user', user);
      user.token = cry;
      user.token_created_at = new Date();
      await user.save();
      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}`, name: user.name },
        message => {
          message
            .to(user.email)
            .from('daniel@teste.com', 'Daniel |Teste')
            .subject('Recuperação de senha')
        }
      )

    }
    catch (err) {

      return response.status(400).send({ error: err.message });
    }
  }

  async update({ request, response }) {
    try{
      const {token, password} = request.only(['token', 'password']);
      const user = await User.findByOrFail('token', token);
      const tokenExpired = moment().subtract('1', 'hour').isAfter(user.token_created_at);

      if(tokenExpired){
        return response.status(401).send({error: 'token expired'});
      }

      user.token = null;
      user.token_created_at = null;
      user.password = password;
      await user.save();
    }
    catch(err){
      return response.status(500).send({error: err.message});
    }
  }

}

module.exports = ForgotPasswordController
