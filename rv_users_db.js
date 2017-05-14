var STATUS_OK = 'STATUS_200_OK'
var STATUS_CREATED = "STATUS_201_CREATED";
var STATUS_AUTHENTICATED = 'STATUS_202_AUTHENTICATED';
var STATUS_DUPLICATE_USER_NAME = 'STATUS_400_DUPLICATE_USER_NAME';
var STATUS_SHORT_USER_NAME = "STATUS_400_TOO_SHORT_USER_NAME";
var STATUS_SHORT_PASSWORD = "STATUS_400_SHORT_PASSWORD";
var STATUS_UNAUTHORIZED = "STATUS_401_UNAUTHORIZED";
var STATUS_NOT_FOUND = 'STATUS_404_NOT_FOUND';

var _client;

function RVUsersDB(client) {
  _client = client;
}

RVUsersDB.prototype.login = function(user_name, password, callback) {
  // ログインの流れ
  // ユーザ名とパスワードでDBクエリ
  // if データ件数が1件ヒット
  //       202 AUTHENTICATED ユーザデータを返す。
  // else
  //   ユーザ名だけでDBクエリ
  //    if データ件数が1件ヒット
  //        40１　UNAUTHORIZED ユーザ名だけを返す。
  //    else
  //        404 NOT_FOUND ユーザ名だけを返す。

  console.log('users.login called!');
  var queryUser = 'SELECT * FROM returnvisitor_db.users WHERE user_name = "' + user_name + '" AND password = "' + password + '";';
  console.log(queryUser);
  _client.query(queryUser, function(err, rows){
    if (rows) {
      if (rows.info.numRows == 1) {
        // データが1件だけの時のみデータを返す。
        var result = {};
        result.user = rows[0];
        result.state = STATUS_AUTHENTICATED;
        callback(result);
      } else {
        // 1件以外の時
        RVUsersDB.prototype.existsUser(user_name, function(exists){
          if (exists) {
            var result = {
              user:{}
            }
            result.user.user_name = user_name;
            result.state = STATUS_UNAUTHORIZED;
          } else {

          }
        });
      }
    } else {

    }

  });
  _client.end();
}

RVUsersDB.prototype.createAccount = function(user_name, password, callback) {

}

RVUsersDB.prototype.existsUser = function(user_name, callback) {

  // callback(boolean)

  console.log('existsUser called!');
  var queryUserName = 'SELECT * FROM returnvisitor_db.users WHERE user_name = "' + user_name + '";';
  console.log(queryUserName);
  _client.query(queryUserName, function(err, rows) {
    if (rows) {
      if (rows.info.numRows >= 1) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
}

module.exports = RVUsersDB;
