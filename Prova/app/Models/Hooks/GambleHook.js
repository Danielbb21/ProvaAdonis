'use strict'

const GambleHook = exports = module.exports = {}
const Gamble = use('App/Models/Gamble');
let data = [];
const Mail = use('Mail');

GambleHook.sendCreateGambleEmail = async (gambleInstance) => {

  // if(!gambleInstance.firty.user_id) return;
  const { id } = gambleInstance;
  console.log('gamble_id', id);

  data.push(id);
  const gamble = await Gamble.find(id);
  console.log(gamble.user_id);
  console.log('data', data);


}
