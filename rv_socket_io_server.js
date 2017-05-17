var server = require('http').createServer();
var io = require('socket.io')(server);
var port = 1337;

var dbclient = require('./dbclient');
var RVUsersDB = require('./rv_users_db');
var usersDB = new RVUsersDB(dbclient);

io.on('connection', (client) => {

  client.on('login', (loginData) => {

    var user = loginData;
    usersDB.login(user.user_name, user.password, (result) => {
      io.emit('login_response', result.state);
    });
  });

  client.on('create_user', (createUserData) => {

    var user = createUserData;
    usersDB.createUser(user.user_name, user.password, (result) => {
      io.emit('create_user_response', result.state);      
    });
  });

  client.on('disconnect', () => {
    console.log('Server disconnected.');
  });
});

server.listen(port, () => {
  console.log('Server listening on: ' + port);
});
