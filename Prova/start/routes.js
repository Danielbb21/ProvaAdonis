'use strict'

const Route = use('Route')

Route.post('user', 'UserController.store');
Route.get('user', 'UserController.show');
Route.post('session', 'SessionController.store');


Route.group(() => {

  Route.put('user', 'UserController.update');
  Route.delete('user', 'UserController.destroy');
}).middleware(['auth'])
