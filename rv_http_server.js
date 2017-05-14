var http = require('http');
var url = require('url');
var port = 1337;

var dbclient = require('./dbclient');
var RVUsersDB = require('./rv_users_db');
var usersDB = new RVUsersDB(dbclient);

var server = http.createServer(function(req, res){

  var reqUrl = req.url;
  // queryをオブジェクトでtrue
  var path = url.parse(reqUrl, true);
  var pathname = path.pathname;
  var tmpArray = pathname.split('/');
  var pathArray = [];
  for (var i = 0 ; i < tmpArray.length; ++i){
    if (tmpArray[i] !== '') {
      pathArray.push(tmpArray[i]);
    }
  }

  // メソッドはつねにPOST

  if (req.method == 'POST') {
    switch (pathArray.shift()) {
      case 'login':
        doLogin(req, res);
        break;

      case 'create_user':
        doCreateUser(req, res);
        break;

      case 'sync_data':
        doSyncData(req, res);
        break;

      default:

    }

  } else {
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.end('Not Found: Not yet implemented method: ' + req.method);
  }
});

var doLogin = function(req, res) {

  // bodyをゲット
  var body = [];
  req.on('data', function(chunk){
    body.push(chunk);
  }).on('end', function(){
    body = Buffer.concat(body).toString();
    var user = JSON.parse(body);

    usersDB.login(user.user_name, user.password, function(result){

      switch (result.state) {
        case 'STATUS_202_AUTHENTICATED':
          res.writeHead(202, {'Content-type': 'text/plain'});
          break;

        case 'STATUS_401_UNAUTHORIZED':
          res.writeHead(401, {'Content-type': 'text/plain'});
          break;

        case 'STATUS_404_NOT_FOUND':
        default:
          res.writeHead(404, {'Content-type': 'text/plain'});
          break;
      }
      var json = JSON.stringify(result);
      console.log(json);
      res.end(json);
    });
  });
}

var doCreateUser = function(req, res) {

  // bodyをゲット
  var body = [];
  req.on('data', function(chunk){
    body.push(chunk);
  }).on('end', function(){
    body = Buffer.concat(body).toString();
    var user = JSON.parse(body);

    usersDB.createUser(user.user_name, user.password, function(result) {

      switch (result.state) {
        case 'STATUS_400_DUPLICATE_USER_NAME':
          res.writeHead(400, {'Content-type': 'text/plain'});
          break;

        case 'STATUS_400_TOO_SHORT_USER_NAME':
          res.writeHead(400, {'Content-type': 'text/plain'});
          break;

        case 'STATUS_400_SHORT_PASSWORD':
          res.writeHead(400, {'Content-type': 'text/plain'});
          break;

        case 'STATUS_201_CREATED':
          res.writeHead(201, {'Content-type': 'text/plain'});
          break;

        default:
      }
      var json = JSON.stringify(result);
      console.log(json);
      res.end(json);
    });
  });
}

var doSyncData = function(req, res) {

}
// var doGet = function(req, res, pathArray, query) {
//   // console.log('doGet called');
//
//   // リソースで振り分ける
//   var resourceRootName = pathArray.shift();
//   // console.log(resourceName);
//   switch (resourceRootName) {
//     case 'users':
//       // users.doGetUser(req, res, query);
//       // 'users'の場合は認証メソッドをコール
//       users.doAuthentication(req, res, query);
//       break;
//     default:
//       res.writeHead(404, {'Content-type': 'text/plain'});
//       res.end('Not Found: Not yet implemented resource: ' + resourceRootName + ' in GET method.');
//   }
// }
//
// var doPost = function(req, res, pathArray) {
//   // console.log('doPost called');
//
//   // リソースで振り分ける
//   var resourceRootName = pathArray.shift();
//   // console.log(resourceName);
//   switch (resourceRootName) {
//     case 'users':
//       users.doPostUser(req, res);
//       break;
//     default:
//       res.writeHead(404, {'Content-type': 'text/plain'});
//       res.end('Not Found: Not yet implemented resource: ' + resourceRootName + ' in POST method.');
//   }
// }
//
// var doPut = function(req, res, pathArray) {
//   // リソースで振り分ける
//   var resourceRootName = pathArray.shift();
//   // console.log(resourceName);
//   switch (resourceRootName) {
//     case 'users':
//       users.doPutUser(req, res);
//       break;
//     default:
//       res.writeHead(404, {'Content-type': 'text/plain'});
//       res.end('Not Found: Not yet implemented resource: ' + resourceRootName + ' in PUT method.');
//   }
// }
//
// var doDelete = function(req, res, pathArray) {
//   // リソースで振り分ける
//   var resourceRootName = pathArray.shift();
//   // console.log(resourceName);
//   switch (resourceRootName) {
//     case 'users':
//       users.doDeleteUser(req, res);
//       break;
//     default:
//       res.writeHead(404, {'Content-type': 'text/plain'});
//       res.end('Not Found: Not yet implemented resource: ' + resourceRootName + ' in PUT method.');
//   }
// }

server.listen(port, function(){
  console.log('Server listening on: ' + port);
});
