var websockets = require("websockets");
var server = websockets.createServer();
var port = 1337;

var dbclient = require('./dbclient');

var RVUsersDB = require('./rv_users_db');
var usersDB = new RVUsersDB(dbclient);

var RVDataDB = require('./rv_data_db');
var dataDB = new RVDataDB(dbclient);


server.on('connect', (socket) => {
  socket.on('message', (json) => {
    var data = JSON.parse(json);
    console.log(data);
    console.log('method: ' + data.method);
    switch (data.method) {
      case 'LOGIN':
        var user = data.user;
        usersDB.login(user.user_name, user.password, (result) => {
          var res = {};
          res.method = data.method;
          res.state = result.state;
          res.user = result.user;
          var jsonRes = JSON.stringify(res);
          console.log('res: ' + jsonRes);
          socket.send(jsonRes);
        });
        break;

      case 'CREATE_USER':
        var user = data.user;
        usersDB.createUser(user.user_name, user.password, (result) => {
          var res = {};
          res.method = data.method;
          res.state = result.state;
          res.user = result.user;
          var jsonRes = JSON.stringify(res);
          console.log('res: ' + jsonRes);
          socket.send(jsonRes);
        });
        break;

      case 'SYNC_DATA':
        var user = data.user;
        var time = data.last_device_sync_time;
        var data_array = data.data_array_later_than_time;

        var sync_result = {};
        sync_result.method = data.method;
        sync_result.user = data.user;
        usersDB.login(user.user_name, user.password, (result) => {
          var user_id = result.user.user_id
          dataDB.saveDataArray(user_id, data_array, (saveResult) => {
            sync_result.failed_data_array = saveResult.failed_data_array;

            dataDB.loadDataLaterThanTime(user_id, time, (loaded_rows) => {
              sync_result.loaded_data_array = loaded_rows;
              sync_result.state = "STATUS_200_OK";

              var jsonRes = JSON.stringify(sync_result);
              console.log('sync_result: ' + jsonRes);
              socket.send(jsonRes);
            });
          });
        });
        break;

      default:

    }
  });
})

server.on('disconnect', () => {
  console.log('Server disconnected.');
});
server.listen(port, () => {
  console.log('Server listening on: ' + port);
});
