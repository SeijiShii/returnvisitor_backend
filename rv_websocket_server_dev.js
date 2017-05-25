var STATUS_200_SYNC_OK = 'STATUS_200_SYNC_OK'

var websockets = require("websockets");
var fs = require('fs');
var logger = require('./logger');

var ssl_server_key = './ssl.key/server.key';
var ssl_server_crt = './ssl.key/server.crt';
var client_crt = './ssl.key/client.crt';

// var server = websockets.createServer();

var server = websockets.createServer({
  key: fs.readFileSync(ssl_server_key),
  cert: fs.readFileSync(ssl_server_crt)
  // requestCert: true,
  // rejectUnauthorized: true,
  // ca: [fs.readFileSync(client_crt)]
});
var port = 1337;
// var host = '0.0.0.0';

var dbclient = require('./dbclient');

var RVUsersDB = require('./rv_users_db');
var usersDB = new RVUsersDB(dbclient);

var RVDataDB = require('./rv_data_db');
var dataDB = new RVDataDB(dbclient);


server.on('connect', (socket) => {
  // console.log(socket._socket.remoteAddress);
  // logger.action.info('Connect from: ' + socket._socket.remoteAddress);
  socket.on('message', (json) => {
    var data = JSON.parse(json);
    // console.log(data);
    // console.log('method: ' + data.method);
    logger.loggerAction.info('Remote Address: ' + socket._socket.remoteAddress + ', Method: ' + data.method);
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

          logger.loggerAction.info('Remote Address: ' + socket._socket.remoteAddress + ', Method: ' + data.method + ', State: ' + result.state);
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

          logger.loggerAction.info('Remote Address: ' + socket._socket.remoteAddress + ', Method: ' + data.method + ', State: ' + result.state);
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

          if (result.state == 'STATUS_202_AUTHENTICATED') {
            var user_id = result.user.user_id
            dataDB.saveDataArray(user_id, data_array, (saveResult) => {
              sync_result.failed_data_array = saveResult.failed_data_array;

              dataDB.loadDataLaterThanTime(user_id, time, (loaded_rows) => {
                sync_result.loaded_data_array = loaded_rows;
                sync_result.state = STATUS_200_SYNC_OK;

                logger.loggerAction.info('Remote Address: ' + socket._socket.remoteAddress + ', Method: ' + data.method + ', State: ' + sync_result.state);

                var jsonRes = JSON.stringify(sync_result);
                console.log('sync_result: ' + jsonRes);
                socket.send(jsonRes);
              });
            });

          } else {
            // ログインに失敗したとき。普通はないけど。
            sync_result.state = result.state;
            var jsonRes = JSON.stringify(sync_result);
            console.log('sync_result: ' + jsonRes);

            logger.loggerAction.info('Remote Address: ' + socket._socket.remoteAddress + ', Method: ' + data.method + ', State: ' + sync_result.state);

            socket.send(jsonRes);
          }


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
