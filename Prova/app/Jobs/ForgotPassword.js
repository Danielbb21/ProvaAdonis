'use strict'

const Mail = use('Mail');

class ForgotPassword {

  static get concurrency () {
    return 1
  }


  static get key () {
    return 'ForgotPassword-job'
  }


  async handle ({token, name, email, redirect}) {
    console.log(`Job: ${ForgotPassword.key}`);

    await Mail.send(
      ['emails.forgot_password', 'emails.forgot_password-text'],
      { email, token: token, link: `${redirect}?token=${token}`, name: name },
      message => {
        message
          .to(email)
          .from('daniel@teste.com', 'Daniel |Teste')
          .subject('Recuperação de senha')
      }
    )
  }
}

module.exports = ForgotPassword

