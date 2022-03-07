var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var crypto = require("crypto");
var password_validator = require("password-validator");

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var db = new sqlite3.Database('./db/web-chat.db');
db.run('CREATE TABLE IF NOT EXISTS usuarios(nome TEXT constraint pk_nome_usuario primary key, senha TEXT, email TEXT)')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  var schema = new password_validator();

  schema
  .is().min(8)                                    
  .is().max(100)                                  
  .has().uppercase()                              
  .has().lowercase()                              
  .has().digits(2)                                 
  .has().not().spaces()

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './signup')));
app.use(express.static(path.join(__dirname, './login')));
app.use(helmet());
app.use(limiter);

app.get('/signup', function(req,res){
    res.sendFile(path.join(__dirname,'./signup/signup.html'));
  });

  app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./login/login.html'));
  });

server.listen(3000, function(){
console.log("server is listening on port: 3000");
});

var usernameExists = { status : 'usernameExists'};
function verifyUsernameExists(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(1) FROM usuarios u WHERE u.nome = ?', username, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row['COUNT(1)']);
    });
  })
}

var invalidUsername = { status : 'invalidUsername' };
function verifyUsername(username) {
  return String(username).match(/^[a-z0-9]+$/);
}

var invalidPassword = { status : 'invalidPassword'};
function verifyPassword(password1, password2) {
  if (password1 !== password2) {
    return false;
  }
  if (password1 === '' || password2 === '') {
      return false;
  }
  if (password2 === '') {
      return false;
  }
  return schema.validate(password1);
}

var emailExists = { status : 'emailExists'};
function verifyEmailExists(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(1) FROM usuarios u WHERE u.email = ?', email, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row['COUNT(1)']);
    });
  })
}


var invalidEmail = { status : 'invalidEmail'};
function verifyEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

var valid = { status : 'valid' };
app.post('/create-user', function(req,res){
  verifyUsernameExists(req.body.uname)
  .then(row => {
    if (row == 1) {
      res.json(usernameExists);
      return;
    }
  })
  .catch(err => console.log(err));
  if (!verifyUsername(req.body.uname)) {
    res.json(invalidUsername);
    return;
  }
  if (!verifyPassword(req.body.psw1, req.body.psw2)) {
    res.json(invalidPassword);
    return;
  }
  verifyEmailExists(req.body.email)
  .then(row => {
    if (row == 1) {
      res.json(emailExists);
      return;
    }
  })
  if (!verifyEmail(req.body.email)) {
    res.json(invalidEmail);
    return;
  }
  db.run('INSERT INTO usuarios (nome, senha, email) VALUES(?,?,?)', [req.body.uname, crypto.createHash('sha256').update(req.body.psw1).digest('hex'), req.body.email]);
  res.json(valid);
  return;
})

app.post('/create-user-m', function(req,res){
  console.log(req.body);
  verifyUsernameExists(req.body.uname_m)
  .then(row => {
    if (row == 1) {
      res.json(usernameExists);
      return;
    }
  })
  .catch(err => console.log(err));
  if (!verifyUsername(req.body.uname_m)) {
    res.json(invalidUsername);
    return;
  }
  if (!verifyPassword(req.body.psw1_m, req.body.psw2_m)) {
    res.json(invalidPassword);
    return;
  }
  verifyEmailExists(req.body.email_m)
  .then(row => {
    if (row == 1) {
      res.json(emailExists);
      return;
    }
  })
  if (!verifyEmail(req.body.email_m)) {
    res.json(invalidEmail);
    return;
  }
  db.run('INSERT INTO usuarios (nome, senha, email) VALUES(?,?,?)', [req.body.uname_m, crypto.createHash('sha256').update(req.body.psw1_m).digest('hex'), req.body.email_m]);
  res.json(valid);
  return;
})
