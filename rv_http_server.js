var http = require('http');
var url = require('url');
var port = 1337;

var dbclient = require('./dbclient');
var rvUsersDb = require('./rv_users_db');
var users = new rvUsersDb(dbclient);

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

      case 'create_account':
        doCreateAccount(req, res);
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

}

var doCreateAccount = function(req, res) {

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
