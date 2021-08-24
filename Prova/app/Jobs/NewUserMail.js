'use strict'

const Mail = use('Mail');

class NewUserMail {

  static get concurrency () {
    return 1
  }


  static get key () {
    return 'NewUserMail-job'
  }


  async handle ({name, email}) {
    console.log(`Job: ${NewUserMail.key}`);

    await Mail.send(
      ['emails.new_user', 'emails.new_user-text'],
      {link: `https://prova-b5b02.web.app/`, name: name },
      message => {
        message
          .to(email)
          .from('daniel@teste.com', 'Daniel |Teste')
          .subject('Seja bem-vindo')
      }
    )
  }
}

module.exports = NewUserMail

