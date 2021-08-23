'use strict'

const Route = use('Route')

Route.post('user', 'UserController.store').validator('User');
Route.get('user', 'UserController.show');
Route.post('session', 'SessionController.store');


Route.group(() => {

  Route.put('user', 'UserController.update');
  Route.delete('user', 'UserController.destroy');
  Route.resource('game', 'GameController').apiOnly();

  Route.resource('games.gambles', 'GambleController').apiOnly();
}).middleware(['auth'])
