'use strict'

const Route = use('Route')

Route.post('user', 'UserController.store').validator('User');
Route.get('users', 'UserController.index');
Route.post('session', 'SessionController.store');
Route.post('passwords', 'ForgotPasswordController.store');
Route.put('passwords/reset','ForgotPasswordController.update');

Route.group(() => {
  Route.get('user', 'UserController.show');
  Route.put('user/game', 'UserController.addingNumbers');
  Route.put('user', 'UserController.update');
  Route.delete('user', 'UserController.destroy');
  Route.resource('game', 'GameController').apiOnly();

  Route.resource('games.gamble', 'GambleController').apiOnly();
}).middleware(['auth'])
