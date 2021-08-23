'use strict'

const UserHook = exports = module.exports = {}
const Mail = use('Mail');
const Database = use('Database');

UserHook.sendNewUserMail = async (userInstance) => {
  const trx = await Database.beginTransaction();
  const {name, email} = userInstance

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
  await trx.commit();
}
