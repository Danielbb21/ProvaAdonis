'use strict'

const Route = use('Route')

Route.post('user', 'UserController.store').validator('User');
Route.get('users', 'UserController.index');
Route.post('session', 'SessionController.store');
Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPasswordEmailSend');
Route.put('passwords/reset','ForgotPasswordController.update').validator('ForgotPassword');

Route.group(() => {
  Route.get('user', 'UserController.show');
  Route.put('user', 'UserController.update').validator('UpdateUser');
  Route.delete('user', 'UserController.destroy');
  Route.resource('game', 'GameController').apiOnly().validator(
    new Map(
      [
        [
          ['game.store'],
          ['CreateGame']
        ]
      ]
    )
  );

  Route.resource('gamble', 'GambleController').apiOnly().validator(
    new Map(
      [
        [
          ['gamble.store'],
          ['Gamble']
        ],
        [
          ['gamble.update'],
          ['UpdateGamble']
        ]
      ]
    )
  );

}).middleware(['auth'])
