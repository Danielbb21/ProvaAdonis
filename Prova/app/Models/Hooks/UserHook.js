'use strict'

const UserHook = exports = module.exports = {}
const Mail = use('Mail');
const Database = use('Database');
const Keu = use('Kue');
const Job = use('App/Jobs/NewUserMail');

UserHook.sendNewUserMail = async (userInstance) => {
  const trx = await Database.beginTransaction();
  const {name, email} = userInstance

  Keu.dispatch(Job.key, { name, email}, {attempts: 3});
  await trx.commit();
}
